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

export default function Entry(entry, navigation) {
    let { title, subtitle, secondTitle, secondSubtitle, thumbnail } = entry;
    let { videoId, browseId, playlistId } = entry;

    let view = {
        videoId: videoId,
        browseId: browseId,
        playlistId: playlistId,
    };

    let start = {
        videoId: videoId,
    }

    return (
        <View style={resultStyle.resultView}>
            <TouchableOpacity onPress={() => {handleMedia(view, navigation)}}>
                <Image style={resultStyle.resultCover} source={{uri: thumbnail}}/>
            </TouchableOpacity>

            <View style={resultStyle.resultColumnOne}>
                <Text numberOfLines={1} style={resultStyle.resultText}>{title}</Text>
                <Text numberOfLines={1} style={resultStyle.resultText}>{subtitle}</Text>
            </View>

            <View style={resultStyle.resultColumnTwo}>
                <Text numberOfLines={1} style={resultStyle.resultText}>{secondTitle}</Text>
                <Text numberOfLines={1} style={resultStyle.resultText}>{secondSubtitle}</Text>
            </View>

            <Button title="▶️" onPress={() => {handleMedia(start, navigation)}}/>
        </View>
    )
}