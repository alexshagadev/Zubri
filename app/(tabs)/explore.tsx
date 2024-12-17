import { StyleSheet, View, SafeAreaView, Text, ScrollView, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from "@react-native-community/datetimepicker";

type Reminder = {
  id: number;
  text: string;
  date: Date;
};

export default function ReminderScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([{
    id: 1,
    text: "Default Reminder",
    date: new Date(),
  }]);
  const [newReminder, setNewReminder] = useState('');
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [reminderId, setReminderId] = useState(-1);

  const handleDateChange = (selectedDate: Date) => {
    setShowPicker(false); // Hide the picker
    if (selectedDate) {
      setReminderDate(selectedDate);
    }

    if (reminderId !== -1) {
      const newReminders = reminders.map((reminder) => {
        if (reminder.id === reminderId) {
          return { ...reminder, date: selectedDate };
        }
        return reminder;
      });
      setReminders(newReminders);
      setReminderId(-1);
    }
  };

  const handleAddReminder = () => {
    if (newReminder.trim() === '') {
      Alert.alert('Please enter a reminder text!');
      return;
    }

    const dateToUse = reminderDate ?? new Date(); // IF NO DATE IS SELECTED, USE THE CURRENT DATE

    setReminders([
      ...reminders,
      { id: reminders.length + 1, text: newReminder, date: dateToUse },
    ]);

    // Clear the input and reset the date picker
    setNewReminder('');
    setReminderDate(new Date());

    console.log(reminders);

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
              onChangeText={(text) => setNewReminder(text)} // Assuming `setReminderText` manages the text state
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
            {/* REMINDERS MAPPING */}
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
          onChange={(event, selectedDate) => handleDateChange(selectedDate!)} // Calling handleDateChange with selectedDate
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
    fontWeight: 800,
    fontSize: 40,
    textAlign: "center",
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

  newReminder: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },

  item: {
    flexDirection: 'row', // Aligns items horizontally
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center', // Ensures the icons and text are vertically aligned
    justifyContent: 'space-between', // Distributes space between the elements
  },

  textContainer: {
    flex: 1, // Ensures the text takes available space on the left
    marginRight: 10, // Adds space between text and icons
  },

  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
