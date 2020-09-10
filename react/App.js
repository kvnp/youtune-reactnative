import React from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";

import PlayView from "./views/full/PlayView";
import PlaylistView from "./views/full/PlaylistView";
import ArtistView from "./views/full/ArtistView";
import Navigator, { getIcon } from "./views/full/Navigator";
import CaptchaView from "./views/full/CaptchaView";
import { appColor } from "./styles/App";
import { Platform } from "react-native";

const Stack = createStackNavigator();
export default () => {
    const stackNavigator =  <NavigationContainer>
                                <Stack.Navigator>
                                    <Stack.Screen name="App" component={Navigator} options={global.navigationOptions}/>
                                    <Stack.Screen name="Playlist" component={PlaylistView} options={Platform.OS == "web" ? {HeaderBackButton: getIcon("arrow-back", "black")} : null }/>
                                    <Stack.Screen name="Music" component={PlayView} options={global.navigationOptions}/>
                                    <Stack.Screen name="Artist" component={ArtistView} options={Platform.OS == "web" ? {HeaderBackButton: getIcon("arrow-back", "black")} : null }/>
                                    <Stack.Screen name="Captcha" component={CaptchaView}/>
                                </Stack.Navigator>
                            </NavigationContainer>
        
    return Platform.OS == "ios"
        ?   <SafeAreaView style={{flex: 1, paddingTop: -44, backgroundColor: appColor.background.backgroundColor}}>
                {stackNavigator}
            </SafeAreaView>

        :   stackNavigator
            
}