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
