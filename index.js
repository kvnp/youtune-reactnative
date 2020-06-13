/**
 * @format
 */

global.apikey = null;

global.playlist = {};
global.artist = {};

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
