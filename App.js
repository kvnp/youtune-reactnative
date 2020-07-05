import React, { PureComponent } from "react";

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

export default class App extends PureComponent {
    constructor(props) {
        StatusBar.setBarStyle("dark-content", true);
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor("transparent", true);
        super(props);

        global.navigationOptions = {
            headerTitle: null,
            headerShown: false
        };
    }
    
    render() {
        const Stack = createStackNavigator();
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="App" component={Navigator} options={global.navigationOptions}/>
                    <Stack.Screen name="Playlist" component={PlaylistView} options={global.navigationOptions}/>
                    <Stack.Screen name="Music" component={PlayView} options={global.navigationOptions}/>
                    <Stack.Screen name="Artist" component={ArtistView} options={global.navigationOptions}/>
                    <Stack.Screen name="CreatePlaylist" component={CreatePlaylistView} options={global.navigationOptions}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}