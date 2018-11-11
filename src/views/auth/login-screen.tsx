import * as React from "react";
import { observer } from "mobx-react";
import {SafeAreaView, View, ViewStyle} from "react-native";
import { Screen } from "../shared/screen";
import { color, spacing } from "src/theme";
import { NavigationScreenProps } from "react-navigation";
import { Text } from "src/views/shared/text";
import autobind from "autobind-decorator";
import {TextField} from "src/views/shared/text-field";

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

  constructor(props) {
    super(props);
    console.tron.log("ok");
  }


  @autobind
  navigateToRegister() {
    const { navigation } = this.props;
    navigation.navigate("register");
  }

  render() {
    const {} = this;

    return (
      <View style={FULL}>
        <SafeAreaView style={FULL}>
          <Screen style={CONTAINER} backgroundColor={color.transparent} preset="fixedStack">
            <Text preset="largeHeaderCentered" tx="auth.login.header"/>
            <View style={{ alignItems: "center", justifyContent: "space-around", flex: 0.12 }}>
                <TextField preset={"loginScreen"} placeholderTx="auth.login.username" placeholderTextColor={color.palette.black} inputStyle={{color:color.palette.blue}} />
            </View>

          </Screen>
        </SafeAreaView>
      </View>
    );
  }
}
