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
            loading: false,
            isSeeking: false,
            position: 0
        }
    }

    finishOpening = (result) => {
        this.setState({loading: false});
        this.props.onPlaylist(result.list, result.index);
    }

    render() {
        const { route, navigation } = this.props;
        const { current } = this.props;

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
                        <Image style={stylesMid.midImage} source={{uri: this.props.current != null ?current.thumbnail :null}}/>
                    </View>

                    <View style={stylesBottom.bottomBit}>
                        <View style={stylesBottom.songContainer}>
                            <Pressable onPress={this.props.onDislike} android_ripple={rippleConfig}>
                                <MaterialIcons name="thumb-down" color={this.props.isDisliked ? "black" : "darkgray"} size={30}/>
                            </Pressable>

                            <Text numberOfLines={1} style={stylesBottom.titleText}>{this.props.current != null ?current.title :""}</Text>

                            <Pressable onPress={this.props.onLike} android_ripple={rippleConfig}>
                                <MaterialIcons name="thumb-up" color={this.props.isLiked ? "black" : "darkgray"} size={30}/>
                            </Pressable>
                        </View>

                        <Text numberOfLines={1} style={stylesBottom.subtitleText}>{this.props.current != null ?current.subtitle :""}</Text>

                        <SeekBar trackLength={this.props.current != null ?current.length :0} currentPosition={this.state.position} onSeek={() => {console.log("onSeek")}} onSlidingStart={() => {console.log("onSlidingStart")}}/>
                        <ButtonArray isRepeating={this.props.isRepeating}
                                     isPlaying={this.props.isPlaying}
                                     onPlay={this.props.onPlay}
                                     onPrevious={this.props.onPrevious}
                                     onNext={this.props.onNext}
                                     onShuffle={this.props.onShuffle}
                                     onRepeat={this.props.onRepeat}
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
        alignSelf: "center",
        overflow: "hidden",
        paddingLeft: 10,
        paddingRight: 10,
        width: "80%",
        textAlign: "center",
    },

    titleText: {
        fontSize: 25,
        fontWeight: "bold",
        overflow: "hidden",
        paddingLeft: 10,
        paddingRight: 10,
        width: "80%",
        textAlign: "center",
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