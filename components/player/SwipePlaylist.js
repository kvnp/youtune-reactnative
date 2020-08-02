import React, { Component } from "react";
import { Image, View, Text, StyleSheet, Pressable, Animated, Dimensions } from "react-native";
import TrackPlayer from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default class SwipePlaylist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMinimized: true,
            scrollAnim: new Animated.Value(this.props.minimumHeight)
        };
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
            <Animated.FlatList
                style={[{height: this.state.scrollAnim}, this.props.style]}
                contentContainerStyle={{}}

                data={this.props.playlist}

                ListHeaderComponentStyle={stylesRest.topAlign}
                ListHeaderComponent={
                    <Pressable style={{alignSelf: "center", alignItems: "center", width: "100%"}} onPress={this.scrollUp}>
                        <View style={stylesRest.smallBar}/>
                        <Text>WIEDERGABELISTE</Text>
                    </Pressable>
                }

                ListFooterComponentStyle={this.state.isMinimized ?{display: "none"} :stylesRest.topAlign}
                ListFooterComponent={
                    <Pressable onPress={this.scrollDown}>
                        <View style={stylesRest.smallBar}/>
                    </Pressable>
                }

                onRefresh={() => {}}
                refreshing={false}

                keyExtractor={item => item.id}
                contentContainerStyle={{alignSelf: "flex-end"}}
                renderItem={
                    this.state.isMinimized
                        ? null
                        : ({item, index}) => <Pressable style={
                                                    {
                                                        height: 50,
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        marginBottom: 5,
                                                        marginTop: 5
                                                    }
                                                }

                                                onPress={() => TrackPlayer.skip(item.id)}>
                                                {this.props.track.id == item.id
                                                    ? <MaterialIcons style={{width: 50, textAlign: "center"}} name="play-arrow" color="black" size={15}/>
                                                    : <Text style={{width: 50, textAlign: "center"}}>{index}</Text>
                                                }
                                                <Image style={{height: 50, width: 50}} source={{uri: item.artwork}}/>
                                                <View style={{width: 300}}>
                                                    <Text>{item.title}</Text>
                                                    <Text>{item.artist}</Text>
                                                </View>
                                            </Pressable>
                }
            />
        );
    }
}


const stylesRest = StyleSheet.create({
    playlistContainer: {height: 50, flexDirection: "row", backgroundColor: "red", width: "100%"},

    topAlign: {
        alignItems: "center",
    },

    smallBar: {
        height: 4,
        width: 30,
        borderRadius: 2,
        backgroundColor: "black",
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10
    }
});