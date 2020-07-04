import React, { Component } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import SearchTab from "./tabs/SearchTab";
import HomeTab from "./tabs/HomeTab";
import LibraryTab from "./tabs/LibraryTab";
import SettingsTab from "./tabs/SettingsTab";

import { Header } from "./components/SharedComponents";
import { headerStyle } from "./styles/App";

export default class Navigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Home",
            image: null
        };

        global.setHeader = (title, image) => {
            if (image != undefined)
                this.setState({title: title, image: image});
            else
                this.setState({title: title});
        }
    }

    getIcon = (title, color, size) => {
        return <MaterialCommunityIcons name={title} color={color} size={size} />;
    }

    getTabOptions = (title) => {
        return { tabBarIcon: ({ color, size }) => this.getIcon(title, color, size) }
    }

    render() {
        const Tab = createBottomTabNavigator();
        return (
            <>
                <Header style={headerStyle.headerPicture} text={this.state.title} source={this.state.image}/>
                <Tab.Navigator>
                    <Tab.Screen name="Home" component={HomeTab} options={this.getTabOptions("home")}/>
                    <Tab.Screen name="Suche" component={SearchTab} options={this.getTabOptions("magnify")}/>
                    <Tab.Screen name="Bibliothek" component={LibraryTab} options={this.getTabOptions("folder")}/>
                    <Tab.Screen name="Einstellungen" component={SettingsTab} options={this.getTabOptions("settings")}/>
                </Tab.Navigator>
            </>
        );
    }
}