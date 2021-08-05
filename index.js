import { AppRegistry, Platform } from 'react-native';
import App from './react/App';
import { register } from './react/service';

AppRegistry.registerComponent(
    Platform.OS == "windows"
        ? "youtune"
        : "YouTune", 
    () => App
);

register();