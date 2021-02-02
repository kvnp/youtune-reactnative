import React, { useState } from "react";
import {
    Modal,
    Pressable,
    View,
    Text,
    Image,
    StyleSheet,
    Share
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

import { downloadSong, localIDs } from "../../modules/storage/SongStorage";
import { rippleConfig } from "../../styles/Ripple";

export var showModal = null;

export default MoreModal = ({navigation}) => {
    const [content, setContent] = useState({
        title: null,
        subtitle: null,
        thumbnail: null,
        videoId: null,
        browseId: null,
        playlistId: null,
        type: null,
        likeFunction: () => {}
    });

    const [visible, setVisible] = useState(false);
    const [liked, setLiked] = useState(null);

    const onShare = async(type, url, message) => {
        try {
            const title = "YouTune - " + type;
            const result = await Share.share({
                title: title,
                url: url,
                message: message + ":\n" + url
            }, {
                dialogTitle: title
            });

            setVisible(false);
            
            if (result.action === Share.sharedAction) {
                if (result.activityType)
                    console.log("shared with activity type of result.activityType");
                else
                    console.log("shared");
                
            } else if (result.action === Share.dismissedAction)
                console.log("dismissed")

        } catch (error) {
            alert(error.message);
        }
    };

    const downloadMedia = () => {
        if (content.videoId != undefined)
            downloadSong(content.videoId)
    };

    const refresh = (type, id) => {
        switch(type) {
            case "Song":
                getSongLike(id)
                    .then(boolean => {
                        setLiked({ isLiked: boolean });
                    });
                break;
            case "Playlist":
                getPlaylistLike(id)
                    .then(boolean => {
                        setLiked({ isLiked: boolean });
                    });
                break;
            case "Artist":
                getArtistLike(id)
                    .then(boolean => {
                        setLiked({ isLiked: boolean });
                    });
        }
    };

    showModal = info => {
        let type;
        let likeFunction;

        if (videoId != null) {
            type = "Song";
            refresh(type, videoId);
    
            likeFunction = boolean => {
                likeSong(videoId, boolean);
                refresh(type, videoId);
            }
        } else if (playlistId != null || browseId != null) {
            if (browseId != null) {
                if (browseId.slice(0, 2) == "UC") {
                    type = "Artist";
                    refresh(type, browseId);
                    likeFunction = (boolean) => {
                        likeArtist(browseId, boolean);
                        refresh(type, browseId);
                    }
    
                } else {
                    type = "Playlist";
                    refresh(type, playlistId);
                    likeFunction = boolean => {
                        likePlaylist(playlistId, boolean);
                        refresh(type, playlistId);
                    }
    
                }
            } else {
                type = "Playlist";
                refresh(type, playlistId);
                likeFunction = boolean => {
                    likePlaylist(playlistId, boolean);
                    refresh(type, playlistId);
                }
    
            }
        }

        setContent({
            ...info,
            type: type,
            likeFunction: likeFunction
        });
        setVisible(true);
    };

    const {
        browseId,
        playlistId,
        videoId,
        type,
        likeFunction
    } = content;

    return <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        onDismiss={() => setVisible(false)}
        hardwareAccelerated={true}>
        <Pressable onPress={() => setVisible(false)} style={{height: "100%", width: "100%", justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.3)"}}>
            <Pressable android_ripple={rippleConfig}
                       style={{
                            paddingHorizontal: 10,
                            maxWidth: 800,
                            alignSelf: "center",
                            width: "100%"
                       }}>
                <View style={modalStyles.header}>
                    <Image source={{uri: content.thumbnail}} style={modalStyles.thumbnail}/>
                    <View style={modalStyles.headerText}>
                        <Text numberOfLines={1}>{content.title}</Text>
                        <Text numberOfLines={1}>{content.subtitle}</Text>
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
                                        liked == null
                                            ? "darkgray"
                                            : !liked
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
                                        liked == null
                                            ? "darkgray"
                                            : liked
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
                            onPress={() => {
                                handleMedia(content, navigation);
                                setVisible(false);
                            }}
                            style={modalStyles.entry}
                            android_ripple={{color: "gray"}}
                        >
                            {type == "Song"
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
                <Pressable onPress={() => downloadMedia()} disabled={localIDs == null ? true : false} style={modalStyles.entry} android_ripple={{color: "gray"}}>
                    <MaterialIcons name="get-app" color="black" size={25}/>
                    <Text style={{paddingLeft: 20}}>
                        {
                            localIDs != null
                                ? localIDs.includes(content.videoId)
                                    ? "Remove"
                                    : "Download"
                                : "Download"
                        }
                    </Text>
                </Pressable>
                </View>

                <View style={modalStyles.entryView}>
                <Pressable onPress={() => {}} style={modalStyles.entry} android_ripple={{color: "gray"}}>
                    {
                        type == "Song"
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
                    onPress={() => {
                        let file;
                        let message;
                        if (type == "Song") {
                            message = content.title + " - " + content.subtitle;
                            file = "watch?v=" + videoId;
                        } else if (type == "Playlist") {
                            message = content.title + " - " + content.subtitle;
                            file = "playlist?list=" + playlistId;
                        } else {
                            message = content.title + " - " + type;
                            file = "channel/" + browseId;
                        }

                        onShare(type, "https://music.youtube.com/" + file, message);
                    }}

                    style={modalStyles.entry} android_ripple={{color: "gray"}}
                >
                    <MaterialIcons name="share" color="black" size={25}/>
                    <Text style={{paddingLeft: 20}}>Share</Text>
                </Pressable>
                </View>
            </Pressable>
        </Pressable>
    </Modal>
};

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
        width: 50
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