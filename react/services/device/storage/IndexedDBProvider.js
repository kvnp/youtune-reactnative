export default class IndexedDBProvider {
    static initialize() {
        return new Promise((resolve, reject) => {
            // In der folgenden Zeile sollten Sie die Präfixe einfügen, die Sie testen wollen.
            window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            // Verwenden Sie "var indexedDB = ..." NICHT außerhalb einer Funktion.
            // Ferner benötigen Sie evtl. Referenzen zu einigen window.IDB* Objekten:
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
            window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
            // (Mozilla hat diese Objekte nie mit Präfixen versehen, also brauchen wir kein window.mozIDB*)

            console.log("openDb ...");
            var req = indexedDB.open(this.#DB_NAME, this.#DB_VERSION);

            req.onupgradeneeded = evt => {
                console.log("openDb.onupgradeneeded");
                var store = evt.currentTarget.result.createObjectStore(
                    this.#DB_STORE_NAME, {keyPath: 'key'}
                );

                store.createIndex('key', 'key', { unique: true });
            };

            req.onsuccess = function(evt) {
                // Better use "this" than "req" to get the result to avoid problems with
                // garbage collection.
                // db = req.result;
                resolve(this.result);
            };

            req.onerror = function(evt) {
                console.error("openDb:", evt.target.errorCode);
                reject(evt.target.errorCode);
            };
        });
    }

    static #DB_NAME = "@storage";
    static #DB_STORE_NAME = this.#DB_NAME;
    static #DB_VERSION = 1;

    static get #initialized() {
        return this.#db !== undefined
    }

    static #db;

    static getItem(key) {
        return new Promise(async(resolve, reject) => {
            if (!this.#initialized)
                this.#db = await this.initialize();

            this.#db
                .transaction(this.#DB_NAME, "readonly")
                .objectStore(this.#DB_STORE_NAME)
                .get(key)
                .onsuccess = function(event) {
                    resolve(event.target.result.value);
                };
        });
    }

    static setItem(key, value) {
        return new Promise(async(resolve, reject) => {
            if (!this.#initialized)
                this.#db = await this.initialize();

            this.#db
                .transaction(this.#DB_NAME, "readwrite")
                .objectStore(this.#DB_STORE_NAME)
                .put({
                    key: key,
                    value: value
                })
                .onsuccess = function(event) {
                    resolve(null);
                }
        });
    }
}