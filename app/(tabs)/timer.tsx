import React from 'react';
import { Image, StyleSheet, Platform, View, SafeAreaView,Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import TimerComponent from '@/components/timerComponent';

export default function TimerScreen() {
  return (
    <View>
      <SafeAreaView>
        <Text style = {styles.BigText}>T I M E R</Text>
        <TimerComponent/>
      </SafeAreaView>
      <View style={styles.stepContainer}>
        <Text >Settings</Text>
        {/* <SettingsComponent/> */}
      </View>
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
    marginBottom: 8,
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
