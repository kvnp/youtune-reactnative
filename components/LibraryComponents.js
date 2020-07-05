import React, { PureComponent } from 'react';

import {
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from "react-native";

export class LibraryNavigator extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selection: 0
        }

        global.setLibraryNavigator = (selection) => {
            if (this.state.selection != selection)
                this.setState({selection: selection});
        };
    }

    getStyle = (value) => {
        if (value == this.state.selection)
            return styles.headerEntryFocus;
        else
            return styles.headerEntry;
    }

    getTextStyle = (value) => {
        if (value == this.state.selection)
            return styles.headerEntryTextFocus;
        else
            return styles.headerEntryText;
    }

    update = (value) => {
        if (value != this.state.selection) {
            this.setState({selection: value});
            switch (value) {
                case 0:
                    this.props.navigation.push("LibraryPlaylist");
                    break;
                case 1: 
                    this.props.navigation.push("LibraryAlbums");
                    break;
                case 2:
                    this.props.navigation.push("LibrarySongs");
                    break;
                case 3:
                    this.props.navigation.push("LibraryArtists");
                    break;
                case 4:
                    this.props.navigation.push("LibrarySubscriptions");
                    break;
            }
        }
    };

    render() {
        return (
            <ScrollView style={styles.header} horizontal={true} showsHorizontalScrollIndicator={false}>
                <TouchableOpacity onPress={() => {this.update(0)}} style={this.getStyle(0)}>
                    <Text style={this.getTextStyle(0)}>PLAYLISTS</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {this.update(1)}} style={this.getStyle(1)}>
                    <Text style={this.getTextStyle(1)}>ALBUMS</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {this.update(2)}} style={this.getStyle(2)}>
                    <Text style={this.getTextStyle(2)}>SONGS</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {this.update(3)}} style={this.getStyle(3)}>
                    <Text style={this.getTextStyle(3)}>ARTISTS</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {this.update(4)}} style={this.getStyle(4)}>
                    <Text style={this.getTextStyle(4)}>SUBSCRIPTIONS</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: '20%'
    },

    header: {
        alignSelf: 'center',
        width: '100%',
        height: 50,
        position: 'absolute',
        bottom: -5
    },

    headerEntry: {
        height: 50,
        paddingRight: 15,
        paddingLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerEntryFocus: {
        height: 50,
        paddingRight: 15,
        paddingLeft: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },

    headerEntryText: {
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },

    headerEntryTextFocus: {
        fontWeight: 'bold',
        borderBottomWidth: 3,
        borderBottomColor: 'gray',
    },

    playlistCollection: {
        width: '100%'
    },

    playlistCollectionContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap-reverse'
    },

    playlist: {
        alignItems: 'center',
        marginTop: 140,
        marginLeft: 30,
        marginRight: 30,
        width: 100,
        height: 100
    },

    playlistCover: {
        alignItems:'center',
        justifyContent:'center',
        height: 150,
        width: 150,
        backgroundColor: 'gray'
    },

    playlistTitle: {
        paddingTop: 5,
        fontSize: 15,
        fontWeight:'bold',
        width: '150%',
    },

    playlistDesc: {
        fontSize: 10,
    },

    newPlaylist: {
        color: 'white',
        fontSize: 80,
    },

    addPlaylist: {

    }
});