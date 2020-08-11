import React from 'react';

import {
    View,
    Image,
    Pressable,
    Text
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { resultStyle } from '../../styles/Search';
import { handleMedia } from '../../modules/event/mediaNavigator';
import { rippleConfig } from '../../styles/Ripple';

const handle = (obj, navigation) => handleMedia(obj, navigation);

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
        <Pressable
            onPress={() => handle(view, navigation)}
            onLongPress={() => global.showModal({title: title, subtitle: subtitle, thumbnail: thumbnail})}
            style={resultStyle.resultView}
        >
            <Pressable android_ripple={rippleConfig} onPress={() => handle(view, navigation)}>
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

            <Pressable onPress={() => global.showModal({title: title, subtitle: subtitle, thumbnail: thumbnail})}>
                <MaterialIcons name="more-vert" color="black" size={24}/>
            </Pressable>
        </Pressable>
    );
}