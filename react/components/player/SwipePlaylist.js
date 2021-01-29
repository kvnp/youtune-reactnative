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
import { rippleConfig } from "../../styles/Ripple";

const { height } = Dimensions.get("window");
export default class SwipePlaylist extends PureComponent {
    static defaultProps = {
        draggableRange: { top: height - 50, bottom: 50}
    };
  
    _draggedValue = new Animated.Value(50);
  
    render() {
        return (
            <SlidingUpPanel
                ref={c => (this._panel = c)}
                draggableRange={this.props.draggableRange}
                animatedValue={this._draggedValue}
                snappingPoints={[51]}
                height={height}
                friction={0.5}
            >
                <View style={styles.panel}>
                    <Pressable android_ripple={rippleConfig} style={[styles.panelHeader, {backgroundColor: this.props.backgroundColor}]} onPress={() => this._panel.show()}>
                        <View style={[stylesRest.smallBar, {backgroundColor: this.props.textColor}]}/>
                        <Text style={{color: this.props.textColor}}>PLAYLIST</Text>
                    </Pressable>

                    <FlatList
                        style={{height: height - 150}}
                        contentContainerStyle={[stylesRest.playlistContainer, {backgroundColor: this.props.backgroundColor}]}

                        data={this.props.playlist}

                        keyExtractor={item => item.id}
                        renderItem={({item, index}) =>
                            <Pressable android_ripple={rippleConfig}
                                        style={{
                                            height: 50,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginVertical: 5
                                        }}

                                        onPress={() => skipTo(item.id)}
                            >
                                {
                                    this.props.track != null
                                        ? this.props.track.id == item.id
                                            ? <MaterialIcons style={{width: 30, textAlign: "center", textAlignVertical: "center"}} name="play-arrow" color={this.props.textColor} size={20}/>
                                            : <Text style={{width: 30, textAlign: "center", fontSize: 15, color: this.props.textColor}}>{index + 1}</Text>

                                        : <Text style={{width: 30, textAlign: "center", fontSize: 15, color: this.props.textColor}}>{index + 1}</Text>

                                        
                                        
                                }

                                <Image style={{height: 50, width: 50, marginRight: 10}} source={{uri: item.artwork}}/>

                                <View style={{width: 0, flexGrow: 1, flex: 1}}>
                                    <Text style={{color: this.props.textColor}} numberOfLines={2}>{item.title}</Text>
                                    <Text style={{color: this.props.textColor}} numberOfLines={1}>{item.artist}</Text>
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
        justifyContent: "center"
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
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 10
    },

    textHeader: {
        fontSize: 28,
        color: "#FFF"
    }
});

const stylesRest = StyleSheet.create({
    playlistContainer: {
        width: "100%",
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
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10
    }
});