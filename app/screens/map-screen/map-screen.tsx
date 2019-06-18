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
import { ICheckPoint, IFeatureCollection, IGeoJsonType, IPaginate, IRun } from "@services/api"
import { featureCollection } from '@turf/helpers';

export interface IMapScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

MapboxGL.setAccessToken(MapboxGLConfig.API_KEY)

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black
}

const MAP: ViewStyle = {
  flex: 1
}

// tslint:disable-next-line: completed-docs
@inject(Injection.Api)
@observer
export class MapScreen extends React.Component<IMapScreenProps> {

  @observable private readonly featureCollection: IFeatureCollection = {
    type: IGeoJsonType.FEATURE_COLLECTION,
    features: []
  }

  private cameraRef;

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
        coordinates: [checkpoint.location.coordinates]
      })
    )
  }

  public onUserMarkerPress(): void {
    Alert.alert("You pressed on the user location annotation")
  }

  // tslint:disable-next-line: no-feature-envy
  public render(): React.ReactNode {
    console.tron.logImportant(this.featureCollection)
    return (
      <Screen style={ROOT} preset="fixed">
        <MapboxGL.MapView
          style={MAP}
          // @ts-ignore
          styleURL={MapboxGLConfig.STYLE_URL}
        >
          <MapboxGL.Camera followZoomLevel={12} followUserLocation />
          <MapboxGL.UserLocation onPress={this.onUserMarkerPress}/>
          <MapboxGL.ShapeSource id="smileyFaceSource" shape={this.featureCollection} hitbox={null}>
            <MapboxGL.FillLayer
              id="smileyFaceFill"
              style={{
                fillAntialias: true,
                fillColor: "red",
                fillOutlineColor: "rgba(255, 255, 255, 0.84)"
              }}
            />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
      </Screen>
    )
  }
}
