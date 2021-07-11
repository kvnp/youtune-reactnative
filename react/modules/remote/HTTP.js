import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { settings } from "../storage/SettingsStorage";

const url = "https://music.youtube.com/"
const partialEndpoint = "youtubei/v1/"
const parameter = "?alt=json&key="

export function getUrl(endpoint, apiKey) {
    return url + partialEndpoint + endpoint + parameter + apiKey;
}

export const getHttpResponse = (url, input, type, controllerCallback) => {
    if (Platform.OS == "web" || settings.proxyYTM) {
        if (url.split("/")[2] == "lh3.googleusercontent.com")
            url = window.location.protocol + "//" +
                  window.location.host + "/proxy/lh3/" +
                  url.split("/").slice(3).join("/");
        else
            url = window.location.protocol + "//" +
                  window.location.host + "/proxy/" +
                  url.split("/").slice(3).join("/");
    }

    if (controllerCallback) {
        let controller = new AbortController();
        let signal = controller.signal;

        input = {...input, signal};
        controllerCallback(controller);
    }

    return new Promise((resolve, reject) => {
        fetch(url, input)
            .then(response => {
                if (type == "json")
                    resolve(response.json());
                else if (type == "blob")
                    resolve(response.blob());
                else
                    resolve(response.text());
            })

            .catch(reason => {
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Request failed',
                    text2: 'Check your internet connection',
                    visibilityTime: 4000,
                    autoHide: true,
                    bottomOffset: 48,
                    onShow: () => {},
                    onHide: () => {}, // called when Toast hides (if `autoHide` was set to `true`)
                    onPress: () => {}
                });
                reject(reason);
            })
    })
}