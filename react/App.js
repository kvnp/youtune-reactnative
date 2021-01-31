import React, { useState } from "react";
import { StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

import { settings } from "./modules/storage/SettingsStorage";
import PlayView from "./views/full/PlayView";
import PlaylistView from "./views/full/PlaylistView";
import ArtistView from "./views/full/ArtistView";
import Navigator, { getIcon } from "./views/full/Navigator";
import CaptchaView from "./views/full/CaptchaView";

export var darkCallback = null;
export const navigationOptions = {
    headerTitle: null,
    headerShown: false
};

const Stack = createStackNavigator();

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

    return <NavigationContainer theme={dark ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
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