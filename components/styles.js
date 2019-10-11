import { StyleSheet } from 'react-native'

export const loginFormStyles = StyleSheet.create({
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196f3',
    borderRadius: 10,
  },
  helpButton: {
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
  },
  helpText: {
    color: '#2196f3',
    fontSize: 20,
  },
})
