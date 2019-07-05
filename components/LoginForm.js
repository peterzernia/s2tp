import React, { useState } from 'react'
import {
  ActivityIndicator, View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native'
import { func, bool } from 'prop-types'

const styles = StyleSheet.create({
  container: {
    width: 300,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    elevation: 10,
  },
  input: {
    height: 50,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196f3',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
})

const LoginForm = (props) => {
  const { login, authenticating } = props
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
          onPress={() => login(organization, accessToken)}
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

export default LoginForm

LoginForm.propTypes = {
  login: func.isRequired,
  authenticating: bool.isRequired,
}
