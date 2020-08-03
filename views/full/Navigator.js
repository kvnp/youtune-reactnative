import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SearchTab from "../tabs/SearchTab";
import HomeTab from "../tabs/HomeTab";
import LibraryTab from "../tabs/LibraryTab";

import Header from "../../components/overlay/Header";
import { headerStyle, appColor } from "../../styles/App";
import { Pressable } from "react-native";
import { rippleConfig } from "../../styles/Ripple";

function getIcon(title, color, size) {
    return <MaterialIcons name={title} color={color} size={size}/>;
}

function getTabOptions(title) {
    return { tabBarIcon: ({ color, size }) => getIcon(title, color, size), tabBarButton: props => <Pressable {...props} android_ripple={rippleConfig}/> };
}

const Nav = createBottomTabNavigator();
export default () => {
    return (
        <>
        <Header style={headerStyle.headerPicture}/>
        <Nav.Navigator initialRouteName="Home" tabBarOptions={{
            activeBackgroundColor: appColor.background.backgroundColor,
            inactiveBackgroundColor: appColor.background.backgroundColor,
            activeTintColor: "white",
            inactiveTintColor: "darkgray",
            keyboardHidesTabBar: true,
            showLabel: false
        }}>
            <Nav.Screen name="Home" component={HomeTab} options={getTabOptions("home")}/>
            <Nav.Screen name="Search" component={SearchTab} options={getTabOptions("search")}/>
            <Nav.Screen name="Library" component={LibraryTab} options={getTabOptions("folder")}/>
        </Nav.Navigator>
        </>
    );
}