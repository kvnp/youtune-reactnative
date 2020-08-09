import { AppRegistry } from 'react-native';
import App from './react/App';
import { name } from './react/app.json';
import { register } from './react/service';

AppRegistry.registerComponent(name, () => App);
register();