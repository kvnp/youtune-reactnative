import { DeviceEventEmitter } from "react-native";
import Media from "../api/Media";
import UI from "../ui/UI";
import IO from "./IO";
import Storage from "./storage/Storage";

export default class Settings {
    static initialized = false;
    static initialize() {
        return new Promise(async(resolve, reject) => {
            if (this.initialized)
                return resolve(true);

            let keys = Object.keys(this.Values);
            for (let i = 0; i < keys.length; i++) {
                let result = await Storage.getItem("Settings", keys[i]);
                if (result !== undefined && result !== null) {
                    this.Values[keys[i]] = result.value;
                }
            }
            
            resolve(true);
        });
    }

    static #emitter = DeviceEventEmitter;
    static EVENT_SETTINGS = "event-settings";

    static addListener(event, listener) {
        return this.#emitter.addListener(event, listener);
    }

    static #storeSetting(key) {
        let data = {
            setting: key,
            value: this.Values[key]
        };
        return Storage.setItem("Settings", data);
    }

    static Values = {
        transmitLanguage: false,
        proxyYTM: false,
        safetyMode: true,
        darkMode: true,
        headerState: null
    }

    static enableLanguageTransmission(boolean) {
        if (boolean != this.Values.transmitLanguage) {
            this.Values.transmitLanguage = boolean;
            this.#storeSetting("transmitLanguage");
        }
    }
    
    static enableProxy(boolean) {
        if (boolean != this.Values.proxyYTM) {
            this.Values.proxyYTM = boolean;
            this.#storeSetting("proxyYTM");
        }
    }
    
    static enableSafetyMode(boolean) {
        if (boolean != this.Values.safetyMode) {
            this.Values.safetyMode = boolean;
            this.#storeSetting("safetyMode");
        }
    }
    
    static enableDarkMode(boolean) {
        if (boolean != this.Values.darkMode) {
            UI.setDarkMode(boolean);
            this.Values.darkMode = boolean;
            this.#storeSetting("darkMode");
        }
    }

    static setHeaderState(state) {
        if (this.Values.headerState != state) {
            if (IO.isBlob(state.source.uri)) {
                this.#storeSetting("headerState");

            } else {
                Media.getBlob({url: state.source.uri})
                    .then(result => {
                        state.source.uri = result;
                        this.Values.headerState = state;
                        this.#storeSetting("headerState");
                    });
            }
        }   
    }
}