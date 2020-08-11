import React, { PureComponent } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    Pressable,
    Modal
} from "react-native";

import Playlist from '../../components/shared/Playlist';
import PlaylistCreator from "../../components/overlay/PlaylistCreator";
import { rippleConfig } from "../../styles/Ripple";

export default class Playlists extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            playlists: []
        }
    }

    setModalVisible = (boolean) => {
        this.setState({modalVisible: boolean});
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setModalVisible(false);
        });
    }
    
    componentWillUnmount() {
        this._unsubscribe();
    }

    createPlaylist = ({title, description}) => {
        let temp = this.state.playlists;
        temp.push({title: title, subtitle: description});

        this.setState({playlists: temp});
        this.forceUpdate();
    }

    render() {
        return (
            <>
                <ScrollView contentContainerStyle={styles.playlistCollectionContainer}>
                    <Pressable style={styles.playlist} android_ripple={rippleConfig} onPress={() => this.setModalVisible(true)}>
                        <Text style={styles.newPlaylist}>+</Text>
                        <Text style={styles.playlistTitle}>Add Playlist</Text>
                    </Pressable>

                    {this.state.playlists.map((playlist) => {
                        return <Playlist playlist={playlist} navigation={this.props.navigation} style={styles.playlist}/>
                    })}

                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(false);
                    }}

                    onDismiss={() => {
                        this.setModalVisible(false);
                    }}

                    hardwareAccelerated={true}
                >
                    <Pressable onPress={() => this.setModalVisible(false)} style={{height: "100%", width: "100%", justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.3)"}}>
                        <Pressable style={{marginBottom: 100}}>
                            <PlaylistCreator
                                style={styles.modalChild}
                                callback={
                                    obj => {
                                        if (obj != undefined) this.createPlaylist(obj);
                                        this.setModalVisible(false);
                                    }
                                }
                            />
                        </Pressable>
                    </Pressable>
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
        alignSelf: "center",
    },

    modalChild: {
        backgroundColor: "white",
        borderRadius: 10
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

    playlistCollectionContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: "flex-end",
        flexWrap: "wrap-reverse"
    },

    playlist: {
        margin: 10,
        width: 150,
        height: 200
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
        width: 150,
        height: 150,
        textAlign: "center",
        fontSize: 100,
        color: 'white',
        backgroundColor: "gray"
    },

    addPlaylist: {

    }
});