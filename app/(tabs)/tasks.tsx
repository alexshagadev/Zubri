import { StyleSheet, View, SafeAreaView, Text, ScrollView, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

type Task = {
  id: number;
  text: string;
  priority: number; // 0 = empty, 1 = light green, 2 = medium green, 3 = dark green
};

export default function TaskScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  // Load tasks from AsyncStorage
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever tasks change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks:', error);
      }
    };

    saveTasks();
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === '') {
      Alert.alert('Please enter a task!');
      return;
    }

    setTasks([
      ...tasks,
      { id: Date.now(), text: newTask, priority: 0 }, // Unique id with Date.now()
    ]);

    setNewTask('');
    Alert.alert('Task added successfully!');
  };

  const togglePriority = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, priority: (task.priority + 1) % 4 }
          : task
      )
    );
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return '#B0E57C'; // Light Green
      case 2:
        return '#73C16E'; // Medium Green
      case 3:
        return '#09756C'; // Dark Green
      default:
        return '#CCC'; // Empty
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <SafeAreaView>
        <Text style={styles.title}>T A S K S</Text>
      </SafeAreaView>

      {/* NEW TASK Container */}
      <View style={styles.newTask}>
        <LinearGradient colors={["#73EC8B", "#15B392"]} style={styles.scrollContent}>
          <View style={styles.item}>
            <TextInput
              placeholder="Add Task ..."
              placeholderTextColor="#888"
              value={newTask}
              onChangeText={(text) => setNewTask(text)}
            />
            <View style={styles.iconContainer}>
              <Icon
                name="check"
                size={30}
                color="#09756C"
                onPress={() => handleAddTask()}
              />
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* TASKS Container */}
      <SafeAreaView style={styles.scrollContainer}>
        <LinearGradient colors={["#73EC8B", "#15B392"]} style={styles.gradient}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* TASKS MAPPING */}
            {tasks.map((task) => (
              <View key={task.id} style={styles.item}>
                {/* Priority Star */}
                <Icon
                  name="star"
                  size={30}
                  color={getPriorityColor(task.priority)}
                  style={{ marginRight: 16 }}
                  onPress={() => togglePriority(task.id)}
                />
                {/* Task Text */}
                <View style={styles.textContainer}>
                  <Text style={styles.taskText}>{task.text}</Text>
                </View>
                {/* Trash Icon */}
                <Icon
                  name="trash"
                  size={30}
                  color="#09756C"
                  onPress={() => setTasks(tasks.filter((t) => t.id !== task.id))}
                />
              </View>
            ))}
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#09756C',
    textTransform: 'uppercase',
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontWeight: '800',
    fontSize: 40,
    textAlign: 'center',
    lineHeight: 60,
    marginBottom: 16,
  },
  scrollContainer: {
    height: 400, // Set a specific height for the ScrollView container
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 8,
  },

  newTask: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },

  item: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  textContainer: {
    flex: 1,
    marginRight: 10,
  },

  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
