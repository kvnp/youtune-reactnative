import React, { useState } from "react";
import {
    Modal,
    Pressable,
    View,
    Text,
    Image,
    StyleSheet,
    Share,
    ActivityIndicator
} from "react-native";

import TrackPlayer from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";

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

import { downloadSong, deleteSong, localIDs, downloadQueue } from "../../modules/storage/SongStorage";
import { rippleConfig } from "../../styles/Ripple";

export var showModal = null;

export var downloadCallback = null;

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

    const [downloading, setDownloading] = useState(false);
    const [playing, setPlaying] = useState(false);
    const {dark, colors} = useTheme();

    downloadCallback = id => {
        if (videoId == id)
            setDownloading(false);
    }

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
                    console.log("shared with activity type of " + result.activityType);
                else
                    console.log("shared");
                
            } else if (result.action === Share.dismissedAction)
                console.log("dismissed")

        } catch (error) {
            alert(error.message);
        }
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

    const download = () => {
        downloadSong(videoId);
        setDownloading(true);
    }

    const remove = () => {
        deleteSong(videoId);
        setDownloading(true);
    }

    showModal = async(info) => {
        let type;
        let likeFunction;

        if (info.videoId != null) {
            type = "Song";
            refresh(type, info.videoId);
    
            likeFunction = boolean => {
                likeSong(info.videoId, boolean);
                refresh(type, info.videoId);
            }
        } else if (info.playlistId != null || info.browseId != null) {
            if (info.browseId != null) {
                if (info.browseId.slice(0, 2) == "UC") {
                    type = "Artist";
                    refresh(type, info.browseId);
                    likeFunction = (boolean) => {
                        likeArtist(info.browseId, boolean);
                        refresh(type, info.browseId);
                    }
    
                } else {
                    type = "Playlist";
                    refresh(type, info.playlistId);
                    likeFunction = boolean => {
                        likePlaylist(info.playlistId, boolean);
                        refresh(type, info.playlistId);
                    }
    
                }
            } else {
                type = "Playlist";
                refresh(type, info.playlistId);
                likeFunction = boolean => {
                    likePlaylist(info.playlistId, boolean);
                    refresh(type, info.playlistId);
                }
            }
        }

        let isPlaying = false
        if (await TrackPlayer.getCurrentTrack() == info.videoId) {
            if (await TrackPlayer.getState() == TrackPlayer.STATE_PLAYING) {
                isPlaying = true;
            }
        }

        setPlaying(isPlaying);

        setContent({
            ...info,
            type: type,
            likeFunction: likeFunction
        });

        if (videoId in downloadQueue)
            setDownloading(true);

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
                            onPress={
                                async() => {
                                if (playing) {
                                    TrackPlayer.pause()
                                    setPlaying(false);
                                    setVisible(false);
                                    return;
                                } else {
                                    if (await TrackPlayer.getCurrentTrack() == videoId) {
                                        navigation.navigate("Music");
                                        setVisible(false);
                                        TrackPlayer.play();
                                        return;
                                    }
                                }

                                handleMedia(content, navigation);
                                setVisible(false);
                            }}
                            style={modalStyles.entry}
                            android_ripple={{color: "gray"}}
                        >
                            {type == "Song"
                                ? playing
                                    ? <>
                                        <MaterialIcons name="pause" color="black" size={25}/>
                                        <Text style={{paddingLeft: 20}}>Pause</Text>
                                    </>

                                    : <>
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
                    <Pressable
                        onPress={
                            () => localIDs.includes(content.videoId)
                                ? remove()
                                : download()
                        }
                        disabled={localIDs == null ? true : false}
                        style={modalStyles.entry}
                        android_ripple={{color: "gray"}}
                    >
                        {
                            downloading
                                ? <ActivityIndicator color="black"/>
                                : <MaterialIcons
                                    name={
                                        localIDs.includes(content.videoId)
                                            ? "delete"
                                            : "get-app"
                                    }
                                    color="black"
                                    size={25}
                                />
                        }

                        <Text style={{paddingLeft: 20}}>
                            {
                                downloading
                                    ? "Downloading" + downloadQueue > 1
                                        ? " - " + downloadQueue + " in queue"
                                        : ""
                                    : localIDs.includes(content.videoId)
                                        ? "Delete"
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
        flex: 1,
        paddingLeft: 10,
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