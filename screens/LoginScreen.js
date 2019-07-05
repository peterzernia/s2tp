import React, { useState } from 'react'
import { Alert, AsyncStorage } from 'react-native'
import { shape, func } from 'prop-types'
import axios from 'axios'
import LoginForm from '../components/LoginForm'

const LoginScreen = ({ navigation }) => {
  const [authenticating, setAuthenticating] = useState(false)
  const login = async (organization, accessToken) => {
    try {
      setAuthenticating(true)
      if (organization && accessToken) {
        await axios.get(`https://${organization}.tpondemand.com/api/v1/UserStories/?format=json&access_token=${accessToken}`)
        await AsyncStorage.setItem('organization', organization)
        await AsyncStorage.setItem('accessToken', accessToken)
        navigation.navigate('Main')
      }
    } catch (err) {
      let error
      if (typeof err.response === 'undefined') {
        error = 'Invalid organization name'
      } else if (err.response.request.status === 401) {
        error = 'Invalid Access Token'
      } else {
        error = 'Please try again'
      }
      setAuthenticating(false)
      Alert.alert(error)
    }
  }
  return (
    <LoginForm login={login} authenticating={authenticating} />
  )
}

export default LoginScreen

LoginScreen.propTypes = {
  navigation: shape({
    navigate: func,
  }).isRequired,
}
