import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import Login from './pages/login/Login'
import Main from './pages/main/Main'
import Main2 from './pages/main/Main2'
import SignUp from './pages/signup/SignUp'
import Room from './pages/room/Room'

export default createAppContainer(
    createSwitchNavigator({
        Login,
        Main,
        SignUp,
        Room,
        Main2
    })
)