import { Instance, types } from "mobx-state-tree"
import { RootNavigator } from "./root-navigator"
import { NavigationAction, NavigationActions, NavigationLeafRoute } from "react-navigation"
import { NavigationEvents } from "./navigation-events"
import { IVoidFunction } from "@types"

const DEFAULT_STATE = RootNavigator.router.getStateForAction(NavigationActions.init(), null)

/**
 * Finds the current route.
 *
 * @param navState the current nav state
 */
function findCurrentRoute(navState: object): NavigationLeafRoute {
  // @ts-ignore
  const route = navState.routes[navState.index]
  if (route.routes) {
    return findCurrentRoute(route)
  }

  return route
}

/**
 * Tracks the navigation state for `react-navigation` as well as providers
 * the actions for changing that state.
 */
export const NavigationStoreModel = NavigationEvents.named("NavigationStore")
  .props({
    /**
     * the navigation state tree (Frozen here means it is immutable.)
     */
    state: types.optional(types.frozen(), DEFAULT_STATE)
  })
  // tslint:disable-next-line:typedef deprecation
  .preProcessSnapshot((snapshot) => {
    if (!snapshot || !Boolean(snapshot.state)) {
      return snapshot
    }

    try {
      // make sure react-navigation can handle our state
      RootNavigator.router.getPathAndParamsForState(snapshot.state)

      return snapshot
    } catch (err) {
      // otherwise restore default state
      return { ...snapshot, state: DEFAULT_STATE }
    }
  })
  .actions((self: Instance<typeof NavigationStoreModel>) => ({
    /**
     * Return all subscribers
     */
    actionSubscribers(): any {
      return self.subs
    },

    /**
     * Fires when navigation happens.
     *
     * Our job is to update the state for this new navigation action.
     *
     * @param action The new navigation action to perform
     * @param shouldPush Should we push or replace the whole stack?
     */
    // tslint:disable-next-line no-inferrable-types no-flag-args
    dispatch(action: NavigationAction, shouldPush: boolean = true): boolean {
      const previousNavState = shouldPush ? self.state : null
      self.state = RootNavigator.router.getStateForAction(action, previousNavState) || self.state
      self.fireSubscribers(action, previousNavState, self.state)

      return true
    },

    /**
     * Resets the navigation back to the start.
     */
    reset(): void {
      self.state = DEFAULT_STATE
    },

    smoothReset(callback: IVoidFunction): void {
      self.reset()
      callback()
    },

    /**
     * Finds the current route.
     */
    findCurrentRoute(): NavigationLeafRoute {
      return findCurrentRoute(self.state)
    }
  }))
  .actions((self: any) => ({
    /**
     * Navigate to another place.
     *
     * @param routeName The route name.
     */
    navigateTo(routeName: string): void {
      self.dispatch(NavigationActions.navigate({ routeName }))
    }
  }))

export type NavigationStore = Instance<typeof NavigationStoreModel>
