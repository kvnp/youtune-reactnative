import React, { Component } from "react";
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default class SwipePlaylist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMinimized: true,
            scrollAnim: new Animated.Value(this.props.minimumHeight)
        }
    }

    scrollUp = () => {
        Animated.timing(this.state.scrollAnim, {
            toValue: Dimensions.get('window').height - 50,
            duration: 150,
            useNativeDriver: false
        }).start(({finished}) => {
            this.setState({isMinimized: false});
        });
      };
    
    scrollDown = () => {
        Animated.timing(this.state.scrollAnim, {
            toValue: this.props.minimumHeight,
            duration: 150,
            useNativeDriver: false
        }).start(({finished}) => {
                this.setState({isMinimized: true});
        });
    };


    render() {
        return (
            <Animated.View style={[this.props.style, {height: this.state.scrollAnim}]}>
                <Pressable onPress={this.scrollUp} style={this.state.isMinimized ?stylesRest.topAlign :{ display: "none"}}>
                    <View style={stylesRest.smallBar}/>
                    <Text>WIEDERGABELISTE</Text>
                </Pressable>

                <FlatList
                    style={stylesRest.playlistContainer}

                />

                


                <Pressable
                    onPress={this.scrollDown}
                    
                    style={
                        this.state.isMinimized
                            ? { display: "none" }
                            : stylesRest.topAlign
                    }
                >
                    <Text>WIEDERGABELISTE</Text>
                    <View style={stylesRest.smallBar}/>
                </Pressable>
            </Animated.View>
        );
    }
}


const stylesRest = StyleSheet.create({
    playlistContainer: {
        flex: 1
    },

    topAlign: {
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