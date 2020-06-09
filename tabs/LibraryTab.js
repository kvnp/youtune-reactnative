import React, {Component} from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from 'react-native';

import {
    Header
} from '../components/SharedComponents';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { ScrollView } from 'react-native-gesture-handler';

export default class LibraryTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selection: 0
        };
    }

    update = (value) => {
        this.setState({selection: value});
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

    render() {
        return (
            <>
                <View style={styles.headerPicture}>
                    <Header text={"Bibliothek"}  color={this.props.passBackground.color} sourcee={this.props.passBackground.source}/>
                </View>
            
                <View style={styles.middleView}>
                    <ScrollView style={styles.playlistCollection} contentContainerStyle={styles.playlistCollectionContainer}>
                        <View style={styles.playlist}>
                            <View style={styles.playlistCover}>
                                <Text style={styles.newPlaylist}>+</Text>
                            </View>
                            <Text style={styles.playlistTitle}>Neue Playlist</Text>
                            <Text style={styles.playlistDesc}></Text>
                        </View>
                    </ScrollView>
                </View>

                <ScrollView style={styles.header} horizontal={true}>
                    <TouchableHighlight onPress={() => {this.update(0)}} style={this.getStyle(0)}>
                        <Text style={this.getTextStyle(0)}>PLAYLISTS</Text>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={() => {this.update(1)}} style={this.getStyle(1)}>
                        <Text style={this.getTextStyle(1)}>ALBUMS</Text>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={() => {this.update(2)}} style={this.getStyle(2)}>
                        <Text style={this.getTextStyle(2)}>SONGS</Text>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={() => {this.update(3)}} style={this.getStyle(3)}>
                        <Text style={this.getTextStyle(3)}>ARTISTS</Text>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={() => {this.update(4)}} style={this.getStyle(4)}>
                        <Text style={this.getTextStyle(4)}>SUBSCRIPTIONS</Text>
                    </TouchableHighlight>
                </ScrollView>
            </>
        );
    }
};

const styles = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: 150,
        flexDirection: 'column'
    },

    middleView: {
        alignContent:'flex-start',
        width: '100%'
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
        borderBottomColor: Colors.dark,
    },

    playlistCollection: {
        width: '100%',
        paddingTop: 20,
    },

    playlistCollectionContainer: {
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexGrow: 1,
        flexWrap: 'wrap'
    },

    playlist: {
        margin: 10,
        width: 100,
        height: 160
    },

    playlistCover: {
        alignItems:'center',
        justifyContent:'center',
        height: 100,
        width: 100,
        backgroundColor: Colors.dark
    },

    playlistTitle: {
        paddingTop: 5,
        fontSize: 10,
        fontWeight:'bold'
    },

    playlistDesc: {
        fontSize: 10,
    },

    newPlaylist: {
        color: Colors.white,
        fontSize: 50,
    }
});

/*<>
        <View style={styles.playlist}>
            <View style={styles.playlistCover}></View>
            <Text style={styles.playlistTitle}>Meine Playlist 1</Text>
            <Text style={styles.playlistDesc}>Kevin • 1 song</Text>
        </View>

        <View style={styles.playlist}>
            <View style={styles.playlistCover}></View>
            <Text style={styles.playlistTitle}>Meine Playlist 2</Text>
            <Text style={styles.playlistDesc}>Kevin • 6 songs</Text>
        </View>

        <View style={styles.playlist}>
            <View style={styles.playlistCover}></View>
            <Text style={styles.playlistTitle}>Meine Playlist 3</Text>
            <Text style={styles.playlistDesc}>Kevin • 20 songs</Text>
        </View>

        <View style={styles.playlist}>
            <View style={styles.playlistCover}></View>
            <Text style={styles.playlistTitle}>Meine Playlist 4</Text>
            <Text style={styles.playlistDesc}>Kevin • 5 songs</Text>
        </View>
    </>*/