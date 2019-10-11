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
