import * as React from "react";
import { observer } from "mobx-react";
import { ViewStyle } from "react-native";
import { Screen } from "../shared/screen";
import { color } from "src/theme";
import { NavigationScreenProps } from "react-navigation";
import { Button } from "src/views/shared/button";

export interface LoginScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
};

// @inject("mobxstuff")
@observer
export class LoginScreen extends React.Component<LoginScreenProps, {}> {
  render () {
    return (
      <Screen style={ROOT} preset="fixedCenter">
        <Button/>
        {/*<Text preset="header" tx="auth.header" />*/}
      </Screen>
    );
  }
}
