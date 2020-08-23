import { AppRegistry } from 'react-native'
import { name } from '../react/app.json'
import App from '../react/App'

import iconFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';
import { register } from '../react/service';

const iconFontStyles = `@font-face {
                            src: url(${iconFont});
                            font-family: MaterialIcons;
                        }

                        body {
                            position: fixed;
                            top: 0;
                            width: 100%;
                            height: 100%;
                        }

                        #app {
                            height: 100%;
                            width: 100%;
                        }
                        
                        #app > div {
                            height: 100%
                        }

                        `;

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

AppRegistry.runApplication(name, {
    initialProps: {},
    rootTag: document.getElementById('app'),
});