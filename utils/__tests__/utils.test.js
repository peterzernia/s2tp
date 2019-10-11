import { transcribeSpeech } from '../index'

describe('transcribe speech tests', () => {
  it('parses ticket number', () => {
    const results = ['test results']
    try {
      transcribeSpeech(results)
    } catch (err) {
      expect(err).toEqual(new Error('Ticket must be a valid number'))
    }
  })

  it('throws error if transcription is too long', () => {
    const results = ['6514 in progress test']
    try {
      transcribeSpeech(results)
    } catch (err) {
      expect(err).toEqual(new Error('Could not process transcription'))
    }
  })

  it('correctly transcribes results', () => {
    let results = ['6514 open']
    let transcription = transcribeSpeech(results)
    expect(transcription).toEqual({ ticket: '6514', state: 'open' })

    results = ['5139 in progress']
    transcription = transcribeSpeech(results)
    expect(transcription).toEqual({ ticket: '5139', state: 'in progress' })
  })
})
