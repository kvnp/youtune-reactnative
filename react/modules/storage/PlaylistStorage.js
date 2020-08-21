import AsyncStorage from '@react-native-community/async-storage';

export async function getPlaylists() {
    try {
        const value = await AsyncStorage.getItem('@storage_Playlists');

        if(value !== null)
            return JSON.parse(value);
        else
            return null;
    
    } catch(e) {
        console.log("reading playlists error");
        return null;
    }
}

export async function storePlaylists(json) {
    try {
        const string = JSON.stringify(json);
        await AsyncStorage.setItem('@storage_Playlists', string);

    } catch (e) {
        console.log("saving playlists error");
    }
}