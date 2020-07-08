import React, { PureComponent, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert
} from "react-native";

import Playlist from '../../components/shared/Playlist';
import { Modal } from "react-native-paper";
import { PlaylistCreator } from "../../components/overlay/PlaylistCreator";

export default class Playlists extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            playlists: []
        }

        global.createPlaylist = (title, subtitle) => {
            this.createPlaylist(title, subtitle);
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            global.setLibraryNavigator(0);
            this.setModalVisible(false);
            this.forceUpdate();
        });
    }
    
    componentWillUnmount() {
        this._unsubscribe();
    }

    openCreatePlaylist = () => {
        this.props.navigation.navigate("CreatePlaylist");
    }

    createPlaylist = (title, description) => {
        let temp = this.state.playlists;
        temp.push({title: title, subtitle: description});

        this.setState({playlists: temp});
        this.forceUpdate();
    }

    getPlaylist = (playlistJson) => {
        return (
            <View style={styles.playlist}>
                <Playlist playlist={playlistJson} navigation={this.props.navigation}/>
            </View>
        );
    }

    getPlaylists = () => {
        return this.state.playlists.map(this.getPlaylist);
    }

    getAddPlaylist = () => {
        return (
            <View style={styles.playlist}>
                <TouchableOpacity onPress={() => {this.openCreatePlaylist()}}
                                  style={styles.playlistCover}>
                    <Text style={styles.newPlaylist}>+</Text>
                </TouchableOpacity>
                <Text style={styles.playlistTitle}>Neue Playlist</Text>
            </View>
        );
    }

    setModalVisible = (boolean) => {
        this.setState({modalVisible: boolean});
    }

    render() {
        return (
            <>
                <ScrollView style={styles.playlistCollection} contentContainerStyle={styles.playlistCollectionContainer}>
                    <View style={styles.playlist}>
                        <TouchableOpacity onPress={() => this.setModalVisible(true)}
                                        style={styles.playlistCover}>
                            <Text style={styles.newPlaylist}>+</Text>
                        </TouchableOpacity>
                        <Text style={styles.playlistTitle}>Neue Playlist</Text>
                    </View>
                    {this.getPlaylists()}
                </ScrollView>

                <Modal animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(false);
                    }}

                    onDismiss={() => {
                        this.setModalVisible(false);
                    }}
                >
                    <View style={styles.modalView}>
                        {PlaylistCreator({
                            callback: () => {
                                    this.setModalVisible(false);
                            }
                        })}
                    </View>
                </Modal>
            </>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        justifyContent: "center",
        shadowColor: "#000",
    },

    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
    },

    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },

    modalText: {
        marginBottom: 15,
        textAlign: "center",
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