/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';

import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SearchTab from './tabs/SearchTab';
import HomeTab from './tabs/HomeTab';
import LibraryTab from './tabs/LibraryTab';
import SettingsTab from './tabs/SettingsTab';
import { Colors } from 'react-native/Libraries/NewAppScreen';


class SearchScreen extends Component {
    render() {
        return (
            <SearchTab passBackground={this.props.passBackground}/>
        );
    }
}

class HomeScreen extends Component {
    callback = (data) => {
        this.props.appCallback(data);
    }

    render() {
        return (
            <HomeTab callback={this.callback}/>
        );
    }
}

class LibraryScreen extends Component {
    render() {
        return (
            <LibraryTab passBackground={this.props.passBackground}/>
        );
    }
}

class SettingsScreen extends Component {
    render() {
        return (
            <SettingsTab passBackground={this.props.passBackground}/>
        );
    }
}

const Tab = createBottomTabNavigator();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barStyle: "lighter-content",
            background: {
                source: require("./assets/img/header.jpg"),
                bright: false,
                color: Colors.white
            }
        };
    }

    appCallback = (data) => {
        let statusStyle;
        let headerColor;
        if (data.bright) {
            statusStyle = "dark-content";
            headerColor = Colors.dark;
        } else {
            statusStyle = "lighter-content";
            headerColor = Colors.white;
        }

        this.setState({
            barStyle: statusStyle,
            background: data,
            color: headerColor
        });
        
    }

    render() {
        return (
            <NavigationContainer>
                <StatusBar barStyle={this.state.barStyle}
                           hidden={false}
                           backgroundColor='transparent'
                           translucent={true}/>
                <Tab.Navigator>
                    <Tab.Screen name="Home">
                        {() => <HomeScreen appCallback={this.appCallback} />}
                    </Tab.Screen>

                    <Tab.Screen name="Suche" >
                        {() => <SearchScreen passBackground={this.state.background}></SearchScreen>}
                    </Tab.Screen>

                    <Tab.Screen name="Bibliothek">
                        {() => <LibraryScreen passBackground={this.state.background}></LibraryScreen>}
                    </Tab.Screen>

                    <Tab.Screen name="Einstellungen">
                        {() => <SettingsScreen passBackground={this.state.background}></SettingsScreen>}
                    </Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
        );
    } 
}
