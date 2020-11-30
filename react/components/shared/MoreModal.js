import React, { PureComponent } from "react";
import {
    Modal,
    Pressable,
    View,
    Text,
    Image,
    StyleSheet,
    Share,
    Platform
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { appColor } from "../../styles/App";
import { handleMedia } from "../../modules/event/mediaNavigator";

import {
    likeSong,
    likeArtist,
    likePlaylist,
    getSongLike,
    getPlaylistLike,
    getArtistLike
} from "../../modules/storage/MediaStorage";

export default class MoreModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            isLiked: null,
            modalContent: {
                title: null,
                subtitle: null,
                thumbnail: null,
                videoId: null,
                browseId: null,
                playlistId: null,
                
            }
        }

        global.showModal = content => {
            this.setModalVisible(true, content);
        }
    }

    setModalVisible = (
        boolean,
        content = {title: null, subtitle: null, thumbnail: null, videoId: null, browseId: null, playlistId: null}
    ) => {
        this.setState({
            modalVisible: boolean,
            modalContent: content
        });
    }

    onShare = async (type, url, message) => {
        try {
            const title = "YouTune - " + type;
            const result = await Share.share({
                title: title,
                url: url,
                message: message + ":\n" + url
            }, {
                dialogTitle: title
            });

            this.setModalVisible(false);
            
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                // shared with activity type of result.activityType
                } else {
                // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    refresh(type, id) {
        switch(type) {
            case "Song":
                getSongLike(id).then(boolean => { this.setState({ isLiked: boolean }) });
                break;
            case "Playlist":
                getPlaylistLike(id).then(boolean => { this.setState({ isLiked: boolean }) });
                break;
            case "Artist":
                getArtistLike(id).then(boolean => { this.setState({ isLiked: boolean }) });
        }
    }

    render() {
        const { browseId, playlistId, videoId} = this.state.modalContent;
        console.log({
            browseId, playlistId, videoId
        });
        var likeFunction = null;
        var type;

        if (videoId != null) {
            type = "Song";
            this.refresh(type, videoId);
            likeFunction = (boolean) => {
                likeSong(videoId, boolean);
                this.refresh(type, videoId);
            }
        } else if (playlistId != null || browseId != null) {
            if (browseId != null) {
                if (browseId.slice(0, 2) == "UC") {
                    type = "Artist";
                    this.refresh(type, browseId);
                    likeFunction = (boolean) => {
                        likeArtist(browseId, boolean);
                        this.refresh(type, browseId);
                    }

                } else {
                    type = "Playlist";
                    this.refresh(type, playlistId);
                    likeFunction = (boolean) => {
                        likePlaylist(playlistId, boolean);
                        this.refresh(type, playlistId);
                    }

                }
            } else {
                type = "Playlist";
                this.refresh(type, playlistId);
                likeFunction = (boolean) => {
                    likePlaylist(playlistId, boolean);
                    this.refresh(type, playlistId);
                }

            }
        }

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.setModalVisible(false)}
                onDismiss={() => this.setModalVisible(false)}

                hardwareAccelerated={true}
            >
                <Pressable onPress={() => this.setModalVisible(false)} style={{height: "100%", width: "100%", justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.3)"}}>
                    <Pressable style={{paddingHorizontal: 10}}>
                        <View style={modalStyles.header}>
                            <Image source={{uri: this.state.modalContent.thumbnail}} style={modalStyles.thumbnail}/>
                            <View style={modalStyles.headerText}>
                                <Text numberOfLines={1} style={{}}>{this.state.modalContent.title}</Text>
                                <Text numberOfLines={1} style={{}}>{this.state.modalContent.subtitle}</Text>
                            </View>
                            <View style={{width: 120, height: 50, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                                <View style={{width: 50, height: 50, alignItems: "center", justifyContent: "center"}}>
                                    <Pressable
                                        onPress={() => likeFunction(false)}
                                        android_ripple={{color: "darkgray", borderless: true}}
                                    >
                                        <MaterialIcons
                                            name="thumb-down"

                                            color={
                                                this.state.isLiked == null
                                                    ? "darkgray"
                                                    : !this.state.isLiked
                                                        ? "black"
                                                        : "darkgray"
                                            }

                                            size={25}
                                        />
                                    </Pressable>
                                </View>
                                <View style={{width: 50, height: 50, alignItems: "center", justifyContent: "center"}}>
                                    <Pressable
                                        onPress={() => likeFunction(true)}
                                        android_ripple={{color: "darkgray", borderless: true}}
                                    >
                                        <MaterialIcons
                                            name="thumb-up"

                                            color={
                                                this.state.isLiked == null
                                                    ? "darkgray"
                                                    : this.state.isLiked
                                                        ? "black"
                                                        : "darkgray"
                                            }

                                            size={25}
                                        />
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        <View style={modalStyles.entryView}>
                                <Pressable 
                                    onPress={
                                        () => {
                                            handleMedia(this.state.modalContent, this.props.navigation);
                                            this.setModalVisible(false);
                                        }
                                    }
                                    style={modalStyles.entry}
                                    android_ripple={{color: "gray"}}
                                >
                                    {
                                        type != "Song"
                                            ? <>
                                                <MaterialIcons name="play-arrow" color="black" size={25}/>
                                                <Text style={{paddingLeft: 20}}>Play</Text>
                                            </>
                                            
                                            : <>
                                                <MaterialIcons name="launch" color="black" size={25}/>
                                                <Text style={{paddingLeft: 20}}>Open</Text>
                                            </>
                                    }
                                </Pressable>
                            </View>
                        
                        <View style={modalStyles.entryView}>
                        <Pressable onPress={() => {}} style={modalStyles.entry} android_ripple={{color: "gray"}}>
                            <MaterialIcons name="get-app" color="black" size={25}/>
                            <Text style={{paddingLeft: 20}}>Download</Text>
                        </Pressable>
                        </View>

                        <View style={modalStyles.entryView}>
                        <Pressable onPress={() => {}} style={modalStyles.entry} android_ripple={{color: "gray"}}>
                            {
                                type != "Song"
                                    ? <>
                                        <MaterialIcons name="playlist-add" color="black" size={25}/>
                                        <Text style={{paddingLeft: 20}}>Add to playlist</Text>
                                    </>

                                    : <>
                                        <MaterialIcons name="library-add" color="black" size={25}/>
                                        <Text style={{paddingLeft: 20}}>Add to library</Text>
                                    </>
                            }
                        </Pressable>
                        </View>

                        <View style={modalStyles.entryView}>
                        <Pressable
                            onPress={
                                () => {
                                    let file;
                                    let message;
                                    if (type == "Song") {
                                        message = this.state.modalContent.title + " - " + this.state.modalContent.subtitle;
                                        file = "watch?v=" + videoId;
                                    } else if (type == "Playlist") {
                                        message = this.state.modalContent.title + " - " + this.state.modalContent.subtitle;
                                        file = "playlist?list=" + playlistId;
                                    } else {
                                        message = this.state.modalContent.title + " - " + type;
                                        file = "channel/" + browseId;
                                    }
                                    

                                    this.onShare(type, "https://music.youtube.com/" + file, message);
                                }
                            }

                            style={modalStyles.entry} android_ripple={{color: "gray"}}
                        >
                            <MaterialIcons name="share" color="black" size={25}/>
                            <Text style={{paddingLeft: 20}}>Share</Text>
                        </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        );
        
    }
}

const modalStyles = StyleSheet.create({
    header: {
        flexDirection: "row",
        borderBottomWidth: 1,
        height: 70,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        width: "100%",
        backgroundColor: "gray",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },

    headerText: {
        overflow: "hidden",
        width: 140,
    },

    thumbnail: {
        backgroundColor: appColor.background.backgroundColor,
        height: 50,
        aspectRatio: 1
    },

    entry: {
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 50,
        height: 50,
        backgroundColor: "darkgray",
    },

    entryView: {
        height: 50,
    }
});