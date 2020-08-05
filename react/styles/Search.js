import { StyleSheet } from 'react-native';
import { appColor } from './App';

export const searchBarStyle = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: appColor.background.backgroundColor,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 3,
        paddingBottom: 3,
    },

    button: {
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "rgba(25, 25, 25, 0.5)",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderWidth: 1,
        justifyContent: "center",
        elevation: 1
    },

    input: {
        flex: 1,
        color: "white",
        alignSelf: "center",
        backgroundColor: "rgba(25, 25, 25, 0.3)",
        textAlign: "center",
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        elevation: 1
    },

    suggestion: {
        height: 50,
        width: "100%",
        backgroundColor: appColor.background.backgroundColor,
        justifyContent: "center",
        flexDirection: "row"
    },

    suggestionContainer: {
        flex: 1,
        backgroundColor: "rgba(25, 25, 25, 0.5)",
        borderRadius: 25,
        margin: 5,
        borderWidth: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
        elevation: 1
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
        flexGrow: 1,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,0.1)",
        borderWidth: .5
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