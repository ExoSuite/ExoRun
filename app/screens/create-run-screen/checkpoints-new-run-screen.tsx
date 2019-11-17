import React from "react"
import { Text } from "@components/text"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { View, ViewStyle } from "react-native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import MapboxGL, { UserTrackingModes } from "@react-native-mapbox-gl/maps"
import { MapboxGLConfig } from "@utils/mapbox-gl-cfg"
import { Button } from "@components/button"
import { NavigationStackScreenProps } from "react-navigation-stack"
import autobind from "autobind-decorator"
import { ICheckPoint, CheckPointType, IFeatureCollection, ILocation, IFeature } from "@services/api"
import { renderIf } from "@utils/render-if"
import { action, observable, runInAction } from "mobx"
import Geolocation, { GeoPosition } from "react-native-geolocation-service"
import { forEach, noop } from "lodash-es"
import { RNNumberStepper } from "react-native-number-stepper";
import destination from "@turf/destination"
import turf, { Coord, Position } from "@turf/helpers"
import { interpolateCoordinates } from "@utils/geoutils"

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

// tslint:disable-next-line: completed-docs
export class CheckpointsNewRunScreen extends React.Component<NavigationStackScreenProps> {

  private get kmToMeters(): number {
    return this.checkpointRange / 1000
  }

  private cameraRef
  @observable private checkpointRange = 2.5

  @observable private checkpoints = []

  @observable private readonly line = null

  public static navigationOptions = {
    headerTitle: <Text tx="checkpoint.from-run" preset="lightHeader"/>,
    headerLeft: NavigationBackButtonWithNestedStackNavigator({
      iconName: "chevron-down"
    })
  }

  private buildCheckpoint(coordinates: Position): any {
    const degrees = [-45, 45, 135, -135]

    const checkpoints = degrees.map((degree: number) => {
      return destination(coordinates, this.kmToMeters, degree).geometry.coordinates
    })

    return [checkpoints]
  }

  @action.bound
  private buildFirstCheckpoint(position: GeoPosition): void {
    this.checkpoints.push([position.coords.longitude, position.coords.latitude])
    this.checkpoints = this.checkpoints.slice()
    this.forceUpdate()
  }

  @autobind
  private collection(): any {
    return MapboxGL.geoUtils.makeFeatureCollection(this.checkpoints.map((checkpoint: [number, number]) => {
      return MapboxGL.geoUtils.makeFeature({
        type: "Polygon",
        coordinates: this.buildCheckpoint(checkpoint)
      })
    }))
  }

  @autobind
  private setCameraRef(ref: any): void {
    this.cameraRef = ref
  }


  @action.bound
  private updateCheckpointRange(range: number): void {
    this.checkpointRange = range
    this.forceUpdate()
  }

  public componentDidMount(): void {
    // tslint:disable-next-line: no-void-expression
    Geolocation.getCurrentPosition(this.buildFirstCheckpoint).catch(noop)

  }

  // tslint:disable-next-line: no-feature-envy
  public render(): React.ReactNode {
    const buttonColor = true ? enabled : disabled

    return (
      <View style={ROOT}>
        <MapboxGL.MapView
          animated
          style={MAP}
          // @ts-ignore
          styleURL={MapboxGLConfig.STYLE_URL}
        >
          <MapboxGL.Camera
            zoomLevel={50}
            followUserLocation
            followUserMode="course"
          />

          <MapboxGL.UserLocation/>

          {renderIf(this.checkpoints.length > 0)(
            <MapboxGL.ShapeSource id="runSource" shape={this.collection()} hitbox={null}>
              <MapboxGL.FillLayer
                id="runFillLayer"
                style={layerStyles.smileyFace}
              />
            </MapboxGL.ShapeSource>
          )}

          {renderIf(this.line)(
            <MapboxGL.ShapeSource id="progressSource" shape={this.line}>
              <MapboxGL.LineLayer
                id="progressFill"
                style={layerStyles.progress}
              />
            </MapboxGL.ShapeSource>
          )}
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
          />
        </View>

      </View>
    )
  }
}
