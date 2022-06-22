import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  toolbar: {
    justifyContent: 'center',
    minHeight: 22,
    boxShadow: 'inset 0 1px 0 #f5f4f5',
    backgroundColor: '#e8e6e8',
    borderBottomColor: '#red',
    borderBottomWidth: 1,
  },
  title: {
    marginTop: 1,
    textAlign: 'center',
  },
});

const TopBar = () => (
  <View style={styles.toolbar}>
    <Text style={styles.title}>We do not listen, we do not hear.</Text>
  </View>
);

export default TopBar;
