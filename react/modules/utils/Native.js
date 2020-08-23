import { NativeModules, Platform } from 'react-native';

const deviceLanguage = Platform.OS == "web"
        ? null

        : Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13

            : NativeModules.I18nManager.localeIdentifier;

var gl = Platform.OS != "web" 
    ? deviceLanguage.split("_")[1]
    : "US";

var hl = Platform.OS != "web" 
    ? deviceLanguage.split("_")[0]
    : "en"

if (gl == "CN") {
    gl = "TW"
}

if (hl == "yue") {
    hl = "zh"
}

export function getGL() {
    return gl;
}

export function getHL() {
    return hl;
}