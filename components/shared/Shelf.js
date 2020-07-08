import React, { PureComponent } from 'react';

import { Text } from "react-native";

import Entry from '../shared/Entry';
import Playlist from '../shared/Playlist';

import { resultHomeStyle, albumStyle } from '../../styles/Home';
import { descriptionStyle } from '../../styles/Description';
import FlatAlbums from '../collections/FlatAlbums';
import FlatEntries from '../collections/FlatEntries';

export default class Shelf extends PureComponent {
    render() {
        const { title, entries, subtitle, albums, description } = this.props.shelf;

        let view = [];
        if (description != undefined)
            view.push(<Text style={descriptionStyle.text}>{description}</Text>)

        if (subtitle != undefined || subtitle != "")
            view.push(<Text>{subtitle}</Text>)

        if (entries != undefined)
            view.push(FlatEntries(entries, this.props.navigation));
        
        if (albums != undefined)
            view.push(FlatAlbums(albums, this.props.navigation));

        return (
            <>
                <Text style={resultHomeStyle.homeText}>{title}</Text>
                {view}
            </>
        );
    }
}