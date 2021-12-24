import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";

const ScrollingText = ({children, style}) => {
    const [containerWidth, setContainerWidth] = useState(-1);
    const [contentWidth, setContentWidth] = useState(-1);
    const viewRef = useRef(null);

    useEffect(() => {
        viewRef.current.style.animationTimingFunction = "linear";
        viewRef.current.style.animationDuration = "10s";
        viewRef.current.style.transformOrigin = "0%";
        viewRef.current.children[0].children[0].children[0]
            .style.whiteSpace = "nowrap";
    }, []);

    useEffect(() => {
        if (isOverflowing())
            startAnimation();
        else
            stopAnimation();
    }, [contentWidth, containerWidth]);

    const startAnimation = () => {
        viewRef.current.style.animationDelay = "2s";
        viewRef.current.style.animationIterationCount = "1";
        viewRef.current.style.animationName = children.props.children.replaceAll(" ", "_").replace(/[\W_]+/g,"-");
        viewRef.current.onanimationend = e => {
            viewRef.current.style.animationDelay = "0s";
            viewRef.current.style.animationIterationCount = "infinite";
            viewRef.current.style.animationName = children.props.children.replaceAll(" ", "_").replace(/[\W_]+/g,"-") + "_2";
        }
    }

    const stopAnimation = () => {
        viewRef.current.style.animationName = "";
    }

    const areWidthsNotDefined = () => {
        return (contentWidth == -1 || containerWidth == -1);
    }

    const isOverflowing = () => {
        return areWidthsNotDefined()
            ? false
            : contentWidth > containerWidth;
    }

    return <View
        style={[
            {overflow: "hidden", width: "100%"},
            style
        ]}
        onLayout={
            e => setContainerWidth(e.nativeEvent.layout.width)
        }
    > 
        {
            isOverflowing()
                ? <style>
                    {
                        `@keyframes ${children.props.children.replaceAll(" ", "_").replace(/[\W_]+/g,"-")} { from {transform: translateX(0%)} to {transform: translateX(-100%)}}\n` +
                        `@keyframes ${children.props.children.replaceAll(" ", "_").replace(/[\W_]+/g,"-")}_2 { from {transform: translateX(${containerWidth/contentWidth*100}%)} to {transform: translateX(-100%)}}`
                    }
                </style>

                : null
        }
        
        <ScrollView
            ref={viewRef}
            onContentSizeChange={
                width => setContentWidth(width)
            }

            style={{
                alignSelf: isOverflowing()
                    ? "flex-start"
                    : "center",
            }}
        >
            <View
                style={{
                    alignSelf: "center",
                    justifyContent: "center",
                    width: "auto"
                }}
            >
                {children}
            </View>
        </ScrollView>
    </View>;
}

export default ScrollingText;