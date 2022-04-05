import Settings from "./Settings";

export default class Device {
    static #platform;
    static Language = class Language {
        static #hl;
        static #gl;
    
        static #initialize() {
            let deviceLanguage;
            if (Device.Platform == "web") {
                deviceLanguage = (navigator.language || navigator.userLanguage).split("-")

                if (deviceLanguage.length == 1)
                    if (navigator.languages.length > 1)
                        if (navigator.languages[1].includes("-"))
                            deviceLanguage.push(navigator.languages[1].split("-")[1]);
    
            } else if (Device.Platform == "android")
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

            if (Settings.Values.transmitLanguage)
                return this.#gl;
        }
    
        static get HL() {
            if (!this.#hl)
                this.#initialize();
            
            if (Settings.Values.transmitLanguage)
                return this.#hl;
        }
    };

    static #initializePlatform() {
        if (typeof process !== 'undefined')
            if (process.hasOwnProperty("versions"))
                if (process.versions.node)
                    return this.#platform = "node";
        
        this.#platform = require("react-native")["Platform"].OS;
    }

    static get Platform() {
        if (!this.#platform)
            this.#initializePlatform();

        return this.#platform;
    }
}