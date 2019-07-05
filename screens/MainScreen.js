import React, { Component } from 'react'
import {
  Alert, AsyncStorage, StyleSheet, Text, View, Image, TouchableHighlight,
} from 'react-native'
import axios from 'axios'

import Voice from 'react-native-voice'
import button from './button.png'

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 100,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
})

const ENTITY_STATES = {
  open: '1',
  planned: '263',
  'in progress': '130',
  'Q&A': '135',
  'QA passed': '260',
  done: '2',
}

class VoiceTest extends Component {
  state = {
    recognized: '',
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
    organization: null,
    accessToken: null,
    userStory: null,
    state: null,
  };

  constructor(props) {
    super(props)
    Voice.onSpeechStart = this.onSpeechStart
    Voice.onSpeechRecognized = this.onSpeechRecognized
    Voice.onSpeechEnd = this.onSpeechEnd
    Voice.onSpeechError = this.onSpeechError
    Voice.onSpeechResults = this.onSpeechResults
    Voice.onSpeechPartialResults = this.onSpeechPartialResults
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged
  }

  async componentDidMount() {
    const organization = await AsyncStorage.getItem('organization')
    const accessToken = await AsyncStorage.getItem('accessToken')
    this.setState({ organization, accessToken })
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners)
  }

  onSpeechStart = (e) => {
    // eslint-disable-next-line
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
    })
  };

  onSpeechRecognized = (e) => {
    // eslint-disable-next-line
    console.log('onSpeechRecognized: ', e);
    this.setState({
      recognized: '√',
    })
  };

  onSpeechEnd = (e) => {
    // eslint-disable-next-line
    console.log('onSpeechEnd: ', e);
    this.setState({
      end: '√',
    })
  };

  onSpeechError = (e) => {
    // eslint-disable-next-line
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    })
  };

  onSpeechResults = async (e) => {
    // eslint-disable-next-line
    console.log('onSpeechResults: ', e);
    this.setState({
      results: e.value,
    })
    await this.updateTargetProcess()
  };

  onSpeechPartialResults = (e) => {
    // eslint-disable-next-line
    console.log('onSpeechPartialResults: ', e);
    this.setState({
      partialResults: e.value,
    })
  };

  onSpeechVolumeChanged = (e) => {
    // eslint-disable-next-line
    console.log('onSpeechVolumeChanged: ', e);
    this.setState({
      pitch: e.value,
    })
  };

  _startRecognizing = async () => {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    })

    try {
      await Voice.start('en_US')
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    try {
      await Voice.stop()
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    try {
      await Voice.cancel()
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy()
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    })
  };

  transcribeSpeech = () => {
    const { results } = this.state
    const transcription = results[0].split(' ')
    if (transcription.length === 2) {
      this.setState({
        userStory: transcription[0],
        state: transcription[1],
      })
    } else if (transcription.length === 3) {
      this.setState({
        userStory: transcription[0],
        state: `${transcription[1]} ${transcription[2]}`,
      })
    } else {
      throw new Error('Transcription too long')
    }
  }

  updateTargetProcess = async () => {
    try {
      this.transcribeSpeech()
      const {
        organization, accessToken, userStory, state,
      } = this.state

      // eslint-disable-next-line
      if (!ENTITY_STATES.hasOwnProperty(state)) {
        throw new Error('Invalid state')
      }

      const url = `https://${organization}.tpondemand.com/api/v1/UserStories/${userStory}/?format=json&access_token=${accessToken}`
      const body = {
        EntityState: { Id: ENTITY_STATES[state] },
      }

      const res = await axios.post(url, body)
      Alert.alert('success')
      console.log(res)
    } catch (err) {
      console.log(err)
      Alert.alert(err.message && err.message)
    }
  }

  render() {
    const {
      recognized, pitch, error, started, results, partialResults, end,
    } = this.state

    console.log(recognized, pitch, partialResults, end)

    return (
      <View style={styles.container}>
        <Text style={styles.stat}>{`Recording: ${started}`}</Text>
        <Text style={styles.stat}>{`Error: ${error}`}</Text>
        <Text style={styles.stat}>{`Text: ${results[0] || ''}`}</Text>
        <TouchableHighlight onPressIn={this._startRecognizing} onPressOut={this._stopRecognizing}>
          <Image style={styles.button} source={button} />
        </TouchableHighlight>
        {
          // <TouchableHighlight onPress={this._cancelRecognizing}>
          //   <Text style={styles.action}>Cancel</Text>
          // </TouchableHighlight>
          // <TouchableHighlight onPress={this._destroyRecognizer}>
          //   <Text style={styles.action}>Destroy</Text>
          // </TouchableHighlight>
        }
      </View>
    )
  }
}

export default VoiceTest
