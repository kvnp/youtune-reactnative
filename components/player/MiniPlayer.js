import React, { PureComponent } from "react";
import { StyleSheet, Animated, View, Pressable, Image, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TrackPlayer from 'react-native-track-player';

export default class MiniPlayer extends PureComponent{
    constructor(props) {
        super(props)
        this.state = {
            isPlaying: false,
            isStopped: true,
            isLoading: false,
            track: null
        };

        TrackPlayer.addEventListener("playback-state", async(params) => {
            switch (params["state"]) {
                case TrackPlayer.STATE_NONE:
                    break;
                case TrackPlayer.STATE_PLAYING:
                    this.setState({isPlaying: true, isStopped: false, isLoading: false});
                    break;
                case TrackPlayer.STATE_PAUSED:
                    this.setState({isPlaying: false, isStopped: false, isLoading: false});
                    break;
                case TrackPlayer.STATE_STOPPED:
                    this.setState({isPlaying: false, isStopped: true, isLoading: false});
                    break;
                case TrackPlayer.STATE_BUFFERING:
                    this.setState({isPlaying: false, isStopped: false, isLoading: true});
            }
        });

        TrackPlayer.addEventListener("playback-track-changed", params => {
            this.refreshUI();
        });
    }

    componentDidMount() {
        this.refreshUI();
    }

    refreshUI = async() => {
        let id = await TrackPlayer.getCurrentTrack();
        if (id != null) {
            let thisstate = {};
            let track = await TrackPlayer.getTrack(id);
            let state = await TrackPlayer.getState();

            thisstate.track = track;
            switch (state) {
                case TrackPlayer.STATE_NONE:
                    break;
                case TrackPlayer.STATE_PLAYING:
                    thisstate.isPlaying = true;
                    thisstate.isLoading = false;
                    break;
                case TrackPlayer.STATE_PAUSED:
                    thisstate.isPlaying = false;
                    thisstate.isLoading = false;
                    break;
                case TrackPlayer.STATE_STOPPED:
                    thisstate.isStopped = true;
                    thisstate.isPlaying = false;
                    thisstate.isLoading = false;
                    break;
                case TrackPlayer.STATE_BUFFERING:
                    thisstate.isPlaying = false;
                    thisstate.isLoading = true;
                    break;
            }

            this.setState(thisstate);
        }
    }

    onOpen = () => {
        this.props.navigation.navigate("Music");
    }

    onNext = () => {
        TrackPlayer.skipToNext().then(this.refreshUI);
    }

    onPlay = () => {
        if (this.state.isPlaying)
            TrackPlayer.pause().then(this.refreshUI);
        else
            TrackPlayer.play().then(this.refreshUI);
    }

    onStop = () => {
        TrackPlayer.stop().then(this.refreshUI);
    }

    render() {
        var title = null;
        var artist = null;
        var artwork = null;

        if (this.state.track != null)
            var {title, artist, artwork} = this.state.track;

        return (
            <Animated.View style={[this.props.style, {height: this.state.isStopped ?0 :50}]}>
                <Pressable style={styles.container} onPress={this.onOpen}>
                    <Image source={{uri: artwork}} style={styles.image}/>
                    <View style={styles.textContainer}>
                        <Text numberOfLines={1} style={[styles.text, styles.titleText]}>{title}</Text>
                        <Text numberOfLines={1} style={[styles.text, styles.subtitleText]}>{artist}</Text>
                    </View>

                    <Pressable style={styles.button} onPress={this.onStop}>
                        <MaterialIcons name="clear" color="white" size={29}/>
                    </Pressable>

                    <Pressable style={styles.button} onPress={this.onPlay}>
                        <MaterialIcons name={this.state.isPlaying ?"pause" :"play-arrow"} color="white" size={29}/>
                    </Pressable>

                    <Pressable style={styles.button} onPress={this.onNext}>
                        <MaterialIcons name="skip-next" color="white" size={29}/>
                    </Pressable>
                </Pressable>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        overflow: "hidden",
        height: 50,
        paddingRight: 15,
        paddingLeft: 15,
        paddingBottom: 2,
        paddingTop: 2,
        alignItems: "center",
        alignSelf: "center",
    },

    image: {
        height: "100%",
        aspectRatio: 1,
        backgroundColor: "gray",
    },

    textContainer: {
        flex: 1,
        overflow: "hidden",
        paddingLeft: 10
    },

    text: {
        color: "white",
    },

    titleText: {
        fontWeight: "bold"
    },

    subtitleText: {
        
    },

    button: {
        paddingLeft: 2,
        paddingRight: 2
    }
});