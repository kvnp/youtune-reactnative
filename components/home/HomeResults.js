import React, { PureComponent } from 'react';

import {
    Text,
    ScrollView,
    View
} from "react-native";

import Playlist from '../shared/Playlist';

import { fetchHome } from '../../modules/API';

import { resultHomeStyle, albumStyle } from '../../styles/Home';

export default class Results extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            icon: '🏠',
            home: null,
            started: false,
        }
    }

    componentDidUpdate() {
        if (this.props.load && !this.state.started) {
            this.setState({started: true});
            this.startRefresh();
        }
    }
    
    startRefresh = () => {
        this.setState({icon: '|'});

        let loader = setInterval(() => {
            switch (this.state.icon) {
                case '|' :
                    return this.setState({icon: '/'});
                case '/' :
                    return this.setState({icon: '-'});
                case '-' :
                    return this.setState({icon: '\\'});
                case '\\':
                    return this.setState({icon: '|'});
            }
        }, 300);

        fetchHome().then((result) => {
            clearInterval(loader);

            if (result.background != undefined) {
                this.props.setImage(result.background);
                this.setState({home: result});
            } else this.props.setImage(null);

            this.setState({icon: '🏠', started: false});
        });
    }

    openAlbum = (album) => this.props.navigation.navigate("Playlist", album);

    displayAlbums = (albums) => {
        return albums.map(album => { return <Playlist style={albumStyle.album} playlist={album} navigation={this.props.navigation}/> } );
    }

    displayShelf = (shelf) => {
        if (shelf.albums.length > 0) {
            return (
                <>
                    <Text style={resultHomeStyle.homeText}>{shelf.title}</Text>
                    <ScrollView style={albumStyle.albumCollection} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {this.displayAlbums(shelf.albums)}
                    </ScrollView>
                </>
            )
        }
    }

    displayShelves = (result) => {
        return result.shelves.map(this.displayShelf);
    }

    displayHome = () => {
        if (this.state.home == null || this.state.started)
            return <Text style={resultHomeStyle.preHome}>{this.state.icon}</Text>
        else
            return <View>{this.displayShelves(this.state.home)}</View>
    }

    render() {
        return (
            <ScrollView style={resultHomeStyle.scrollView}
                        contentContainerStyle={resultHomeStyle.scrollContainer}>
                {this.displayHome()}
            </ScrollView>
        )
    }
}