import { StyleSheet } from 'react-native';
import { appColor } from './App';

export const searchBarStyle = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: appColor.background.backgroundColor,
        paddingHorizontal: 20,
        paddingVertical: 3,
        height: 50
    },

    button: {
        width: 60,
        height: 45,
        backgroundColor: "rgba(25, 25, 25, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 1
    },

    input: {
        height: 45,
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
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,0.1)",
        borderWidth: .5
    },

    resultCover: {
        width: 45,
        height: 45,
        //aspectRatio: 1
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
        backgroundColor: appColor.background.backgroundColor,
        marginHorizontal: "auto",
        alignSelf: "center"
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
        alignSelf: 'center',
    },
});