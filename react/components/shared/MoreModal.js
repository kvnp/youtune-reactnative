import React, { PureComponent } from "react";
import {
    Modal,
    Pressable,
    View,
    Text,
    Image,
    StyleSheet
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { appColor } from "../../styles/App";

export default class MoreModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalContent: {
                title: null,
                subtitle: null,
                thumbnail: null
            }
        }

        global.showModal = content => {
            this.setModalVisible(true, content);
        }
    }

    setModalVisible = (
        boolean,
        content = {title: null, subtitle: null, thumbnail: null}
    ) => {
        this.setState({
            modalVisible: boolean,
            modalContent: content
        });
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.setModalVisible(false)}
                onDismiss={() => this.setModalVisible(false)}

                hardwareAccelerated={true}
            >
                <Pressable onPress={() => this.setModalVisible(false)} style={{height: "100%", width: "100%", justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.3)"}}>
                    <Pressable style={{paddingHorizontal: 10}}>
                        <View style={modalStyles.header}>
                            <Image source={{uri: this.state.modalContent.thumbnail}} style={modalStyles.thumbnail}/>
                            <View style={modalStyles.headerText}>
                                <Text numberOfLines={1} style={{}}>{this.state.modalContent.title}</Text>
                                <Text numberOfLines={1} style={{}}>{this.state.modalContent.subtitle}</Text>
                            </View>
                            <View style={{width: 120, height: 50, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                                <View style={{width: 50, height: 50, alignItems: "center", justifyContent: "center"}}>
                                    <Pressable onPress={() => {}} android_ripple={{color: "darkgray", borderless: true}}>
                                        <MaterialIcons name="thumb-down" color="black" size={25}/>
                                    </Pressable>
                                </View>
                                <View style={{width: 50, height: 50, alignItems: "center", justifyContent: "center"}}>
                                    <Pressable onPress={() => {}} android_ripple={{color: "darkgray", borderless: true}}>
                                        <MaterialIcons name="thumb-up" color="black" size={25}/>
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        <View style={modalStyles.entryView}>
                        <Pressable onPress={() => {}} style={modalStyles.entry} android_ripple={{color: "gray"}}>
                            <MaterialIcons name="play-arrow" color="black" size={25}/>
                            <Text style={{paddingLeft: 20}}>Play</Text>
                        </Pressable>
                        </View>
                        
                        <View style={modalStyles.entryView}>
                        <Pressable onPress={() => {}} style={modalStyles.entry} android_ripple={{color: "gray"}}>
                            <MaterialIcons name="get-app" color="black" size={25}/>
                            <Text style={{paddingLeft: 20}}>Download</Text>
                        </Pressable>
                        </View>

                        <View style={modalStyles.entryView}>
                        <Pressable onPress={() => {}} style={modalStyles.entry} android_ripple={{color: "gray"}}>
                            <MaterialIcons name="playlist-add" color="black" size={25}/>
                            <Text style={{paddingLeft: 20}}>Add to playlist</Text>
                        </Pressable>
                        </View>

                        <View style={modalStyles.entryView}>
                        <Pressable onPress={() => {}} style={modalStyles.entry} android_ripple={{color: "gray"}}>
                            <MaterialIcons name="share" color="black" size={25}/>
                            <Text style={{paddingLeft: 20}}>Share</Text>
                        </Pressable>
                        </View>

                        <View style={modalStyles.entryView}>

                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        );
    }
}

const modalStyles = StyleSheet.create({
    header: {
        flexDirection: "row",
        borderBottomWidth: 1,
        height: 70,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        width: "100%",
        backgroundColor: "gray",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },

    headerText: {
        overflow: "hidden",
        width: 140,
    },

    thumbnail: {
        backgroundColor: appColor.background.backgroundColor,
        height: 50,
        aspectRatio: 1
    },

    entry: {
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 50,
        height: 50,
        backgroundColor: "darkgray",
    },

    entryView: {
        height: 50,
    }
});