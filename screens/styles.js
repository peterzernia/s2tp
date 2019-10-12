import { StyleSheet } from 'react-native'

export const mainScreenStyles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
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
  logoutContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
  },
  logoutButton: {
    padding: 10,
  },
  textContainer: {
    alignSelf: 'stretch',
  },
  text: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
})

export const helpScreenStyles = StyleSheet.create({
  container: {
    width: 300,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    elevation: 10,
  },
  textContainer: {
  },
  helpText: {
    fontSize: 16,
    marginBottom: 10,
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
