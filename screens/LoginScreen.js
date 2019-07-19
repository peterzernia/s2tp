import React, { useState } from 'react'
import { Alert, AsyncStorage } from 'react-native'
import { shape, func } from 'prop-types'
import axios from 'axios'
import LoginForm from '../components/LoginForm'

export default function LoginScreen({ navigation }) {
  const [authenticating, setAuthenticating] = useState(false)
  const authLogin = async (organization, accessToken) => {
    try {
      setAuthenticating(true)
      if (organization && accessToken) {
        await axios.get(`https://${organization}.tpondemand.com/api/v1/UserStories/?format=json&access_token=${accessToken}`)
        await AsyncStorage.setItem('organization', organization)
        await AsyncStorage.setItem('accessToken', accessToken)
        navigation.navigate('Main')
      } else {
        Alert.alert('Credentials cannot be blank')
      }
    } catch (err) {
      let error
      if (typeof err.response === 'undefined') {
        error = 'Invalid organization name'
      } else if (err.response.status === 401) {
        error = 'Invalid Access Token'
      } else {
        error = 'Please try again'
      }
      Alert.alert(error)
      setAuthenticating(false)
    }
  }

  return (
    <LoginForm authLogin={authLogin} authenticating={authenticating} />
  )
}

LoginScreen.propTypes = {
  navigation: shape({
    navigate: func,
  }).isRequired,
}
