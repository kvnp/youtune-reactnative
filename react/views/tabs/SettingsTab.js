import React, { useEffect, useState } from 'react';

import {
    StyleSheet,
    Switch,
    Text,
    Pressable,
    Platform,
    Linking
} from 'react-native';

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FlatList } from 'react-native-gesture-handler';

import {
    setTransmitLanguage,
    setProxyYTM,
    setSafetyMode,
    setDarkMode,
    settings
} from '../../modules/storage/SettingsStorage';

import { useTheme } from '@react-navigation/native';
import { setHeader } from '../../components/overlay/Header';
import { rippleConfig } from '../../styles/Ripple';

const host = Platform.OS == "web"
    ? window.location.hostname.replace("-", "‑") // Unicode NON-BREAKING HYPHEN (U+2011)
    : "youtune.kvnp.eu";

export default SettingsTab = ({navigation}) => {
    const [language, setLanguage] = useState(settings.transmitLanguage);
    const [proxy, setProxy] = useState(settings.proxyYTM);
    const [safety, setSafety] = useState(settings.safetyMode);
    const [dark, setDark] = useState(settings.darkMode);

    const { colors } = useTheme();

    useEffect(() => {
        const _unsubscribe = navigation.addListener('tabPress', () => {
            setHeader({title: "Settings"});
        });

        return () => {
            _unsubscribe();
        }
    }, []);

    const openRepo = () => {
        const url = "https://github.com/kvnp/youtune-reactnative";
        if (Platform.OS == "web")
            window.open(url, "_blank");
        else
            Linking.openURL(url).catch(
                err => console.error("Couldn't load page", err)
            );
    };

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

    const drawItem = ({item}) => {
        const func = item.function;
        const icon = item.icon;
        const desc = item.description;
        const useSwitch = item.switch;

        const disabled = item.hasOwnProperty("override") && Platform.OS == "web"
            ? item.override.web.disabled
            : false;
        
        const state = item.hasOwnProperty("override") && Platform.OS == "web"
            ? item.override.web.state
            : item.state;

        return <Pressable key={icon} android_ripple={rippleConfig} onPress={() => disabled ? null : func(!state)} style={[styles.item, {backgroundColor: colors.card}]}>
            <MaterialIcons name={icon} color={colors.text} size={30}/>
            <Text style={{flexWrap: "wrap", width: "50%", color: colors.text}}>{desc}</Text>
            {
                useSwitch
                ? <Switch
                    trackColor={{ false: "gray", true: colors.primary }}
                    thumbColor="darkgray"
                    onValueChange={disabled ? null : func}
                    value={state}
                    disabled={disabled}
                />

                : <MaterialIcons name="launch" color={colors.text} size={30}/>
            }
        </Pressable>
    }

    const items = [
        {
            icon: "code",
            description: "View git repository on github",
            state: true,
            function: openRepo,
            switch: false
        },

        {
            icon: "language",
            description: "Transmit device language",
            state: language,
            function: toggleLanguage,
            switch: true
        },

        {
            icon: "public",
            description: "Proxy search and browse requests over " + host,
            state: proxy,
            function: toggleProxy,
            switch: true,
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
            function: toggleSafetyMode,
            switch: true
        },

        {
            icon: "brightness-low",
            description: "Enable dark mode",
            state: dark,
            function: toggleDarkMode,
            switch: true
        },
    ];
    
    return <FlatList
        bounces={true}
        contentContainerStyle={styles.content}

        data={items}
        renderItem={drawItem}
    />
}

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        justifyContent: "flex-end",
        
        maxWidth: 800,
        width: "100%",
        alignSelf: "center"
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: 70,
        marginHorizontal: 5,
        marginBottom: 10,
        borderRadius: 5
    },
});