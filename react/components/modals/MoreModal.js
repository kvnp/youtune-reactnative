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

import { TouchableRipple } from "react-native-paper";
import TrackPlayer from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";

import ScrollingText from "../shared/ScrollingText";
import { appColor } from "../../styles/App";
import Navigation from "../../services/ui/Navigation";

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
            /*switch(type) {
                case "Song":
                    liked = await getSongLike(id);
                    break;
                case "Playlist":
                    liked = await getPlaylistLike(id);
                    break;
                case "Artist":
                    liked = await getArtistLike(id);
            }*/
            resolve(liked);
        })
    };

    const download = () => {
        setContent(content => ({...content, downloading: true}));
        /*storeSong(videoId)
            .then(id => {
                const title = 'Download Finished';
                const text = 'Download of ' + content.title + ' complete';
                displayNotification({title: title, text: text, icon: content.thumbnail});
                setContent(Content => ({
                    ...Content,
                    downloading: Content.videoId == content.videoId ? false : downloadQueue.findIndex(entry => Content.videoId in entry) > -1 ? true : false,
                    downloaded: Content.videoId == content.videoId ? true : downloadQueue.findIndex(entry => Content.videoId in entry) > -1 ? true : false
                }));
            })
            .catch(id => {
                const title = 'Download Failed';
                const text = 'Download of ' + content.title + ' did not finish';
                displayNotification({title: title, text: text, icon: content.thumbnail});
                setContent(Content => ({
                    ...Content,
                    downloading: Content.videoId == content.videoId ? false : downloadQueue.findIndex(entry => Content.videoId in entry) > -1 ? true : false,
                    downloaded: Content.videoId == content.videoId ? false : localIDs.includes(Content.videoId) ? true : false
                }));
            });*/
    }

    const abort = () => {
        /*abortSongDownload(videoId).then(() => {
            setContent(content => ({...content, downloading: false, downloaded: false}));
        });*/
    }

    const remove = () => {
        setContent(content => ({...content, downloading: true}));
        /*deleteSong(videoId)
            .then(id => {
                setContent(Content => ({
                    ...Content,
                    downloading: Content.videoId == content.videoId ? false : downloadQueue.findIndex(entry => Content.videoId in entry) > -1 ? true : false,
                    downloaded: Content.videoId == content.videoId ? false : localIDs.includes(Content.videoId) ? true : false
                }));
            })
            .catch(id => {
                setContent(Content => ({
                    ...Content,
                    downloading: Content.videoId == content.videoId ? false : downloadQueue.findIndex(entry => Content.videoId in entry) > -1 ? true : false,
                    downloaded: Content.videoId == content.videoId ? true : localIDs.includes(Content.videoId) ? true : false
                }));
            });*/
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
                //likeSong(info.videoId, boolean);
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
                        //likeArtist(info.browseId, boolean);
                        refresh(type, info.videoId)
                            .then(liked => {
                                setContent(content => ({...content, liked: liked}));
                            })
                    }
    
                } else {
                    type = "Playlist";
                    liked = await refresh(type, info.playlistId);
                    likeFunction = boolean => {
                        //likePlaylist(info.playlistId, boolean);
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
                    //likePlaylist(info.playlistId, boolean);
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
        
        /*if (downloadQueue.findIndex(entry => info.videoId in entry) > -1)
            downloading = true;

        if (localIDs.includes(info.videoId))
            downloaded = true;*/

        setContent({
            ...info,
            type: type,
            playing: isPlaying,
            downloading: downloading,
            downloaded: downloaded,
            visible: true,
            liked,
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
                <View style={[modalStyles.header, {backgroundColor: colors.border}, Platform.OS == "web" ? {cursor: "default"} : undefined]}>
                    <Image source={{uri: content.thumbnail}} style={modalStyles.thumbnail}/>
                    <View style={modalStyles.headerText}>
                        <ScrollingText>
                            <Text style={{color: colors.text}} numberOfLines={1}>{content.title}</Text>
                        </ScrollingText>
                        
                        <ScrollingText>
                            <Text style={{color: colors.text}} numberOfLines={1}>{content.subtitle}</Text>
                        </ScrollingText>
                    </View>
                    <View style={{width: 120, height: 50, alignItems: "center", alignSelf: "center", justifyContent: "center", flexDirection: "row"}}>
                        <TouchableRipple
                            borderless={true}
                            rippleColor={colors.primary}
                            onPress={() => likeFunction(false)}
                            style={{
                                width: 50,
                                height: 50,
                                marginHorizontal: 5,
                                borderRadius: 25,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
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
                        </TouchableRipple>
                        <TouchableRipple
                            borderless={true}
                            rippleColor={colors.primary}
                            onPress={() => likeFunction(true)}

                            style={{
                                width: 50,
                                height: 50,
                                marginHorizontal: 5,
                                borderRadius: 25,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
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
                        </TouchableRipple>
                    </View>
                </View>

                {
                    type == "Song"
                    ? <View style={{backgroundColor: colors.card}}>
                        <TouchableRipple
                            borderless={true}
                            rippleColor={colors.primary}
                            style={{
                                borderRadius: 5,
                                height: 50,
                                alignItems: "center",
                                flexDirection: "row"
                            }}
                            
                            onPress={() => {
                                Navigation.handleMedia({
                                    title: content.title,
                                    subtitle: content.subtitle,
                                    thumbnail: content.thumbnail,
                                    videoId: videoId,
                                    browseId: browseId,
                                    playlistId: playlistId,
                                }, navigation);
                            }}
                        >
                            <>
                                <MaterialIcons
                                    name="radio"
                                    color={colors.text}
                                    size={25}
                                    style={{marginLeft: 70}}
                                />
                                <Text style={{paddingLeft: 20,color: colors.text}}>Start radio</Text>
                            </>
                        </TouchableRipple>
                    </View>

                    : undefined
                }
                <View style={{backgroundColor: colors.card}}>
                <TouchableRipple
                    borderless={true}
                    rippleColor={colors.primary}
                    style={{
                        borderRadius: 5,
                        height: 50,
                        alignItems: "center",
                        flexDirection: "row"
                    }}
                    onPress={() => {
                        if (playing) {
                            TrackPlayer.pause();
                            setContent(content => ({
                                ...content,
                                playing: false,
                                visible: false
                            }));
                        }
                    }}
                >
                    {type == "Song"
                        ? playing
                            ? <>
                                <MaterialIcons style={{marginLeft: 70}} name="pause" color={colors.text} size={25}/>
                                <Text style={{paddingLeft: 20, color: colors.text}}>Pause</Text>
                            </>

                            : <>
                                <MaterialIcons style={{marginLeft: 70}} name="play-arrow" color={colors.text} size={25}/>
                                <Text style={{paddingLeft: 20, color: colors.text}}>Play</Text>
                            </>
                        
                        : <>
                            <MaterialIcons style={{marginLeft: 70}} name="launch" color={colors.text} size={25}/>
                            <Text style={{paddingLeft: 20, color: colors.text}}>Open</Text>
                        </>
                    }
                </TouchableRipple>
                </View>
                {
                    videoId
                        ? <View style={{backgroundColor: colors.card}}>
                            <TouchableRipple
                            borderless={true}
                            rippleColor={colors.primary}
                            style={{
                                borderRadius: 5,
                                height: 50,
                                alignItems: "center",
                                flexDirection: "row"
                            }}
                            onPress={
                                () => downloading
                                    ? abort()
                                    : downloaded
                                        ? remove()
                                        : download()
                            }
                        >
                            <>
                            {
                                downloading
                                    ? <ActivityIndicator
                                        color={colors.text}
                                        style={{marginLeft: 70}}
                                    />
                                    : <MaterialIcons
                                        style={{marginLeft: 70}}
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
                                    "Download"
                                    /*downloading
                                        ? "Downloading" + (downloadQueue.length > 0
                                            ? " (" + downloadQueue.length + " in queue)"
                                            : "")
    
                                        : downloaded
                                            ? "Delete" + (downloadQueue.length > 0
                                                ? " (" + downloadQueue.length + " in queue)"
                                                : "")
    
                                            : "Download" + (downloadQueue.length > 0
                                                ? " (" + downloadQueue.length + " in queue)"
                                                : "")*/
                                }
                            </Text>
                            </>
                        </TouchableRipple>
                        </View>


                        : undefined
                }
                <View style={{backgroundColor: colors.card}}>
                <TouchableRipple
                    borderless={true}
                    rippleColor={colors.primary}
                    style={{
                        borderRadius: 5,
                        height: 50,
                        alignItems: "center",
                        flexDirection: "row"
                    }}
                    onPress={() => {}}
                >
                    {
                        type == "Song"
                            ? <>
                                <MaterialIcons name="playlist-add" style={{marginLeft: 70}} color={colors.text} size={25}/>
                                <Text style={{paddingLeft: 20, color: colors.text}}>Add to playlist</Text>
                            </>

                            : <>
                                <MaterialIcons name="library-add" style={{marginLeft: 70}} color={colors.text} size={25}/>
                                <Text style={{paddingLeft: 20, color: colors.text}}>Add to library</Text>
                            </>
                    }
                </TouchableRipple>
                </View>
                
                <View style={{backgroundColor: colors.card}}>
                <TouchableRipple
                    borderless={true}
                    rippleColor={colors.primary}
                    style={{
                        borderRadius: 5,
                        height: 50,
                        alignItems: "center",
                        flexDirection: "row"
                    }}
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
                >
                    <>
                    <MaterialIcons name="share" style={{marginLeft: 70}} color={colors.text} size={25}/>
                    <Text style={{paddingLeft: 20, color: colors.text}}>Share</Text>
                    </>
                </TouchableRipple>
                </View>
            </View>
        </Pressable>
    </Modal>
};

const modalStyles = StyleSheet.create({
    header: {
        flexDirection: "row",
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
        textAlign: "left",
        paddingVertical: 5,
        paddingHorizontal: 50,
        height: 30,
        maxWidth: 800,
        alignSelf: "center",
        width: "100%"
    },
});