import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

// Debounce function to limit the number of updates
const debounce = (func: Function, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export default function SliderComponent() {
  // States for each slider
  const [timerValue, setTimerValue] = useState(0);
  const [shortBreak, setShortBreak] = useState(0);
  const [longBreak, setLongBreak] = useState(0);

  // Flags to track if the sliders are being dragged
  const [isSlidingTimer, setIsSlidingTimer] = useState(false);
  const [isSlidingShortBreak, setIsSlidingShortBreak] = useState(false);
  const [isSlidingLongBreak, setIsSlidingLongBreak] = useState(false);

  // Refs for debounced state updates
  const debouncedSetTimerValue = useRef(debounce(setTimerValue, 50)).current;
  const debouncedSetShortBreak = useRef(debounce(setShortBreak, 50)).current;
  const debouncedSetLongBreak = useRef(debounce(setLongBreak, 50)).current;

  // General sliding handlers for each slider
  const handleSlidingStart = (slider: string) => {
    if (slider === 'timer') setIsSlidingTimer(true);
    if (slider === 'shortBreak') setIsSlidingShortBreak(true);
    if (slider === 'longBreak') setIsSlidingLongBreak(true);
  };

  const handleSlidingComplete = (slider: string, value: number) => {
    if (slider === 'timer') {
      setIsSlidingTimer(false);
      setTimerValue(value);
    }
    if (slider === 'shortBreak') {
      setIsSlidingShortBreak(false);
      setShortBreak(value);
    }
    if (slider === 'longBreak') {
      setIsSlidingLongBreak(false);
      setLongBreak(value);
    }
  };

  // Optimized value change handler with debouncing
  const handleValueChange = (slider: string, value: number) => {
    if (slider === 'timer' && isSlidingTimer) {
      debouncedSetTimerValue(value);
    }
    if (slider === 'shortBreak' && isSlidingShortBreak) {
      debouncedSetShortBreak(value);
    }
    if (slider === 'longBreak' && isSlidingLongBreak) {
      debouncedSetLongBreak(value);
    }
  };

  return (
    <View style={styles.container}>
        <Text>Wack</Text>
      {/* Timer Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.title}>Timer</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={timerValue}
          onValueChange={(value) => handleValueChange('timer', value)}
          onSlidingStart={() => handleSlidingStart('timer')}
          onSlidingComplete={(value) => handleSlidingComplete('timer', value)}
          minimumTrackTintColor="#1EB1FC"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#1EB1FC"
        />
        <Text style={styles.sliderValue}>Value: {timerValue}</Text>
      </View>

      {/* Short Break Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.title}>Short Break</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={shortBreak}
          onValueChange={(value) => handleValueChange('shortBreak', value)}
          onSlidingStart={() => handleSlidingStart('shortBreak')}
          onSlidingComplete={(value) => handleSlidingComplete('shortBreak', value)}
          minimumTrackTintColor="#1EB1FC"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#1EB1FC"
        />
        <Text style={styles.sliderValue}>Value: {shortBreak}</Text>
      </View>

      {/* Long Break Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.title}>Long Break</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={longBreak}
          onValueChange={(value) => handleValueChange('longBreak', value)}
          onSlidingStart={() => handleSlidingStart('longBreak')}
          onSlidingComplete={(value) => handleSlidingComplete('longBreak', value)}
          minimumTrackTintColor="#1EB1FC"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#1EB1FC"
        />
        <Text style={styles.sliderValue}>Value: {longBreak}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sliderContainer: {
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slider: {
    width: '80%',
    height: 40,
  },
  sliderValue: {
    fontSize: 18,
    marginTop: 10,
    color: '#333',
  },
});
