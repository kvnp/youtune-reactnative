import React from "react";
//import { WebView } from 'react-native-webview';

export default CaptchaView = ({route}) => {
    const destination = "https://www.youtube.com/watch?v=" + route.params.videoId;
    /*return <WebView
                source={{ uri: destination }}
                onNavigationStateChange={params => console.log(params)}
    />;*/

    return <>
        <Text>{destination}</Text>
    </>
}