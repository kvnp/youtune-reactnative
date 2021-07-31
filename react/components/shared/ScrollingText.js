import React, { useRef, useState, useEffect } from "react";
import { Animated, Easing, View } from "react-native";

const ScrollingText = ({children, style}) => {
    const [containerWidth, setContainerWidth] = useState(-1);
    const [contentWidth, setContentWidth] = useState(-1);

    const valueAnimation = useRef(new Animated.Value(-1)).current;
    var valueInterpolation = valueAnimation.interpolate({
        inputRange: [-1, 1],
        outputRange: ["-100%", "100%"],
        useNativeDriver: true
    });

    useEffect(() => {
        valueAnimation.setValue(0);
        handleAnimation();

        return () => {
            valueAnimation.stopAnimation();
            animation.stop();
            valueAnimation.removeAllListeners();
            valueInterpolation.removeAllListeners();
        }
    }, [containerWidth, contentWidth]);

    const animation = Animated.timing(
        valueAnimation,
        {
            toValue: 0.5,
            duration: 15000,
            easing: Easing.linear,
            useNativeDriver: true
        }
    );

    const runAnimation = () => {
        if (!valueAnimation.hasListeners())
            animation.start(finished => {
                if (finished && isOverflowing()) {
                    valueAnimation.setValue(-1);
                    runAnimation();
                }
            });
    }

    const stopAnimation = () => {
        valueAnimation.stopAnimation();
        animation.stop();
        valueAnimation.removeAllListeners();
        valueInterpolation.removeAllListeners();
        valueAnimation.setValue(-1);
    }

    const isOverflowing = () => {
        if (contentWidth == -1 || containerWidth == -1)
            return false;
        
        if (contentWidth > containerWidth)
            return true;
        else
            return false;
    }

    const handleAnimation = () => {
        if (isOverflowing())
            runAnimation();
        else
            stopAnimation();
    }

    return <View
        style={[{overflow: "hidden", width: "100%"}, style]}
        onLayout={event => {
            setContainerWidth(event.nativeEvent.layout.width);
        }}
    >
        <Animated.ScrollView
            onContentSizeChange={(width, height) => {
                setContentWidth(width);
            }}
            
            style={{
                alignSelf: isOverflowing()
                    ? "flex-start"
                    : "center",
                transform: [{
                    translateX: isOverflowing()
                        ? valueInterpolation
                        : 0
                }]
            }}
        >
            {children}
        </Animated.ScrollView>
    </View>;
}

export default ScrollingText;