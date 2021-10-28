export default class Device {
    static #platform;
    static Language = class Language {
        static #hl;
        static #gl;
    
        static #initialize() {
            let deviceLanguage;
            if (Device.Platform == "web")
                deviceLanguage = navigator
                    .language
                    .split("-");
    
            else if (Device.Platform == "android")
                deviceLanguage = require("react-native")
                    .NativeModules
                    .I18nManager
                    .localeIdentifier;
                
            else if (Device.Platform == "ios")
                deviceLanguage = require("react-native")
                        .NativeModules
                        .SettingsManager
                        .settings
                        .AppleLocale
                    || require("react-native")
                        .NativeModules
                        .SettingsManager
                        .settings
                        .AppleLanguages[0];
    
            else if (Device.Platform == "node")
                deviceLanguage = Intl
                    .DateTimeFormat()
                    .resolvedOptions()
                    .locale
                    .split("-");
            
            this.#hl = deviceLanguage[0];
            this.#gl = deviceLanguage[1];
        }
    
        static get GL() {
            if (!this.#gl)
                this.#initialize();
            
            return this.#gl;
        }
    
        static get HL() {
            if (!this.#hl)
                this.#initialize();
            
            return this.#hl;
        }
    };

    static #initializePlatform() {
        if ((typeof process !== 'undefined') &&
            (typeof process.versions.node !== 'undefined'))
                this.#platform = "node";
        else
                this.#platform = require("react-native")["Platform"].OS;
    }

    static get Platform() {
        if (!this.#platform)
            this.#initializePlatform();

        return this.#platform;
    }
}