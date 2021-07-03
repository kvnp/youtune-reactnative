import 'react-native-gesture-handler';
import React, { useCallback, useState } from "react";
import { Platform, StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import Toast from 'react-native-toast-message'

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

const linking = {
    prefixes: ["https://youtune.kvnp.eu"],
    config: {
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
    }
};

export default App = () => {
    const [dark, setDark] = useState(settings.darkMode);
    const toastRef = useCallback(ref => Toast.setRef(ref), []);
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

    if (Platform.OS == "web") {
        window['isUpdateAvailable']
            .then(isAvailable => { if (isAvailable) {
                Toast.show({
                    type: 'info',
                    position: 'bottom',
                    text1: 'New Update available!',
                    text2: 'Reload the webapp to see the latest juicy changes.',
                    visibilityTime: 4000,
                    autoHide: true,
                    bottomOffset: 48,
                    onShow: () => {},
                    onHide: () => {}, // called when Toast hides (if `autoHide` was set to `true`)
                    onPress: () => location.reload(),
                });
            }});
    }

    return <NavigationContainer linking={linking} theme={dark ? DarkTheme : DefaultTheme}>
        <Stack.Navigator screenOptions={{gestureEnabled: true, swipeEnabled: true, animationEnabled: true}}>
            <Stack.Screen name="App" component={Navigator} options={navigationOptions}/>
            <Stack.Screen name="Music" component={PlayView} options={{...navigationOptions, presentation: "modal"}}/>
            <Stack.Screen name="Captcha" component={CaptchaView}/>
            
            <Stack.Screen name="Playlist" component={PlaylistView}
                          options={{headerBackImage: () => getIcon({title: "arrow-back"})}}
            />
            
            <Stack.Screen name="Artist" component={ArtistView}
                          options={{headerBackImage: () => getIcon({title: "arrow-back"})}}
            />
        </Stack.Navigator>
        <Toast ref={toastRef}/>
    </NavigationContainer>
}