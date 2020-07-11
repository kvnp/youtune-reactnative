import React, { PureComponent } from 'react';

import {
    View,
    Image,
    Pressable,
    Text,
    Button
} from "react-native";

import { resultStyle } from '../../styles/Search';
import { handleMedia } from '../../modules/Event';
import { rippleConfig } from '../../styles/Ripple';

export default ({entry, navigation}) => {
    let { title, subtitle, secondTitle, secondSubtitle, thumbnail } = entry;
    let { videoId, browseId, playlistId } = entry;

    let view = {
        title: title,
        subtitle: subtitle,
        thumbnail: thumbnail,
        videoId: videoId,
        browseId: browseId,
        playlistId: playlistId,
    };

    return (
        <View style={resultStyle.resultView}>
            <Pressable android_ripple={rippleConfig} onPress={() => {handleMedia(view, navigation)}}>
                <Image style={resultStyle.resultCover} source={{uri: thumbnail}}/>
            </Pressable>

            <View style={resultStyle.resultColumnOne}>
                <Text numberOfLines={1} style={resultStyle.resultText}>{title}</Text>
                <Text numberOfLines={1} style={resultStyle.resultText}>{subtitle}</Text>
            </View>

            <View style={resultStyle.resultColumnTwo}>
                <Text numberOfLines={1} style={resultStyle.resultText}>{secondTitle}</Text>
                <Text numberOfLines={1} style={resultStyle.resultText}>{secondSubtitle}</Text>
            </View>

            <Button title="▶️" onPress={() => {handleMedia(view, navigation)}}/>
        </View>
    )
}