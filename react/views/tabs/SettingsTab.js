import React, { PureComponent } from 'react';

import {
    StyleSheet,
    Switch,
    Text,
    Pressable
} from 'react-native';

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { appColor } from '../../styles/App';
import { ScrollView } from 'react-native-gesture-handler';
import MiniPlayer from '../../components/player/MiniPlayer';
import { setTransmitLanguage, setProxyYTM, setSafetyMode, settings} from '../../modules/storage/SettingsStorage';

export default class SettingsTab extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            language: false,
            proxy: false,
            safety: false,
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            global.setHeader({title: "Settings"});

            this.setState({
                language: settings.transmitLanguage,
                proxy: settings.proxyYTM,
                safety: settings.safetyMode
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

    render() {
        return <>
            <ScrollView bounces={true} contentContainerStyle={{flexGrow: 1, justifyContent: "flex-end"}}>
                <Pressable onPress={() => this.toggleLanguage(!this.state.language)} style={{flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", backgroundColor: "darkgray", borderWidth: 1, height: 65, marginTop: 7, marginBottom: 7}}>
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

                <Pressable onPress={() => this.toggleProxy(!this.state.proxy)} style={{flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", backgroundColor: "darkgray", borderWidth: 1, height: 65, marginTop: 7, marginBottom: 7}}>
                    <MaterialIcons name="public" color="black" size={30}/>
                    <Text style={{flexWrap: "wrap", width: "50%"}}>Proxy YouTube Music (Search/Home/Browse) requests</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={this.state.proxy ? appColor.background.backgroundColor : "darkgray"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={this.toggleProxy}
                        value={this.state.proxy}
                    />
                </Pressable>

                <Pressable onPress={() => this.toggleSafetyMode(!this.state.safety)} style={{flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", backgroundColor: "darkgray", borderWidth: 1, height: 65, marginTop: 7, marginBottom: 7}}>
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
            </ScrollView>
            <MiniPlayer navigation={this.props.navigation} style={appColor.background}/>
        </>
    }
};

const styles = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: '20%'
    },

    middleView: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },

    placeholder: {
        fontSize: 70
    },
});