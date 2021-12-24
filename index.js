import 'react-native-gesture-handler';
import { AppRegistry, Platform } from 'react-native';
import App from './react/App';

AppRegistry.registerComponent(
    Platform.OS == "windows"
        ? "youtune"
        : "YouTune", 
    () => App
);