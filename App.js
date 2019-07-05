import * as React from 'react'
import {
  Platform, StatusBar, StyleSheet, View,
} from 'react-native'
import AppNavigator from './navigation/AppNavigator'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const App = () => (
  <View style={styles.container}>
    {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
    <AppNavigator />
  </View>
)

export default App
