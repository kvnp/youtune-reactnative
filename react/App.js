import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import PlayView from "./views/full/PlayView";
import PlaylistView from "./views/full/PlaylistView";
import ArtistView from "./views/full/ArtistView";
import Navigator from "./views/full/Navigator";
import CaptchaView from "./views/full/CaptchaView";

const Stack = createStackNavigator();
export default () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="App" component={Navigator} options={global.navigationOptions}/>
                <Stack.Screen name="Playlist" component={PlaylistView}/>
                <Stack.Screen name="Music" component={PlayView} options={global.navigationOptions}/>
                <Stack.Screen name="Artist" component={ArtistView}/>
                <Stack.Screen name="Captcha" component={CaptchaView}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}