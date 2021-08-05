import React, { useEffect, useState } from 'react';

import {
    StyleSheet,
    Switch,
    Text,
    Platform,
    Linking,
    FlatList,
    View
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {
    setTransmitLanguage,
    setProxyYTM,
    setSafetyMode,
    setDarkMode,
    settings
} from '../../modules/storage/SettingsStorage';

import { useTheme } from '@react-navigation/native';
import { setHeader } from '../../components/overlay/Header';

const host = Platform.OS == "web"
    ? window.location.hostname.replace("-", "‑") // Unicode NON-BREAKING HYPHEN (U+2011)
    : "youtune.kvnp.eu";

export default SettingsTab = ({navigation}) => {
    const [language, setLanguage] = useState(settings.transmitLanguage);
    const [proxy, setProxy] = useState(settings.proxyYTM);
    const [safety, setSafety] = useState(settings.safetyMode);
    const { colors, dark } = useTheme();

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', () => {
            setHeader({title: "Settings"});
        });

        const unsubscribe2 = navigation.addListener('focus', () => {
            setHeader({title: "Settings"});
        });

        return () => {
            unsubscribe();
            unsubscribe2();
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

        return <TouchableRipple
            borderless={true}
            disabled={disabled}
            style={{
                marginHorizontal: 5,
                borderRadius: 5,
                marginBottom: 10,
                height: 70,
                backgroundColor: colors.card,
                flexDirection: 'row',
            }}

            key={icon}
            onPress={() => disabled ? null : func(!state)}
            rippleColor={colors.primary}
        >
            <View style={{
                flex: 1,
                flexDirection: "row",
                alignSelf: "center",
                alignItems: "center",
                paddingHorizontal: 20
            }}>
                <MaterialIcons
                    name={icon}
                    color={colors.text}
                    size={30}
                />

                <Text style={{
                    flex: 1,
                    flexWrap: "wrap",
                    color: colors.text,
                    marginHorizontal: 10
                }}>
                    {desc}
                </Text>
                
                {
                    useSwitch
                        ? <Switch
                            trackColor={{ false: "gray", true: colors.primary }}
                            thumbColor="darkgray"
                            onValueChange={disabled ? null : func}
                            value={state}
                            disabled={disabled}
                        />

                        : <MaterialIcons
                            name="launch"
                            color={colors.text}
                            size={30}
                        />
                }
            </View>
        </TouchableRipple>;
    }

    const items = [
        {
            icon: "code",
            description: "View code on github",
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
        height: 70
    },
});