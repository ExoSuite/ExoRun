import React from "react"
import { Text } from "@components/text"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { View, ViewStyle } from "react-native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import MapboxGL from "@react-native-mapbox-gl/maps"
import { MapboxGLConfig } from "@utils/mapbox-gl-cfg"
import { Button } from "@components/button"
import { NavigationStackScreenProps } from "react-navigation-stack"
import autobind from "autobind-decorator"
import { IFeature, IRun } from "@services/api"
import { renderIf } from "@utils/render-if"
import { action, observable } from "mobx"
import Geolocation, { GeoPosition } from "react-native-geolocation-service"
import { first, isEmpty, last, noop, orderBy } from "lodash-es"
import { RNNumberStepper } from "react-native-number-stepper"
import destination from "@turf/destination"
import { Position } from "@turf/helpers"
import { interpolateCoordinates } from "@utils/geoutils"
import { inject, observer } from "mobx-react"
import booleanContains from "@turf/boolean-contains"
import { Injection, InjectionProps } from "@services/injections"
import { ApiResponse } from "apisauce"
import { DataLoader } from "@components/data-loader"
import { NavigationActions, StackActions } from "react-navigation"
import { AppScreens } from "@navigation/navigation-definitions"
import moment from "moment"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

const MAP: ViewStyle = {
  flex: 1
}

const gridPattern = require("../map-screen/grid_pattern.png")

const layerStyles = {
  origin: {
    circleRadius: 5,
    circleColor: "white"
  },
  destination: {
    circleRadius: 5,
    circleColor: "white"
  },
  route: {
    lineColor: "white",
    lineCap: MapboxGL.LineJoin.Round,
    lineWidth: 3,
    lineOpacity: 0.84
  },
  progress: {
    lineColor: "#314ccd",
    lineWidth: 3
  },
  smileyFace: {
    fillAntialias: true,
    fillPattern: gridPattern
  }
}

const disabled = color.palette.lightGrey
const enabled = color.secondary

interface IPoint {
  id: number,
  location: Position
}

