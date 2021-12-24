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

            if (IDBTransaction != undefined) {
                if (IDBTransaction.READ_WRITE != undefined) {
                    this.#read_write = IDBTransaction.READ_WRITE;
                }

                if (IDBTransaction.READ_ONLY != undefined) {
                    this.#read_only = IDBTransaction.READ_ONLY;
                }
            }

            console.log("openDb ...");
            var req = indexedDB.open(this.#DB_NAME, 1);

            req.onupgradeneeded = evt => {
                console.log("openDb.onupgradeneeded");

                var result = evt.currentTarget.result;
                var settings = result.createObjectStore("Settings", { keyPath: "setting" });
                settings.createIndex('setting', 'setting', { unique: true });

                var artists = result.createObjectStore("Artists", { keyPath: "channelId" });
                artists.createIndex("channelId", "channelId", { unique: true });

                var playlists = result.createObjectStore("Playlists", { keyPath: "playlistId" });
                playlists.createIndex("playlistId", "playlistId", { unique: true });
                playlists.createIndex("channelId", "channelId", { unique: false });

                var songs = result.createObjectStore("Tracks", { keyPath: "videoId" });
                songs.createIndex("videoId", "videoId", { unique: true });
                songs.createIndex("playlistId", "playlistId", { unique: false });
                songs.createIndex("channelId", "channelId", { unique: false });

                var downloads = result.createObjectStore("Downloads", { keyPath: "videoId" });
                downloads.createIndex("videoId", "videoId", { unique: true });

                var likes = result.createObjectStore("Likes", {keyPath: "videoId"});
                likes.createIndex("videoId", "videoId", { unique: true });
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

    static get #initialized() {
        return this.#db !== undefined
    }

    static #DB_NAME = "youtune-storage";
    static #read_write = "readwrite";
    static #read_only = "readonly";
    static #db;

    static getItem(storeName, key) {
        return new Promise(async(resolve, reject) => {
            if (!this.#initialized)
                this.#db = await this.initialize();

            try {
                this.#db
                    .transaction(storeName, this.#read_only)
                    .objectStore(storeName)
                    .get(key)
                    .onsuccess = function(event) {
                        resolve(event.target.result);
                    };
            } catch (_) {
                this.#db = await this.initialize();
            }
        });
    }

    static setItem(storeName, data) {
        return new Promise(async(resolve, reject) => {
            if (!this.#initialized)
                this.#db = await this.initialize();

            try {
                this.#db
                    .transaction(storeName, this.#read_write)
                    .objectStore(storeName)
                    .put(data)
                    .onsuccess = function(event) {
                        resolve(true);
                    };
            } catch (_) {
                this.#db = await this.initialize();
            }
            
        });
    }

    static deleteItem(storeName, key) {
        return new Promise(async(resolve, reject) => {
            if (!this.#initialized)
                this.#db = await this.initialize();

            try {
                this.#db
                    .transaction(storeName, this.#read_write)
                    .objectStore(storeName)
                    .delete(key)
                    .onsuccess = function(event) {
                        resolve(true);
                    };
            } catch (_) {
                this.#db = await this.initialize();
            }
            
        });
    }

    static getAllKeys(storeName) {
        return new Promise(async(resolve, reject) => {
            if (!this.#initialized)
                this.#db = await this.initialize();
            
            try {
                this.#db
                    .transaction(storeName, this.#read_only)
                    .objectStore(storeName)
                    .getAllKeys()
                    .onsuccess = function(event) {
                        resolve(event.target.result);
                    }
            } catch (_) {
                this.#db = await this.initialize();
            }
        });
    }
}