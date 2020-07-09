import React, { PureComponent } from 'react';

import {
    Text,
    FlatList,
    TouchableOpacity
} from "react-native";
import { navigatorStyle } from '../../styles/Library';

export default class LibraryNavigator extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selection: 0
        }

        global.setLibraryNavigator = (selection) => {
            if (this.state.selection != selection)
                this.setState({selection: selection});
        };
    }

    getStyle = (value) => {
        if (value == this.state.selection)
            return navigatorStyle.focus;
        else
            return navigatorStyle.entry;
    }

    getTextStyle = (value) => {
        if (value == this.state.selection)
            return navigatorStyle.focusText;
        else
            return navigatorStyle.entryText;
    }

    update = (value) => {
        if (value != this.state.selection) {
            if (value == 0)         this.props.navigation.navigate("Library", {screen: "Playlists"});
            else if (value == 1)    this.props.navigation.navigate("Library", {screen: "Albums"});
            else if (value == 2)    this.props.navigation.navigate("Library", {screen: "Songs"});
            else if (value == 3)    this.props.navigation.navigate("Library", {screen: "Artists"});
            else if (value == 4)    this.props.navigation.navigate("Library", {screen: "Subscriptions"});
            this.setState({selection: value});
        }
    };

    render() {
        const buttons = ["PLAYLISTS", "ALBUMS", "SONGS", "ARTISTS", "SUBSCRIPTIONS"];
        return <FlatList
                    data={buttons}
                    renderItem={({index, item}) => 
                        <TouchableOpacity onPress={() => {this.update(index)}} style={this.getStyle(index)}>
                            <Text style={this.getTextStyle(index)}>{item}</Text>
                        </TouchableOpacity>
                    }
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={navigatorStyle.navigator}
                    contentContainerStyle={navigatorStyle.container}
                />
    }
}