import React from 'react';

import {
    Text,
    Image,
    Pressable
} from "react-native";

import { playlistStyle } from '../../styles/Playlist';
import { handleMedia } from '../../modules/event/mediaNavigator';
import { rippleConfig } from '../../styles/Ripple';
import { useTheme } from '@react-navigation/native';

export default Playlist = ({ playlist, navigation, style }) => {
    let { title, subtitle, thumbnail } = playlist;
    let { videoId, browseId, playlistId } = playlist;

    let view = {
        title: title,
        subtitle: subtitle,
        thumbnail: thumbnail,
        videoId: videoId,
        browseId: browseId,
        playlistId: playlistId,
        ...navigation
    };

    const { colors } = useTheme();

    return (
        <Pressable
            android_ripple={rippleConfig}
            onLongPress={() => global.showModal(view)}
            onPress={() => handleMedia(view, navigation)}
            style={[style, playlistStyle.container]}
        >
            <Image style={playlistStyle.cover} source={{uri: thumbnail}}/>

            <Text style={[playlistStyle.title, {color: colors.text}]} numberOfLines={2}>
                {title}
            </Text>

            <Text style={[playlistStyle.description, {color: colors.text}]} numberOfLines={2}>
                {subtitle}
            </Text>
        </Pressable>
    );
}