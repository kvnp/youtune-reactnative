import React, { PureComponent } from 'react';

import {
    StyleSheet,
    Switch,
    Text,
    Pressable,
    Platform
} from 'react-native';

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { appColor } from '../../styles/App';
import { ScrollView } from 'react-native-gesture-handler';
import MiniPlayer from '../../components/player/MiniPlayer';
import { setTransmitLanguage, setProxyYTM, setSafetyMode, setDarkMode, settings} from '../../modules/storage/SettingsStorage';

export default class SettingsTab extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            language: false,
            proxy: false,
            safety: false,
            dark: false,
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            global.setHeader({title: "Settings"});

            this.setState({
                language: settings.transmitLanguage,
                proxy: settings.proxyYTM,
                safety: settings.safetyMode,
                dark: settings.darkMode,
            });
        });
    }
    
    componentWillUnmount() {
        this._unsubscribe();
    }

    toggleLanguage = boolean => {
        setTransmitLanguage(boolean);
        this.setState({language: boolean});
    }
    
    toggleProxy = boolean => {
        setProxyYTM(boolean);
        this.setState({proxy: boolean});
    }

    toggleSafetyMode = boolean => {
        setSafetyMode(boolean);
        this.setState({safety: boolean});
    }

    toggleDarkMode = boolean => {
        setDarkMode(boolean);
        this.setState({dark: boolean});
    }

    render() {
        return <>
            <ScrollView bounces={true} contentContainerStyle={styles.content}>
                <Pressable onPress={() => this.toggleLanguage(!this.state.language)} style={styles.entry}>
                    <MaterialIcons name="language" color="black" size={30}/>
                    <Text style={{flexWrap: "wrap", width: "50%"}}>Transmit device language to YouTube</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={this.state.language ? appColor.background.backgroundColor : "darkgray"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={this.toggleLanguage}
                        value={this.state.language}
                    />
                </Pressable>

                <Pressable onPress={Platform.OS == "web" ?null :() => this.toggleProxy(!this.state.proxy)} style={styles.entry}>
                    <MaterialIcons name="public" color="black" size={30}/>
                    <Text style={{flexWrap: "wrap", width: "50%"}}>Proxy YouTube Music (Search/Browse) requests</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={this.state.proxy ? appColor.background.backgroundColor : "darkgray"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={Platform.OS == "web" ?null :this.toggleProxy}
                        value={Platform.OS == "web" ?true :this.state.proxy}
                        disabled={Platform.OS == "web" ?true :false}
                    />
                </Pressable>

                <Pressable onPress={() => this.toggleSafetyMode(!this.state.safety)} style={styles.entry}>
                    <MaterialIcons name="child-friendly" color="black" size={30}/>
                    <Text style={{flexWrap: "wrap", width: "50%"}}>Enable safety mode</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={this.state.safety ? appColor.background.backgroundColor : "darkgray"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={this.toggleSafetyMode}
                        value={this.state.safety}
                    />
                </Pressable>
                <Pressable onPress={() => this.toggleDarkMode(!this.state.safety)} style={styles.entry}>
                    <MaterialIcons name="brightness-low" color="black" size={30}/>
                    <Text style={{flexWrap: "wrap", width: "50%"}}>Enable dark mode</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={this.state.dark ? appColor.background.backgroundColor : "darkgray"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={this.toggleDarkMode}
                        value={this.state.dark}
                    />
                </Pressable>
            </ScrollView>
            <MiniPlayer navigation={this.props.navigation} style={appColor.background}/>
        </>
    }
};

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        justifyContent: "flex-end"
    },

    entry: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: "darkgray",
        borderWidth: 1,
        height: 65,
        marginTop: 7,
        marginBottom: 7
    }
});