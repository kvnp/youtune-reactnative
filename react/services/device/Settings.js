import { DeviceEventEmitter } from "react-native";
import UI from "../ui/UI";
import Storage from "./storage/Storage";

export default class Settings {
    static initialized = false;
    static initialize() {
        return new Promise(async(resolve, reject) => {
            if (this.initialized)
                resolve(true);
            
            const value = await Storage.getItem("@storage_Settings");

            if (value !== null) {
                console.log(value);
                this.Values = JSON.parse(value);
                this.#emitter.emit(this.EVENT_SETTINGS, this.Values);
                this.initialized = true;
                resolve(true);
            } else {
                reject("loading failed");
            }
        });
    }

    static #emitter = DeviceEventEmitter;
    static EVENT_SETTINGS = "event-settings";

    static addListener(event, listener) {
        return this.#emitter.addListener(event, listener);
    }

    static #storeSettings() {
        console.log("storing")
        const string = JSON.stringify(this.Values);
        return Storage.setItem("@storage_Settings", string); 
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
            this.#storeSettings();
        }
    }
    
    static enableProxy(boolean) {
        if (boolean != this.Values.proxyYTM) {
            this.Values.proxyYTM = boolean;
            this.#storeSettings();
        }
    }
    
    static enableSafetyMode(boolean) {
        if (boolean != this.Values.safetyMode) {
            this.Values.safetyMode = boolean;
            this.#storeSettings();
        }
    }
    
    static enableDarkMode(boolean) {
        if (boolean != this.Values.darkMode) {
            UI.setDarkMode(boolean);
            this.Values.darkMode = boolean;
            this.#storeSettings();
        }
    }

    static setHeaderState(state) {
        if (state != this.Values.headerState) {
            console.log(state);
            this.Values.headerState = state;
            this.#storeSettings();
        }
    }
}