// tslint:disable-next-line:typedef
const sleep = (milliseconds) => {
  // tslint:disable-next-line:typedef no-string-based-set-timeout
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

// tslint:disable-next-line: completed-docs
@inject(Injection.Api, Injection.SoundPlayer)
@observer
export class CheckpointsNewRunScreen extends React.Component<NavigationStackScreenProps & InjectionProps> {

  private get kmToMeters(): number {
    return this.checkpointRange / 1000
  }

  @observable private checkpointRange = 2.5

  @observable private readonly checkpoints: IPoint[] = []

  public static navigationOptions = {
    headerTitle: <Text tx="checkpoint.from-run" preset="lightHeader"/>,
    headerLeft: NavigationBackButtonWithNestedStackNavigator({
      iconName: "chevron-down"
    })
  }

  private buildCheckpoint(coordinates: Position): any {
    const degrees = [-45, 45, 135, -135]

    const checkpoints = degrees.map((degree: number) =>
      destination(coordinates, this.kmToMeters, degree).geometry.coordinates)

    return [checkpoints]
  }

  @action.bound
  private buildFirstCheckpoint(position: GeoPosition): void {
    this.checkpoints[0] = {
      id: 0,
      location: [position.coords.longitude, position.coords.latitude]
    }
  }

  @autobind
  private collection(): any {
    return MapboxGL.geoUtils.makeFeatureCollection(this.checkpoints.map((checkpoint: IPoint) => {
      return MapboxGL.geoUtils.makeFeature({
        type: "Polygon",
        coordinates: this.buildCheckpoint(checkpoint.location)
      })
    }))
  }

  // tslint:disable-next-line: no-feature-envy
  @autobind
  private async createRunAndCheckpoints(): Promise<void> {
    const { api, soundPlayer, navigation } = this.props;

    DataLoader.Instance.toggleIsVisible()
    const params = navigation.state.params
    const checkpoints = orderBy(this.checkpoints, "id")

    const formattedCheckpoint = {
      data: []
    }

    let it = 0

    for (const checkpoint of checkpoints) {

      formattedCheckpoint.data[it] = {
        id: checkpoint.id,
        location: this.buildCheckpoint(checkpoint.location)[0]
      }
      formattedCheckpoint.data[it].location.push(first(formattedCheckpoint.data[it].location))
      it += 1
    }

    const run: ApiResponse<IRun> = await api.post("user/me/run", {
      name: params.name,
      description: params.description,
      visibility: params.runType
    })

    await api.post(`user/me/run/${run.data.id}/checkpoint/checkpoints`, formattedCheckpoint);

    DataLoader.Instance.success(
      soundPlayer.playSuccess,
      () => navigation.pop(2)
    )
  }

  @action.bound
  private onUserLongPressTheMap(feature: IFeature): void {
    if (this.checkpoints.length === 1) { return; }

    // tslint:disable-next-line: no-ignored-return no-map-without-usage
    let filteredCheckpoint = this.checkpoints.slice(1, this.checkpoints.length).map((checkpoint: IPoint) => {
      const checkpointFeature = MapboxGL.geoUtils.makeFeature({
        type: "Polygon",
        coordinates: this.buildCheckpoint(checkpoint.location),
      })

      // @ts-ignore
      if (booleanContains(checkpointFeature, feature)) {
        return null
      }

      return checkpoint
    })

    filteredCheckpoint = filteredCheckpoint.filter((checkpoint: IPoint) => !isEmpty(checkpoint))
    this.checkpoints.length = 1;
    this.checkpoints.push(...filteredCheckpoint)
  }

  @action.bound
  private onUserPressTheMap(feature: IFeature): void {
    this.checkpoints.push({
      id: last(this.checkpoints).id + 1,
      // @ts-ignore
      location: feature.geometry.coordinates
    })
  }

  @action.bound
  private updateCheckpointRange(range: number): void {
    this.checkpointRange = range
  }

  public componentDidMount(): void {
    // tslint:disable-next-line: no-void-expression
    Geolocation.getCurrentPosition(this.buildFirstCheckpoint).catch(noop)
  }

  // tslint:disable-next-line: no-feature-envy
  public render(): React.ReactNode {
    const buttonColor = this.checkpoints.length >= 2 ? enabled : disabled

    return (
      <View style={ROOT}>
        <MapboxGL.MapView
          animated
          style={MAP}
          // @ts-ignore
          styleURL={MapboxGLConfig.STYLE_URL}
          onPress={this.onUserPressTheMap}
          onLongPress={this.onUserLongPressTheMap}
        >
          <MapboxGL.Camera
            zoomLevel={50}
            followUserLocation
            followUserMode="course"
          />

          <MapboxGL.UserLocation onUpdate={this.buildFirstCheckpoint}/>

          {renderIf(this.checkpoints.length > 0)(
            <MapboxGL.ShapeSource id="runSource" shape={this.collection()}>
              <MapboxGL.FillLayer
                id="runFillLayer"
                style={layerStyles.smileyFace}
              />
            </MapboxGL.ShapeSource>
          )}

          {
            this.checkpoints.length >= 2 && (
              <MapboxGL.ShapeSource
                id="progressSource"
                shape={MapboxGL.geoUtils.makeLineString(
                  this.checkpoints.map((checkpoint: IPoint) => interpolateCoordinates({
                    // @ts-ignore
                    location: {
                      coordinates: this.buildCheckpoint(checkpoint.location)
                    }
                  }))
                )}
              >
                <MapboxGL.LineLayer
                  id="progressFill"
                  style={layerStyles.progress}
                />
              </MapboxGL.ShapeSource>
            )
          }
        </MapboxGL.MapView>

        <View style={{padding: spacing[4], justifyContent: "space-between"}}>
          <View style={{marginBottom: spacing[3]}}>
            <Text text="Checkpoint range in metters:"/>
            <RNNumberStepper
              minValue={1}
              maxValue={5}
              stepValue={0.5}
              width="100%"
              value={this.checkpointRange}
              onChange={this.updateCheckpointRange}
            />
          </View>

          <Button
            tx="run.new"
            textPreset="primaryBoldLarge"
            style={{height: spacing[7], backgroundColor: buttonColor}}
            disabled={buttonColor !== enabled}
            onPress={this.createRunAndCheckpoints}
          />
        </View>

      </View>
    )
  }
}
