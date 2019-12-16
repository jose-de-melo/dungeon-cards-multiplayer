import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import Login from './pages/login/Login'
import Main from './pages/main/Main'
import SignUp from './pages/signup/SignUp'

export default createAppContainer(
    createSwitchNavigator({
        Login,
        SignUp,
        Main
    })
)