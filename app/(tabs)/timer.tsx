import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import TimerComponent from '@/components/timerComponent';
import SliderComponent from '@/components/settingsComponent';

export default function TimerScreen() {
  const [startingTime, setStartingTime] = useState(1200);

  return (
    <LinearGradient colors={['#73EC8B', '#15B392']} style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerContainer}>
        <Text style={styles.bigText}>T I M E R</Text>
      </SafeAreaView>

      {/* Timer Section */}
      <View style={styles.timerSection}>
        <TimerComponent startingTime={startingTime} />
      </View>

      {/* Settings Section */}
      <ScrollView style={styles.settingsContainer}>
        <Text style={styles.settingsTitle}>S E T T I N G S</Text>
        <SliderComponent />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContainer: {
    marginBottom: 20,
  },

  bigText: {
    fontWeight: '800',
    fontSize: 40,
    textAlign: 'center',
    color: '#fff',
    lineHeight: 60,
  },

  timerSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '90%', // Make timer box wider
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  settingsContainer: {
    width: '90%', // Maintain consistency
    height: 300, // Make settings box taller
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  settingsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#09756C',
    textAlign: 'center',
  },

  buttonText: {
    fontSize: 22, // Increased font size for button text in TimerComponent
    fontWeight: '700',
    color: '#09756C',
  },
});
