import React, { PureComponent } from "react";
import { StyleSheet, Animated, View, Pressable, Image, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TrackPlayer from 'react-native-track-player';
import { skip, setPlay } from "../../service";

export default class MiniPlayer extends PureComponent{
    constructor(props) {
        super(props)
        this.state = {
            isPlaying: false,
            isStopped: true,
            isLoading: false,
            track: null
        };
    }

    componentDidMount() {
        this.refreshUI();

        this._unsub = [];
        this._unsub.push(
            TrackPlayer.addEventListener("playback-state", params => this.refreshUI)
        );

        this._unsub.push(
            TrackPlayer.addEventListener("playback-track-changed", params => this.refreshUI)
        );
    }

    componentWillUnmount() {
        for (let i = 0; i < this._unsub.length; i++)
            this._unsub[i].remove();
    }

    refreshUI = async() => {
        let id = await TrackPlayer.getCurrentTrack();
        if (id != null) {
            let track = await TrackPlayer.getTrack(id);
            let state = await TrackPlayer.getState();
            let newstate = {track: track};

            switch (state) {
                case TrackPlayer.STATE_NONE:
                    break;
                case TrackPlayer.STATE_PLAYING:
                    newstate.isPlaying = true;
                    newstate.isLoading = false;
                    newstate.isStopped = false;
                    break;
                case TrackPlayer.STATE_PAUSED:
                    newstate.isPlaying = false;
                    newstate.isLoading = false;
                    newstate.isStopped = false;
                    break;
                case TrackPlayer.STATE_STOPPED:
                    newstate.isPlaying = false;
                    newstate.isLoading = false;
                    newstate.isStopped = true;
                    break;
                case TrackPlayer.STATE_BUFFERING:
                    newstate.isPlaying = false;
                    newstate.isLoading = true;
                    newstate.isStopped = false;
                    break;
            }

            this.setState(newstate);
        } else
            this.setState({isPlaying: false, isLoading: false, isStopped: true});
    }

    onOpen = () => this.props.navigation.navigate("Music");

    onNext = () => skip(true);

    onPlay = () => setPlay(this.state.isPlaying);

    onStop = () => TrackPlayer.reset().then(this.refreshUI);

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