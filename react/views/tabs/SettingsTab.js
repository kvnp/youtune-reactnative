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
import { useTheme } from '@react-navigation/native';

import Settings from '../../services/device/Settings';

const host = Platform.OS == "web"
    ? window.location.hostname.replace("-", "‑") // Unicode NON-BREAKING HYPHEN (U+2011)
    : "youtune.kvnp.eu";

export default SettingsTab = () => {
    const [settings, setSettings] = useState(Settings.Values);
    const { colors } = useTheme();

    useEffect(() => {
        const settingsListener = Settings.addListener(
            Settings.EVENT_SETTINGS,
            settings => setSettings(settings)
        );
                
        return () => settingsListener.remove();
    }, []);

    const openRepo = () => {
        const url = "https://github.com/kvnp/youtune-reactnative";
        if (Platform.OS == "web")
            window.open(url, "_blank");
        else
            Linking.openURL(url);
    };

    const toggleLanguage = boolean => {
        setSettings({...settings, transmitLanguage: boolean});
        Settings.enableLanguageTransmission(boolean);
    };
    
    const toggleProxy = boolean => {
        setSettings({...settings, proxyYTM: boolean});
        Settings.enableProxy(boolean);
    };

    const toggleSafetyMode = boolean => {
        setSettings({...settings, safetyMode: boolean});
        Settings.enableSafetyMode(boolean);
    };

    const toggleDarkMode = boolean => {
        setSettings({...settings, darkMode: boolean});
        Settings.enableDarkMode(boolean);
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
            state: settings.transmitLanguage,
            function: toggleLanguage,
            switch: true
        },

        {
            icon: "public",
            description: "Proxy search and browse requests over " + host,
            state: settings.proxyYTM,
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
            state: settings.safetyMode,
            function: toggleSafetyMode,
            switch: true
        },

        {
            icon: "brightness-low",
            description: "Enable dark mode",
            state: settings.darkMode,
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