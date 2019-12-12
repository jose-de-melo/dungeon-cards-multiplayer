import React, { useState } from 'react';

import { Text, View, StyleSheet, TextInput, TouchableOpacity, StatusBar, Image } from 'react-native'


export default function Login({ navigation }) {
    const [user, setUser,] = useState('')


    async function handleLogin() {
        //const response = await api.post('/devs')

        console.log({ user })
        navigation.navigate('Main')
    }


    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor={'#7e57c2'} />

            <Image
                style={styles.img}
                source={require('../../images/hero.png')}
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