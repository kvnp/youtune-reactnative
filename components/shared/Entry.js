import React, { PureComponent } from 'react';

import {
    View,
    Image,
    TouchableOpacity,
    Text,
    Button
} from "react-native";

import { resultStyle } from '../../styles/Search';
import { handleMedia } from '../../modules/Event';

export default class Entry extends PureComponent {
    render() {
        let { title, subtitle, secondTitle, secondSubtitle, thumbnail } = this.props.entry;
        let { videoId, browseId, playlistId } = this.props.entry;

        let view = {
            videoId: videoId,
            browseId: browseId,
            playlistId: playlistId,
            navigation: this.props.navigation
        };

        let start = {
            videoId: videoId,
            navigation: this.props.navigation
        }

        return (
            <View style={resultStyle.resultView}>
                <TouchableOpacity onPress={() => {handleMedia(view)}}>
                    <Image style={resultStyle.resultCover} source={{uri: thumbnail}}></Image>
                </TouchableOpacity>

                <View style={resultStyle.resultColumnOne}>
                    <Text numberOfLines={1} style={resultStyle.resultText}>{title}</Text>
                    <Text numberOfLines={1} style={resultStyle.resultText}>{subtitle}</Text>
                </View>

                <View style={resultStyle.resultColumnTwo}>
                    <Text numberOfLines={1} style={resultStyle.resultText}>{secondTitle}</Text>
                    <Text numberOfLines={1} style={resultStyle.resultText}>{secondSubtitle}</Text>
                </View>

                <Button title="▶️" onPress={() => {handleMedia(start)}}/>
            </View>
        )
    }
}