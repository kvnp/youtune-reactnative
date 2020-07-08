import React, { PureComponent } from 'react';

import {
    Text,
    Image,
    TouchableOpacity,
    View
} from "react-native";

import { playlistStyle } from '../../styles/Playlist';
import { handleMedia } from '../../modules/Event';

export default class Playlist extends PureComponent {
    render() {
        let { title, subtitle, thumbnail } = this.props.playlist;
        let { videoId, browseId, playlistId } = this.props.playlist;

        let viewObject = {
            videoId: videoId,
            browseId: browseId,
            playlistId: playlistId,
            navigation: this.props.navigation
        };

        return (
            <View style={[this.props.style, playlistStyle.container]}>
                <TouchableOpacity onPress={() => handleMedia(viewObject, this.props.navigation)}>
                    <Image style={playlistStyle.cover} source={{uri: thumbnail}}/>
                </TouchableOpacity>

                <Text style={playlistStyle.title}
                      numberOfLines={2}>
                    {title}
                </Text>

                <Text style={playlistStyle.description}
                      numberOfLines={2}>
                    {subtitle}
                </Text>
            </View>
        );
    }
}