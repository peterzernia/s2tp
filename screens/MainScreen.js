import React, { Component } from 'react'
import {
  Alert, AsyncStorage, StyleSheet, Text, View, TouchableHighlight,
} from 'react-native'
import Svg, { Path } from 'react-native-svg'
import axios from 'axios'
import Voice from 'react-native-voice'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: 'red',
    width: 100,
    height: 100,
    borderRadius: 75,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
  },
  text: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
})

const ENTITY_STATES = {
  userstories: {
    open: '1',
    planned: '263',
    'in progress': '130',
    'Q&A': '135',
    'QA passed': '260',
    done: '2',
  },
  bugs: {
    open: '5',
    planned: '264',
    'in progress': '139',
    'Q&A': '6',
    'QA passed': '261',
    closed: '8',
  },
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
    entity: null,
    ticket: null,
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

    if (transcription[0] === 'bug') {
      this.setState({ entity: 'bugs' })
    } else if (transcription[0] === 'story') {
      this.setState({ entity: 'userstories' })
    } else {
      throw new Error('Invalid entity')
    }

    if (transcription.length === 3) {
      this.setState({
        ticket: transcription[1],
        state: transcription[2],
      })
    } else if (transcription.length === 4) {
      this.setState({
        ticket: transcription[1],
        state: `${transcription[2]} ${transcription[3]}`,
      })
    } else {
      throw new Error('Could not process transcription')
    }
  }

  updateTargetProcess = async () => {
    try {
      this.transcribeSpeech()
      const {
        organization, accessToken, entity, ticket, state,
      } = this.state

      // eslint-disable-next-line
      if (!ENTITY_STATES[entity].hasOwnProperty(state)) {
        throw new Error('Invalid state')
      }

      parseInt(ticket, 10)

      const url = `https://${organization}.tpondemand.com/api/v1/${entity}/${ticket}/?format=json&access_token=${accessToken}`
      const body = {
        EntityState: { Id: ENTITY_STATES[entity][state] },
      }

      const res = await axios.post(url, body)
      Alert.alert('success')
      // eslint-disable-next-line
      console.log(res)
    } catch (err) {
      // eslint-disable-next-line
      console.log(err)
      Alert.alert(err.message && err.message)
    }
  }

  render() {
    const {
      recognized, pitch, error, started, results, partialResults, end,
    } = this.state

    // eslint-disable-next-line
    console.log(recognized, pitch, partialResults, end)

    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{`Recording: ${started}`}</Text>
          <Text style={styles.text}>{`Error: ${error}`}</Text>
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

export default VoiceTest
