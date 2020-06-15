import React, {Component} from 'react';

import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    Dimensions
} from "react-native";

import { Playlist } from './SharedComponents';

import { fetchHome } from '../modules/Tube';

export class Results extends Component {
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

    openAlbum = (album) => {
        this.props.navigation.navigate("Playlist", album);
    }

    displayAlbums = (albums) => {
        return albums.map(album => {return <Playlist style={styles.album} playlist={album} navigation={this.props.navigation}/>} );
    }

    displayShelf = (shelf) => {
        if (shelf.albums.length > 0) {
            return (
                <>
                    <Text style={styles.homeText}>{shelf.title}</Text>
                    <ScrollView style={styles.albumCollection} horizontal={true} showsHorizontalScrollIndicator={false}>
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
        if (this.state.home == null || this.state.started) {
            return (
                <Text style={styles.preHome}>
                    {this.state.icon}
                </Text>
            )
        } else 
            return (
                <View>
                    {this.displayShelves(this.state.home)}
                </View>
            )
    }

    render() {
        return (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
                {this.displayHome()}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    preHome: {
        fontSize: 70,
    },

    scrollView: {
        flexGrow: 1,
        flexDirection: 'column'
    },
    
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    homeText: {
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingTop: 20,
        fontSize: 25
    },

    albumCollection: {
        paddingTop: 10,
        paddingLeft: 20,
        paddingBottom: 5,
        marginBottom: 35
    },

    album: {
        marginRight: 20
    },

    albumCover: {
        height: 100,
        width: 100,
        backgroundColor: 'gray'
    },

    albumTitle: {
        paddingTop: 5,
        fontSize: 10,
        fontWeight: 'bold'
    },

    albumDesc: {
        fontSize: 10,
    }
});