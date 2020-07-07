import React, { PureComponent } from 'react';

import {
    Text,
    ScrollView
} from "react-native";

import Entry from '../shared/Entry';
import Playlist from '../shared/Playlist';

import { resultHomeStyle, albumStyle } from '../../styles/Home';
import { descriptionStyle } from '../../styles/Description';

export default class Shelf extends PureComponent {
    openAlbum = (album) => this.props.navigation.navigate("Playlist", album);

    displayAlbums = (albums) => {
        return albums.map(album => { return <Playlist style={albumStyle.album} playlist={album} navigation={this.props.navigation}/> } );
    }

    displayElement = (entry) => {
        return <Entry entry={entry} navigation={this.props.navigation}/>;
    }

    render() {
        const { title, entries, subtitle, albums, description } = this.props.shelf;

        let view = [];
        if (description != undefined)
            view.push(<Text style={descriptionStyle.text}>{description}</Text>)

        if (subtitle != undefined || subtitle != "")
            view.push(<Text>{subtitle}</Text>)

        if (entries != undefined)
            view.push(entries.map(this.displayElement));
        
        if (albums != undefined)
            view.push(
                <ScrollView style={albumStyle.albumCollection}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                    {this.displayAlbums(albums)}
                </ScrollView>
            );

        return (
            <>
                <Text style={resultHomeStyle.homeText}>{title}</Text>
                {view}
            </>
        );
    }
}