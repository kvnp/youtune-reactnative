/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import { Text, StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SearchTab from './tabs/SearchTab.js';
import HomeTab from './tabs/HomeTab.js';
import LibraryTab from './tabs/LibraryTab.js';
import SettingsTab from './tabs/SettingsTab.js';


function SearchScreen() {
    return (
        <>
            <SearchTab/>
        </>
    )
}

function HomeScreen() {
    return (
        <>
            <HomeTab/>
        </>
    );
}

function LibraryScreen() {
    return (
        <>
            <LibraryTab/>
        </>
    )
}

function SettingsScreen() {
    return (
        <>
            <SettingsTab/>
        </>
    );
}

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar barStyle = "lighter-content" hidden = {false} backgroundColor = 'transparent' translucent = {true}/>
            <Tab.Navigator>
                <Tab.Screen name="Suche" component={SearchScreen} />
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Bibliothek" component={LibraryScreen} />
                <Tab.Screen name="Einstellungen" component={SettingsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
