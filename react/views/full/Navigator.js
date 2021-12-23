import React, { useState, useEffect, useCallback } from "react";
import { Dimensions } from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/core";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TrackPlayer, { State } from 'react-native-track-player';

import SearchTab from "../tabs/SearchTab";
import HomeTab from "../tabs/HomeTab";
import LibraryTab from "../tabs/LibraryTab";
import SettingsTab from "../tabs/SettingsTab";

import { navigationOptions } from "../../App";
import Header from "../../components/overlay/Header";
import { headerStyle } from "../../styles/App";
import MoreModal from "../../components/modals/MoreModal";
import MiniPlayer from "../../components/player/MiniPlayer";
import { getIcon } from "../../utils/Icon";

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

export default Navigator = () => {
    const [bottomMargin, setBottomMargin] = useState(0);
    const [headerTitle, setHeaderTitle] = useState(null);
    const navigation = useNavigation();
    
    useFocusEffect(
        useCallback(() => {
            resizeContainer();
        }, [])
    );
    
    useEffect(() => {
        resizeContainer();
        let playbackState = TrackPlayer.addEventListener(
            "playback-state", resizeContainer
        );

        return () => playbackState.remove();
    }, []);

    const resizeContainer = async(e) => {
        if (!e) 
            e = {state: await TrackPlayer.getState()};
        
        setBottomMargin(
            e.state == State.Playing || e.state == State.Paused
                ? 50 : 0
        );
    }

    return <>
        <Header style={headerStyle.headerPicture} title={headerTitle}/>
        <Nav.Navigator
            initialRouteName="Home"
            tabBarPosition="bottom"
            initialLayout={{width: Dimensions.get('window').width}}
            sceneContainerStyle={{marginBottom: bottomMargin}}
            
            screenOptions={{
                ...tabOptions,
                ...navigationOptions,
            }}

            screenListeners={({route}) => {
                setHeaderTitle(route.name);
            }}

            shifting={true}
            sceneAnimationEnabled={true}
            labeled={true}
        >
            <Nav.Screen
                name="Home"
                component={HomeTab}
                options={getTabOptions("home")}
            />

            <Nav.Screen
                name="Search"
                component={SearchTab}
                options={getTabOptions("search")}
            />

            <Nav.Screen
                name="Library"
                component={LibraryTab}
                options={getTabOptions("folder")}
            />

            <Nav.Screen
                name="Settings"
                component={SettingsTab}
                options={getTabOptions("settings")}
            />
        </Nav.Navigator>
        <MiniPlayer
            containerStyle={{position: "absolute", bottom: 48, width: "100%"}}
            style={{maxWidth: 800}}
        />
        <MoreModal navigation={navigation}/>
    </>
}