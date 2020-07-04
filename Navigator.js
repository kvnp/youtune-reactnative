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

    getIcon = (icon, color, size) => {
        return <MaterialCommunityIcons name={icon} color={color} size={size} />;
    }

    render() {
        const Tab = createBottomTabNavigator();
        return (
            <>
                <Header style={headerStyle.headerPicture} text={this.state.title} source={this.state.image}/>
                <Tab.Navigator>
                    <Tab.Screen name="Home" component={HomeTab}
                                options={{ tabBarIcon: ({ color, size }) => this.getIcon("home", color, size)}}/>

                    <Tab.Screen name="Suche" component={SearchTab}
                                options={{ tabBarIcon: ({ color, size }) => this.getIcon("magnify", color, size) }}/>

                    <Tab.Screen name="Bibliothek" component={LibraryTab}
                                options={{ tabBarIcon: ({ color, size }) => this.getIcon("folder", color, size) }}/>

                    <Tab.Screen name="Einstellungen" component={SettingsTab}
                                options={{ tabBarIcon: ({ color, size }) => this.getIcon("settings", color, size) }}/>
                </Tab.Navigator>
            </>
        );
    }
}