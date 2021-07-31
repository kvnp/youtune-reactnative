import React, { useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";

const ScrollingText = ({children, style, maxWidth}) => {
    const [overflown, setOverflown] = useState(false);

    const valueAnimation = useRef(new Animated.Value(0)).current;
    var valueInterpolation = valueAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
        useNativeDriver: true
    });

    const animation = Animated.timing(
        valueAnimation,
        {
            toValue: 1,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: true
        }
    );

    const runAnimation = () => {
        if (!overflown) {
            setOverflown(true);
            animation.start(() => {
                valueAnimation.setValue(-1);
                runAnimation();
            });
        }
    }

    const stopAnimation = () => {
        if (overflown) {
            animation.stop();
            animation.reset();
            valueAnimation.setValue(0);
            setOverflown(false);
        }
    }

    return <View style={[{overflow: "hidden"}, style]}>
        <Animated.ScrollView
            /*onLayout={e => {
                let width = e.nativeEvent.layout.width;
                
                if (width > maxWidth)
                    runAnimation();
                else
                    stopAnimation();
            }}*/
            onContentSizeChange={(width, height) => {
                if (width > maxWidth)
                    runAnimation();
                else
                    stopAnimation();
            }}
            
            style={{transform: [{translateX: overflown ? valueInterpolation : 0}]}}
        >
            {children}
        </Animated.ScrollView>
    </View>;
}

export default ScrollingText;