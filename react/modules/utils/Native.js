import { NativeModules, Platform } from 'react-native';

const deviceLanguage = Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13

        : NativeModules.I18nManager.localeIdentifier;

var gl = deviceLanguage.split("_")[1];
var hl = deviceLanguage.split("_")[0];

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