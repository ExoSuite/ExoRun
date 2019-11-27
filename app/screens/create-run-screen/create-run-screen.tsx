import * as React from "react"
import { observer } from "mobx-react"
import { View, ViewStyle } from "react-native"
import { Button, DismissKeyboard, Text, TextField } from "@components"
import { color, spacing } from "@theme/index"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { Menu } from "react-native-paper"
import { action, observable, runInAction } from "mobx"
import { RunType } from "@screens/create-run-screen/run-type"
import { IVoidFunction } from "@custom-types/functions"
import { translate } from "@i18n/translate"
import autobind from "autobind-decorator"
import { AppScreens } from "@navigation/navigation-definitions"
import { isEmpty } from "lodash-es"
import Geolocation from "react-native-geolocation-service";
import { PERMISSIONS, request } from "react-native-permissions"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  padding: spacing[6],
  flex: 1,
  justifyContent: "space-evenly",
}

const BOTTOM_BORDER: ViewStyle = {
  borderBottomColor: color.palette.lighterGrey,
  borderBottomWidth: 0.5,
}

const INPUT_STYLE: ViewStyle = {
  backgroundColor: color.transparent,
}

const disabled = color.palette.lightGrey
const enabled = color.secondary

// tslint:disable-next-line:completed-docs
@observer
export class CreateRunScreen extends React.Component {

  @observable private chooseRunTypeOpened = false
  @observable private description: string = null
  @observable private name: string = null
  @observable private runType: RunType = RunType.PRIVATE

  public static navigationOptions = {
    headerTitle: <Text tx="run.new" preset="header"/>,
    headerLeft: NavigationBackButtonWithNestedStackNavigator({
      iconName: "chevron-down",
    }),
  }

  private chooseRunType(runType: RunType): IVoidFunction {
    // tslint:disable-next-line: no-void-expression
    return (): void => runInAction(() => {
      this.runType = runType
      this.toggleChooseRunTypeOpened()
    })
  }

  @autobind
  private navigateNext(): void {
    this.props.navigation.navigate(
      AppScreens.CHECKPOINTS_FOR_NEW_RUN, {
        runType: this.runType,
        description: this.description,
        name: this.name,
      },
    )
  }

  @action.bound
  private toggleChooseRunTypeOpened(): void {
    this.chooseRunTypeOpened = !this.chooseRunTypeOpened
  }

  @action.bound
  private updateDescription(description: string): void {
    this.description = description
  }

  @action.bound
  private updateName(name: string): void {
    this.name = name
  }

  // tslint:disable-next-line:no-feature-envy
  public render(): React.ReactNode {

    const translatedRunType = translate(`run.${this.runType}`)

    const buttonColor = !isEmpty(this.name) && !isEmpty(this.description) ? enabled : disabled

    return (
      <DismissKeyboard>
        <View style={ROOT}>
          <TextField
            value={this.name}
            autoCapitalize="none"
            labelTx="run.name"
            placeholderTx="run.name"
            inputStyle={[INPUT_STYLE, BOTTOM_BORDER]}
            placeholderTextColor={color.palette.lightGrey}
            onChangeText={this.updateName}
          />
          <TextField
            value={this.description}
            autoCapitalize="none"
            labelTx="run.description"
            multiline
            placeholderTx="run.description"
            inputStyle={[INPUT_STYLE, BOTTOM_BORDER]}
            placeholderTextColor={color.palette.lightGrey}
            onChangeText={this.updateDescription}
          />

          <Menu
            visible={this.chooseRunTypeOpened}
            onDismiss={this.toggleChooseRunTypeOpened}
            anchor={
              (
                <Button
                  preset="neutral"
                  textPreset="primaryBoldLarge"
                  text={`${translate("run.type")}: ${translatedRunType}`}
                  onPress={this.toggleChooseRunTypeOpened}
                />
              )
            }
            contentStyle={{ backgroundColor: color.backgroundDarkerer }}
          >
            <Menu.Item
              onPress={this.chooseRunType(RunType.PRIVATE)}
              title={<Text style={{ textTransform: "capitalize" }} text={translate(`run.${RunType.PRIVATE}`)}/>}
            />
            <Menu.Item
              onPress={this.chooseRunType(RunType.PUBLIC)}
              title={<Text style={{ textTransform: "capitalize" }} text={translate(`run.${RunType.PUBLIC}`)}/>}
            />
          </Menu>

          <Button
            tx="common.next-step"
            textPreset="primaryBoldLarge"
            style={{ height: spacing[7], backgroundColor: buttonColor }}
            onPress={this.navigateNext}
            disabled={buttonColor !== enabled}
          />

        </View>
      </DismissKeyboard>
    )
  }
}
