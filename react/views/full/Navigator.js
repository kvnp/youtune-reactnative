import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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

const getTabOptions = (title) => {
    return { tabBarIcon: ({ color }) => getIcon({title, color}) };
}

const Nav = createMaterialTopTabNavigator();

export default Navigator = ({navigation}) => {
    const [bottomMargin, setBottomMargin] = useState(0);
    
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
                setBottomMargin(50);
        }
    }

    return <>
        <Header style={headerStyle.headerPicture}/>
        <Nav.Navigator
            initialRouteName="Home"
            tabBarPosition="bottom"
            initialLayout={{width: Dimensions.get('window').width}}
            sceneContainerStyle={{marginBottom: bottomMargin}}
            lazy={false}
            tabBarOptions={{
                optimizationsEnabled: true,
                lazy: false,
                keyboardHidesTabBar: true,
                showIcon: true,
                showLabel: false
            }}
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