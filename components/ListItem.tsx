import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Pressable,
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
}
const LIST_HEIGHT = 80;
const ROW_HEIGHT = 60;

const ListItem = ({ task, onDismiss, simultaneousHandlers }: Props) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const TRANSLATE_X = SCREEN_WIDTH * 0.3;
  const translateX = useSharedValue(0);
  const radiusConstant = useSharedValue(10);
  const itemHeight = useSharedValue(LIST_HEIGHT);

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      const shouldBeDismissed =
        translateX.value + 2 * TRANSLATE_X < TRANSLATE_X;
      if (shouldBeDismissed) {
        translateX.value = withTiming(-TRANSLATE_X);
        radiusConstant.value = withTiming(0);
      } else {
        translateX.value = withTiming(0);
        radiusConstant.value = withTiming(10);
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
    borderTopRightRadius: radiusConstant.value,
    borderBottomRightRadius: radiusConstant.value,
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
            style={[styles.redContainer, iconStyle, { width: TRANSLATE_X / 2 }]}
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
          <Text style={styles.text}>{task.title}</Text>
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
    height: ROW_HEIGHT,
    borderRadius: 10,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
    alignSelf: "center",
  },
  text: {
    fontSize: 16,
  },
  iconContainer: {
    height: ROW_HEIGHT,
    backgroundColor: "transparent",
    position: "absolute",
    flexDirection: "row",
    right: "5%",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  redContainer: {
    height: ROW_HEIGHT,
    width: 50,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  blueContainer: {
    height: ROW_HEIGHT,
    width: 50,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
});
