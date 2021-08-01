import React, { useRef, useState, useEffect } from "react";
import { Animated, Easing, View } from "react-native";

const ScrollingText = ({children, style}) => {
    const [containerWidth, setContainerWidth] = useState(-1);
    const [contentWidth, setContentWidth] = useState(-1);

    const valueAnimation = useRef(new Animated.Value(0)).current;
    var valueInterpolation = valueAnimation.interpolate({
        inputRange: [-1, 1],
        outputRange: ["100%", "-100%"],
        useNativeDriver: true
    });

    const animation = Animated.timing(
        valueAnimation,
        {
            toValue: 1,
            duration: 10000,
            delay: 1000,
            easing: Easing.linear,
            useNativeDriver: true
        }
    );

    useEffect(() => {
        valueAnimation.setValue(0);
        handleAnimation();

        return () => stopAnimation();
    }, [containerWidth, contentWidth]);

    const runAnimation = () => {
        animation.start(finished => {
            if (finished && isOverflowing()) {
                valueAnimation.setValue(-containerWidth/contentWidth);
                runAnimation();
            }
        });
    }

    const stopAnimation = () => {
        valueAnimation.stopAnimation();
        animation.stop();
        valueAnimation.removeAllListeners();
        valueInterpolation.removeAllListeners();
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