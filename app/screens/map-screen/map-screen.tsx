import * as React from "react"
import { inject, observer } from "mobx-react"
import { ViewStyle } from "react-native"
import { Screen } from "@components/screen"
import { color } from "@theme"
import MapboxGL from "@react-native-mapbox-gl/maps"
import { NavigationScreenProps } from "react-navigation"
import { MapboxGLConfig } from "@utils/mapbox-gl-cfg"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { action, observable } from "mobx"
import { Injection, InjectionProps } from "@services/injections"
import { ApiResponse } from "apisauce"
import { CheckPointType, ICheckPoint, IFeatureCollection, IPaginate } from "@services/api"
import autobind from "autobind-decorator"
import { renderIf } from "@utils/render-if"
import { interpolateCoordinates } from "@utils/geoutils"
import { filter, last, remove } from "lodash-es"

const gridPattern = require("./grid_pattern.png")

export interface IMapScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

const layerStyles = {
  origin: {
    circleRadius: 5,
    circleColor: "white",
  },
  destination: {
    circleRadius: 5,
    circleColor: "white",
  },
  route: {
    lineColor: "white",
    lineCap: MapboxGL.LineJoin.Round,
    lineWidth: 3,
    lineOpacity: 0.84,
  },
  progress: {
    lineColor: "#314ccd",
    lineWidth: 3,
  },
  smileyFace: {
    fillAntialias: true,
    fillPattern: gridPattern,
  },
}

const MAP: ViewStyle = {
  flex: 1,
}

MapboxGL.setTelemetryEnabled(false)

/**
 * MapScreen will deal with mapbox
 */
@inject(Injection.Api)
@observer
export class MapScreen extends React.Component<IMapScreenProps> {

  private cameraRef
  @observable private readonly featureCollection: IFeatureCollection = MapboxGL.geoUtils.makeFeatureCollection()
  @observable private line = null

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator(),
  }

  @autobind
  private setCameraRef(ref: any): void {
    this.cameraRef = ref
  }

  // tslint:disable-next-line:no-feature-envy
  @action
  public async componentDidMount(): Promise<void> {
    const { api } = this.props

    const runId = this.props.navigation.getParam("runId")
    const creatorId = this.props.navigation.getParam("creatorId")
    let response: ApiResponse<IPaginate<ICheckPoint>> = await api.get(`user/${creatorId}/run/${runId}/checkpoint`)
    const checkpoints = response.data.data

    for (let it = response.data.current_page; it < response.data.last_page; it += 1) {
      response = await api.get(`user/${creatorId}/run/${runId}/checkpoint`, { page: it + 1 })
      console.tron.logImportant(response.data.data)
      checkpoints.push(...response.data.data)
    }

    const filteredCheckpoints = []

    const start = checkpoints.splice(checkpoints.findIndex(
      (checkpoint: ICheckPoint) => checkpoint.type === CheckPointType.START), 1)[0]

    filteredCheckpoints.push(start)

    while (filteredCheckpoints.length !== checkpoints.length + 1) {
      const lastCheckpoint = last<ICheckPoint>(filteredCheckpoints)
      for (const checkpoint of checkpoints) {
        if (lastCheckpoint.id === checkpoint.previous_checkpoint_id) {
          filteredCheckpoints.push(checkpoint)
          break
        }
      }
    }

    this.cameraRef.flyTo(filteredCheckpoints[0].location.coordinates[0][0])
    this.line = MapboxGL.geoUtils.makeLineString(filteredCheckpoints.map(interpolateCoordinates))
    this.featureCollection.features = filteredCheckpoints.map(
      (checkpoint: ICheckPoint) => MapboxGL.geoUtils.makeFeature({
        type: checkpoint.location.type,
        coordinates: checkpoint.location.coordinates,
      }),
    )
  }

  // tslint:disable-next-line: no-feature-envy
  public render(): React.ReactNode {

    return (
      <Screen style={ROOT} preset="fixed">
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
            ref={this.setCameraRef}
          />

          <MapboxGL.UserLocation/>

          {renderIf(this.featureCollection.features.length > 0)(
            (
              <MapboxGL.ShapeSource id="runSource" shape={this.featureCollection} hitbox={null}>
                <MapboxGL.FillLayer
                  id="runFillLayer"
                  style={layerStyles.smileyFace}
                />
              </MapboxGL.ShapeSource>
            ),
          )}

          {renderIf(this.line)(
            (
              <MapboxGL.ShapeSource id="progressSource" shape={this.line}>
                <MapboxGL.LineLayer
                  id="progressFill"
                  style={layerStyles.progress}
                />
              </MapboxGL.ShapeSource>
            )
          )}
        </MapboxGL.MapView>
      </Screen>
    )
  }
}
