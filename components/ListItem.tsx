import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Pressable,
  useColorScheme,
} from "react-native";
import React, { useCallback } from "react";
import { TASKPROPS } from "../App";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  SharedValue,
} from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";

interface Props extends Pick<PanGestureHandlerProps, "simultaneousHandlers"> {
  task: TASKPROPS;
  onDismiss: (task: TASKPROPS) => void;
  index: number;
  length: number;
}
const LIST_HEIGHT = 80;

const ListItem = ({
  task,
  onDismiss,
  simultaneousHandlers,
  index,
  length,
}: Props) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const currentTheme = useColorScheme();
  const TRANSLATE_X = SCREEN_WIDTH * 0.3;
  const translateX = useSharedValue(0);
  const radiusConstant = useSharedValue(20);
  const itemHeight = useSharedValue(LIST_HEIGHT);

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX;
      radiusConstant.value = withTiming(0);
    },
    onEnd: () => {
      const shouldBeDismissed =
        translateX.value + 2 * TRANSLATE_X < TRANSLATE_X;
      if (shouldBeDismissed) {
        translateX.value = withTiming(-TRANSLATE_X);
        radiusConstant.value = withTiming(0);
      } else {
        translateX.value = withTiming(0);
        radiusConstant.value = withTiming(20);
      }
    },
  });

  // executing onDismiss
  const handleDelete = useCallback(() => {
    itemHeight.value = withTiming(0);
    runOnJS(onDismiss)(task);
  }, []);

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
    borderTopLeftRadius: index === 0 ? 20 : 0,
    borderTopRightRadius: index === 0 ? radiusConstant.value : 0,
    borderBottomLeftRadius: index === length - 1 ? radiusConstant.value : 0,
    borderBottomRightRadius: index === length - 1 ? radiusConstant.value : 0,
    backgroundColor: currentTheme === "dark" ? "#282927" : "white",
    borderColor: currentTheme === "dark" ? "#3f413d" : "#F1F3F2",
    borderBottomWidth: index === length - 1 ? 0 : 2,
  }));

  const iconStyle = useAnimatedStyle(() => {
    const width = (translateX.value * -1) / 2;
    return { width };
  });

  const heightStyle = useAnimatedStyle(() => {
    return { height: itemHeight.value };
  });

  return (
    <Animated.View style={[styles.container, heightStyle]}>
      <Animated.View style={styles.iconContainer}>
        <Pressable>
          <Animated.View
            style={[
              styles.blueContainer,
              iconStyle,
              { width: TRANSLATE_X / 2 },
            ]}
          >
            <FontAwesome name="edit" size={28} color="white" />
          </Animated.View>
        </Pressable>
        <Pressable onPress={handleDelete}>
          <Animated.View
            style={[
              styles.redContainer,
              iconStyle,
              {
                width: TRANSLATE_X / 2,
                borderTopRightRadius: index === 0 ? 20 : 0,
                borderBottomRightRadius: index === length - 1 ? 20 : 0,
              },
            ]}
          >
            <FontAwesome name="trash" size={28} color="white" />
          </Animated.View>
        </Pressable>
      </Animated.View>
      <PanGestureHandler
        simultaneousHandlers={simultaneousHandlers}
        onGestureEvent={panGesture}
      >
        <Animated.View style={[styles.titleContainer, rStyle]}>
          <Text
            style={[
              styles.text,
              { color: currentTheme === "dark" ? "white" : "black" },
            ]}
          >
            {task.title}
          </Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    height: LIST_HEIGHT,
  },
  titleContainer: {
    width: "90%",
    height: "100%",
    justifyContent: "center",
    padding: 20,
    alignSelf: "center",
  },
  text: {
    fontSize: 18,
  },
  iconContainer: {
    height: "100%",
    backgroundColor: "transparent",
    position: "absolute",
    flexDirection: "row",
    right: "5%",
  },
  redContainer: {
    height: "100%",
    width: 50,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  blueContainer: {
    height: "100%",
    width: 50,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
});
