import React, { PureComponent } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { rippleConfig } from "../../styles/Ripple";
import SeekBar from "../../components/player/SeekBar";
import ButtonArray from "../../components/player/ButtonArray";

export default class PlayView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            playlist: [],
            isPlaying: false,
            isRepeating: false,
        }
    }

    render() {
        const {route, navigation} = this.props;
        const title = "Ordinary People";
        const subtitle = "John Legend";

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

                    <Pressable android_ripple={rippleConfig} style={stylesTop.topThird}>
                        <MaterialIcons name="more-vert" color={"black"} size={30}/>
                    </Pressable>
                </View>

                <View style={stylesTop.vertContainer}>
                    <View style={stylesMid.midBit}>
                        <Image style={stylesMid.midImage} source={{uri: "https://lh3.googleusercontent.com/-10JdFwul4KJvn94EObz6rX2C9HoaL4EpOArwsytbDzHCvYmywz-lAaT4tvR668OmhW5qYFUvk16TkLv=w544-h544-l90-rj"}}/>
                    </View>

                    <View style={stylesBottom.bottomBit}>
                        <View style={stylesBottom.songContainer}>
                            <Pressable android_ripple={rippleConfig}>
                                <MaterialIcons name="thumb-down" color={"black"} size={30}/>
                            </Pressable>

                            <Text style={stylesBottom.titleText}>{title}</Text>

                            <Pressable android_ripple={rippleConfig}>
                                <MaterialIcons name="thumb-up" color={"black"} size={30}/>
                            </Pressable>
                        </View>

                        <Text style={stylesBottom.subtitleText}>{subtitle}</Text>

                        <SeekBar trackLength={40} currentPosition={0} onSeek={() => {console.log("onSeek")}} onSlidingStart={() => {console.log("onSlidingStart")}}/>
                        <ButtonArray isRepeating={this.state.isRepeating}
                                     isPlaying={this.state.isPlaying}
                                     onPlay={() => this.setState({isPlaying: !this.state.isPlaying})}
                                     onPrevious={() => {}}
                                     onNext={() => {}}
                                     onShuffle={() => {}}
                                     onRepeat={() => this.setState({isRepeating: !this.state.isRepeating})}
                                     
                                     style={stylesBottom.buttonContainer}/>
                    </View>
                </View>

                <View style={stylesRest.container}>
                    <View style={stylesRest.smallBar}/>
                    <Text>WIEDERGABELISTE</Text>
                </View>
            </View>
        )
    }
}

const stylesRest = StyleSheet.create({
    container: {
        alignSelf: "flex-end",
        backgroundColor: "darkgray",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        paddingBottom: 10,
        alignItems: "center",
    },

    smallBar: {
        height: 4,
        width: 30,
        borderRadius: 2,
        backgroundColor: "black",
        marginTop: 10,
        marginBottom: 10
    }
});

const stylesBottom = StyleSheet.create({
    bottomBit: {
        paddingTop: 20,
        flexGrow: 1,
        flex: 1,
    },

    songContainer: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    subtitleText: {
        paddingTop: 5,
        alignSelf: "center"
    },

    titleText: {
        fontSize: 25,
        fontWeight: "bold"
    },

    buttonContainer: {
        paddingTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
});

const stylesMid = StyleSheet.create({
    midBit: {
        flex: 1
    },

    midImage: {
        flexGrow: 1,
        borderRadius: 10
    }
});


const stylesTop = StyleSheet.create({
    mainView: {
        paddingTop: 50,
        flex: 1
    },

    topBit: {
        height: 90,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginRight: -25,
        marginLeft: -25,
        marginTop: -30,
    },

    topSecond: {
        flexDirection: "row",
        backgroundColor: "brown",
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        paddingTop: 5,
        borderRadius: 25,
    },

    topSecondTextOne: {
        fontWeight: "bold",
        color: "white",
        paddingLeft: 15,
        paddingRight: 15,
    },

    topSecondTextTwo: {
        fontWeight: "bold",
        color: "white",
        paddingLeft: 15,
        paddingRight: 15,
    },

    vertContainer: {
        flex: 1,
        marginLeft: 50,
        marginRight: 50,
    }
});