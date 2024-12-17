import { StyleSheet, View, SafeAreaView, Text, ScrollView, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from "@react-native-community/datetimepicker";

type Reminder = {
  id: number;
  text: string;
  date: Date;
};

export default function ReminderScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState('');
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [reminderId, setReminderId] = useState(-1);

  // Load reminders on component mount
  useEffect(() => {
    const loadReminders = async () => {
      try {
        const storedReminders = await AsyncStorage.getItem('reminders');
        if (storedReminders) {
          setReminders(JSON.parse(storedReminders).map((r: Reminder) => ({
            ...r,
            date: new Date(r.date), // Reconvert date strings to Date objects
          })));
        }
      } catch (error) {
        console.error('Failed to load reminders:', error);
      }
    };

    loadReminders();
  }, []);

  // Save reminders whenever they change
  useEffect(() => {
    const saveReminders = async () => {
      try {
        await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
      } catch (error) {
        console.error('Failed to save reminders:', error);
      }
    };

    saveReminders();
  }, [reminders]);

  const handleDateChange = (selectedDate: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setReminderDate(selectedDate);
    }

    if (reminderId !== -1) {
      const updatedReminders = reminders.map((reminder) =>
        reminder.id === reminderId ? { ...reminder, date: selectedDate } : reminder
      );
      setReminders(updatedReminders);
      setReminderId(-1);
    }
  };

  const handleAddReminder = () => {
    if (newReminder.trim() === '') {
      Alert.alert('Please enter a reminder text!');
      return;
    }

    const newReminderObject: Reminder = {
      id: Date.now(), // Unique ID
      text: newReminder,
      date: reminderDate ?? new Date(),
    };

    setReminders([...reminders, newReminderObject]);
    setNewReminder('');
    setReminderDate(new Date());
    Alert.alert('Reminder added successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <SafeAreaView>
        <Text style={styles.title}>R E M I N D E R S</Text>
      </SafeAreaView>

      {/* NEW REMINDER Container */}
      <View style={styles.newReminder}>
        <LinearGradient colors={["#73EC8B", "#15B392"]} style={styles.scrollContent}>
          <View style={styles.item}>
            <TextInput
              placeholder="Add Reminder ..."
              placeholderTextColor="#888"
              value={newReminder}
              onChangeText={(text) => setNewReminder(text)}
            />
            <View style={styles.iconContainer}>
              <Icon
                name="clock-o"
                size={30}
                color="#09756C"
                style={{ marginRight: 16 }}
                onPress={() => setShowPicker(true)}
              />
              <Icon
                name="check"
                size={30}
                color="#09756C"
                onPress={() => handleAddReminder()}
              />
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* REMINDERS Container */}
      <SafeAreaView style={styles.scrollContainer}>
        <LinearGradient colors={["#73EC8B", "#15B392"]} style={styles.gradient}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {reminders.map((reminder) => (
              <View key={reminder.id} style={styles.item}>
                <View style={styles.textContainer}>
                  <Text style={styles.reminderText}>{reminder.text}</Text>
                  <Text style={styles.reminderDate}>{reminder.date.toDateString()}</Text>
                </View>
                <View style={styles.iconContainer}>
                  <Icon
                    name="clock-o"
                    size={30}
                    color="#09756C"
                    style={{ marginRight: 16 }}
                    onPress={() => {
                      setReminderId(reminder.id);
                      setShowPicker(true);
                    }}
                  />
                  <Icon
                    name="trash"
                    size={30}
                    color="#09756C"
                    onPress={() => setReminders(reminders.filter((r) => r.id !== reminder.id))}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>

      {/* Date Picker */}
      {showPicker && (
        <DateTimePicker
          value={reminderDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => handleDateChange(selectedDate!)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  reminderText: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#09756C',
    textTransform: 'uppercase',
  },

  reminderDate: {
    fontSize: 12,
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
    height: 400,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 8,
  },

  newReminder: {
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
