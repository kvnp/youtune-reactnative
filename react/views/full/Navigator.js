import React, { useState, useEffect } from "react";
import { Dimensions, Platform } from "react-native";

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import TrackPlayer from 'react-native-track-player';

import SearchTab from "../tabs/SearchTab";
import HomeTab from "../tabs/HomeTab";
import LibraryTab from "../tabs/LibraryTab";
import SettingsTab from "../tabs/SettingsTab";

import Header from "../../components/overlay/Header";
import { headerStyle } from "../../styles/App";
import MoreModal from "../../components/modals/MoreModal";
import MiniPlayer from "../../components/player/MiniPlayer";
import { getIcon } from "../../modules/utils/Icon";
import { navigationOptions } from "../../App";
import { useTheme } from "@react-navigation/native";

const getTabOptions = title => {
    return { tabBarIcon: ({ color }) => getIcon({title, color}) };
}

const Nav = createMaterialBottomTabNavigator();

const tabOptions = {
    lazy: false,
    optimizationsEnabled: true,
    tabBarHideOnKeyboards: true,
    tabBarShowLabel: false,
    gestureEnabled: true,
    swipeEnabled: true,
    animationEnabled: true
};

export default Navigator = ({navigation}) => {
    const [bottomMargin, setBottomMargin] = useState(0);
    const { colors } = useTheme();
    
    useEffect(() => {
        resizeContainer();
        let _unsub = TrackPlayer.addEventListener("playback-state", resizeContainer);
        return () => _unsub.remove();
    }, []);

    const resizeContainer = async(e) => {
        if (!e) e = {state: await TrackPlayer.getState()}

        switch (e.state) {
            case TrackPlayer.STATE_NONE:
            case TrackPlayer.STATE_STOPPED:
                setBottomMargin(0);
                break;
            case TrackPlayer.STATE_PLAYING:
            case TrackPlayer.STATE_PAUSED:
            case TrackPlayer.STATE_BUFFERING:
                setBottomMargin(98);
        }
    }

    return <>
        <Header style={headerStyle.headerPicture}/>
        <Nav.Navigator
            initialRouteName="Home"
            tabBarPosition="bottom"
            initialLayout={{width: Dimensions.get('window').width}}

            style={{marginBottom: bottomMargin}}
            barStyle={{backgroundColor: colors.card, position: Platform.OS == "web" ? "fixed" : "absolute", bottom: 0}}
            screenOptions={{
                ...tabOptions,
                ...navigationOptions
            }}

            shifting={true}
            sceneAnimationEnabled={true}
            lazy={false}
            labeled={true}
        >
            <Nav.Screen name="Home" component={HomeTab} options={getTabOptions("home")}/>
            <Nav.Screen name="Search" component={SearchTab} options={getTabOptions("search")}/>
            <Nav.Screen name="Library" component={LibraryTab} options={getTabOptions("folder")}/>
            <Nav.Screen name="Settings" component={SettingsTab} options={getTabOptions("settings")}/>
        </Nav.Navigator>
        <MiniPlayer style={{position: "absolute", bottom: 48, width: "100%"}} navigation={navigation}/>
        <MoreModal navigation={navigation}/>
    </>
}