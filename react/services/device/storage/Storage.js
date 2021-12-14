import Device from "../Device";

export default class Storage {
    static #Provider = (() => {
        if (Device.Platform == "web")
            return require("./provider/IndexedDBProvider").default;
        else if (Device.Platform == "node")
            return require("./provider/FSProvider").default;
        else
            return require("./provider/AsyncStorageProvider").default;
    })();

    static setItem(storeName, data) {
        return this.#Provider.setItem(storeName, data);
    }

    static getItem(storeName, key) {
        return this.#Provider.getItem(storeName, key);
    }

    static deleteItem(storeName, key) {
        return this.#Provider.deleteItem(storeName, key);
    }

    static getAllKeys(storeName) {
        return this.#Provider.getAllKeys(storeName);
    }
}