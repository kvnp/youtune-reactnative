import React, { PureComponent } from 'react';

import {
    Text,
    Image,
    TouchableOpacity,
    View
} from "react-native";

import { fetchBrowse } from '../../modules/API';
import { playlistStyle } from '../../styles/Playlist';

export default class Playlist extends PureComponent {
    constructor(props) {
        super(props);
        this.browse = null;
    }

    viewPlaylist = () => {
        let { browseId } = this.props.playlist;

        if (this.browse == null) fetchBrowse(browseId).then((result) => {
            this.browse = result;
            this.props.navigation.navigate("Playlist", result);
        });

        else this.props.navigation.navigate("Playlist", this.browse);
    }

    render() {
        let {title, subtitle, thumbnail} = this.props.playlist;
        return (
            <View style={[this.props.style, playlistStyle.container]}>
                <TouchableOpacity onPress={() => this.viewPlaylist()}>
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