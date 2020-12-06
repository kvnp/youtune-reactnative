import React from "react";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import SearchTab from "../tabs/SearchTab";
import HomeTab from "../tabs/HomeTab";
import LibraryTab from "../tabs/LibraryTab";
import SettingsTab from "../tabs/SettingsTab";

import Header from "../../components/overlay/Header";
import { headerStyle, navOptions } from "../../styles/App";
import MoreModal from "../../components/shared/MoreModal";
import { Platform } from "react-native";
import { useTheme } from "@react-navigation/native";

export const getIcon = ({title, color}) => {
    if (color == undefined) {
        const { colors } = useTheme();
        color = colors.text;
    }

    return <MaterialIcons name={title} color={color} size={25}/>;
}

const getTabOptions = (title) => {
    return { tabBarIcon: ({ color }) => getIcon({title, color}) };
}

const Nav = createMaterialTopTabNavigator();

export default Navigator = ({navigation}) => {
    return <>
        <Header style={headerStyle.headerPicture}/>
        <Nav.Navigator
                initialRouteName="Home"
                tabBarPosition="bottom"
                tabBarOptions={navOptions}
                
                style={
                    Platform.OS == "web"
                        ? {
                            height: "80%",
                            width: "100%",
                            position: "fixed",
                            bottom: 0
                        }
                        
                        : null
                }>
            <Nav.Screen name="Home" component={HomeTab} options={getTabOptions("home")}/>
            <Nav.Screen name="Search" component={SearchTab} options={getTabOptions("search")}/>
            <Nav.Screen name="Library" component={LibraryTab} options={getTabOptions("folder")}/>
            <Nav.Screen name="Settings" component={SettingsTab} options={getTabOptions("settings")}/>
        </Nav.Navigator>
        <MoreModal navigation={navigation}/>
    </>
}