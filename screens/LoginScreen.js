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
        // Get all available entity states for all entities
        const res = await axios.get(`https://${organization}.tpondemand.com/api/v1/EntityStates/?include=[Name]&format=json&take=10000&access_token=${accessToken}`)

        const allEntityStates = JSON.parse(res.request.response).Items.map(
          item => item.Name,
        )

        const entityStates = [...new Set(allEntityStates)]

        await Promise.all([
          AsyncStorage.setItem('organization', organization),
          AsyncStorage.setItem('accessToken', accessToken),
          AsyncStorage.setItem('entityStates', JSON.stringify(entityStates)),
        ])

        navigation.navigate('Main')
      } else {
        Alert.alert('Credentials cannot be blank')
      }
    } catch (err) {
      let error
      console.log(err)
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
    <LoginForm
      authLogin={authLogin}
      authenticating={authenticating}
      navigation={navigation}
    />
  )
}

LoginScreen.propTypes = {
  navigation: shape({
    navigate: func,
  }).isRequired,
}
