import React, { PureComponent } from "react";
import {
    View,
    ScrollView,
    Text,
    ImageBackground,
    TouchableOpacity
} from "react-native";

import Shelf from "../../components/shared/Shelf";
import LinearGradient from "react-native-linear-gradient";
import { bottomBarStyle } from "../../styles/Artist";

export default class ArtistView extends PureComponent {
    getShelf = (shelf) => {
        return <Shelf navigation={this.props.navigation} shelf={shelf}/>
    }

    render() {
        const { shelves } = this.props.route.params;
        const { title, subscriptions, thumbnail } = this.props.route.params.header;

        return (
            <>
                <ScrollView>
                    {shelves.map(this.getShelf)}
                </ScrollView>
                <ImageBackground style={bottomBarStyle.container} source={{uri: thumbnail}}>
                    <LinearGradient style={{width: '100%', height: '100%'}} colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.6)']}>
                        <View style={bottomBarStyle.centerContainer}>
                            <View style={bottomBarStyle.topRow}>
                                <View style={bottomBarStyle.topLeftPadding}/>
                                <View style={bottomBarStyle.artistColumn}>
                                    <Text style={bottomBarStyle.artistName}>{title}</Text>
                                    <TouchableOpacity>
                                        <Text style={bottomBarStyle.subscribeArtist}>ABONNIEREN {subscriptions}</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={bottomBarStyle.closeButton}
                                                onPress={() => {this.props.navigation.pop()}}>
                                    <Text style={[bottomBarStyle.buttonText, bottomBarStyle.closeButtonText]}>X</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={bottomBarStyle.buttonView}>
                                <TouchableOpacity style={bottomBarStyle.button}>
                                    <Text style={bottomBarStyle.buttonText}>WIEDERGEBEN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={bottomBarStyle.button}>
                                    <Text style={bottomBarStyle.buttonText}>ZUR MEDIATHEK</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={bottomBarStyle.button}>
                                    <Text style={bottomBarStyle.buttonText}>TEILEN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </>
        )
    }
}