import { AppRegistry } from 'react-native';
import App from './App';
import { name } from './app.json';
import TrackPlayer from "react-native-track-player";

AppRegistry.registerComponent(name, () => App);
TrackPlayer.registerPlaybackService();
