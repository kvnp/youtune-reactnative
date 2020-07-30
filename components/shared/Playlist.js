import React from 'react';

import {
    Text,
    Image,
    Pressable
} from "react-native";

import { playlistStyle } from '../../styles/Playlist';
import { handleMedia } from '../../modules/event/mediaNavigator';
import { rippleConfig } from '../../styles/Ripple';

export default ({ playlist, navigation, style }) => {
    let { title, subtitle, thumbnail } = playlist;
    let { videoId, browseId, playlistId } = playlist;

    let viewObject = {
        videoId: videoId,
        browseId: browseId,
        playlistId: playlistId,
        ...navigation
    };

    return (
        <Pressable android_ripple={rippleConfig} onPress={() => handleMedia(viewObject, navigation)} style={[style, playlistStyle.container]}>
            <Image style={playlistStyle.cover} source={{uri: thumbnail}}/>

            <Text style={playlistStyle.title}
                    numberOfLines={2}>
                {title}
            </Text>

            <Text style={playlistStyle.description}
                    numberOfLines={2}>
                {subtitle}
            </Text>
        </Pressable>
    );
}