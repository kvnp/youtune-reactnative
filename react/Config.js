import { configureFonts, DefaultTheme as PaperTheme} from 'react-native-paper';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const linking = {
    enabled: true,
    prefixes: ["https://youtune.kvnp.eu"],
    config: {
        screens: {
            App: {
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
    return {
        ...DarkTheme,
        ...PaperTheme,
        colors: {
            ...DarkTheme.colors,
            onSurface: DarkTheme.colors.border
        },
        dark: isDark,
    };
}