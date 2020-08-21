import AsyncStorage from '@react-native-community/async-storage';

export var settings = {
    transmitLanguage: false,
    proxyYTM: false,
    safetyMode: false
}

getSettings().then(storage => {
    if (storage != null)
        settings = storage;
});

export async function getSettings() {
    try {
        const value = await AsyncStorage.getItem('@storage_Settings');

        if(value !== null)
            return JSON.parse(value);
        else
            return null;
    
    } catch(e) {
        console.log("reading settings error");
        return null;
    }
}

export async function storeSettings() {
    try {
        const string = JSON.stringify(settings);
        await AsyncStorage.setItem('@storage_Settings', string);

    } catch (e) {
        console.log("saving settings error");
    }
}

export const setTransmitLanguage = boolean => {
    settings.transmitLanguage = boolean;
    storeSettings();
}

export const setProxyYTM = boolean => {
    settings.proxyYTM = boolean;
    storeSettings();
}

export const setSafetyMode = boolean => {
    settings.safetyMode = boolean;
    storeSettings();
}