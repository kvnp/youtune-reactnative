import {AppRegistry} from 'react-native'
import {name as appName} from './app.json'
import App from './App'

import iconFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';
const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: MaterialIcons;
}`;

const style = document.createElement('style');
style.rel = "stylesheet";
style.type = 'text/css';

if (style.styleSheet)
    style.styleSheet.cssText = iconFontStyles;
else
    style.appendChild(document.createTextNode(iconFontStyles));

document.head.appendChild(style);

AppRegistry.registerComponent(appName, () => App)

AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('app-root'),
})