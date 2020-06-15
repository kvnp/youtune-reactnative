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
        return albums.map(album => {
            return (
                <View style={styles.album}>
                    <Playlist playlist={album} navigation={this.props.navigation}/>
                </View>
            );
        });
    }

    displayShelf = (shelf) => {
        if (shelf.albums.length > 0) {
            return (
                <>
                    <Text style={styles.homeText}>{shelf.title}</Text>
                    <ScrollView style={styles.albumCollection} horizontal={true}>
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
        marginTop: (Dimensions.get("screen").height / 2) - 300,
        alignSelf: 'center'
    },

    scrollView: {
        height: '100%',
        flex: 1,
        flexDirection: 'column'
    },
    
    scrollContainer: {
        alignItems: 'center'
    },

    homeText: {
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingTop: 15,
        fontSize: 20
    },

    albumCollection: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingBottom: 5,
        marginBottom: 35
    },

    album: {
        marginRight: 20,
        width: 100,
        height: 160
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