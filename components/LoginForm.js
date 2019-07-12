import React, { useState } from 'react'
import {
  ActivityIndicator, View, Text, TextInput, TouchableOpacity,
} from 'react-native'
import { func, bool } from 'prop-types'
import { loginFormStyles as styles } from './styles'

export default function LoginForm({ authLogin, authenticating }) {
  const [organization, setOrganization] = useState('')
  const [accessToken, setAccessToken] = useState('')

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Organization"
        onChangeText={setOrganization}
      />
      <TextInput
        style={styles.input}
        placeholder="Target Process Access Token"
        onChangeText={setAccessToken}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => authLogin(organization, accessToken)}
        >
          {authenticating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

LoginForm.propTypes = {
  authLogin: func.isRequired,
  authenticating: bool.isRequired,
}
