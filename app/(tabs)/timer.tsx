import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Zubri Notfication",
    body: "Your Timer Has Finished",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

export default function TimerScreen() {
  const [timerDuration, setTimerDuration] = useState(20); // Timer duration in minutes
  const [breakDuration, setBreakDuration] = useState(5); // Break duration in minutes
  const [breakFrequency, setBreakFrequency] = useState(2); // Break after X sessions

  const [timeLeft, setTimeLeft] = useState(timerDuration * 60); // Timer in seconds
  const [isRunning, setIsRunning] = useState(false); // Timer state
  const [sessionCount, setSessionCount] = useState(0); // Track session count

  const [breakTimeLeft, setBreakTimeLeft] = useState(0); // Set initial time for the break
  const [isOnBreak, setIsOnBreak] = useState(false); // Track if we are on a break
  const [currentTimer, setCurrentTimer] = useState("task"); // Track which timer is active (task or break)

  const [expoPushToken, setExpoPushToken] = useState("");
  // Load saved settings from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTimerDuration = await AsyncStorage.getItem("timerDuration");
        const savedBreakDuration = await AsyncStorage.getItem("breakDuration");
        const savedBreakFrequency = await AsyncStorage.getItem(
          "breakFrequency"
        );

        if (savedTimerDuration) setTimerDuration(parseInt(savedTimerDuration));
        if (savedBreakDuration) setBreakDuration(parseInt(savedBreakDuration));
        if (savedBreakFrequency)
          setBreakFrequency(parseInt(savedBreakFrequency));
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem("timerDuration", timerDuration.toString());
        await AsyncStorage.setItem("breakDuration", breakDuration.toString());
        await AsyncStorage.setItem("breakFrequency", breakFrequency.toString());
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    };
    saveSettings();
  }, [timerDuration, breakDuration, breakFrequency]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0 && !isOnBreak) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isOnBreak) {
      setIsRunning(false);
      handleTimerEnd("task");
    } else if (isOnBreak && breakTimeLeft > 0) {
      timer = setInterval(() => {
        setBreakTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (breakTimeLeft === 0 && isOnBreak) {
      setIsRunning(false);
      handleTimerEnd("break");
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, breakTimeLeft, isOnBreak]);

  const handleTimerEnd = (type: "task" | "break") => {
    if (type === "task") {
      setSessionCount((prev) => prev + 1);
      if ((sessionCount + 1) % breakFrequency === 0) {
        alert(`Time for a ${breakDuration}-minute break!`);
        setIsOnBreak(true);
        setBreakTimeLeft(breakDuration * 60);
        sendPushNotification(expoPushToken); // Send push notification on task end
      } else {
        alert("Session complete! Starting a new session.");
        setTimeLeft(timerDuration * 60);
        sendPushNotification(expoPushToken); // Send push notification on task end
      }
    } else if (type === "break") {
      alert("Break is over. Starting a new session.");
      setIsOnBreak(false);
      setTimeLeft(timerDuration * 60);
      sendPushNotification(expoPushToken); // Send push notification on break end
    }
    setIsRunning(false);
  };

  // Reset the timer when timerDuration changes
  useEffect(() => {
    setTimeLeft(timerDuration * 60);
    setIsRunning(false);
    setBreakTimeLeft(breakDuration * 60); // Reset break timer as well
  }, [timerDuration, breakDuration]);

  // Reset the timer when timerDuration changes
  useEffect(() => {
    setTimeLeft(timerDuration * 60);
    setIsRunning(false);
  }, [timerDuration]);

  // const handleTimerEnd = () => {
  //   setSessionCount((prev) => prev + 1);
  //   if ((sessionCount + 1) % breakFrequency === 0) {
  //     alert(`Time for a ${breakDuration}-minute break!`);
  //     setTimeLeft(breakDuration * 60);
  //   } else {
  //     alert("Session complete! Starting a new session.");
  //     setTimeLeft(timerDuration * 60);
  //   }
  //   setIsRunning(false);
  // };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setTimeLeft(timerDuration * 60);
    setIsRunning(false);
    setIsOnBreak(false);
    setBreakTimeLeft(breakDuration * 60); // Reset break timer
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#73EC8B", "#15B392"]} style={styles.container}>
        {/* Header */}
        <SafeAreaView style={styles.headerContainer}>
          <Text style={styles.bigText}>T I M E R</Text>
        </SafeAreaView>

        {/* Timer Section */}
        <View style={styles.timerSection}>
          <Text style={styles.timerText}>
            {isOnBreak ? "Break Time" : "Task Time"}
          </Text>
          <Text style={styles.timerText}>
            {isOnBreak ? formatTime(breakTimeLeft) : formatTime(timeLeft)}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsRunning(true)}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsRunning(false)}
            >
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={resetTimer}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <ScrollView style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>S E T T I N G S</Text>

          {/* Timer Duration Slider */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              Timer Duration: {timerDuration} mins
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={60}
              step={1}
              value={timerDuration}
              onValueChange={(value) => setTimerDuration(value)}
              minimumTrackTintColor="#09756C"
              thumbTintColor="#09756C"
            />
          </View>

          {/* Break Duration Slider */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              Break Duration: {breakDuration} mins
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={15}
              step={1}
              value={breakDuration}
              onValueChange={(value) => setBreakDuration(value)}
              minimumTrackTintColor="#09756C"
              thumbTintColor="#09756C"
            />
          </View>

          {/* Break Frequency Slider */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              Break Frequency: {breakFrequency} sessions
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={breakFrequency}
              onValueChange={(value) => setBreakFrequency(value)}
              minimumTrackTintColor="#09756C"
              thumbTintColor="#09756C"
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
  },
  headerContainer: { marginBottom: 20 },
  bigText: {
    fontWeight: "800",
    fontSize: 40,
    textAlign: "center",
    color: "#fff",
  },
  timerSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#09756C",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: { backgroundColor: "#09756C", padding: 10, borderRadius: 5 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  settingsContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#09756C",
    textAlign: "center",
    marginBottom: 20,
  },
  sliderContainer: { marginBottom: 20 },
  sliderLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#09756C",
    textAlign: "center",
    marginBottom: 10,
  },
  slider: { width: "100%" },
  safeArea: { flex: 1, paddingTop: 50 },
});
