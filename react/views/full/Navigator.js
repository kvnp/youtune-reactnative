import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import SearchTab from "../tabs/SearchTab";
import HomeTab from "../tabs/HomeTab";
import LibraryTab from "../tabs/LibraryTab";

import Header from "../../components/overlay/Header";
import { headerStyle, navOptions } from "../../styles/App";

function getIcon(title, color) {
    return <MaterialIcons name={title} color={color} size={25}/>;
}

function getTabOptions(title) {
    return { tabBarIcon: ({ color }) => getIcon(title, color) };
}

const Nav = createMaterialTopTabNavigator();
export default () => {
    return (
        <>
        <Header style={headerStyle.headerPicture}/>
        <Nav.Navigator initialRouteName="Home" tabBarPosition="bottom" tabBarOptions={navOptions}>
            <Nav.Screen name="Home" component={HomeTab} options={getTabOptions("home")}/>
            <Nav.Screen name="Search" component={SearchTab} options={getTabOptions("search")}/>
            <Nav.Screen name="Library" component={LibraryTab} options={getTabOptions("folder")}/>
        </Nav.Navigator>
        </>
    )};