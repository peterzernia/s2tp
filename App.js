import * as React from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import AppNavigator from './navigation/AppNavigator'
import MainScreen from './screens/MainScreen'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: StatusBar.currentHeight,
        paddingBottom: StatusBar.currentHeight,
    }
})

const App = () => (
    <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
    </View>
)

export default App
