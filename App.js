import React, {Component} from 'react';

import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import SearchTab from './tabs/SearchTab';
import HomeTab from './tabs/HomeTab';
import LibraryTab from './tabs/LibraryTab';
import SettingsTab from './tabs/SettingsTab';

import PlayView from './views/PlayView';
import PlaylistView from './views/PlaylistView';
import ArtistView from './views/ArtistView';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HeaderDb = {
    "https://lh3.googleusercontent.com/3OazqYM5TA4lMDZ0A-52-v6Zg4L-uFsAmfMp8aC-l-TUgr_UwPvayfxy_5hs5ll4B4zpj2hrG9A=w2880-h1613-l90-rj": true,
    "https://lh3.googleusercontent.com/G2nNxQ2O_svAtYlismpu0ZfNvusgKGBVpq-LI4xsHPeJELQO2_wOOu9NvOHcb9X1VvPR5_qx=w2880-h1620-l90-rj":    true,
    "https://lh3.googleusercontent.com/zG2J10I50KGW5v6bk9nPzkHEUI-JRU8Ok_h4rZD1AbrT0dM2zGFUUR-IFzL7oXISeY1ZEJAbrL4=w2880-h1613-l90-rj": true,
    "https://lh3.googleusercontent.com/KSM3z3kDJmVatKI47EHy7rkP9wZY6kkM1pAe1YGW7dajrs0ioZd9j_BCF2Q0ql25RottK03Z0Q=w2880-h1613-l90-rj":  true
};

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barStyle: "lighter-content",
            background: {
                source: require("./assets/img/header.jpg"),
                headerColor: Colors.white
            }
        };
    }

    setHeader = (url) => {
        let barStyle;
        let headerColor;

        if (HeaderDb.hasOwnProperty(url)) {
            if (HeaderDb[url]) {

                barStyle = "dark-content";
                headerColor = Colors.dark;
            } else {
                barStyle = "lighter-content";
                headerColor = Colors.white;
            }
            
        }

        this.setState({
            barStyle: barStyle,
            background: {
                source: url,
                headerColor: headerColor
            }
        });
    }

    getTabScreens = ({navigation}) => {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Home"
                            options={{ tabBarIcon: ({ color, size }) =>
                                <MaterialCommunityIcons name="home" color={color} size={size} />
                            }}>
                    {() => <HomeTab passBackground={this.state.background} setHeader={this.setHeader} navigation={navigation}/>}
                </Tab.Screen>

                <Tab.Screen name="Suche"
                            options={{ tabBarIcon: ({ color, size }) =>
                                <MaterialCommunityIcons name="magnify" color={color} size={size} />
                            }}>
                    {() => <SearchTab passBackground={this.state.background} navigation={navigation}/>}
                </Tab.Screen>

                <Tab.Screen name="Bibliothek"
                            options={{ tabBarIcon: ({ color, size }) =>
                                <MaterialCommunityIcons name="folder" color={color} size={size} />
                            }}>
                    {() => <LibraryTab passBackground={this.state.background} navigation={navigation}/>}
                </Tab.Screen>

                <Tab.Screen name="Einstellungen"
                            options={{ tabBarIcon: ({ color, size }) =>
                            <MaterialCommunityIcons name="settings" color={color} size={size} />
                            }}>
                    {() => <SettingsTab passBackground={this.state.background} navigation={navigation}/>}
                </Tab.Screen>
            </Tab.Navigator>
        );
    }

    getStatusStyle = () => {
        if (global.noTabBar)
            this.setState({barStyle: 'dark-content'});
        else
            this.setState({barStyle: ''});
    }

    render() {
        return (
            <NavigationContainer>
                <StatusBar barStyle={this.state.barStyle}
                           hidden={false}
                           backgroundColor='transparent'
                           translucent={true}/>
                <Stack.Navigator>
                    <Stack.Screen name="App" component={this.getTabScreens} options={{headerShown: false}}></Stack.Screen>

                    <Stack.Screen name="Playlist">
                        {() => <PlaylistView/>}
                    </Stack.Screen>

                    <Stack.Screen name="Music">
                        {() => <PlayView/>}
                    </Stack.Screen>

                    <Stack.Screen name="Artist">
                        {() => <ArtistView/>}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        );
    } 
}