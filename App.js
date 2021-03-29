import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Focus } from './src/features/focus/Focus';
import { Timer } from './src/features/timer/Timer';
import { FocusHistory } from './src/features/focus/FocusHistory';
import { colors } from './src/utils/colors';
import { spacing } from './src/utils/sizes';

const STATUSES = { COMPLETE: 1, CANCELLED: 2 };

export default function App() {
  const [focusSubject, setFocusSubject] = useState(null);
  const [history, setHistory] = useState([]);

  const addHistorySubjectWithStatus = (subject, status) => {
    setHistory([...history, { key: String(history.length + 1), subject, status }]);
  };

  const onClear = () => setHistory([]);

  const saveHistory = async () => {
    try {
      await AsyncStorage.setItem('history', JSON.stringify(history));
    } catch (e) {
      console.log(e);
    }
  };

  const loadHistory = async () => {
    try {
      const h = await AsyncStorage.getItem('history');
      if (h && JSON.parse(h).length) {
        setHistory(JSON.parse(h));
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {loadHistory();}, []);

  useEffect(() => {saveHistory();}, [history]);

  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer
          focusSubject={focusSubject}
          onTimerEnd={() => {
            addHistorySubjectWithStatus(focusSubject, STATUSES.COMPLETE);
            setFocusSubject(null);
          }}
          clearSubject={() => {
            addHistorySubjectWithStatus(focusSubject, STATUSES.CANCELLED);
            setFocusSubject(null);
          }}
        />
      ) : (
        <View style={{flex: 1}}>
          <Focus addSubject={setFocusSubject} />
          <FocusHistory history={history} onClear={onClear} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? spacing.lg : spacing.xl,
    backgroundColor: colors.darkBlue,
  },
});
