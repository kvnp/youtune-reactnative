import React, { PureComponent } from 'react';

import {
    View,
    Image,
    Linking,
    TouchableOpacity,
    Text,
    Button
} from "react-native";

import { resultStyle } from '../../styles/SearchTab';

export default class SongElement extends PureComponent {
    render() {
        let {title, subtitle, secondTitle, secondSubtitle, thumbnail} = this.props.song;
        return (
            <View style={resultStyle.resultView}>
                <TouchableOpacity onPress={() => {this.triggerEvent(element)}}>
                    <Image style={resultStyle.resultCover} source={{uri: thumbnail}}></Image>
                </TouchableOpacity>

                <View style={resultStyle.resultColumnOne}>
                        <Text numberOfLines={1} style={resultStyle.resultText}>{title}</Text>
                        <Text style={resultStyle.resultText}>{subtitle}</Text>
                    </View>
                    <View style={resultStyle.resultColumnTwo}>
                        <Text numberOfLines={1} style={resultStyle.resultText}>{secondTitle}</Text>
                        <Text style={resultStyle.resultText}>{secondSubtitle}</Text>
                </View>

                <Button
                    title="▶️"
                    onPress={() => {
                        Linking.openURL("https://music.youtube.com/watch?v=" + (element.videoId))
                    }}/>
            </View>
        )
    }
}