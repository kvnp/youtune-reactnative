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

        global.state = {
            isPlaying: false,
            isRepeating: false,
            isLiked: false,
            isDisliked: false,

            current: {
                title: null,
                subtitle: null,
                playlistId: null,
                videoId: null,
                thumbnail: null,
                length: 0
            },

            playlist: {
                list: [],
                index: 0
            }
        }

        global.onPlay = ({title, subtitle, videoId}) => {
            console.log("play");
        }

        global.setIndex = (index) => {
            global.state.playlist.index = index;
            global.state.isPlaying = true;

            global.state.current = global.state.playlist.list[index];
            this.forceUpdate();
        }

        global.setPlaylist = () => {

        }
    
        global.onNext = () => {
            let { list, index } = global.state.playlist;
            if (index < list.length - 1)
                index += 1
            else
                index = 0

            
            console.log("Nächstes Lied:" + index);
            console.log(list[index]);
            console.log("\n");

            global.setIndex(index);
        }
    
        global.onPrevious = () => {
            let { list, index } = global.state.playlist;
            if (index > 0)
                index -= 1
            else
                index = list.length - 1

            
            console.log("Voriges Lied:" + index);
            console.log(list[index]);
            console.log("\n");

            global.setIndex(index);
        }

        global.miniPlayer = <MiniPlayer style={{backgroundColor: appColor.background.backgroundColor}}/>
    }

    onPlay = ({title, subtitle, videoId}) => {
        global.state.currentTitle = title;
        global.state.currentSubtitle = subtitle;
        global.state.currentVideoID = videoId;
        this.forceUpdate();
    }

    onNext = () => {
        console.log("next");
    }

    onPrevious = () => {
        console.log("previous");
    }

    render() {
        const Stack = createStackNavigator();
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="App" component={Navigator} options={global.navigationOptions}/>
                    <Stack.Screen name="Playlist" component={PlaylistView}/>
                    <Stack.Screen name="Music" component={PlayView} options={global.navigationOptions}/>
                    <Stack.Screen name="Artist" component={ArtistView}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}