import React, { useState } from 'react';

<<<<<<< HEAD
import { Text, View, StyleSheet, TextInput, TouchableOpacity, StatusBar, Image } from 'react-native'
=======
import { Text, View, StyleSheet, TextInput, TouchableOpacity, StatusBar, Image, Keyboard } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

>>>>>>> 19d0067939cb2572373b1cf0684ab62dd44b7000


<<<<<<< HEAD
export default function Login({ navigation }) {
    const [user, setUser,] = useState('')
=======
export default function Login({ navigation }){
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
>>>>>>> 19d0067939cb2572373b1cf0684ab62dd44b7000


<<<<<<< HEAD
    async function handleLogin() {
        //const response = await api.post('/devs')

        console.log({ user })
        navigation.navigate('Main')
=======
        if(token != null){
            navigation.navigate("Main")
        }
    }

    isLogged()

    async function saveInfo(token, user) {
        await AsyncStorage.setItem("token", "Bearer " + token)
        await AsyncStorage.setItem("id", user._id)
    }


    async function handleLogin(){
        Keyboard.dismiss()

        
        await api.post('/users/authenticate',{
             "name": user,
             "password": password
        })
        .then(response => {
            if(response.data.code == 200){
                const { token, user } = response.data
                saveInfo(token, user)
                navigation.navigate('Main')
            }
          })
        .catch(error => {
            alert(error)
        })
>>>>>>> 19d0067939cb2572373b1cf0684ab62dd44b7000
    }


    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor={'#7e57c2'} />

            <Image
                style={styles.img}
                source={require('./../../../assets/imagens/heroi/templario.png')}
            />

            <Text style={styles.text}>Dungeons</Text>
            <Text style={styles.text}>MMO</Text>
            <TextInput
                placeholder="Nickname"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                value={user}
                onChangeText={setUser}
            />

            <TextInput
                secureTextEntry={true}
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <Text style={styles.createText}>Don't have account ?
            </Text>

            <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
            >
                <Text style={styles.link}>Create here</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7e57c2',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },

    img: {
        marginRight: 30
    },

    text: {
        marginTop: 10,
        color: '#fff',
        fontSize: 30,
        fontFamily: 'PressStart'
    },

    input: {
        height: 46,
        width: 250,
        backgroundColor: '#fafafa',
        borderColor: '#fafafa',
        borderWidth: 1,
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15,
    },

    button: {
        height: 46,
        width: 125,
        backgroundColor: '#6200ea',
        borderWidth: 1,
        borderColor: '#651fff',
        borderRadius: 4,
        marginTop: 25,
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 12

    },

    buttonText: {
        color: '#FFF',
        fontSize: 15,

    },

    createText: {
        color: '#FFF',
        marginTop: 20,
        fontSize: 15,

    },

    link: {
        marginTop: 5,
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 15
    }

})