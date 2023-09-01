import { StatusBar } from "expo-status-bar";
import { useState, useCallback, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from "react-native";
import ListItem from "./components/ListItem";
import {
  GestureHandlerRootView,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";

const titles = [
  "Record the dismissible tutorial",
  "Leave a like to the video",
  "Check youtube comments",
  "Subscribe to the channel",
  "Leave a star on the Github Repo",
  "Record the dismissible tutorial",
  "Leave a like to the video",
  "Check youtube comments",
  "Subscribe to the channel",
];

export interface TASKPROPS {
  title: string;
  index: number;
}

const Tasks: TASKPROPS[] = titles.map((title, index) => ({ title, index }));

const BG_COLOR = "#F1F3F2";

export default function App() {
  const [tasks, setTasks] = useState<TASKPROPS[]>(Tasks);
  const scrollRef = useRef(null);

  const onDismiss = useCallback((task: TASKPROPS) => {
    setTasks((tasks) => tasks.filter((item) => item.index !== task.index));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Tasks</Text>

      <ScrollView ref={scrollRef} style={styles.scrollContainer}>
        <GestureHandlerRootView>
          <NativeViewGestureHandler>
            <View>
              {tasks?.map((task) => (
                <ListItem
                  key={task.index}
                  task={task}
                  onDismiss={onDismiss}
                  simultaneousHandlers={scrollRef}
                />
              ))}
            </View>
          </NativeViewGestureHandler>
        </GestureHandlerRootView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  title: {
    fontSize: 44,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: Platform.OS === "android" ? 20 : 0,
    paddingLeft: "5%",
  },
  scrollContainer: {
    flex: 1,
    borderRadius: 10,
  },
});
