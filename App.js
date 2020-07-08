import React from "react";

import { StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import PlayView from "./views/full/PlayView";
import PlaylistView from "./views/full/PlaylistView";
import ArtistView from "./views/full/ArtistView";

import Navigator from "./views/full/Navigator";

export default function App() {
    StatusBar.setBarStyle("dark-content", true);
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent", true);

    global.navigationOptions = {
        headerTitle: null,
        headerShown: false
    };

    const Stack = createStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="App" component={Navigator} options={global.navigationOptions}/>
                <Stack.Screen name="Playlist" component={PlaylistView} options={global.navigationOptions}/>
                <Stack.Screen name="Music" component={PlayView} options={global.navigationOptions}/>
                <Stack.Screen name="Artist" component={ArtistView} options={global.navigationOptions}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}