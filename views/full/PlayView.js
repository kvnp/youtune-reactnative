import React, { PureComponent } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { rippleConfig } from "../../styles/Ripple";
import SeekBar from "../../components/player/SeekBar";
import ButtonArray from "../../components/player/ButtonArray";
import SwipePlaylist from "../../components/player/SwipePlaylist";
import { appColor } from "../../styles/App";
import { fetchNext } from "../../modules/API";

export default class PlayView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            position: 0,
            loading: false,
            isSeeking: false
        }
    }

    thumbDown = () => {
        if (global.state.isLiked)
            global.state.isLiked = false;

        global.state.isDisliked = !global.state.isDisliked;
        this.forceUpdate();
    }

    thumbUp = () => {
        if (global.state.isDisliked)
            global.state.isDisliked = false;

        global.state.isLiked = !global.state.isLiked;
        this.forceUpdate();
    }

    setPlaying = () => {
        global.state.isPlaying = !global.state.isPlaying;
        this.forceUpdate();
    }

    setRepeat = () => {
        global.state.isRepeating = !global.state.isRepeating;
        this.forceUpdate();
    }

    setShuffle = () => {
        
    }

    setNext = () => {
        global.onNext();
        this.forceUpdate();
    }

    setPrevious = () => {
        global.onPrevious();
        this.forceUpdate();
    }

    finishOpening = (result) => {
        global.state.playlist.list = result.list;
        global.state.playlist.index = result.index;

        global.state.current.title = result.list[result.index].title;
        global.state.current.subtitle = result.list[result.index].subtitle;
        global.state.current.playlistId = result.list[result.index].playlistId;
        global.state.current.videoId = result.list[result.index].videoId;
        global.state.current.thumbnail = result.list[result.index].thumbnail;
        global.state.current.length = result.list[result.index].length;
        this.setState({loading: false});

    }

    render() {
        const { route, navigation} = this.props;
        const { title, subtitle, thumbnail, length } = global.state.current;

        if (route.params != undefined && !this.state.loading) {
            this.setState({loading: true});
            const { playlistId, videoId } = route.params;
            route.params = undefined;

            fetchNext(videoId, playlistId).then((result) => this.finishOpening(result));
        }

        return (
            <View style={stylesTop.mainView}>
                <View style={stylesTop.vertContainer}>
                    <View style={stylesMid.midBit}>
                        <Image style={stylesMid.midImage} source={{uri: thumbnail}}/>
                    </View>

                    <View style={stylesBottom.bottomBit}>
                        <View style={stylesBottom.songContainer}>
                            <Pressable onPress={this.thumbDown} android_ripple={rippleConfig}>
                                <MaterialIcons name="thumb-down" color={global.state.isDisliked ? "black" : "darkgray"} size={30}/>
                            </Pressable>

                            <Text style={stylesBottom.titleText}>{title}</Text>

                            <Pressable onPress={this.thumbUp} android_ripple={rippleConfig}>
                                <MaterialIcons name="thumb-up" color={global.state.isLiked ? "black" : "darkgray"} size={30}/>
                            </Pressable>
                        </View>

                        <Text style={stylesBottom.subtitleText}>{subtitle}</Text>

                        <SeekBar trackLength={length} currentPosition={this.state.position} onSeek={() => {console.log("onSeek")}} onSlidingStart={() => {console.log("onSlidingStart")}}/>
                        <ButtonArray isRepeating={global.state.isRepeating}
                                     isPlaying={global.state.isPlaying}
                                     onPlay={this.setPlaying}
                                     onPrevious={this.setPrevious}
                                     onNext={this.setNext}
                                     onShuffle={this.setShuffle}
                                     onRepeat={this.setRepeat}
                                     isLoading={this.state.loading}
                                     
                                     style={stylesBottom.buttonContainer}/>
                        <View style={stylesTop.topBit}>
                            <Pressable onPress={() => navigation.goBack()} android_ripple={rippleConfig} style={stylesTop.topFirst}>
                                <MaterialIcons name="keyboard-arrow-down" color={"black"} size={30}/>
                            </Pressable>

                            <Pressable android_ripple={rippleConfig} style={stylesTop.topThird}>
                                <MaterialIcons name="more-vert" color={"black"} size={30}/>
                            </Pressable>
                        </View>
                    </View>
                </View>
                

                <SwipePlaylist minimumHeight={50}
                               onMinimize={() => {}}
                               onMaximize={() => {}}
                               style={stylesRest.container}/>
            </View>
        )
    }
}

const stylesRest = StyleSheet.create({
    container: {
        backgroundColor: "darkgray",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        paddingBottom: 10,
        alignItems: "center",
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,

        position: "absolute",
        bottom: 0
    },
});

const stylesBottom = StyleSheet.create({
    bottomBit: {
        paddingTop: 20,
        flexGrow: 1,
        flex: 1,
    },

    songContainer: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    subtitleText: {
        paddingTop: 5,
        alignSelf: "center"
    },

    titleText: {
        fontSize: 25,
        fontWeight: "bold"
    },

    buttonContainer: {
        paddingTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
});

const stylesMid = StyleSheet.create({
    midBit: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    midImage: {
        width: "100%",
        height: undefined,
        aspectRatio: 1,
        backgroundColor: appColor.background.backgroundColor
    }
});


const stylesTop = StyleSheet.create({
    mainView: {
        paddingTop: 50,
        flex: 1
    },

    topBit: {
        height: 90,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    topSecond: {
        flexDirection: "row",
        backgroundColor: "brown",
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        paddingTop: 5,
        borderRadius: 25,
    },

    topSecondTextOne: {
        fontWeight: "bold",
        color: "white",
        paddingLeft: 15,
        paddingRight: 15,
    },

    topSecondTextTwo: {
        fontWeight: "bold",
        color: "white",
        paddingLeft: 15,
        paddingRight: 15,
    },

    vertContainer: {
        flex: 1,
        marginLeft: 50,
        marginRight: 50,
    }
});