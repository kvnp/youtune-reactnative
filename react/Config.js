import { configureFonts, DefaultTheme as PaperTheme} from 'react-native-paper';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const fontConfig = {
    //-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
    default: {
        regular: {
            fontFamily: 'Segoe UI',
            fontWeight: 'normal',
            textTransform: "none",
            letterSpacing: 0,
            fontSize: 14
        },
        medium: {
            fontFamily: 'Segoe UI',
            fontWeight: 'normal',
            textTransform: "none",
            letterSpacing: 0,
            fontSize: 14
        },
        light: {
            fontFamily: 'Segoe UI',
            fontWeight: 'normal',
            textTransform: "none",
            letterSpacing: 0,
            fontSize: 14
        },
        thin: {
            fontFamily: 'Segoe UI',
            fontWeight: 'normal',
            textTransform: "none",
            letterSpacing: 0,
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

export const linking = {
    prefixes: ["https://youtune.kvnp.eu"],
    config: {
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

export const getTheme = isDark => {
    return isDark
        ? {
            ...PaperTheme,
            ...DarkTheme,
            colors: {
                ...PaperTheme.colors,
                ...DarkTheme.colors,
                onSurface: DarkTheme.colors.border
            },
            dark: true,
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
            dark: false,
            fonts: configureFonts(fontConfig)
        }
}