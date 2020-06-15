import React, { Component } from "react";

import { StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import SearchTab from "./tabs/SearchTab";
import HomeTab from "./tabs/HomeTab";
import LibraryTab from "./tabs/LibraryTab";
import SettingsTab from "./tabs/SettingsTab";

import { PlayView } from "./views/PlayView";
import { PlaylistView } from "./views/PlaylistView";
import { ArtistView } from "./views/ArtistView";
import { CreatePlaylistView } from "./views/CreatePlaylistView";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Home",
            image: null
        };
    }

    componentDidMount() {
        StatusBar.setBarStyle("light-content", true);
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor("transparent", true);
    }

    setImage = (url) => {
        this.setState({image: url});
    }

    
    render() {
        const Stack = createStackNavigator();
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="App" component={this.getBottomTabScreens} options={{headerShown: false}}/>

                    <Stack.Screen name="Playlist" component={PlaylistView} options={{headerTitle: null, headerShown: false}}/>

                    <Stack.Screen name="Music" component={PlayView} options={{headerTitle: null, headerShown: false}}/>

                    <Stack.Screen name="Artist" component={ArtistView} options={{headerTitle: null, headerShown: false}}/>

                    <Stack.Screen name="CreatePlaylist" component={CreatePlaylistView} options={{headerTitle: null, headerShown: false}}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    getBottomTabScreens = ({ navigation }) => {
        const Tab = createBottomTabNavigator();
        return (
            <Tab.Navigator>
                <Tab.Screen name="Home"
                            options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} /> }}>
                    {() => <HomeTab setImage={this.setImage} navigation={navigation}/>}
                </Tab.Screen>

                <Tab.Screen name="Suche"
                            options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="magnify" color={color} size={size} /> }}>
                    {() => <SearchTab passImage={this.state.image} navigation={navigation}/>}
                </Tab.Screen>

                <Tab.Screen name="Bibliothek"
                            options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="folder" color={color} size={size} /> }}>
                    {() => <LibraryTab passImage={this.state.image} navigation={navigation}/>}
                </Tab.Screen>

                <Tab.Screen name="Einstellungen"
                            options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="settings" color={color} size={size} /> }}>
                    {() => <SettingsTab passImage={this.state.image} navigation={navigation}/>}
                </Tab.Screen>
            </Tab.Navigator>
        );
    }
}