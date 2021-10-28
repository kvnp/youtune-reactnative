import AsyncStorage from "@react-native-async-storage/async-storage";

export default class AsyncStorageProvider {
    static getItem(key) {
        return new Promise(async(resolve, reject) => {
            const value = await AsyncStorage.getItem(`@storage_${key}`);

            if (value !== null)
                resolve(JSON.parse(value));
            else
                resolve(null);
        });
    }

    static setItem(key, value) {
        const string = JSON.stringify(value);
        return AsyncStorage.setItem(`@storage_${key}`, string);
    }
}