import React, { PureComponent } from "react";

import { StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import PlayView from "./views/full/PlayView";
import PlaylistView from "./views/full/PlaylistView";
import ArtistView from "./views/full/ArtistView";
import Navigator from "./views/full/Navigator";
import MiniPlayer from "./components/player/MiniPlayer";
import { appColor } from "./styles/App";

import {NativeModules} from 'react-native';
const LinkBridge = NativeModules.LinkBridge;

import TrackPlayer from 'react-native-track-player';
TrackPlayer.registerPlaybackService();

const Stack = createStackNavigator();
export default class App extends PureComponent {
    constructor(props) {
        super(props);

        StatusBar.setBarStyle("dark-content", true);
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor("transparent", true);

        global.navigationOptions = {
            headerTitle: null,
            headerShown: false
        };

        this.state = {
            isPlaying: false,
            isRepeating: false,
            isLiked: false,
            isDisliked: false,

            downloadLink: null,
            current: null,
            playlist: null
        }

        global.onPlay = () => {
            if (this.state.downloadLink == null) {
                LinkBridge.getString(
                    "https://www.youtube.com/watch?v=" + this.state.current.videoId,
                    string => {
                        this.setState({downloadLink: string});

                        TrackPlayer.setupPlayer().then(
                            async() => {
                                await TrackPlayer.add({
                                    id: this.state.current.videoId,
                                    url: this.state.downloadLink
                                });

                                TrackPlayer.play();
                                this.setState({isPlaying: true});
                            }
                        );
                    }
                );
            }
        }

        global.onRepeat = () => {
            this.setState({isRepeating: !this.state.isRepeating})
        }

        global.onLike = () => {
            this.setState({isLiked: !this.state.isLiked});
        }

        global.onDislike = () => {
            this.setState({isDisliked: !this.state.isDisliked});
        }

        global.onRepeat = () => {
            this.setState({isRepeating: !this.state.isRepeating});
        }

        global.onOpen = (navigation) => {
            navigation.navigate("Music");
        }

        global.onShuffle = () => {
            console.log("shuffle playlist");
        }

        this.setPlaylist = (list, index) => {
            this.setState({
                playlist: {
                    list: list,
                    index: index
                },
                downloadLink: null,
                current: list[index]
            });
        }

        this.setIndex = (index) => {
            console.log("Lied: " + index);
            console.log(this.state.playlist.list[index], "\n" + "\n");

            this.setState({
                isPlaying: true,
                current: this.state.playlist.list[index],
                playlist: {
                    list: this.state.playlist.list,
                    index: index
                },
                downloadLink: null
            });

            global.onPlay();
        }
    
        global.onNext = () => {
            if (this.state.playlist != null) {
                let { list, index } = this.state.playlist;
                
                index < list.length - 1
                    ? index += 1
                    : index = 0

                this.setIndex(index);
            }
        }
    
        global.onPrevious = () => {
            let { list, index } = this.state.playlist;
            index > 0
                ? index -= 1
                : index = list.length - 1

            this.setIndex(index);
        }

        global.onStop = () => {
            this.setState({current: null, playlist: null});
        }
    }

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="App" options={global.navigationOptions}>
                        {({navigation, route}) => <Navigator
                            miniPlayer={
                                <MiniPlayer media={this.state.current}
                                            playlist={this.state.playlist}
                                            isPlaying={this.state.isPlaying}
                                            isStopped={this.state.current == null ? true : false}
                                            isLoading={
                                                this.state.downloadLink == null && this.state.isPlaying
                                                ? true
                                                : false
                                            }

                                            onStop={global.onStop}
                                            onOpen={() => global.onOpen(navigation)}
                                            onClose={global.onClose}
                                            onNext={global.onNext}
                                            onPlay={global.onPlay}
                                            style={{backgroundColor: appColor.background.backgroundColor}}/>
                            }
                        />}
                    </Stack.Screen>

                    <Stack.Screen name="Playlist" component={PlaylistView}/>

                    <Stack.Screen name="Music" options={global.navigationOptions}>
                        {({navigation, route}) => <PlayView
                                                        current={this.state.current}
                                                        playlist={this.state.playlist}
                                                        navigation={navigation}
                                                        route={route}
                                                        
                                                        isPlaying={this.state.isPlaying}
                                                        isRepeating={this.state.isRepeating}
                                                        isStopped={this.state.isStopped}
                                                        isDisliked={this.state.isDisliked}
                                                        isLiked={this.state.isLiked}
                                                        isLoading={
                                                            this.state.downloadLink == null && this.state.isPlaying
                                                            ? true
                                                            : false
                                                        }

                                                        onPlaylist={this.setPlaylist}
                                                        onLike={global.onLike}
                                                        onDislike={global.onDislike}
                                                        onPlay={global.onPlay}
                                                        onPrevious={global.onPrevious}
                                                        onNext={global.onNext}
                                                        onShuffle={global.onShuffle}
                                                        onRepeat={global.onRepeat}/>
                        }
                    </Stack.Screen>

                    <Stack.Screen name="Artist" component={ArtistView}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}