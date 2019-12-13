import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import Login from './pages/login/Login'
import Main from './pages/main/Main'
import SignUp from './pages/signup/SignUp'
import Room from './pages/room/Room'

export default createAppContainer(
    createSwitchNavigator({
        Login,
        Main,
        SignUp,
        Room
    })
)