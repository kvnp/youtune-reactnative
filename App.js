import React, { Component } from "react";

import {
    StatusBar
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { PlayView } from "./views/PlayView";
import { PlaylistView } from "./views/PlaylistView";
import { ArtistView } from "./views/ArtistView";
import { CreatePlaylistView } from "./views/CreatePlaylistView";

import Navigator from "./Navigator";

export default class App extends Component {
    constructor(props) {
        StatusBar.setBarStyle("dark-content", true);
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor("transparent", true);
        super(props);
        this.options = {
            headerTitle: null,
            headerShown: false
        };
    }
    
    render() {
        const Stack = createStackNavigator();
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen options={this.options} name="App" component={Navigator} />
                    <Stack.Screen options={this.options} name="Playlist" component={PlaylistView}/>
                    <Stack.Screen options={this.options} name="Music" component={PlayView}/>
                    <Stack.Screen options={this.options} name="Artist" component={ArtistView}/>
                    <Stack.Screen options={this.options} name="CreatePlaylist" component={CreatePlaylistView}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}