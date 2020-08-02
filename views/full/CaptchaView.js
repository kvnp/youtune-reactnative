import React, { PureComponent } from "react";
import { WebView } from 'react-native-webview';

export default class CaptchaView extends PureComponent {
    constructor(props) {
        super(props);
        this.YOUTUBE_URL = "https://m.youtube.com/watch?v="
    }
    
    render() {
        const destination = this.YOUTUBE_URL + this.props.route.params.videoId;
        return <WebView
                    source={{ uri: destination }}
                    onNavigationStateChange={params => console.log(params)}
               />;
    }
}