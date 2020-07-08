import { StyleSheet } from 'react-native';
import { appColor } from './App';

export const searchBarStyle = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center'
    },

    bar: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        backgroundColor: appColor.background.backgroundColor
    },

    content: {
        marginBottom: 5,
        width: '80%'
    }
});

export const topicStyle = StyleSheet.create({
    topicView: {
        paddingTop: 20,
        width: '100%'
    },

    topicHeader: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 50
    },
});

export const resultStyle = StyleSheet.create({
    scrollMargin: {
        marginBottom: 93
    },

    resultHeader: {
        marginTop: 10,
        fontSize: 30,
        fontWeight: 'bold'
    },

    resultView: {
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: 'gray',
        alignItems: 'center'
    },

    resultCover: {
        width: 50,
        height: 50
    },

    resultColumnOne: {
        paddingLeft: 10,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },

    resultColumnTwo: {
        paddingLeft: 10,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },

    resultText: {
        color: 'white'
    }
});

export const searchStyle = StyleSheet.create({
    preResults: {
        fontSize: 70,
        alignSelf: 'center'
    },

    emptyView: {
        marginBottom: -20
    }
});

export const specificStyle = StyleSheet.create({
    container: {
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: 'row',
        width: '80%',
        backgroundColor: 'transparent'
    },

    button: {
        backgroundColor: 'transparent',
        flexGrow: 1,
        height: 30,
        borderRadius: 75,
        marginLeft: 2,
        marginRight: 2,
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1.5
    },

    text: {
        color: 'black',
        alignSelf: 'center',
    },
});