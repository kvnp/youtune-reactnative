import React, { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import PlayView from "./views/full/PlayView";
import PlaylistView from "./views/full/PlaylistView";
import ArtistView from "./views/full/ArtistView";
import Navigator from "./views/full/Navigator";
import CaptchaView from "./views/full/CaptchaView";

import { getTheme, linking } from "./Config";
import { getIcon } from "./utils/Icon";
import UpdateBar from "./components/shared/UpdateBar";
import UI from "./services/ui/UI";
import Settings from "./services/device/Settings";

UI.initialize();

export const navigationOptions = {
    headerTitle: null,
    headerShown: false
};

const Stack = createStackNavigator();

const App = () => {
    const [dark, setDark] = useState(Settings.Values.darkMode);

    useEffect(() => {
        const darkmodeListener = UI.addListener(
            UI.EVENT_DARK,
            boolean => setDark(boolean)
        );

        return () => darkmodeListener.remove();
    }, [])

    const theme = getTheme(dark);

    return <GestureHandlerRootView>
        <Provider theme={theme}>
            <NavigationContainer linking={linking} theme={theme}>
                <Stack.Navigator screenOptions={{gestureEnabled: true, swipeEnabled: true, animationEnabled: true}}>
                    <Stack.Screen name="App" component={Navigator} options={navigationOptions}/>
                    <Stack.Screen name="Music" component={PlayView} options={{...navigationOptions, presentation: "transparentModal"}}/>
                    <Stack.Screen name="Captcha" component={CaptchaView}/>
                    
                    <Stack.Screen name="Playlist" component={PlaylistView}
                                options={{headerBackImage: () => getIcon({title: "arrow-back"})}}
                    />
                    
                    <Stack.Screen name="Artist" component={ArtistView}
                                options={{headerBackImage: () => getIcon({title: "arrow-back"})}}
                    />
                </Stack.Navigator>
                <UpdateBar/>
            </NavigationContainer>
        </Provider>
    </GestureHandlerRootView>;
}

export default App;