import * as React from "react"
import { observer } from "mobx-react"
import {SafeAreaView, View, ViewStyle} from "react-native"
import { Text } from "../shared/text/index"
import { Screen } from "../shared/screen/index"
import {color, spacing} from "../../theme/index"
import { NavigationScreenProps } from "react-navigation"
import autobind from "autobind-decorator";
import {Button} from "src/views/shared/button";

export interface AuthScreenProps extends NavigationScreenProps<{}> {
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
export class AuthScreen extends React.Component<AuthScreenProps, {}> {

  constructor(props) {
    super(props);
    console.tron.log("ok");
  }


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
          <Screen style={CONTAINER} backgroundColor={color.transparent} preset="fixedStack">
            <Text preset="largeHeaderCentered" tx="auth.login.header"/>
            <View style={{ alignItems: "center", justifyContent: "space-around", flex: 0.12 }}>
              <Button style={{ width: "80%" }} onPress={navigateToLogin}>
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
