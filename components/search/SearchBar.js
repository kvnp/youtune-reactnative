import React, { PureComponent } from 'react';

import {
    Button,
    Text,
    TextInput,
    View,
    Keyboard,
    TouchableOpacity
} from "react-native";

import { fetchResults } from '../../modules/API';

import { searchBarStyle, specificStyle } from '../../styles/Search';
import { textStyle } from '../../styles/App';

export default class SearchBar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            query: null,
            buttonDisabled: true,
            results: null
        };
    }

    setQuery = (event) => {
        if (event.nativeEvent.text.length > 0)
            this.setState({query: event.nativeEvent.text,
                           buttonDisabled: false});
        else
            this.setState({query: event.nativeEvent.text,
                           buttonDisabled: true});
    }

    search = () => {
        Keyboard.dismiss();
        if (this.state.query.length > 0) {
            let icon = '|';
            this.props.sendIcon(icon);
            let loader = setInterval(() => {
                switch (icon) {
                    case '|' :
                        icon = '/';
                        return this.props.sendIcon(icon);
                    case '/' :
                        icon = '-';
                        return this.props.sendIcon(icon);
                    case '-' :
                        icon = '\\';
                        return this.props.sendIcon(icon);
                    case '\\':
                        icon = '|';
                        return this.props.sendIcon(icon);
                }
            }, 300);

            this.setState({buttonDisabled: true});
            fetchResults(this.state.query)
                .then(data => { clearInterval(loader);
                                this.props.sendIcon('🔎');
                                this.setState({results: data});
                                this.props.resultSender(data);
                               });
        }
    }

    getSpecificButtons = () => {
        if (this.state.results != null)
            return (
                <View style={specificStyle.container}>
                    <TouchableOpacity style={specificStyle.button}>
                        <Text style={specificStyle.text}>
                            Videos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={specificStyle.button}>
                        <Text style={specificStyle.text}>
                            Playlists
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={specificStyle.button}>
                        <Text style={specificStyle.text}>
                            Songs
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={specificStyle.button}>
                        <Text style={specificStyle.text}>
                            Künstler
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={specificStyle.button}>
                        <Text style={specificStyle.text}>
                            Alben
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        else return null;
    }

    render() {
        return (
            <View style={[searchBarStyle.container, this.props.style]}>
                {this.getSpecificButtons()}
                <TextInput style={[searchBarStyle.content, textStyle.text]}
                        placeholder="Suchen"
                        placeholderTextColor={textStyle.placeholder.color}
                        onChange={this.setQuery}
                        onSubmitEditing={this.search}/>

                <View style={searchBarStyle.content}>
                    <Button onPress={this.search}
                            title='🔎'
                            disabled={this.state.buttonDisabled}/>
                </View>
            </View>
        )
    }
}