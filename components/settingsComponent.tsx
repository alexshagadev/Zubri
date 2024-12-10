import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

export default function SliderComponent() {
  // States for each slider
  const [timerValue, setTimerValue] = useState(0);
  const [shortBreak, setShortBreak] = useState(0);
  const [longBreak, setLongBreak] = useState(0);

  // General sliding handlers for each slider
  const handleSlidingStart = (slider: string) => {
    // Additional logic can go here if needed for when sliding starts
  };

  const handleSlidingComplete = (slider: string, value: number) => {
    if (slider === 'timer') {
      setTimerValue(value);
    }
    if (slider === 'shortBreak') {
      setShortBreak(value);
    }
    if (slider === 'longBreak') {
      setLongBreak(value);
    }
  };

  return (
    <View style={styles.container}>
      {/* Timer Slider */}
      <Text style={styles.title}>Timer</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={timerValue}
          onSlidingStart={() => handleSlidingStart('timer')}
          onSlidingComplete={(value) => handleSlidingComplete('timer', value)}
          minimumTrackTintColor="#127C73"
          maximumTrackTintColor="#76F0A9"
          thumbTintColor="#127C73"
        />
        <Text style={styles.sliderValue}>Value: {timerValue}</Text>
      </View>

      {/* Short Break Slider */}
      <Text style={styles.title}>Short Break</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={shortBreak}
          onSlidingStart={() => handleSlidingStart('shortBreak')}
          onSlidingComplete={(value) => handleSlidingComplete('shortBreak', value)}
          minimumTrackTintColor="#127C73"
          maximumTrackTintColor="#76F0A9"
          thumbTintColor="#127C73"
        />
        <Text style={styles.sliderValue}>Value: {shortBreak}</Text>
      </View>

      {/* Long Break Slider */}
      <Text style={styles.title}>Long Break</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={longBreak}
          onSlidingStart={() => handleSlidingStart('longBreak')}
          onSlidingComplete={(value) => handleSlidingComplete('longBreak', value)}
          minimumTrackTintColor="#127C73"
          maximumTrackTintColor="#76F0A9"
          thumbTintColor="#127C73"
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
    width: '80%', // Adjust width to fit screen size properly
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000', // Ensure the text is visible by adding a color
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 18,
    marginTop: 10,
    color: '#333', // Make sure the text color is visible
  },
});
