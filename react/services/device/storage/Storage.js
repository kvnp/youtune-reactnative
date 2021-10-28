import Device from "../Device";

export default class Storage {
    static #Provider = (() => {
        if (Device.Platform == "web")
            return require("./IndexedDBProvider").default;
        else if (Device.Platform == "node")
            return require("./FSProvider").default;
        else
            return require("./AsyncStorageProvider").default;
    })();

    static setItem(key, value) {
        return this.#Provider.setItem(key, value);
    }

    static getItem(key) {
        return this.#Provider.getItem(key);
    }
}