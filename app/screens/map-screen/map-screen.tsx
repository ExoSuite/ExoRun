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
import { ICheckPoint, IFeature, IFeatureCollection, IPaginate, IRun } from "@services/api"
import idx from "idx"

const gridPattern = require("./grid_pattern.png")

export interface IMapScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

MapboxGL.setAccessToken(MapboxGLConfig.API_KEY)

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black
}

const MAP: ViewStyle = {
  flex: 1
}

const layerStyles = {
  smileyFace: {
    fillAntialias: true,
    fillPattern: gridPattern
  },
};

// tslint:disable-next-line: completed-docs
@inject(Injection.Api)
@observer
export class MapScreen extends React.Component<IMapScreenProps> {

  @observable private readonly featureCollection: IFeatureCollection = MapboxGL.geoUtils.makeFeatureCollection()

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator()
  }

  @action
  public async componentDidMount(): Promise<void> {
    const { api } = this.props

    MapboxGL.setTelemetryEnabled(false)
    const response: ApiResponse<IPaginate<IRun>> = await api.get("user/me/run")
    this.featureCollection.features = response.data.data[0].checkpoints.map(
      (checkpoint: ICheckPoint) => MapboxGL.geoUtils.makeFeature({
        type: checkpoint.location.type,
        coordinates: checkpoint.location.coordinates
      })
    )
    console.tron.logImportant(this.featureCollection)
  }

  public onUserMarkerPress(): void {
    Alert.alert("You pressed on the user location annotation")
  }

  // tslint:disable-next-line: no-feature-envy
  public render(): React.ReactNode {

    const start = idx(this.featureCollection, (collection: IFeatureCollection) => collection.features[0])
    const cameraCoordinates = idx(start, (feature: IFeature) => feature.geometry.coordinates[0][0])

    return (
      <Screen style={ROOT} preset="fixed">
        <MapboxGL.MapView
          style={MAP}
          // @ts-ignore
          styleURL={MapboxGLConfig.STYLE_URL}
        >
          <MapboxGL.Camera
            zoomLevel={20}
            centerCoordinate={cameraCoordinates}
          />

          <MapboxGL.ShapeSource id="runSource" shape={this.featureCollection} hitbox={null}>
            <MapboxGL.FillLayer
              id="runFillLayer"
              style={layerStyles.smileyFace}
            />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
      </Screen>
    )
  }
}
