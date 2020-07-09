import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { rippleConfig } from "../../styles/Ripple";

export default ({route, navigation}) => {
    return (
        <View style={stylesTop.mainView}>
            <View style={stylesTop.topBit}>
                <Pressable android_ripple={rippleConfig} style={stylesTop.topFirst}>
                    <MaterialIcons name="keyboard-arrow-down" color={"black"} size={30}/>
                </Pressable>
                <View style={stylesTop.topSecond}>
                    <Text style={stylesTop.topSecondTextOne}>Song</Text>
                    <Text style={stylesTop.topSecondTextTwo}>Video</Text>
                </View>

                <View style={stylesTop.topThird}>
                    <MaterialIcons name="more-vert" color={"black"} size={30}/>
                </View>
            </View>

            <View style={stylesMid.midBit}>
                <Image style={stylesMid.midImage} source={{uri: "https://lh3.googleusercontent.com/-10JdFwul4KJvn94EObz6rX2C9HoaL4EpOArwsytbDzHCvYmywz-lAaT4tvR668OmhW5qYFUvk16TkLv=w544-h544-l90-rj"}}/>
            </View>


            <View style={stylesMid.bottomBit}>

            </View>
        </View>
    )
}

const stylesMid = StyleSheet.create({
    midBit: {
        flex: 1
    },

    midImage: {
        flexGrow: 1,
        marginLeft: 50,
        marginRight: 50,
        borderRadius: 10
    },

    bottomBit: {
        backgroundColor: "red",
        flex: 1
    }
});


const stylesTop = StyleSheet.create({
    mainView: {
        paddingTop: 50,
        flex: 1
    },

    topBit: {
        alignSelf: "flex-start",
        width: "100%",
        height: 90,
        paddingLeft: 35,
        paddingRight: 35,
        flexDirection: "row"
    },

    topFirst: {
        flexGrow: 1,
        alignSelf: "flex-start",
    },

    topSecond: {
        flexGrow: 1,
        justifyContent: "space-evenly",
        flexDirection: "row",
        alignSelf: "flex-start",
        paddingBottom: 3,
        paddingTop: 3,
        backgroundColor: "brown",
        borderRadius: 25,
    },

    topSecondTextOne: {
        fontWeight: "bold",
        color: "white",
    },

    topSecondTextTwo: {
        fontWeight: "bold",
        color: "white",
    },

    topThird: {
        flexGrow: 1,
        alignItems: "flex-end",
        alignSelf: "flex-start",
    },
});