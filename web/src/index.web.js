import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native'
import iconFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';

import { name } from '../../react/app.json'
import App from '../../react/App'

const styles = `@font-face{
    src: url(${iconFont});
    font-family: MaterialIcons;
}`;

const style = document.createElement('style');
style.rel = "stylesheet";

if (style.styleSheet)
    style.styleSheet.cssText = styles;
else
    style.appendChild(document.createTextNode(styles));

document.head.appendChild(style);

AppRegistry.registerComponent(name, () => App);

AppRegistry.runApplication(name, {
    initialProps: {},
    rootTag: document.getElementById('app'),
});