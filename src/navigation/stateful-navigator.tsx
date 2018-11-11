import * as React from "react";
import { inject, observer } from "mobx-react";
// @ts-ignore: until they update @type/react-navigation
import { getNavigation, NavigationScreenProp, NavigationState } from "react-navigation";

import { RootNavigator } from "./root-navigator";
import { NavigationStore } from "./navigation-store";
import { Loader } from "src/views/auth/loader";
import autobind from "autobind-decorator";
import { AssetLocator } from "src/services/asset";
import { color } from "src/theme";

interface StatefulNavigatorProps {
  navigationStore?: NavigationStore;
}

@inject("navigationStore")
@observer
export class StatefulNavigator extends React.Component<StatefulNavigatorProps, {}> {
  currentNavProp: NavigationScreenProp<NavigationState>;

  loader: Loader = null;

  getCurrentNavigation = () => {
    return this.currentNavProp;
  };

  @autobind
  removeLoader() {
    this.loader.animate();
  }

  async componentDidMount() {
    setTimeout(this.removeLoader, 2000);
  }

  render() {
    // grab our state & dispatch from our navigation store
    const { state, dispatch, actionSubscribers } = this.props.navigationStore;

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
        ref={(ref: Loader) => this.loader = ref}
        backgroundColor={color.loaderColor}
        imageProperties={{ height: 200, width: 200 }}
        imageSource={AssetLocator("exosuite-icon-loader")}
      >
        <RootNavigator navigation={this.currentNavProp}/>
      </Loader>
    );
  }
}
