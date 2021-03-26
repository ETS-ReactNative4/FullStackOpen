import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import AppBarTab from './AppBarTab';

import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20, 
    paddingTop: 20 + Constants.statusBarHeight,
    backgroundColor: theme.colors.bar,
    opacity: .8
  }
});

const AppBar = () => {
  return <View style={styles.container}>
    <AppBarTab to="/">Repositories</AppBarTab>
    <AppBarTab to="/signin">Sign in</AppBarTab>
  </View>;
};

export default AppBar;