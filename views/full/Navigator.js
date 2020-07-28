import React from "react";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import SearchTab from "../tabs/SearchTab";
import HomeTab from "../tabs/HomeTab";
import LibraryTab from "../tabs/LibraryTab";

import Header from "../../components/overlay/Header";
import { headerStyle, appColor } from "../../styles/App";

function getIcon(title, color) {
    return <MaterialIcons name={title} color={color} size={24}/>;
}

function getTabOptions(title) {
    return { tabBarIcon: ({ color }) => getIcon(title, color) };
}

const Nav = createMaterialBottomTabNavigator();
export default ({miniPlayer}) => {
    return (
        <>
            <Header style={[headerStyle.headerPicture, {}]}/>
            <Nav.Navigator initialRouteName="Home" barStyle={appColor.background}>
                <Nav.Screen name="Home" component={HomeTab} options={getTabOptions("home")}/>
                <Nav.Screen name="Search" component={SearchTab} options={getTabOptions("search")}/>
                <Nav.Screen name="Library" component={LibraryTab} options={getTabOptions("folder")}/>
            </Nav.Navigator>
            {miniPlayer}
        </>
    );
}