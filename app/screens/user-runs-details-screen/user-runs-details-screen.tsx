import * as React from "react"
import { observer } from "mobx-react"
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import moment from "moment"

export interface IUserRunsDetailsScreenProps extends NavigationScreenProps<{}> {
}

const TITLE: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  marginLeft: spacing[5],
  margin: spacing[2]
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  flex: 1
}

const TEXT_ALIGN_CENTER : TextStyle = {
  textAlign: "center"
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

// tslint:disable-next-line:completed-docs
@observer
export class UserRunsDetailsScreen extends React.Component<IUserRunsDetailsScreenProps> {
  private testDatas =
    {
      createdAt: "2019-06-09 08:37:46",
      id: 1,
      run: {
        name: "Run 1"
      },
      times: [
        {
          current_time: 64,
          checkpoint: {
            name: "Checkpoint 1"
          },
          createdAt: "2019-06-09 08:37:46"
        },
        {
          current_time: 128,
          checkpoint: {
            name: "Checkpoint 2"
          },
          createdAt: "2019-06-09 08:37:46"
        },
        {
          current_time: 256,
          checkpoint: {
            name: "Checkpoint 3"
          },
          createdAt: "2019-06-09 08:37:46"
        },
        {
          current_time: 512,
          checkpoint: {
            name: "Checkpoint 4"
          },
          createdAt: "2019-06-09 08:37:46"
        },
        {
          current_time: 1024,
          checkpoint: {
            name: "Checkpoint 5"
          },
          createdAt: "2019-06-09 08:37:46"
        }
      ],
      updatedAt: "2019-06-09 08:39:48"
    }

  // tslint:disable-next-line:no-feature-envy
  public renderTimes({item}: { item: any }): React.ReactElement {
    const formattedCreatedAt = moment(item.created_at).format("LLL");
    const time = new Date(
      0,
      0,
      0,
      (item.current_time / 3600),
      (item.current_time / 60) % 60,
      item.current_time % 60
    );
    // tslint:disable-next-line:max-line-length
    const formattedTime = time.getHours().toString()
      + " h " + time.getMinutes().toString() + " min " + time.getSeconds().toString() + " sec";

    return (
      <TouchableOpacity
        style={TIME_CONTAINER}
      >
        <View style={ROW}>
          <View style={{marginLeft: spacing[2], justifyContent: "center"}}>
            <Text
              style={{textTransform: "capitalize"}}
              text={item.checkpoint.name}
              preset="userRow"
            />
          </View>
        </View>
        {/*
        <View style={{marginTop: spacing[3]}}>
          <Text text={item.content} />
        </View>
*/}
        <View style={{...ROW, flex: 1, marginTop: spacing[3]}}>
          <View>
            <Text preset="default" text="Temps :"/>
            <Text preset="default" text={formattedTime}/>
          </View>
          <View style={{alignSelf: "flex-end", flex: 1}}>
            <Text preset="fieldLabel" tx="common.createdAt" style={TEXT_ALIGN_RIGHT}/>
            <Text preset="fieldLabel" text={formattedCreatedAt} style={TEXT_ALIGN_RIGHT}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  public render(): React.ReactNode {

    return (
      <Screen style={ROOT} preset="scroll">
        <View>
          <View style={TITLE}>
            <Text preset="userRow">{this.testDatas.run.name}</Text>
          </View>
        </View>
        <FlatList
          data={this.testDatas.times}
          renderItem={this.renderTimes}
          keyExtractor={keyExtractor}
        />
      </Screen>
    )
  }
}
