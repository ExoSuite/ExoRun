import * as React from "react";
import { observer } from "mobx-react";
import { SafeAreaView, View, ViewStyle } from "react-native";
import { Screen } from "../shared/screen";
import { color, spacing } from "src/theme";
import { NavigationScreenProps } from "react-navigation";
import { Button } from "src/views/shared/button";
import { Text } from "src/views/shared/text";
import autobind from "autobind-decorator";
import { Header } from "src/views/shared/header";

export interface LoginScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black
};

const FULL: ViewStyle = {
  ...ROOT,
  flex: 1
};

const CONTAINER: ViewStyle = {
  ...FULL,
  paddingHorizontal: spacing[4]
};

// @inject("mobxstuff")
@observer
export class LoginScreen extends React.Component<LoginScreenProps, {}> {

  @autobind
  navigateToRegister() {
    const { navigation } = this.props;
    navigation.navigate("register");
  }

  @autobind
  navigateToHome() {
    const { navigation } = this.props;
    navigation.navigate("home");
  }

  render() {
    const { navigateToRegister, navigateToHome } = this;

    return (
      <View style={FULL}>
        <SafeAreaView style={FULL}>
          <Screen style={CONTAINER} backgroundColor={color.transparent} preset="fixedStack">
            <Text preset="largeHeaderCentered" tx="auth.login.header"/>
            <View style={{ alignItems: "center", justifyContent: "space-around", flex: 0.12 }}>
              <Button style={{ width: "80%" }} onPress={navigateToHome}>
                <Text preset="bold" tx="auth.login.header"/>
              </Button>
              <Button style={{ width: "80%" }} onPress={navigateToRegister}>
                <Text preset="bold" tx="auth.register.header"/>
              </Button>
            </View>
          </Screen>
        </SafeAreaView>
      </View>
    );
  }
}
