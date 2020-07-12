import React, { PureComponent } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    Pressable
} from "react-native";

import Playlist from '../../components/shared/Playlist';
import { Modal } from "react-native-paper";
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
                <ScrollView style={styles.playlistCollection} contentContainerStyle={styles.playlistCollectionContainer}>
                    <View style={styles.playlist}>
                        <Pressable android_ripple={rippleConfig} onPress={() => this.setModalVisible(true)}
                                        style={styles.playlistCover}>
                            <Text style={styles.newPlaylist}>+</Text>
                        </Pressable>
                        <Text style={styles.playlistTitle}>Neue Playlist</Text>
                    </View>

                    {this.state.playlists.map((playlist) => {
                        return (
                            <View style={styles.playlist}>
                                <Playlist playlist={playlist} navigation={this.props.navigation}/>
                            </View>
                        );
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
                >
                    <View style={styles.modalView}>
                        <View style={styles.modalChild}>
                        {PlaylistCreator({
                            callback: (obj) => {
                                if (obj != undefined) this.createPlaylist(obj);
                                this.setModalVisible(false);
                            }
                        })}
                        </View>
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
        backgroundColor: "transparent",
        alignSelf: "center",
    },

    modalChild: {
        backgroundColor: "white",
        borderRadius: 10,
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