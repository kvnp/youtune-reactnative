import React, { useState, useEffect } from "react";
import { Animated, Easing, View } from "react-native";

const ScrollingText = ({children, style}) => {
    const [containerWidth, setContainerWidth] = useState(-1);
    const [contentWidth, setContentWidth] = useState(-1);
    const [animation, setAnimation] = useState({animating: false});

    useEffect(() => {
        if (isOverflowing())
            runAnimation(0, 2000);
        else {
            if (animation.animating) {
                resetAnimation();
            }
        }

        return () => {
            if (animation.animating) {
                animation.timing.stop();
                animation.value.stopAnimation();
                animation.value.removeAllListeners();
                animation.interpolation.removeAllListeners();
            }
        };
    }, [contentWidth, containerWidth]);

    const runAnimation = (value, delay) => {
        if (!animation.animating) {
            let animatedValue = new Animated.Value(value)
            let interpolation = animatedValue.interpolate({
                inputRange: [-1, 1],
                outputRange: ["100%", "-100%"],
                useNativeDriver: true
            });

            let timing = Animated.timing(
                animatedValue,
                {
                    toValue: 1,
                    duration: 10000,
                    delay: delay,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            )
            
            setAnimation({
                animating: true,
                value: animatedValue,
                interpolation: interpolation,
                timing: timing
            });

            timing.start(finished => {
                console.log(finished);
                console.log(animation);
                if (finished && isOverflowing()) {
                    if (animation.animating)
                        resetAnimation();
                    
                    runAnimation(-containerWidth/contentWidth, 0);
                }
            });
        }
        
    }

    const resetAnimation = () => {
        if (animation.animating) {
            animation.timing.stop();
            animation.value.stopAnimation();
            animation.value.removeAllListeners();
            animation.interpolation.removeAllListeners();
            setAnimation({animating: false});
        }
    }

    const isOverflowing = () => {
        if (contentWidth == -1 || containerWidth == -1)
            return false;
        
        return contentWidth > containerWidth;
    }

    return <View
        style={[{overflow: "hidden", width: "100%"}, style]}
        onLayout={e => {
            if (containerWidth == -1)
                setContainerWidth(e.nativeEvent.layout.width);
        }}
    >
        <Animated.ScrollView
            onContentSizeChange={(width, height) => {
                if (contentWidth == -1)
                    setContentWidth(width);
            }}
            
            style={{
                alignSelf: isOverflowing()
                    ? "flex-start"
                    : "center",
                transform: [{
                    translateX: isOverflowing()
                        ? animation.interpolation
                        : 0
                }]
            }}
        >
            <View style={{alignSelf: "center", justifyContent: "center", width: "auto"}} onLayout={e => {
                setContentWidth(e.nativeEvent.layout.width);
            }}>
                {children}
            </View>
        </Animated.ScrollView>
    </View>;
}

export default ScrollingText;