import React, { useEffect, useState } from 'react';

import {
    StyleSheet,
    Switch,
    Text,
    Pressable,
    Platform
} from 'react-native';

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ScrollView } from 'react-native-gesture-handler';
import MiniPlayer from '../../components/player/MiniPlayer';
import { setTransmitLanguage, setProxyYTM, setSafetyMode, setDarkMode, settings} from '../../modules/storage/SettingsStorage';
import { useTheme } from '@react-navigation/native';

export default SettingsTab = ({navigation}) => {
    const [language, setLanguage] = useState(settings.transmitLanguage);
    const [proxy, setProxy] = useState(settings.proxyYTM);
    const [safety, setSafety] = useState(settings.safetyMode);
    const [dark, setDark] = useState(settings.darkMode);

    const { colors } = useTheme();

    useEffect(() => {
        const _unsubscribe = navigation.addListener('focus', () => {
            global.setHeader({title: "Settings"});
        });

        return () => {
            _unsubscribe();
        }
    }, []);

    const toggleLanguage = boolean => {
        setTransmitLanguage(boolean);
        setLanguage(boolean);
    };
    
    const toggleProxy = boolean => {
        setProxyYTM(boolean);
        setProxy(boolean);
    };

    const toggleSafetyMode = boolean => {
        setSafetyMode(boolean);
        setSafety(boolean);
    };

    const toggleDarkMode = boolean => {
        setDarkMode(boolean);
        setDark(boolean);
    };

    const drawEntry = entry => {
        const func = entry.function;
        const icon = entry.icon;
        const desc = entry.description;

        const disabled = entry.hasOwnProperty("override") && Platform.OS == "web"
            ? entry.override.web.disabled
            : false;
        
        const state = entry.hasOwnProperty("override") && Platform.OS == "web"
            ? entry.override.web.state
            : entry.state;

        return <Pressable key={icon} onPress={() => disabled ? null : func(!state)} style={[styles.entry, {backgroundColor: colors.card}]}>
            <MaterialIcons name={icon} color={colors.text} size={30}/>
            <Text style={{flexWrap: "wrap", width: "50%", color: colors.text}}>{desc}</Text>
            <Switch
                trackColor={{ false: "gray", true: colors.primary }}
                thumbColor="darkgray"
                onValueChange={disabled ? null : func}
                value={state}
                disabled={disabled}
            />
        </Pressable>
    }

    const entries = [
        {
            icon: "language",
            description: "Transmit device language",
            state: language,
            function: toggleLanguage
        },

        {
            icon: "public",
            description: "Proxy search and browse requests over youtune.kvnp.eu",
            state: proxy,
            function: toggleProxy,
            override: {
                web: {
                    disabled: true,
                    state: true,
                }
            }
        },

        {
            icon: "child-friendly",
            description: "Enable safety mode",
            state: safety,
            function: toggleSafetyMode
        },

        {
            icon: "brightness-low",
            description: "Enable dark mode",
            state: dark,
            function: toggleDarkMode
        },
    ];

    return <>
        <ScrollView bounces={true} contentContainerStyle={styles.content}>
            {entries.map(drawEntry)}
        </ScrollView>
        <MiniPlayer navigation={navigation}/>
    </>
}

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
        height: 65,
        marginTop: 7,
        marginBottom: 7,
        borderRadius: 5
    }
});