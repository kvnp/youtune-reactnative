import React, { PureComponent } from "react";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import SearchTab from "../tabs/SearchTab";
import HomeTab from "../tabs/HomeTab";
import LibraryTab from "../tabs/LibraryTab";
import SettingsTab from "../tabs/SettingsTab";

import { Header } from "../../components/SharedComponents";
import { headerStyle, appColor } from "../../styles/App";

export default class Navigator extends PureComponent {
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

    getIcon = (title, color) => {
        return <MaterialIcons name={title} color={color} size={24}/>;
    }

    getTabOptions = (title) => {
        return { tabBarIcon: ({ color }) => this.getIcon(title, color) }
    }

    render() {
        const Tab = createMaterialBottomTabNavigator();
        return (
            <>
                <Header style={headerStyle.headerPicture} text={this.state.title} source={this.state.image}/>
                <Tab.Navigator initialRouteName="Home" barStyle={appColor.background}>
                    <Tab.Screen name="Home" component={HomeTab} options={this.getTabOptions("home")}/>
                    <Tab.Screen name="Suche" component={SearchTab} options={this.getTabOptions("search")}/>
                    <Tab.Screen name="Bibliothek" component={LibraryTab} options={this.getTabOptions("folder")}/>
                    <Tab.Screen name="Einstellungen" component={SettingsTab} options={this.getTabOptions("settings")}/>
                </Tab.Navigator>
            </>
        );
    }
}