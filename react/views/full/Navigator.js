import { useState, useEffect } from "react";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { State } from 'react-native-track-player';

import SearchTab from "../tabs/SearchTab";
import HomeTab from "../tabs/HomeTab";
import LibraryTab from "../tabs/LibraryTab";
import SettingsTab from "../tabs/SettingsTab";

import Music from "../../services/music/Music";
import { getIcon } from "../../utils/Icon";
import { headerStyle } from "../../styles/App";
import { navigationOptions } from "../../App";
import Header from "../../components/overlay/Header";
import MiniPlayer from "../../components/player/MiniPlayer";

const getTabOptions = title => {
    return { tabBarIcon: ({ color }) => getIcon({title, color}) };
}

const Nav = createMaterialTopTabNavigator();

const tabOptions = {
    lazy: false,
    optimizationsEnabled: true,
    tabBarHideOnKeyboards: true,
    tabBarShowLabel: false,
    gestureEnabled: true,
    swipeEnabled: true,
    animationEnabled: true
};

const getHeight = state => [State.Stopped, State.None].includes(state) ? 0 : 50;

var firstRoute;
var fixedNavigation;
export default Navigator = () => {
    const [bottomMargin, setBottomMargin] = useState(getHeight(Music.state));
    const [headerTitle, setHeaderTitle] = useState(null);
    
    useEffect(() => {
        const stateListener = Music.addListener(
            Music.EVENT_STATE_UPDATE,
            state => setBottomMargin(getHeight(state))
        );

        return () => stateListener.remove();
    }, []);

    return <>
        <Header style={headerStyle.headerPicture} title={headerTitle}/>
        <Nav.Navigator tabBarPosition="bottom"
            sceneAnimationEnabled={true} shifting={true} labeled={true}
            sceneContainerStyle={{marginBottom: bottomMargin}}
            screenOptions={{...tabOptions, ...navigationOptions}}
            screenListeners={({route, navigation}) => {
                if (!fixedNavigation) {
                    if (firstRoute == undefined) {
                        firstRoute = route.name;
                        if (route.name == "Home")
                            fixedNavigation = true;
                    } else {
                        if (route.name == "Home") {
                            fixedNavigation = true;
                            navigation.reset({
                                index: 0,
                                routes: [{name: "Home"}],
                            });
                        }
                    }
                }

                setHeaderTitle(route.name);
            }}
        >
            <Nav.Screen name="Home" component={HomeTab} options={getTabOptions("home")}/>
            <Nav.Screen name="Search" component={SearchTab} options={getTabOptions("search")}/>
            <Nav.Screen name="Library" component={LibraryTab} options={getTabOptions("folder")}/>
            <Nav.Screen name="Settings" component={SettingsTab} options={getTabOptions("settings")}/>
        </Nav.Navigator>
        <MiniPlayer
            containerStyle={{position: "absolute", bottom: 48, width: "100%"}}
            style={{maxWidth: 800}}
            height={bottomMargin}
        />
    </>
}