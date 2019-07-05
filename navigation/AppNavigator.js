import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import LoginScreen from '../screens/LoginScreen'
import MainScreen from '../screens/MainScreen'

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Login: LoginScreen,
    Main: MainScreen,
  },
  {
    initialRouteName: 'AuthLoading',
  },
)

const AppContainer = createAppContainer(AppNavigator)

export default AppContainer
