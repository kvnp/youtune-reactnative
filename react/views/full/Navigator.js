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
import { View, Platform } from "react-native";

function getIcon(title, color) {
    return <MaterialIcons name={title} color={color} size={25}/>;
}

function getTabOptions(title) {
    return { tabBarIcon: ({ color }) => getIcon(title, color) };
}

const Nav = createMaterialTopTabNavigator();

export default Navigator = ({navigation}) => {
    return (
        <>
        <Header style={headerStyle.headerPicture}/>
        <Nav.Navigator initialRouteName="Home" tabBarPosition="bottom" style={Platform.OS == "web" ? {height: "80%", width: "100%", position: "fixed", bottom: 0} :null} tabBarOptions={navOptions}>
            <Nav.Screen name="Home" component={HomeTab} options={getTabOptions("home")}/>
            <Nav.Screen name="Search" component={SearchTab} options={getTabOptions("search")}/>
            <Nav.Screen name="Library" component={LibraryTab} options={getTabOptions("folder")}/>
            <Nav.Screen name="Settings" component={SettingsTab} options={getTabOptions("settings")}/>
        </Nav.Navigator>
        <MoreModal navigation={navigation}/>
        </>
    )
}