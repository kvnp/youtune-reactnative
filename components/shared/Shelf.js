import React, { PureComponent } from 'react';

import {
    Text,
    ScrollView
} from "react-native";

import Entry from '../shared/Entry';
import Playlist from '../shared/Playlist';

import { resultHomeStyle, albumStyle } from '../../styles/Home';

export default class Shelf extends PureComponent {
    openAlbum = (album) => this.props.navigation.navigate("Playlist", album);

    displayAlbums = (albums) => {
        return albums.map(album => { return <Playlist style={albumStyle.album} playlist={album} navigation={this.props.navigation}/> } );
    }

    getAlbumShelf = (albums) => {
        if (albums != undefined)
        return (
            <ScrollView style={albumStyle.albumCollection}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                {this.displayAlbums(albums)}
            </ScrollView>
        )
    }

    getInfoShelf = (info) => {

    }

    displayElement = (entry) => {
        return <Entry song={entry} navigation={this.props.navigation}/>;
    }

    getEntryShelf = (entries) => {
        if (entries != undefined)
        return entries.map(this.displayElement);
    }

    render() {
        let { title, albums, entries, info } = this.props.shelf;
        return (
            <>
                <Text style={resultHomeStyle.homeText}>{title}</Text>
                {this.getAlbumShelf(albums)}
                {this.getInfoShelf(info)}
                {this.getEntryShelf(entries)}
            </>
        );
    }
}