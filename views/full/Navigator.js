import React from "react";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import SearchTab from "../tabs/SearchTab";
import HomeTab from "../tabs/HomeTab";
import LibraryTab from "../tabs/LibraryTab";

import Header from "../../components/overlay/Header";
import { headerStyle, appColor } from "../../styles/App";
import { View, Text } from "react-native";

function getIcon(title, color) {
    return <MaterialIcons name={title} color={color} size={24}/>;
}

function getTabOptions(title) {
    return { tabBarIcon: ({ color }) => getIcon(title, color) };
}

export default () => {
    const Tab = createMaterialBottomTabNavigator();
    return (
        <>
            <Header style={[headerStyle.headerPicture, {}]}/>
            <Tab.Navigator initialRouteName="Home" barStyle={appColor.background}>
                <Tab.Screen name="Home" component={HomeTab} options={getTabOptions("home")}/>
                <Tab.Screen name="Search" component={SearchTab} options={getTabOptions("search")}/>
                <Tab.Screen name="Library" component={LibraryTab} options={getTabOptions("folder")}/>
            </Tab.Navigator>
            <View style={{overflow: "hidden", height: 0}}>
                <Text>asodakpksdpaok</Text>
            </View>
        </>
    );
}