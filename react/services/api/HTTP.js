import Device from "../device/Device";
import IO from "../device/IO";

export default class HTTP {
    static Headers = class Headers {
        get Simple() {
            return {
                "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0"
            };
        }
    
        get Referer() {
            return {
                "Referer":      "https://music.youtube.com/",
                "Content-Type": "application/json"
            };
        }
    }

    static Type = class Type {
        static get Text() {
            return "text";
        }

        static get Blob() {
            return "blob";
        }

        static get Json() {
            return "json";
        }
    }

    static Method = class Method {
        static get GET() {
            return "GET";
        }

        static get POST() {
            return "POST";
        }
    }

    static #getProxyUrl(url) {
        if (!url.startsWith("http"))
            return url;

        if (url.includes(window.location.hostname))
            return url;

        if (url.split("/")[2] == "lh3.googleusercontent.com")
            return window.location.protocol + "//" +
                  window.location.host + "/proxy/lh3/" +
                  url.split("/").slice(3).join("/");
        else
            return window.location.protocol + "//" +
                  window.location.host + "/proxy/" +
                  url.split("/").slice(3).join("/");
    }

    static getResponse(url, input, type, controllerCallback) {
        //TODO implement custom proxy setting
        //Settings.forceProxy
        if (Device.Platform == "web")
            url = this.#getProxyUrl(url);
        
        if (Device.Platform == "node")
            return this.#nodeFetch(url, input, type);

        return this.#fetch(url, input, type, controllerCallback);
    }

    static #fetch(url, input, type, controllerCallback) {
        if (controllerCallback) {
            let controller = new AbortController();
            let signal = controller.signal;
    
            input = {...input, signal};
            controllerCallback(controller);
        }
        
        return new Promise((resolve, reject) => {
            fetch(url, input)
                .then(response => {
                    if (type == HTTP.Type.Json)
                        resolve(response.json());
                    else if (type == HTTP.Type.Blob)
                        resolve(response.blob());
                    else
                        resolve(response.text());
                })

                .catch(reason => {
                    reject(reason);
                })
        });
    }

    static #nodeFetch(url, input, type) {
        return new Promise((resolve, reject) => {
            reject("not implemented yet");
        });
    }
}