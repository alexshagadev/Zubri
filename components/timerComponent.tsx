
import React, {useState, useEffect} from "react";
import {Button, Pressable, StyleSheet, Text, View} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
  


export default function TimerComponent(){

  const [timeLeft, setTimeLeft] = useState(1200);  // timeLeft in seconds
  const [isRunning, setIsRunning] = useState(false); // To track whether the timer is running


  useEffect(() => {
    let timer: NodeJS.Timeout |null = null;

    // Start the timer
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000); // Update every second
    } else if (timeLeft === 0) {
      if(timer){

      
      clearInterval(timer);  // Stop the timer when it reaches 0
      }
    }

    // Cleanup the interval on unmount
    return () => {
      if(timer){
      clearInterval(timer)}};
  }, [isRunning, timeLeft]);


  const toggleTimer = () => {
    setIsRunning((prevState) => !prevState);
  };

  const resetTimer = () => {
    setTimeLeft(1200);  // Reset to 20 minutes (1200 seconds)
    setIsRunning(false); // Stop the timer
  };
  const formatTime = (time:number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
    let timerLength = 20

  return(<LinearGradient colors={["#73EC8B","#15B392"]} style={styles.gradient} // The container style for the gradient background 
  >
    <View style = {styles.container}>
      <Text>
      {formatTime(timeLeft)}
      </Text>
      <Pressable onPress={toggleTimer}><Text>Start</Text></Pressable>
      <Pressable onPress={resetTimer}><Text>Reset</Text></Pressable>

    </View>
  </LinearGradient>)
}

const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    gradient:{
      height:190,
      borderRadius:8,
      margin:15,
      padding:15
    },
    container: {
      height:190,
      borderRadius:8,
      margin:15,
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