import * as React from "react";
import { observer } from "mobx-react";
import { Image, ImageStyle, SafeAreaView, View, ViewStyle } from "react-native";
import { Text } from "src/views/shared/text";
import { Screen } from "src/views/shared/screen";
import { color, spacing } from "src/theme";
import { NavigationScreenProps } from "react-navigation";
import autobind from "autobind-decorator";
import { Button } from "src/views/shared/button";
import { AssetLocator } from "src/services/asset";

export interface AuthScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker
};

const FULL: ViewStyle = {
  ...ROOT,
  flex: 1
};

const CONTAINER: ViewStyle = {
  ...FULL,
  paddingHorizontal: spacing[4]
};

const EXORUN_TEXT: ImageStyle = {
  width: 150,
  height: 50,
  alignSelf: "center"
};

const EXORUN_LOGO: ImageStyle = {
  width: 75,
  height: 35,
  alignSelf: "center"
};

const EXOSUITE: ImageStyle = {
  width: 200,
  height: 100,
};

const FOOTER_CONTAINER: ViewStyle = {
  flexDirection: 'row',
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center'
};

@observer
export class AuthScreen extends React.Component<AuthScreenProps, {}> {

  @autobind
  navigateToRegister() {
    const { navigation } = this.props;
    navigation.navigate("register");
  }

  @autobind
  navigateToLogin() {
    const { navigation } = this.props;
    navigation.navigate("login");
  }

  render() {
    const { navigateToRegister, navigateToLogin } = this;

    return (
      <View style={FULL}>
        <SafeAreaView style={FULL}>
          <Image
            source={AssetLocator("exorun-text")}
            style={EXORUN_TEXT}
            resizeMode="contain"
          />
          <Image
            source={AssetLocator("exorun-logo")}
            style={EXORUN_LOGO}
            resizeMode="contain"
          />
          <Screen style={CONTAINER} backgroundColor={color.transparent} preset="fixedCenter">
            <View style={{marginBottom: 100}}>
              <Text preset="largeHeaderCentered" tx="auth.slogan"/>
            </View>
            <Button style={{ width: "80%", marginBottom: 10 }} onPress={navigateToLogin}>
              <Text preset="bold" tx="auth.login.header"/>
            </Button>
            <Button style={{ width: "80%" }} onPress={navigateToRegister} preset="secondary">
              <Text preset="bold" tx="auth.register.header"/>
            </Button>
          </Screen>
          <View style={FOOTER_CONTAINER}>
            <Text preset="bold" tx="auth.powered"/>
            <Image
              source={AssetLocator("exosuite-logo")}
              style={EXOSUITE}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
