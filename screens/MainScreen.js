import React, { Component } from 'react'
import { shape, func } from 'prop-types'
import {
  Alert, AsyncStorage, Text, View, TouchableHighlight, Switch,
} from 'react-native'
import Svg, { Path } from 'react-native-svg'
import axios from 'axios'
import Voice from 'react-native-voice'
import FuzzySet from 'fuzzyset.js'
import { STATES } from '../constants'
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
      switchValue: true,
      recognized: '',
      pitch: '',
      error: '',
      recording: '',
      results: [],
      partialResults: [],
      organization: null,
      accessToken: null,
      ticket: null, // Target Process Ticket Number
      state: null, // Open, Planned, In Progress, QA, QA Passed, Done, Closed
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
    this.setState({
      results: e.value,
    })
    await this.updateTargetProcess()
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

  transcribeSpeech = () => {
    const { results } = this.state
    const transcription = results[0].split(' ')

    // Check if ticket is a valid number
    if (Number.isNaN(parseInt(transcription[0], 10))) {
      throw new Error('Ticket must be a valid number')
    }

    if (transcription.length === 2) {
      this.setState({
        ticket: transcription[0],
        state: transcription[1],
      })
    } else if (transcription.length === 3) {
      this.setState({
        ticket: transcription[0],
        state: `${transcription[1]} ${transcription[2]}`,
      })
    } else {
      throw new Error('Could not process transcription')
    }
  }

  updateTargetProcess = async () => {
    try {
      this.transcribeSpeech()
      const {
        organization,
        accessToken,
        ticket,
      } = this.state

      // Match state to closest allowed words
      const fuzzySet = FuzzySet(STATES)
      const state = fuzzySet.get(this.state.state)[0][1]
      console.log(state, ticket)

      const nextStates = await axios.get(
        `https://${organization}.tpondemand.com/api/v1/assignables/${ticket}?include=[entitystate[nextstates]]&format=json&access_token=${accessToken}`,
      )

      console.log(JSON.parse(nextStates.request.response))

      const nextState = JSON.parse(nextStates.request.response).EntityState.NextStates.Items.find(
        item => item.Name === state,
      )

      if (!nextState) throw new Error('Invalid ticket state')

      const Id = nextState.Id

      await axios.post(
        `https://${organization}.tpondemand.com/api/v1/assignables/${ticket}/?format=json&access_token=${accessToken}`,
        { EntityState: { Id } },
      )

      Alert.alert(`Moved ticket #${ticket} to ${state}`)
    } catch (err) {
      console.log(err)
      if (err.response && err.response.status === 404) {
        Alert.alert('Ticket does not exist')
      } else if (err.response && err.response.status === 401) {
        Alert.alert('Invalid Access Token.\nPlease logout and reenter credentials.')
      } else {
        Alert.alert(err.message || 'There was an unknown error')
      }
    }
  }

  render() {
    const {
      switchValue,
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
            <Switch
              value={switchValue}
              onValueChange={(value) => {
                this.setState({ switchValue: value })
                this.authLogout()
              }
            }
            />
          </View>
          <Text style={styles.text}>{`Recording: ${recording}`}</Text>
          <Text style={styles.text}>{`Error: ${error.message || ''}`}</Text>
          <Text style={styles.text}>{`Text: ${results[0] || ''}`}</Text>
        </View>
        <TouchableHighlight
          style={styles.recordButton}
          onPressIn={this._startRecognizing}
          onPressOut={this._stopRecognizing}
        >
          <Svg width={24} height={24}>
            <Path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
            <Path d="M0 0h24v24H0z" fill="none" />
          </Svg>
        </TouchableHighlight>
        {
          // <TouchableHighlight onPress={this._cancelRecognizing}>
          //   <Text>Cancel</Text>
          // </TouchableHighlight>
          // <TouchableHighlight onPress={this._destroyRecognizer}>
          //   <Text>Destroy</Text>
          // </TouchableHighlight>
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
