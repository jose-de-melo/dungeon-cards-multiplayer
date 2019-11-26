import  React, {useState} from 'react';
import { Keyboard, ToastAndroid, Text, TextInput, TouchableOpacity, StyleSheet, View, StatusBar } from 'react-native'


export default function SignUp({navigation}){
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [email, setEmail] = useState('')
    const [checkPass, setCheckPass] = useState(true)

    function showToast(message){
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            0,
            30,
        );
    }


    function createUser(){
        Keyboard.dismiss()

        if(password != confirmPass){
            setCheckPass(false)
            setConfirmPass('')
            showToast("As senhas não batem!")
        }else{
            setCheckPass(true)
        }



        
    }

    return(
        <View style={styles.container}>
            <StatusBar translucent backgroundColor={'#214'} />
            <Text style={styles.title}>Sign Up</Text>
            
            <Text style={styles.inputText}>Nickname</Text>
            <TextInput
                
                placeholder="Nickname"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                value={user}
                onChangeText={setUser}
            />


            <Text style={styles.inputText}>Email</Text>
            <TextInput
                placeholder="Email"
                textContentType="emailAddress"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
            />

            <Text style={styles.inputText}>Password</Text>
            <TextInput
                secureTextEntry={true}
                placeholder="Password"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onChangeText={setPassword}
            />

            <Text style={styles.inputText}>Confirm password</Text>
            <TextInput
                secureTextEntry={true}
                placeholder="Password"
                style={checkPass ? styles.input : styles.inputError}
                autoCapitalize="none"
                autoCorrect={false}
                value={confirmPass}
                onChangeText={setConfirmPass}
            />


            <TouchableOpacity style={styles.button} onPress={createUser}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buttonLink}
                onPress={() => navigation.navigate('Login') }
            >
                <Text style={styles.link}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#214',
        justifyContent: 'center',
        alignItems: 'center'
    },

    title: {
        fontFamily: 'PressStart',
        color: '#FFF',
        fontSize: 35
    },

    input:{
        height: 46,
        width: 250,
        backgroundColor: '#fafafa',
        borderColor: '#fafafa',
        borderWidth:1,
        borderRadius:4,
        paddingHorizontal:15,
    },

    link: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold'
    },

    buttonLink: {
        marginTop: 10,
        width: 125,
        height:46,
        borderWidth:1,
        borderColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },

    inputText:{
        color: '#FFF',
        marginTop: 20,
        marginBottom: 5,
        fontFamily: 'PressStart'
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
        
    },

    buttonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold'
    },

    inputError:{
        height: 46,
        width: 250,
        backgroundColor: '#fafafa',
        borderColor: '#d32f2f',
        borderWidth:2,
        borderRadius:4,
        paddingHorizontal:15,
    }



})