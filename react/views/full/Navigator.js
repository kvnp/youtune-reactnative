import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

import { useNavigation } from "@react-navigation/core";
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
import MoreModal from "../../components/modals/MoreModal";
import StreamModal from "../../components/modals/StreamModal";
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

export default Navigator = () => {
    const [bottomMargin, setBottomMargin] = useState(0);
    const [headerTitle, setHeaderTitle] = useState(null);
    const navigation = useNavigation();
    
    useEffect(() => {
        const stateListener = Music.addListener(
            Music.EVENT_STATE_UPDATE,
            state => setBottomMargin(state == State.Stopped || state == State.None ? 0 : 50)
        );

        return () => stateListener.remove();
    }, []);

    return <>
        <Header style={headerStyle.headerPicture} title={headerTitle}/>
        <Nav.Navigator
            initialRouteName="Home" tabBarPosition="bottom"
            shifting={true} labeled={true} sceneAnimationEnabled={true}
            initialLayout={{width: Dimensions.get('window').width}}
            sceneContainerStyle={{marginBottom: bottomMargin}}
            screenOptions={{...tabOptions, ...navigationOptions}}
            screenListeners={({route}) => setHeaderTitle(route.name)}
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
        <MoreModal navigation={navigation}/>
        <StreamModal/>
    </>
}