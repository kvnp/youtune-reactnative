import React, { useState } from "react";
import {
    Modal,
    Pressable,
    View,
    Text,
    Image,
    StyleSheet,
    Share,
    ActivityIndicator,
    Platform
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

import { storeSong, deleteSong, localIDs, downloadQueue } from "../../modules/storage/SongStorage";
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
        liked: null,
        visible: false,
        playing: false,
        downloading: false,
        downloaded: false,
        likeFunction: () => {}
    });

    const {dark, colors} = useTheme();

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
            setContent({...content, visible: false});
            
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
        return new Promise(async(resolve) => {
            let liked = null;
            switch(type) {
                case "Song":
                    liked = await getSongLike(id);
                    break;
                case "Playlist":
                    liked = await getPlaylistLike(id);
                    break;
                case "Artist":
                    liked = await getArtistLike(id);
            }
            resolve(liked);
        })
    };

    const download = () => {
        setContent(content => ({...content, downloading: true}));
        storeSong(videoId)
            .then(id => {
                setContent(Content => ({
                    ...Content,
                    downloading: Content.videoId == content.videoId ? false : downloadQueue.includes(Content.videoId) ? true : false,
                    downloaded: Content.videoId == content.videoId ? true : localIDs.includes(Content.videoId) ? true : false
                }));
            })
            .catch(id => {
                setContent(Content => ({
                    ...Content,
                    downloading: Content.videoId == content.videoId ? false : downloadQueue.includes(Content.videoId) ? true : false,
                    downloaded: Content.videoId == content.videoId ? false : localIDs.includes(Content.videoId) ? true : false
                }));
            });
    }

    const remove = () => {
        setContent(content => ({...content, downloading: true}));
        deleteSong(videoId)
            .then(id => {
                setContent(Content => ({
                    ...Content,
                    downloading: Content.videoId == content.videoId ? false : downloadQueue.includes(Content.videoId) ? true : false,
                    downloaded: Content.videoId == content.videoId ? false : localIDs.includes(Content.videoId) ? true : false
                }));
            })
            .catch(id => {
                setContent(Content => ({
                    ...Content,
                    downloading: Content.videoId == content.videoId ? false : downloadQueue.includes(Content.videoId) ? true : false,
                    downloaded: Content.videoId == content.videoId ? true : localIDs.includes(Content.videoId) ? true : false
                }));
            });
        ;
    }

    showModal = async(info) => {
        let type;
        let likeFunction;
        let liked;
        let downloading = false;
        let downloaded = false;

        if (info.videoId != null) {
            type = "Song";
            liked = await refresh(type, info.videoId);
    
            likeFunction = boolean => {
                likeSong(info.videoId, boolean);
                refresh(type, info.videoId)
                    .then(liked => {
                        setContent(content => ({...content, liked: liked}));
                    })
            }
        } else if (info.playlistId != null || info.browseId != null) {
            if (info.browseId != null) {
                if (info.browseId.slice(0, 2) == "UC") {
                    type = "Artist";
                    liked = await refresh(type, info.browseId);
                    likeFunction = (boolean) => {
                        likeArtist(info.browseId, boolean);
                        refresh(type, info.videoId)
                            .then(liked => {
                                setContent(content => ({...content, liked: liked}));
                            })
                    }
    
                } else {
                    type = "Playlist";
                    liked = await refresh(type, info.playlistId);
                    likeFunction = boolean => {
                        likePlaylist(info.playlistId, boolean);
                        refresh(type, info.videoId)
                            .then(liked => {
                                setContent(content => ({...content, liked: liked}));
                            })
                    }
                }
            } else {
                type = "Playlist";
                liked = await refresh(type, info.playlistId);
                likeFunction = boolean => {
                    likePlaylist(info.playlistId, boolean);
                    refresh(type, info.videoId)
                        .then(liked => {
                            setContent(content => ({...content, liked: liked}));
                        })
                }
            }
        }

        let isPlaying = false;
        if (await TrackPlayer.getCurrentTrack() == info.videoId) {
            if (await TrackPlayer.getState() == TrackPlayer.STATE_PLAYING) {
                isPlaying = true;
            }
        }
        
        if (downloadQueue.includes(info.videoId))
            downloading = true;

        if (localIDs.includes(info.videoId))
            downloaded = true;

        setContent({
            ...info,
            type: type,
            playing: isPlaying,
            downloading: downloading,
            downloaded: downloaded,
            visible: true,
            liked, liked,
            likeFunction: likeFunction
        });
    };

    const {
        browseId,
        playlistId,
        videoId,
        type,
        downloading,
        downloaded,
        visible,
        playing,
        liked,
        likeFunction
    } = content;

    return <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setContent(content => ({...content, visible: false}))}
        onDismiss={() => setContent(content => ({...content, visible: false}))}
        hardwareAccelerated={true}>
        <Pressable onPress={() => setContent(content => ({...content, visible: false}))} style={{height: "100%", width: "100%", justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.3)"}}>
            <View style={{
                paddingHorizontal: 10,
                maxWidth: 800,
                alignSelf: "center",
                width: "100%"
            }}>
                <Pressable style={[modalStyles.header, {backgroundColor: colors.border}, Platform.OS == "web" ? {cursor: "default"} : undefined]}>
                    <Image source={{uri: content.thumbnail}} style={modalStyles.thumbnail}/>
                    <View style={modalStyles.headerText}>
                        <Text style={{color: colors.text}} numberOfLines={1}>{content.title}</Text>
                        <Text style={{color: colors.text}} numberOfLines={1}>{content.subtitle}</Text>
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
                                                ? colors.primary
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
                                                ? colors.primary
                                                : "darkgray"
                                    }

                                    size={25}
                                />
                            </Pressable>
                        </View>
                    </View>
                </Pressable>

                <View style={modalStyles.entryView}>
                    <Pressable
                        onPress={
                            async() => {
                                if (playing) {
                                    TrackPlayer.pause();
                                    setContent(content => ({
                                        ...content,
                                        playing: false,
                                        visible: false
                                    }));
                                    return;
                                } else {
                                    if (await TrackPlayer.getCurrentTrack() == videoId) {
                                        navigation.navigate("Music");
                                        setContent(content => ({...content, visible: false}));
                                        TrackPlayer.play();
                                        return;
                                    }
                                }

                                handleMedia(content, navigation);
                                setContent(content => ({...content, visible: false}));
                            }
                        }
                        style={[modalStyles.entry, {backgroundColor: colors.card}]}
                        android_ripple={{color: "gray"}}
                    >
                        {type == "Song"
                            ? playing
                                ? <>
                                    <MaterialIcons name="pause" color={colors.text} size={25}/>
                                    <Text style={{paddingLeft: 20, color: colors.text}}>Pause</Text>
                                </>

                                : <>
                                    <MaterialIcons name="play-arrow" color={colors.text} size={25}/>
                                    <Text style={{paddingLeft: 20, color: colors.text}}>Play</Text>
                                </>
                            
                            : <>
                                <MaterialIcons name="launch" color={colors.text} size={25}/>
                                <Text style={{paddingLeft: 20, color: colors.text}}>Open</Text>
                            </>
                        }
                    </Pressable>
                </View>
                {
                    videoId
                        ? <View style={modalStyles.entryView}>
                            <Pressable
                                onPress={
                                    () => downloaded
                                        ? remove()
                                        : download()
                                }
                                disabled={downloading}
                                style={[modalStyles.entry, {backgroundColor: colors.card}]}
                                android_ripple={{color: "gray"}}
                            >
                                {
                                    downloading
                                        ? <ActivityIndicator color={colors.text}/>
                                        : <MaterialIcons
                                            name={
                                                downloaded
                                                    ? "delete"
                                                    : "get-app"
                                            }
                                            color={colors.text}
                                            size={25}
                                        />
                                }
        
                                <Text style={{paddingLeft: 20, color: colors.text}}>
                                    {
                                        downloading
                                            ? "Downloading" + (downloadQueue.length > 0
                                                ? " (" + downloadQueue.length + " in queue)"
                                                : "")
        
                                            : downloaded
                                                ? "Delete" + (downloadQueue.length > 0
                                                    ? " (" + downloadQueue.length + " in queue)"
                                                    : "")
        
                                                : "Download" + (downloadQueue.length > 0
                                                    ? " (" + downloadQueue.length + " in queue)"
                                                    : "")
                                    }
                                </Text>
                            </Pressable>
                        </View>


                        : undefined
                }

                <View style={modalStyles.entryView}>
                <Pressable onPress={() => {}} style={[modalStyles.entry, {backgroundColor: colors.card}]} android_ripple={{color: "gray"}}>
                    {
                        type == "Song"
                            ? <>
                                <MaterialIcons name="playlist-add" color={colors.text} size={25}/>
                                <Text style={{paddingLeft: 20, color: colors.text}}>Add to playlist</Text>
                            </>

                            : <>
                                <MaterialIcons name="library-add" color={colors.text} size={25}/>
                                <Text style={{paddingLeft: 20, color: colors.text}}>Add to library</Text>
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

                    style={[modalStyles.entry, {backgroundColor: colors.card}]} android_ripple={{color: "gray"}}
                >
                    <MaterialIcons name="share" color={colors.text} size={25}/>
                    <Text style={{paddingLeft: 20, color: colors.text}}>Share</Text>
                </Pressable>
                </View>
            </View>
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
    },

    entryView: {
        height: 50,
    }
});