import React from 'react'
import { shape, func } from 'prop-types'
import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import * as Permissions from 'expo-permissions'
import {
  Alert, AsyncStorage, View, Text, TouchableOpacity, StyleSheet,
} from 'react-native'
import axios from 'axios'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  logoutButton: {
    width: 100,
    height: 50,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196f3',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  recordButton: {
    backgroundColor: 'red',
    height: 150,
    width: 150,
    borderRadius: 75,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
  },
})

const MainScreen = ({ navigation }) => {
  let recording

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('organization')
      await AsyncStorage.removeItem('accessToken')
      await AsyncStorage.removeItem('speechAPIKey')
      navigation.navigate('Login')
    } catch (err) {
      Alert.alert(err)
    }
  }

  const recordingOptions = {
    android: {
      extension: '.wav',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
      sampleRate: 8000,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 8000,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  }

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync()
    } catch (err) {
      console.log(err)
    }
  }

  const startRecording = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
    if (status !== 'granted') return

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
      staysActiveInBackground: false,
    })

    recording = new Audio.Recording()

    try {
      await recording.prepareToRecordAsync(recordingOptions)
      console.log('Recording')
      await recording.startAsync()
    } catch (error) {
      console.log(error)
      stopRecording()
    }
  }

  const deleteRecording = async () => {
    try {
      const info = await FileSystem.getInfoAsync(recording.getURI())
      await FileSystem.deleteAsync(info.uri)
      recording = null
      console.log('File deleted')
    } catch {
      // file doesn't exist
    }
  }

  const getTranscription = async () => {
    stopRecording()
    try {
      const info = await FileSystem.getInfoAsync(recording.getURI())
      // console.log(`FILE INFO: ${JSON.stringify(info)}`)
      const uri = info.uri
      const formData = new FormData()
      formData.append('uri', uri)
      const speechAPIKey = await AsyncStorage.getItem('speechAPIKey')
      // const response = await axios.post('http://192.168.1.228:8080/api/v1/speech', formData)
      const response = await axios.post(`https://speech.googleapis.com/v1/speech:recognize?key=${speechAPIKey}`, {
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 8000,
          languageCode: 'en-US',
        },
        audio: {
          uri,
        },
      })
      console.log(response)
    } catch (err) {
      console.log(err.response)
    }
    deleteRecording()
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={logout}
        style={styles.logoutButton}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.recordButton}
        onPressIn={startRecording}
        onPressOut={getTranscription}
      >
        <Text style={styles.buttonText}>Record</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MainScreen

MainScreen.propTypes = {
  navigation: shape({
    navigate: func,
  }).isRequired,
}
