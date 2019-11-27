import {PERMISSIONS, RESULTS} from "react-native-permissions/src/constants";
export {PERMISSIONS, RESULTS};

// tslint:disable-next-line:no-empty
export const openSettings = jest.fn(async () => {});
// tslint:disable-next-line:typedef
export const check = jest.fn(async (permission) => RESULTS.GRANTED);
// tslint:disable-next-line:typedef
export const request = jest.fn(async (permission) => RESULTS.GRANTED);

const notificationOptions = [
  "alert",
  "badge",
  "sound",
  "criticalAlert",
  "carPlay",
  // 'provisional', // excluded as it's not included in NotificationSettings
];

const notificationSettings = {
  alert: true,
  badge: true,
  sound: true,
  carPlay: true,
  criticalAlert: true,
  lockScreen: true,
  notificationCenter: true,
};

export const checkNotifications = jest.fn(async () => ({
  status: RESULTS.GRANTED,
  settings: notificationSettings,
}));

// tslint:disable-next-line:typedef
export const requestNotifications = jest.fn(async (options) => ({
  status: RESULTS.GRANTED,
  settings: options
    // tslint:disable-next-line:typedef
    .filter((option) => notificationOptions.includes(option))
    // tslint:disable-next-line:typedef
    .reduce((acc, option) => ({...acc, [option]: true}), {
      lockScreen: true,
      notificationCenter: true,
    }),
}));

// tslint:disable-next-line:no-default-export
export default {
  PERMISSIONS,
  RESULTS,
  openSettings,
  check,
  request,
  checkNotifications,
  requestNotifications,
};
