import React, { Component } from "react";
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from "react-native";

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
        const {
            style,
            minimumHeight,
            maximumHeight,
            onMinimize,
            onMaximize,
        } = this.props;
        
        return (
            <Animated.View style={[style, {height: this.state.scrollAnim}]}>
                {this.state.isMinimized
                    ?   <Pressable onPress={() => {
                                        this.scrollUp();
                                        onMaximize();
                                    }} style={stylesRest.topAlign}>
                            <View style={stylesRest.smallBar}/>
                            <Text>WIEDERGABELISTE</Text>
                        </Pressable>

                    :   null
                }

                <View style={stylesRest.playlistContainer}>

                </View>


                <Pressable  onPress={() => {
                                        this.scrollDown();
                                        onMinimize();
                                    }}

                            style={this.state.isMinimized
                                    ? {display: "none"}
                                    : stylesRest.topAlign}
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