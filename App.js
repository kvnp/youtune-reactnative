import React, {Component} from 'react';

import { StatusBar, View, Text, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import SearchTab from './tabs/SearchTab';
import HomeTab from './tabs/HomeTab';
import LibraryTab from './tabs/LibraryTab';
import SettingsTab from './tabs/SettingsTab';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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

    getTabScreens = ({navigation}) => {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Home"
                            options={{ tabBarIcon: ({ color, size }) =>
                                <MaterialCommunityIcons name="home" color={color} size={size} />
                            }}>
                    {() => <HomeTab appCallback={this.appCallback} navigation={navigation} />}
                </Tab.Screen>

                <Tab.Screen name="Suche"
                            options={{ tabBarIcon: ({ color, size }) =>
                                <MaterialCommunityIcons name="magnify" color={color} size={size} />
                            }}>
                    {() => <SearchTab passBackground={this.state.background} navigation={navigation}></SearchTab>}
                </Tab.Screen>

                <Tab.Screen name="Bibliothek"
                            options={{ tabBarIcon: ({ color, size }) =>
                                <MaterialCommunityIcons name="folder" color={color} size={size} />
                            }}>
                    {() => <LibraryTab passBackground={this.state.background} navigation={navigation}></LibraryTab>}
                </Tab.Screen>

                <Tab.Screen name="Einstellungen"
                            options={{ tabBarIcon: ({ color, size }) =>
                            <MaterialCommunityIcons name="settings" color={color} size={size} />
                            }}>
                    {() => <SettingsTab passBackground={this.state.background} navigation={navigation}></SettingsTab>}
                </Tab.Screen>
            </Tab.Navigator>
        );
    }

    render() {
        return (
            <NavigationContainer>
                <StatusBar barStyle={this.state.barStyle}
                           hidden={false}
                           backgroundColor='transparent'
                           translucent={true}/>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name="App" component={this.getTabScreens}></Stack.Screen>

                    <Stack.Screen name="Playlist">
                        {() => <View style={{alignSelf: 'center', justifyContent: 'center'}}><Text>Playlist</Text></View>}
                    </Stack.Screen>

                    <Stack.Screen name="Musik">
                        {() => <View style={{alignSelf: 'center', justifyContent: 'center'}}><Text>Musik</Text></View>}
                    </Stack.Screen>

                    <Stack.Screen name="Künstler">
                        {() => <View style={{alignSelf: 'center', justifyContent: 'center'}}><Text>Künstler</Text></View>}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        );
    } 
}