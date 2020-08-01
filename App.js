import React, { PureComponent } from "react";

import { StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import PlayView from "./views/full/PlayView";
import PlaylistView from "./views/full/PlaylistView";
import ArtistView from "./views/full/ArtistView";
import Navigator from "./views/full/Navigator";

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
    }

    render() {
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