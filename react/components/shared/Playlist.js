import React from 'react';

import {
    Text,
    Image
} from "react-native";
import { TouchableRipple } from 'react-native-paper';

import { playlistStyle } from '../../styles/Playlist';
import { useTheme } from '@react-navigation/native';
import { showModal } from '../modals/MoreModal';
import Navigation from '../../services/ui/Navigation';

export default Playlist = ({ playlist, navigation, style }) => {
    let { title, subtitle, thumbnail } = playlist;
    let { videoId, browseId, playlistId } = playlist;

    let view = {
        title: title,
        subtitle: subtitle,
        thumbnail: thumbnail,
        videoId: videoId,
        browseId: browseId,
        playlistId: playlistId
    };

    const { colors } = useTheme();

    return (
        <TouchableRipple
            rippleColor={colors.primary}
            onLongPress={() => showModal(view)}
            onPress={() => Navigation.handleMedia(view, navigation)}
            style={[style, playlistStyle.container]}
        >
            <>
            <Image style={playlistStyle.cover} source={{uri: thumbnail}}/>

            <Text style={[playlistStyle.title, {color: colors.text}]} numberOfLines={2}>
                {title}
            </Text>

            <Text style={[playlistStyle.description, {color: colors.text}]} numberOfLines={2}>
                {subtitle}
            </Text>
            </>
        </TouchableRipple>
    );
}