import * as React from "react";
import { inject, observer } from "mobx-react";
import { action, observable } from "mobx";
import { StyleSheet } from 'react-native';
// @ts-ignore: until they update @type/react-navigation
import { getNavigation, NavigationScreenProp, NavigationState } from "react-navigation";
import Loader from "react-native-mask-loader";

import { RootNavigator } from "./root-navigator";
import { NavigationStore } from "./navigation-store";

interface StatefulNavigatorProps {
  navigationStore?: NavigationStore;
}

@inject("navigationStore")
@observer
export class StatefulNavigator extends React.Component<StatefulNavigatorProps, {}> {
  currentNavProp: NavigationScreenProp<NavigationState>;

  @observable appLoaded: boolean = false;

  getCurrentNavigation = () => {
    return this.currentNavProp;
  };

  @action.bound
  removeLoader() {
    this.appLoaded = true;
  }

  async componentDidMount() {
      setTimeout(this.removeLoader, 2000);
  }

  render() {
    // grab our state & dispatch from our navigation store
    const { state, dispatch, actionSubscribers } = this.props.navigationStore;

    const { appLoaded } = this;

    // create a custom navigation implementation
    this.currentNavProp = getNavigation(
      RootNavigator.router,
      state,
      dispatch,
      actionSubscribers(),
      {},
      this.getCurrentNavigation
    );

    return (
      <Loader
        isLoaded={appLoaded}
        imageSource={require("./twitter.png")}
        backgroundStyle={styles.loadingBackgroundStyle}
      >
        <RootNavigator navigation={this.currentNavProp}/>
      </Loader>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingBackgroundStyle: {
    backgroundColor: 'rgba(125, 125, 255, 1)',
  },
});
