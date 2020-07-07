import { StyleSheet } from 'react-native';
import { appColor } from './App';

export const bottomBarStyle = StyleSheet.create({
    container: {
        backgroundColor: appColor.background.backgroundColor,
        width: '100%',
        height: 130,
        alignSelf: 'flex-end',
        justifyContent: 'space-around',
    },

    centerContainer: {
        alignSelf: 'center',
    },

    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
    },

    topLeftPadding: {
        flexGrow: 1
    },

    closeButton: {
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 25,
        alignSelf: 'center',
    },

    closeButtonText: {
        fontSize: 15,
    },

    buttonView: {
        paddingTop: 10,
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },

    button: {
        marginRight: 10,
        paddingLeft: 13,
        paddingRight: 13,
        paddingTop: 2,
        paddingBottom: 2,
        backgroundColor: 'white',
        borderRadius: 5
    },

    buttonText: {
        fontWeight: 'bold'
    },

    artistColumn: {
        paddingRight: 40,
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },

    artistName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25
    },

    subscribeArtist: {
        alignSelf: 'baseline',
        backgroundColor: 'red',
        fontWeight: 'bold',
        marginTop: 5,
        paddingRight: 5,
        paddingLeft: 5,
        borderRadius: 5,
    },
});

export const bottomBarAlbumStyle = StyleSheet.create({
    albumCover: {
        backgroundColor: appColor.background.backgroundColor,
        height: 70,
        width: 70,
        marginRight: 30,
    },

    topColumn: {

    },

    albumTitle: {

    },

    albumSubtitle: {

    },

    albumInfo: {
        
    }
});

