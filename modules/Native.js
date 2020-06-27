import { NativeModules } from 'react-native';

var gl = null;
var hl = null;

function getSystemLocale() {
    let locale;
    // iOS
    if ( NativeModules.SettingsManager &&
         NativeModules.SettingsManager.settings &&
         NativeModules.SettingsManager.settings.AppleLanguages )
            locale = NativeModules.SettingsManager.settings.AppleLanguages[0];

    // Android
    else if (NativeModules.I18nManager)
        locale = NativeModules.I18nManager.localeIdentifier;
    

    if (typeof locale === 'undefined') return 'en';
    
    return locale;
}

export function getGL() {
    if (gl == null) gl = getSystemLocale().slice(3, 5);
    return gl;
}

export function getHL() {
    if (hl == null) hl = getSystemLocale().slice(0, 2);
    return hl;
    
}