import { Alert } from 'react-native'
import axios from 'axios'
import FuzzySet from 'fuzzyset.js'

export const transcribeSpeech = (results) => {
  let ticket
  let state
  const transcription = results[0].split(' ')

  // Check if ticket is a valid number
  if (Number.isNaN(parseInt(transcription[0], 10))) {
    throw new Error('Ticket must be a valid number')
  }

  if (transcription.length === 2) {
    ticket = transcription[0]
    state = transcription[1]
  } else if (transcription.length === 3) {
    ticket = transcription[0]
    state = `${transcription[1]} ${transcription[2]}`
  } else {
    throw new Error('Could not process transcription')
  }

  return {
    ticket,
    state,
  }
}

export const updateTargetProcess = async (results, organization, accessToken, entityStates) => {
  try {
    const { ticket, state } = transcribeSpeech(results)

    // Match state to closest allowed words
    const fuzzySet = FuzzySet(entityStates)
    const matchState = fuzzySet.get(state)[0][1]

    console.log({ entityStates, matchState })

    // Get the available states/ids for the ticket
    const nextStates = await axios.get(
      `https://${organization}.tpondemand.com/api/v1/assignables/${ticket}?include=[entitystate[nextstates]]&format=json&access_token=${accessToken}`,
    )

    const nextState = JSON.parse(nextStates.request.response).EntityState.NextStates.Items.find(
      item => item.Name === matchState,
    )

    if (!nextState) throw new Error('Invalid ticket state')

    const url = `https://${organization}.tpondemand.com/api/v1/assignables/${ticket}/?format=json&access_token=${accessToken}`
    const currentId = JSON.parse(nextStates.request.response).EntityState.Id
    const Id = nextState.Id

    await axios.post(url, { EntityState: { Id } })

    Alert.alert(
      'Success',
      `Moved ticket #${ticket} to ${matchState}`,
      [
        {
          text: 'Undo',
          onPress: () => axios.post(url, { EntityState: { Id: currentId } }),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
    )
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
