import { AppRegistry } from 'react-native'
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import iconFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';

import { name } from '../react/app.json'
import App from '../react/App'
import { register } from '../react/service';

const iconFontStyles = `@font-face{src: url(${iconFont});font-family: MaterialIcons;}`;

const style = document.createElement('style');
style.rel = "stylesheet";
style.type = 'text/css';

if (style.styleSheet)
    style.styleSheet.cssText = iconFontStyles;
else
    style.appendChild(document.createTextNode(iconFontStyles));

document.head.appendChild(style);

AppRegistry.registerComponent(name, () => App);
register();

OfflinePluginRuntime.install();

AppRegistry.runApplication(name, {
    initialProps: {},
    rootTag: document.getElementById('app'),
});