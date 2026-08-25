import {AppRegistry, LogBox} from 'react-native';
import {App} from './src/App';
import {name as appName} from './app.json';

LogBox.ignoreLogs([
  '************** Running debug build of JavaScript',
  "hasViewManagerConfig('RCTSafeAreaView') is not implemented",
  'useComponentInstance is deprecated.',
]);

AppRegistry.registerComponent(appName, () => App);
