import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={["#73EC8B", "#15B392"]} style={styles.container}>
      {/* Logo at the Top */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Z</Text>
        <Text style={styles.logoText}>U</Text>
        <Text style={styles.logoText}>B</Text>
        <Text style={styles.logoText}>R</Text>
        <Text style={styles.logoText}>I</Text>
      </View>

      {/* START STUDYING */}
      <Text style={styles.startText}>S T A R T</Text>

      {/* Target Button */}
      <TouchableOpacity
        style={styles.targetButton}
        onPress={() => navigation.navigate('tasks')} // Navigate to Tasks
      >
        <Icon name="bullseye" size={100} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.studyText}>S T U D Y I N G</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 50,
  },

  logoText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#000',
    backgroundColor: '#fff',
    marginHorizontal: 2,
    paddingHorizontal: 5,
  },

  startText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },

  targetButton: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#fff',
    marginVertical: 20,
  },

  studyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
});
