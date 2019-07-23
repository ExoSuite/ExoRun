import * as React from "react"
import { observer } from "mobx-react"
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { observable } from "mobx"
import autobind from "autobind-decorator"
import LottieView from "lottie-react-native"
import { AppScreens } from "@navigation/navigation-definitions"
// @ts-ignore
import { IBoolFunction } from "@types/FunctionTypes"
import moment from "moment"
import { Lottie } from "@services/lottie"
import AnimatedLottieView from "lottie-react-native"

export interface IAchievementsScreenProps extends NavigationScreenProps<{}> {
}

const TITLE: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  marginLeft: spacing[5],
  margin: spacing[2],
  flexDirection: "row",
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1
}

const TIME_CONTAINER: ViewStyle = {
  backgroundColor: color.backgroundDarkerer,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  margin: spacing[2],
  padding: spacing[2]
}

const TEXT_ALIGN_RIGHT: TextStyle = {
  textAlign: "right"
}

const ROW: ViewStyle = {
  flexDirection: "row"
}

const keyExtractor = (item: any, index: number): string => item.id

// @inject("mobxstuff")
@observer
export class AchievementsScreen extends React.Component<IAchievementsScreenProps, {}> {
  private testData = [
    {
      createdAt: "2019-06-09 09:15:00",
      id: 1,
      infos: {
        name: "Defi 1",
        progression: 50
      }
    },
    {
      createdAt: "2017-01-27 15:37:46",
      id: 2,
      infos: {
        name: "Defi 2",
        progression: 75
      }
    },
    {
      createdAt: "2018-12-14 01:57:46",
      id: 3,
      infos: {
        name: "Defi 3",
        progression: 33
      }
    }]

  @autobind
  private onTimePressNavigateToDetails(item: any): IBoolFunction {
    return (): boolean => this.props.navigation.navigate(
      AppScreens.RUN,
      {
        item
      }
    )
  }

  @autobind
  // tslint:disable-next-line:prefer-function-over-method
  private renderAchivements({item}: { item: any }): React.ReactElement {
    const formattedCreatedAt = moment(item.createdAt).format("LLL")

    return (
      <TouchableOpacity
        style={TIME_CONTAINER}
        onPress={this.onTimePressNavigateToDetails}
      >
        <View style={ROW}>
          <View style={{marginLeft: spacing[2], justifyContent: "center"}}>
            <Text
              style={{textTransform: "capitalize"}}
              text={item.infos.name}
              preset="userRow"
            />

            <LottieView
              source={Lottie.AchievementsProgressBar}
              loop
              autoPlay
              style={{ height: 100, marginLeft: 3, backgroundColor: "green"}}
            />
            <AnimatedLottieView
              source={Lottie.AchievementsProgressBar}
              loop
              autoPlay
              duration={1500}
              style={{ height: 100, marginLeft: 3, backgroundColor: "white" }}
            />

          </View>
        </View>
        <View style={{...ROW, flex: 1, marginTop: spacing[3]}}>
          <View style={{alignSelf: "flex-end", flex: 1}}>
            <Text preset="fieldLabel" tx="common.createdAt"/>
            <Text preset="fieldLabel" text={formattedCreatedAt}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  public render (): React.ReactNode {
    return (
      <Screen style={ROOT} preset="fixed">
        <View style={TITLE}>
          <Text preset="headerCentered" text="Accomplissements"/>
        </View>
        <FlatList
          data={this.testData}
          keyExtractor={keyExtractor}
          renderItem={this.renderAchivements}
        />
      </Screen>
    )
  }
}
