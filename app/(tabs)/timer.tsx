import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';

export default function TimerScreen() {
  const [timerDuration, setTimerDuration] = useState(20); // Timer duration in minutes
  const [breakDuration, setBreakDuration] = useState(5); // Break duration in minutes
  const [breakFrequency, setBreakFrequency] = useState(2); // Break after X sessions

  const [timeLeft, setTimeLeft] = useState(timerDuration * 60); // Timer in seconds
  const [isRunning, setIsRunning] = useState(false); // Timer state
  const [sessionCount, setSessionCount] = useState(0); // Track session count

  // Load saved settings from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTimerDuration = await AsyncStorage.getItem('timerDuration');
        const savedBreakDuration = await AsyncStorage.getItem('breakDuration');
        const savedBreakFrequency = await AsyncStorage.getItem('breakFrequency');

        if (savedTimerDuration) setTimerDuration(parseInt(savedTimerDuration));
        if (savedBreakDuration) setBreakDuration(parseInt(savedBreakDuration));
        if (savedBreakFrequency) setBreakFrequency(parseInt(savedBreakFrequency));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('timerDuration', timerDuration.toString());
        await AsyncStorage.setItem('breakDuration', breakDuration.toString());
        await AsyncStorage.setItem('breakFrequency', breakFrequency.toString());
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    };
    saveSettings();
  }, [timerDuration, breakDuration, breakFrequency]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      handleTimerEnd();
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Reset the timer when timerDuration changes
  useEffect(() => {
    setTimeLeft(timerDuration * 60);
    setIsRunning(false);
  }, [timerDuration]);

  const handleTimerEnd = () => {
    setSessionCount((prev) => prev + 1);
    if ((sessionCount + 1) % breakFrequency === 0) {
      alert(`Time for a ${breakDuration}-minute break!`);
      setTimeLeft(breakDuration * 60);
    } else {
      alert('Session complete! Starting a new session.');
      setTimeLeft(timerDuration * 60);
    }
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimeLeft(timerDuration * 60);
    setIsRunning(false);
  };

  return (
    <LinearGradient colors={['#73EC8B', '#15B392']} style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerContainer}>
        <Text style={styles.bigText}>T I M E R</Text>
      </SafeAreaView>

      {/* Timer Section */}
      <View style={styles.timerSection}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setIsRunning(true)}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setIsRunning(false)}>
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
          <Text style={styles.sliderLabel}>Timer Duration: {timerDuration} mins</Text>
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
          <Text style={styles.sliderLabel}>Break Duration: {breakDuration} mins</Text>
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
          <Text style={styles.sliderLabel}>Break Frequency: {breakFrequency} sessions</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerContainer: { marginBottom: 20 },
  bigText: { fontWeight: '800', fontSize: 40, textAlign: 'center', color: '#fff' },
  timerSection: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%', marginBottom: 20 },
  timerText: { fontSize: 48, fontWeight: '700', color: '#09756C', textAlign: 'center' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  button: { backgroundColor: '#09756C', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  settingsContainer: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20 },
  settingsTitle: { fontSize: 24, fontWeight: '700', color: '#09756C', textAlign: 'center', marginBottom: 20 },
  sliderContainer: { marginBottom: 20 },
  sliderLabel: { fontSize: 16, fontWeight: '700', color: '#09756C', textAlign: 'center', marginBottom: 10 },
  slider: { width: '100%' },
});
