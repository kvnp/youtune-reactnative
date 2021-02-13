import React, { useState } from "react";
import { StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';

import { settings } from "./modules/storage/SettingsStorage";
import PlayView from "./views/full/PlayView";
import PlaylistView from "./views/full/PlaylistView";
import ArtistView from "./views/full/ArtistView";
import Navigator from "./views/full/Navigator";
import CaptchaView from "./views/full/CaptchaView";

import { getIcon } from "./modules/utils/Icon";

enableScreens();

export var darkCallback = null;
export const navigationOptions = {
    headerTitle: null,
    headerShown: false
};

const Stack = createStackNavigator();

const config = {
    initialRouteName: "App",
    screens: {
        App: {
            initialRouteName: "Home",
            path: "",
            screens: {
                Home: "",
                Search: "search",
                Settings: "settings",
                
                Library: {
                    path: "library",
                    screens: {
                        Playlists: "playlists",
                        Albums: "albums",
                        Songs: "songs",
                        Artists: "artists",
                        Downloads: "downloads"
                    }
                }
            }
        },

        Music: "watch",
        Artist: "channel/:channelId",
        Playlist: "playlist",
    }
};

const linking = {
    prefixes: ["https://youtune.kvnp.eu", "http://127.0.0.1"],
    config
};

export default App = () => {
    const [dark, setDark] = useState(settings.darkMode);
    if (settings.darkMode)
        StatusBar.setBarStyle("light-content", true);
    else
        StatusBar.setBarStyle("dark-content", true);

    darkCallback = boolean => {
        setDark(boolean);
        if (boolean)
            StatusBar.setBarStyle("light-content", true);
        else
            StatusBar.setBarStyle("dark-content", true);
    };

    return <NavigationContainer linking={linking} theme={dark ? DarkTheme : DefaultTheme}>
        <Stack.Navigator detachInactiveScreens={false} options={{animationEnabled: true, detachPreviousScreen: false}}>
            <Stack.Screen name="App" component={Navigator} options={navigationOptions}/>
            <Stack.Screen name="Music" component={PlayView} options={navigationOptions}/>
            <Stack.Screen name="Captcha" component={CaptchaView}/>
            
            <Stack.Screen name="Playlist" component={PlaylistView}
                          options={{headerBackImage: () => getIcon({title: "arrow-back"})}}
            />
            
            <Stack.Screen name="Artist" component={ArtistView}
                          options={{headerBackImage: () => getIcon({title: "arrow-back"})}}
            />
        </Stack.Navigator>
    </NavigationContainer>
}