import React, { PureComponent } from 'react';

import {
    Text,
    View
} from "react-native";

import { resultHomeStyle } from '../../styles/Home';
import { descriptionStyle } from '../../styles/Description';
import FlatAlbums from '../collections/FlatAlbums';
import FlatEntries from '../collections/FlatEntries';

export default class Shelf extends PureComponent {
    render() {
        const { title, entries, subtitle, albums, description } = this.props.shelf;

        return (
            <>
                <View style={resultHomeStyle.textView}>
                    <Text style={resultHomeStyle.homeText}>{title}</Text>
                </View>
                {description != undefined ? <Text style={descriptionStyle.text}>{description}</Text> : null}
                {subtitle != undefined || subtitle != "" ? <Text>{subtitle}</Text> : null}
                {entries != undefined ? FlatEntries(entries, this.props.navigation) : null}
                {albums != undefined ? FlatAlbums(albums, this.props.navigation) : null}
            </>
        );
    }
}