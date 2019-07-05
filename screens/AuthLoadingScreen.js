import React, { useEffect } from 'react'
import {
  Alert, ActivityIndicator, AsyncStorage, StatusBar, View,
} from 'react-native'
import { shape, func } from 'prop-types'


const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const organization = await AsyncStorage.getItem('organization')
        const accessToken = await AsyncStorage.getItem('accessToken')

        if (organization === null || accessToken === null) {
          navigation.navigate('Login')
        } else {
          navigation.navigate('Main')
        }
      } catch (err) {
        Alert.alert(err)
      }
    }

    checkAuthentication()
  }, [navigation])

  return (
    <View>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  )
}

export default AuthLoadingScreen

AuthLoadingScreen.propTypes = {
  navigation: shape({
    navigate: func,
  }).isRequired,
}
