if (Platform.OS != "windows")
    require('react-native-gesture-handler');

import React, { useState } from "react";
import { Platform, StatusBar } from "react-native";
import { Provider, configureFonts, Snackbar, DefaultTheme as PaperTheme} from 'react-native-paper';

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

const fontConfig = {
    //-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
    default: {
        regular: {
            fontFamily: 'Segoe UI',
            fontWeight: 'normal',
            textTransform: "none",
            letterSpacing: "normal",
            fontSize: 14
        },
        medium: {
            fontFamily: 'Segoe UI',
            fontWeight: 'normal',
            textTransform: "none",
            letterSpacing: "normal",
            fontSize: 14
        },
        light: {
            fontFamily: 'Segoe UI',
            fontWeight: 'normal',
            textTransform: "none",
            letterSpacing: "normal",
            fontSize: 14
        },
        thin: {
            fontFamily: 'Segoe UI',
            fontWeight: 'normal',
            textTransform: "none",
            letterSpacing: "normal",
            fontSize: 14
        },
    },
    ios: {
        regular: {
            fontFamily: '-apple-system',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: '-apple-system',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: '-apple-system',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: '-apple-system',
            fontWeight: 'normal',
        },
    },
    android: {
        regular: {
            fontFamily: 'Roboto-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Roboto-Medium',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Roboto-Light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Roboto-Thin',
            fontWeight: 'normal',
        },
        black: {
            fontFamily: 'Roboto-Black',
            fontWeight: 'normal',
        },
        bold: {
            fontFamily: 'Roboto-Bold',
            fontWeight: 'normal',
        },
    },
    macos: {
        regular: {
            fontFamily: 'BlinkMacSystemFont',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'BlinkMacSystemFont',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'BlinkMacSystemFont',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'BlinkMacSystemFont',
            fontWeight: 'normal',
        },
    },
};

const App = () => {
    const [dark, setDark] = useState(settings.darkMode);
    const [visible, setVisible] = useState(false);

    const theme = dark
        ? {
            ...PaperTheme,
            ...DarkTheme,
            colors: {
                ...PaperTheme.colors,
                ...DarkTheme.colors,
                onSurface: DarkTheme.colors.border
            },
            dark: dark,
            fonts: configureFonts(fontConfig)
        }

        : {
            ...PaperTheme,
            ...DefaultTheme,
            colors: {
                ...PaperTheme.colors,
                ...DefaultTheme.colors,
                onSurface: DarkTheme.colors.border
            },
            dark: dark,
            fonts: configureFonts(fontConfig)
        }

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

    let updateBar = null;
    if (Platform.OS == "web") {
        updateBar = <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            style={{bottom: 50, maxWidth: 800, alignSelf: "center", width: "100%"}}
            action={{
                label: 'Reload',
                onPress: () => location.reload(),
            }}
        >
            An update is availabe!
        </Snackbar>

        window['isUpdateAvailable']
            .then(isAvailable => { if (isAvailable) {
                setVisible(true);
            }});
    }

    return <Provider theme={theme}>
        <NavigationContainer linking={linking} theme={theme}>
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
            {updateBar}
        </NavigationContainer>
    </Provider>
}

export default App;