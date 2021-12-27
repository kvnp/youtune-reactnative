import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button } from "react-native-paper"
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Cast from "../../services/music/Cast";

export default CastButton = () => {
    const {colors} = useTheme();
    const [state, setState] = useState({
        connected: false, connecting: false
    });

    useEffect(() => {
        const castListener = Cast.addListener(Cast.EVENT_CAST, e => {
            if (e.castState == "NOT_CONNECTED") {
                setState({connected: false, connecting: false});
            } else if (e.castState == "CONNECTED") {
                setState({connected: true, connecting: false});
            } else if (e.castState == "CONNECTING") {
                setState({connected: false, connecting: true});
            }
        });

        return () => castListener.remove();
    }, []);

    return <Button
        onPress={() => {
            if (!state.connected)
                Cast.cast();
            else
                Cast.disconnect();
        }}
        labelStyle={{marginHorizontal: 0}}
        style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
    >
        <MaterialIcons
            name={state.connected ? "cast-connected" : "cast"}
            style={{alignSelf: "center"}}
            selectable={false} 
            color={state.connecting ? "blue" : colors.text}
            size={30}
        />
    </Button>
}