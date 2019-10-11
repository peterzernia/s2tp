import React, { Component } from 'react'
import { shape, func } from 'prop-types'
import {
  AsyncStorage, Text, View, TouchableOpacity,
} from 'react-native'
import Svg, { Path } from 'react-native-svg'
import Voice from 'react-native-voice'
import { updateTargetProcess } from '../utils'
import { mainScreenStyles as styles } from './styles'

export default class MainScreen extends Component {
  constructor(props) {
    super(props)
    Voice.onSpeechStart = this.onSpeechStart
    Voice.onSpeechRecognized = this.onSpeechRecognized
    Voice.onSpeechEnd = this.onSpeechEnd
    Voice.onSpeechError = this.onSpeechError
    Voice.onSpeechResults = this.onSpeechResults
    Voice.onSpeechPartialResults = this.onSpeechPartialResults
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged

    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      recording: '',
      results: [],
      partialResults: [],
      organization: null,
      accessToken: null,
    }
  }

  async componentDidMount() {
    const organization = await AsyncStorage.getItem('organization')
    const accessToken = await AsyncStorage.getItem('accessToken')
    this.setState({ organization, accessToken })
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners)
  }

  authLogout = async () => {
    const { navigation } = this.props
    await AsyncStorage.removeItem('organization')
    await AsyncStorage.removeItem('accessToken')
    navigation.navigate('Login')
  }

  onSpeechStart = (e) => {
    console.log('onSpeechStart: ', e)
    this.setState({
      recording: '√',
    })
  }

  onSpeechRecognized = (e) => {
    console.log('onSpeechRecognized: ', e)
    this.setState({
      recognized: '√',
    })
  }

  onSpeechEnd = (e) => {
    console.log('onSpeechEnd: ', e)
    this.setState({
      recording: '',
    })
  }

  onSpeechError = (e) => {
    console.log('onSpeechError: ', e)
    this.setState({
      error: e.error,
      recording: '',
    })
  }

  onSpeechResults = async (e) => {
    console.log('onSpeechResults: ', e)
    const { organization, accessToken } = this.state

    this.setState({ results: e.value })

    await updateTargetProcess(e.value, organization, accessToken)
  }

  onSpeechPartialResults = (e) => {
    console.log('onSpeechPartialResults: ', e)
    this.setState({
      partialResults: e.value,
    })
  }

  onSpeechVolumeChanged = (e) => {
    console.log('onSpeechVolumeChanged: ', e)
    this.setState({
      pitch: e.value,
    })
  }

  _startRecognizing = async () => {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      recording: '',
      results: [],
      partialResults: [],
    })

    try {
      await Voice.start('en_US')
    } catch (e) {
      console.error(e)
    }
  }

  _stopRecognizing = async () => {
    try {
      await Voice.stop()
    } catch (e) {
      console.error(e)
    }
  }

  _cancelRecognizing = async () => {
    try {
      await Voice.cancel()
    } catch (e) {
      console.error(e)
    }
  }

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy()
    } catch (e) {
      console.error(e)
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      recording: '',
      results: [],
      partialResults: [],
    })
  }

  render() {
    const {
      recognized,
      pitch,
      error,
      recording,
      results,
      partialResults,
    } = this.state

    console.log(recognized, pitch, partialResults)

    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={this.authLogout}
            >
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>{`Recording: ${recording}`}</Text>
          <Text style={styles.text}>{`Error: ${error.message || ''}`}</Text>
          <Text style={styles.text}>{`Text: ${results[0] || ''}`}</Text>
        </View>
        <TouchableOpacity
          style={styles.recordButton}
          onPressIn={this._startRecognizing}
          onPressOut={this._stopRecognizing}
        >
          <Svg width={24} height={24}>
            <Path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
            <Path d="M0 0h24v24H0z" fill="none" />
          </Svg>
        </TouchableOpacity>
        {
          // <TouchableOpacity onPress={this._cancelRecognizing}>
          //   <Text>Cancel</Text>
          // </TouchableOpacity>
          // <TouchableOpacity onPress={this._destroyRecognizer}>
          //   <Text>Destroy</Text>
          // </TouchableOpacity>
        }
      </View>
    )
  }
}

MainScreen.propTypes = {
  navigation: shape({
    navigate: func,
  }).isRequired,
}
