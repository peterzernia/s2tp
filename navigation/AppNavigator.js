import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import LoginScreen from '../screens/LoginScreen'
import HelpScreen from '../screens/HelpScreen'
import MainScreen from '../screens/MainScreen'

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Login: LoginScreen,
    Help: HelpScreen,
    Main: MainScreen,
  },
  {
    initialRouteName: 'AuthLoading',
  },
)

const AppContainer = createAppContainer(AppNavigator)

export default AppContainer
