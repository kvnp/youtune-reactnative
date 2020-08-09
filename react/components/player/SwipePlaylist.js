import React, { PureComponent } from "react";
import {
    Image,
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    FlatList,
    Animated
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SlidingUpPanel from 'rn-sliding-up-panel';

import { skipTo } from "../../service";
import { appColor } from "../../styles/App";

const { height } = Dimensions.get("window");
export default class SwipePlaylist extends PureComponent {
    static defaultProps = {
        draggableRange: { top: height-50, bottom: 50}
    };
  
    _draggedValue = new Animated.Value(50);
  
    render() {
        return (
            <SlidingUpPanel
                ref={(c) => (this._panel = c)}
                draggableRange={this.props.draggableRange}
                animatedValue={this._draggedValue}
                snappingPoints={[50]}
                height={height}
                friction={0.5}
            >
                <View style={styles.panel}>
                    <Pressable style={styles.panelHeader} onPress={() => this._panel.show()}>
                        <View style={stylesRest.smallBar}/>
                        <Text style={{color: "white"}}>WIEDERGABELISTE</Text>
                    </Pressable>

                    <FlatList
                        style={{backgroundColor: appColor.background.backgroundColor, height: height - 150}}
                        contentContainerStyle={stylesRest.playlistContainer}

                        data={this.props.playlist}

                        /*ListFooterComponentStyle={this.state.isMinimized ?{display: "none"} :stylesRest.topAlign}
                        ListFooterComponent={
                            <Pressable onPress={this.scrollDown}>
                                <View style={stylesRest.smallBar}/>
                            </Pressable>
                        }*/

                        keyExtractor={item => item.id}
                        renderItem={({item, index}) => 
                            <Pressable style={{
                                            height: 50,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginVertical: 5
                                        }}

                                        onPress={() => skipTo(item.id)}
                            >
                                {
                                    this.props.track.id == item.id
                                        ? <MaterialIcons style={{width: 30, textAlign: "center", textAlignVertical: "center"}} name="play-arrow" color="white" size={20}/>
                                        : <Text style={{width: 30, textAlign: "center", fontSize: 15, color: "white"}}>{index + 1}</Text>
                                }

                                <Image style={{height: 50, width: 50, marginRight: 10}} source={{uri: item.artwork}}/>

                                <View style={{width: 0, flexGrow: 1, flex: 1}}>
                                    <Text style={{color: "white"}}>{item.title}</Text>
                                    <Text style={{color: "white"}}>{item.artist}</Text>
                                </View>
                            </Pressable>
                        }
                    />
                    
                </View>
            </SlidingUpPanel>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch",
        justifyContent: "center",
        backgroundColor: appColor.background.backgroundColor,
        
    },

    panel: {
        flex: 1,
        backgroundColor: "transparent",
        position: "relative"
    },

    panelHeader: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        backgroundColor: appColor.background.backgroundColor,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },

    textHeader: {
        fontSize: 28,
        color: "#FFF"
    }
});

const stylesRest = StyleSheet.create({
    playlistContainer: {
        width: "100%",
        backgroundColor: appColor.background.backgroundColor,
        paddingHorizontal: 10,
        paddingBottom: 50
    },

    topAlign: {
        alignSelf: "center",
        marginBottom: 10
    },

    smallBar: {
        height: 4,
        width: 30,
        borderRadius: 2,
        backgroundColor: "white",
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10
    }
});