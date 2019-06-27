import * as React from "react"
import { inject, observer } from "mobx-react"
import { Alert, ViewStyle } from "react-native"
import { Screen } from "@components/screen"
import { color } from "@theme"
import MapboxGL from "@react-native-mapbox-gl/maps"
import { NavigationScreenProps } from "react-navigation"
import { MapboxGLConfig } from "@utils/mapbox-gl-cfg"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { action, observable } from "mobx"
import { Injection, InjectionProps } from "@services/injections"
import { ApiResponse } from "apisauce"
import { ICheckPoint, IFeatureCollection, IPaginate, IRun } from "@services/api"
import autobind from "autobind-decorator"
import { renderIf } from "@utils/render-if"
import { interpolateCoordinates } from "@utils/geoutils"

const gridPattern = require("./grid_pattern.png")

export interface IMapScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

MapboxGL.setAccessToken(MapboxGLConfig.API_KEY)

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black
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
    fillPattern: gridPattern
  },
};

const MAP: ViewStyle = {
  flex: 1
}

// tslint:disable-next-line: completed-docs
@inject(Injection.Api)
@observer
export class MapScreen extends React.Component<IMapScreenProps> {

  private cameraRef;
  @observable private readonly featureCollection: IFeatureCollection = MapboxGL.geoUtils.makeFeatureCollection()
  @observable private line = null;

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator()
  }

  @autobind
  private setCameraRef(ref: any): void {
    this.cameraRef = ref
  }

  // tslint:disable-next-line:no-feature-envy
  @action
  public async componentDidMount(): Promise<void> {
    const { api } = this.props

    MapboxGL.setTelemetryEnabled(false)
    const response: ApiResponse<IPaginate<IRun>> = await api.get("user/me/run")
    const checkpoints = response.data.data[0].checkpoints
    this.cameraRef.flyTo(checkpoints[0].location.coordinates[0][0])
    this.line =  MapboxGL.geoUtils.makeLineString(checkpoints.map(interpolateCoordinates))
    this.featureCollection.features = checkpoints.map(
      (checkpoint: ICheckPoint) => MapboxGL.geoUtils.makeFeature({
        type: checkpoint.location.type,
        coordinates: checkpoint.location.coordinates
      })
    )
  }

  public onUserMarkerPress(): void {
    Alert.alert("You pressed on the user location annotation")
  }

  // tslint:disable-next-line: no-feature-envy
  public render(): React.ReactNode {

    return (
      <Screen style={ROOT} preset="fixed">
        <MapboxGL.MapView
          style={MAP}
          // @ts-ignore
          styleURL={MapboxGLConfig.STYLE_URL}
        >
          <MapboxGL.Camera
            zoomLevel={22}
            ref={this.setCameraRef}
          />

          {renderIf(this.featureCollection.features.length > 0)(
            <MapboxGL.ShapeSource id="runSource" shape={this.featureCollection} hitbox={null}>
              <MapboxGL.FillLayer
                id="runFillLayer"
                style={layerStyles.smileyFace}
              />
            </MapboxGL.ShapeSource>
          )}

          {renderIf(this.line)(
            <MapboxGL.Animated.ShapeSource id="progressSource" shape={this.line}>
              <MapboxGL.Animated.LineLayer
                id="progressFill"
                style={layerStyles.progress}
              />
            </MapboxGL.Animated.ShapeSource>
          )}
        </MapboxGL.MapView>
      </Screen>
    )
  }
}
