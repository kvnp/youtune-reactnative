import { DeviceEventEmitter, StatusBar } from "react-native";
import { enableScreens } from "react-native-screens";

import Settings from "../device/Settings";
import Music from "../music/Music";

export default class UI {
    static #emitter = DeviceEventEmitter;
    static EVENT_DARK = "event-dark";
    static EVENT_HEADER = "event-header";

    static initialize = () => {
        enableScreens(true);
        Music.initialize();
        Settings.initialize().then(() => {
            UI.setDarkMode(Settings.Values.darkMode);
            UI.setHeader({url: Settings.Values.headerState.source.uri});
        });
        
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor("transparent", true);
    }

    static setDarkMode = boolean => {
        StatusBar.setBarStyle(
            boolean ? "light-content" : "dark-content",
            true
        );

        UI.#emitter.emit(UI.EVENT_DARK, boolean);
    };

    static Header = {
        source: null
    };

    static setHeader = ({url}) => {
        let state = {};
        if (url != undefined)               state.source = {uri: url};
        else if (UI.Header.source != null)  state.source = UI.Header.source;

        UI.Header = state;
        UI.#emitter.emit(UI.EVENT_HEADER, state);
        Settings.setHeaderState(state);
    }

    static addListener(event, listener) {
        return UI.#emitter.addListener(event, listener);
    }
}