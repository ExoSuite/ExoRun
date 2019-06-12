import * as React from "react"
import { observer } from "mobx-react"
import { Alert, ViewStyle } from "react-native"
import { Screen } from "@components/screen"
import { color } from "@theme"
import MapboxGL from "@react-native-mapbox-gl/maps";
import { NavigationScreenProps } from "react-navigation"
import { MapboxGLConfig } from "@utils/mapbox-gl-cfg"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"

export interface IMapScreenProps extends NavigationScreenProps<{}> {
}

MapboxGL.setAccessToken(MapboxGLConfig.API_KEY);

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

const MAP: ViewStyle = {
  flex: 1
}

// @inject("mobxstuff")
@observer
export class MapScreen extends React.Component<IMapScreenProps> {

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator()
  }

  public componentDidMount(): void {
    MapboxGL.setTelemetryEnabled(false);
  }

  public onUserMarkerPress(): void {
    Alert.alert("You pressed on the user location annotation");
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
          <MapboxGL.Camera followZoomLevel={12} followUserLocation />
          <MapboxGL.UserLocation onPress={this.onUserMarkerPress} />
        </MapboxGL.MapView>
      </Screen>
    )
  }
}
