import React, { useState } from 'react';
import { Image, StyleSheet, Platform, View, SafeAreaView,Text, ScrollView } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import TimerComponent from '@/components/timerComponent';
import SliderComponent from '@/components/settingsComponent';
export default function TimerScreen() {
  const [startingTime, setStartingTime] = useState(1200)
  return (
    <View>
      <SafeAreaView>
        <Text style = {styles.BigText}>T I M E R</Text>
        <TimerComponent startingTime={startingTime}/>
      </SafeAreaView>
      <ScrollView style={styles.stepContainer}>
        <Text style= {styles.BigText} >S E T T I N G S</Text>
        <SliderComponent/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  BigText:{
    fontWeight:800,
    fontSize:40,
    textAlign:"center",
    lineHeight:60
  }
});
