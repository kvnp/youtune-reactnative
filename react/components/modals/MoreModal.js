import React, { useEffect, useState } from "react";
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
import TrackPlayer, { State } from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";

import Navigation from "../../services/ui/Navigation";
import Music from "../../services/music/Music";
import Downloads from "../../services/device/Downloads";
import ScrollingText from "../shared/ScrollingText";
import { appColor } from "../../styles/App";

export var showModal = null;
var dlListener = null;
var lkListener = null;

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
        queue: 0
    });

    const {dark, colors} = useTheme();

    const {
        title, subtitle, thumbnail,
        videoId, browseId, playlistId,
        type, liked, visible, playing,
        downloading, downloaded, queue
    } = content;

    useEffect(() => {
        if (visible) {
            dlListener = Downloads.addListener(
                Downloads.EVENT_DOWNLOAD,
                () => {
                    if (visible) {
                        setContent({
                            ...content,
                            downloading: Downloads.isTrackDownloading(videoId),
                            downloaded: Downloads.isTrackDownloaded(videoId),
                            queue: Downloads.getDownloadingLength()
                        });
                    }
                });

            lkListener = Downloads.addListener(
                Downloads.EVENT_LIKE,
                like => {
                    if (visible) {
                        setContent({
                            ...content,
                            liked: like
                        });
                    }
                });
        } else if (dlListener != null) {
            dlListener.remove();
            lkListener.remove();
        }
    }, [visible]);

    const onShare = async(type, url, message) => {
        try {
            const title = "YouTune - " + type;
            Share.share({
                title: title,
                url: url,
                message: message + ":\n" + url
            }, {
                dialogTitle: title
            }).then(event => {
                console.log(event);
                setContent({...content, visible: false});
            });

        } catch (error) {
            alert(error.message);
        }
    };

    const like = bool => {
        Downloads.likeTrack(videoId, bool);
        setContent({...content, liked: bool});
    }

    const refresh = (type, id) => {
        return new Promise(async(resolve) => {
            let liked = null;
            if (type == "Song")
                liked = await Downloads.isTrackLiked(id);

            resolve(liked);
        });
    };

    showModal = async(info) => {
        let type;
        let liked;

        if (info.videoId != null) {
            type = "Song";
            liked = await refresh(type, info.videoId);
        } else if (info.playlistId != null || info.browseId != null) {
            if (info.browseId != null) {
                if (info.browseId.slice(0, 2) == "UC") {
                    type = "Artist";
                    liked = await refresh(type, info.browseId);
    
                } else {
                    type = "Playlist";
                    liked = await refresh(type, info.playlistId);
                }
            } else {
                type = "Playlist";
                liked = await refresh(type, info.playlistId);
            }
        }

        let isPlaying = false;
        if (Music.metadata.id == info.videoId) {
            if (Music.state == State.Playing) {
                isPlaying = true;
            }
        }

        setContent({
            ...info,
            type: type,
            playing: isPlaying,
            liked: liked,
            downloading: Downloads.isTrackDownloading(info.videoId),
            downloaded: Downloads.isTrackDownloaded(info.videoId),
            queue: Downloads.getDownloadingLength(),
            visible: true
        });
    };

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
                    <Image source={{uri: thumbnail}} style={modalStyles.thumbnail}/>
                    <View style={modalStyles.headerText}>
                        <ScrollingText>
                            <Text style={{color: colors.text}} numberOfLines={1}>{title}</Text>
                        </ScrollingText>
                        
                        <ScrollingText>
                            <Text style={{color: colors.text}} numberOfLines={1}>{subtitle}</Text>
                        </ScrollingText>
                    </View>
                        <View style={{width: 120, height: 50, alignItems: "center", alignSelf: "center", justifyContent: "center", flexDirection: "row"}}>
                        {
                        type != "Song"
                            ? undefined
                            : <>
                            <TouchableRipple
                                borderless={true}
                                rippleColor={colors.primary}
                                onPress={() => like(false)}
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
                                onPress={() => like(true)}
    
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
                            </>
                        }
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
                                    title: title,
                                    subtitle: subtitle,
                                    thumbnail: thumbnail,
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
                        if (playing)
                            TrackPlayer.pause();
                        else {
                            if (Music.metadata.id == videoId) {
                                TrackPlayer.play();
                            } else {
                                Navigation.handleMedia(content, navigation);
                            }
                        }

                        setContent(content => ({
                            ...content,
                            playing: !playing,
                            visible: false
                        }));
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
                                    ? Downloads.cancelDownload(videoId)
                                    : downloaded
                                        ? Downloads.deleteDownload(videoId)
                                        : Downloads.downloadTrack(videoId)
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
                                    downloading
                                        ? "Downloading" + (queue > 0
                                            ? " (" + queue + " in queue)"
                                            : "")
    
                                        : downloaded
                                            ? "Delete" + (queue > 0
                                                ? " (" + queue + " in queue)"
                                                : "")
    
                                            : "Download" + (queue > 0
                                                ? " (" + queue + " in queue)"
                                                : "")
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
                            message = title + " - " + subtitle;
                            file = "watch?v=" + videoId;
                        } else if (type == "Playlist") {
                            message = title + " - " + subtitle;
                            file = "playlist?list=" + playlistId;
                        } else {
                            message = title + " - " + type;
                            file = "channel/" + browseId;
                        }

                        onShare(type, window.location.origin + "/" + file, message);
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