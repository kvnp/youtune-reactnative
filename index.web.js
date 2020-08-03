import {AppRegistry} from 'react-native'
import TrackPlayer from "react-native-track-player";

import {name as appName} from './react/app.json'
import App from './react/App'


import iconFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';
const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: MaterialIcons;
}

#app-root {
    display: flex;
    position: fixed;
    height: 100%;
    width: 100%;
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

AppRegistry.registerComponent(appName, () => App)

TrackPlayer.registerPlaybackService(() => require("./react/handler"));

TrackPlayer.setupPlayer();
TrackPlayer.updateOptions({
    stopWithApp: true,
    alwaysPauseOnInterruption: true,

    capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SEEK_TO
    ],

    notificationCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SEEK_TO
    ],

    compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT
    ],
});

AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('app-root'),
})