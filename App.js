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

        global.callbackList = [];

        this.state = {
            isPlaying: false,
            isRepeating: false,
            isLiked: false,
            isDisliked: false,

            current: null,
            playlist: null
        }

        global.onPlay = () => {
            this.setState({isPlaying: !this.state.isPlaying});
            this.forceUpdate();
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

        global.onShuffle = () => {
            console.log("shuffle playlist");
        }

        this.setPlaylist = (list, index) => {
            this.setState({
                playlist: {
                    list: list,
                    index: index
                },
                current: list[index]
            });
        }

        this.setIndex = (index) => {
            if (this.state.playlist != null)
                this.setState({
                    isPlaying: true,
                    current: this.state.playlist.list[index],
                    playlist: {
                        list: this.state.playlist.list,
                        index: index
                    }
                });
                this.forceUpdate();
        }
    
        global.onNext = () => {
            if (this.state.playlist != null) {
                let { list, index } = this.state.playlist;
                if (index < list.length - 1)
                    index += 1
                else
                    index = 0

                console.log("Nächstes Lied:" + index);
                console.log(list[index]);
                console.log("\n");

                this.setIndex(index);
            }
        }
    
        global.onPrevious = () => {
            let { list, index } = this.state.playlist;
            if (index > 0)
                index -= 1
            else
                index = list.length - 1

            console.log("Voriges Lied:" + index);
            console.log(list[index]);
            console.log("\n");

            this.setIndex(index);
        }
    }

    render() {
        const Stack = createStackNavigator();
        global.miniPlayer = <MiniPlayer media={this.state.current}
                                        playlist={this.state.playlist}
                                        isPlaying={this.state.isPlaying}
                                        isStopped={this.state.current == null ? true : false}
                                        onOpen={global.onOpen}
                                        onClose={global.onClose}
                                        onNext={global.onNext}
                                        onPlay={global.onPlay}
                                        style={{backgroundColor: appColor.background.backgroundColor}}/>;

        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="App" component={Navigator} options={global.navigationOptions}/>
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