import Device from "../device/Device";
import HTTP from "./HTTP";

export default class API {
    static RequestBody = class RequestBody {
        static get WEB() {
            return {
                context: {
                    client: {
                        clientName: "WEB_REMIX",
                        clientVersion: "1.20210630.00.00",
                        //TODO implement disable/enable language settings
                        gl: Device.Language.GL,
                        hl: Device.Language.HL
                    }
                }
            }
        }
    
        static get STREAM() {
            return {
                context: {
                    client: {
                        clientName: "ANDROID",
                        clientVersion: "16.02",
                        //TODO implement disable/enable language settings
                        gl: Device.Language.GL,
                        hl: Device.Language.HL
                    }
                }
            }
        }
    }
    
    static URL = class URL {
        static Main = "https://music.youtube.com";
        static #Gapis = "https://youtubei.googleapis.com"
    
        static #Endpoint = "/youtubei/v1/";
        static #Parameter = "?alt=json&key="
    
        static #Search = "search";
        static #Suggestion = "get_search_suggestions";
        static #Browse = "browse";
        static #Next = "next";
        static #Audio = "player";
    
        static get Search() {
            return this.Main + this.#Endpoint +
                this.#Search + this.#Parameter + API.Key
        }
    
        static get Suggestion() {
            return this.Main + this.#Endpoint +
                this.#Suggestion + this.#Parameter + API.Key
        }
    
        static get Browse() {
            return this.Main + this.#Endpoint +
                this.#Browse + this.#Parameter + API.Key
        }
    
        static get Next() {
            return this.Main + this.#Endpoint +
                this.#Next + this.#Parameter + API.Key
        }
    
        static get Audio() {
            return this.Main + this.#Endpoint +
                this.#Audio + this.#Parameter + API.Key
        }
    
        static get Stream() {
            return this.#Gapis + this.#Endpoint +
                this.#Audio + this.#Parameter + API.Key
        }
    };

    static initialized = false;
    static get Key() {
        if (!this.initialized)
            throw new Error("API needs to be initialized");

        return this
            .WEB_PLAYER_CONTEXT_CONFIGS
            .WEB_PLAYER_CONTEXT_CONFIG_ID_MUSIC_WATCH
            .innertubeApiKey;
    }

    static initialize(initialPath) {
        return new Promise((resolve, reject) => {
            if (this.initialized)
                return resolve(false);

            if (!initialPath)
                initialPath = "";

            let url = API.URL.Main + initialPath;
            let input = {
                method: HTTP.Method.GET,
                headers: HTTP.Headers.Simple
            };
            let type = HTTP.Type.Text;

            HTTP.getResponse(url, input, type)
                .then(response => {
                    this.#populate(response);
                    this.initialized = true;
                    resolve(true);
                })

                .catch(reason => {
                    reject(reason);
                });
        });
    }

    static #populate(html) {
        let ytcfg = {set: object => {
            for (let key of Object.keys(object)) {
                this[key] = object[key];
                
                if (key == "YTMUSIC_INITIAL_DATA") {
                    this[key].map((element, index) =>
                        this[key][index].data = JSON.parse(element.data)
                    );
                }
            }
        }};

        let setMessage = msgs => this.MESSAGES = msgs;
        let initialData = [];
        this.initialData = initialData;

        while (html.includes("<script")) {
            html = html.slice(html.indexOf("<script"));

            let part = html.slice(html.indexOf(">"), html.indexOf("</"));
            while (part.includes("initialData.push(")) {
                let dataOne = part.indexOf("initialData.push(");
                let dataTwo = part.indexOf(");") + 2;
                let slice = part.slice(dataOne, dataTwo);
                eval(slice);
                part = part.slice(dataTwo);
            }

            if (part.includes("ytcfg.set(")) {
                let yOne = part.indexOf("ytcfg.set(") + 10;
                part = part.slice(yOne);
                let yTwo = part.indexOf("</");
            
                let slice = part.slice(0, yTwo).replace(",}", "}").replace(/\'/g, '"');
                
                if (slice.includes(");"))
                    slice = slice.slice(0, slice.indexOf(");"));

                try {
                    if (slice[slice.length - 1] == ")")
                        slice = slice.slice(0, slice.length - 1);

                    if (slice.includes("initialData"))
                        slice = slice.replace("initialData", JSON.stringify(initialData));
                    
                    ytcfg.set(JSON.parse(slice));
                } catch (e) {
                    console.log(e);
                }
            }
            
            if (part.includes("setMessage(")) {
                part = part.slice(part.indexOf("setMessage(") + 11);
                part = part.slice(0, part.indexOf(");"));
                setMessage(JSON.parse(part));
            }

            html = html.slice(html.indexOf("</"));
        }
    }

    static getInitialData() {
        return new Promise(async(resolve, reject) => {
            if (!API.initialized)
                await API.initialize();

            console.log(API.YTMUSIC_INITIAL_DATA);

            for (let i = 0; i < API.YTMUSIC_INITIAL_DATA.length; i++) {
                if ("/browse" == API.YTMUSIC_INITIAL_DATA[i].path) {
                    resolve(API.YTMUSIC_INITIAL_DATA[i].data);
                }
            }
        })
    }
}