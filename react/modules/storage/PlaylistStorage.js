import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getPlaylists() {
    try {
        const value = await AsyncStorage.getItem('@storage_Playlists');

        if(value !== null)
            return JSON.parse(value);
        else
            return [];
    
    } catch(e) {
        alert("Loading playlists failed");
        return [];
    }
}

export async function storePlaylists(json) {
    try {
        const string = JSON.stringify(json);
        await AsyncStorage.setItem('@storage_Playlists', string);

    } catch (e) {
        alert("Saving playlists failed");
    }
}