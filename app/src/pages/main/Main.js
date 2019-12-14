import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, StatusBar, YellowBox } from 'react-native'

const utils = require('../../utils/utils')

import AsyncStorage from '@react-native-community/async-storage'
import io from 'socket.io-client'


YellowBox.ignoreWarnings(['Unrecognized WebSocket']);

import api from '../../services/api'

export default function Main({ navigation }){

    const [nickname, setNickname] = useState('')
    const [pdl, setPdl] = useState(0)
    const [wins, setWins] = useState(0)
    const [loses, setLoses] = useState(0)

    const setUser = async (nickname) => {
        await AsyncStorage.setItem('nickname', nickname)
    }

    function testSocket(){
        const socket = io('http://192.168.1.107:3001');

        console.log(socket.id)

        socket.emit('iniciar', socket.id)
        
        socket.on('attMatriz', function(message){
                alert(message)
        })
    }

    const newGame = async () => {
        await api.get('/game/numberOfPlayersOnRoom')
        .then(response => {
            if(response.data.code == 200){
                const { numberOfPlayers } = response.data

                if(numberOfPlayers < 4){
                    navigation.navigate('Room')
                }
                else{
                    utils.showToastLong('Servidor cheio! Aguarde...')
                } 
            }
          })
        .catch(error => {
            alert(error)
        })
    }

let numberGrid = 6
let numColumns = 6
let postAtual = 0

export default class App extends Component {
    state = {
        data: data
    }

<<<<<<< HEAD
    componentDidMount() {
        // this.obterposicoes()
        this.iniciar()
    }

    movimentar = async (item, index) => {
        const response = await api.post('/game/movimentar/', { x_atual: item, y_atual: 4, x_mov: 2, y_mov: 4 })

        if (response.message == 0) {
            alert("Movimento Inválido!")

        } else {
            let jogador = this.state.data[postAtual]
            this.state.data[postAtual] = item
            this.state.data[index] = jogador
            postAtual = index

            this.setState(this.state)
            
            console.log(response)

        }
    };



        iniciar = async () => {
            // const response = await api.post('/game/join/', {nickname: "Lucas Heber", socket: 1})
            // const response = await api.post('/game/join/', {nickname: "Domith", socket: 2})
            // const response = await api.post('/game/join/', {nickname: "Ricardo", socket: 3})
            const response = await api.post('/game/join/', { nickname: "Outro Ze", socket: 4 })

            console.log(response)
        }

        obterposicoes = async () => {
            const response = await api.get('/game/iniciar')
            console.log(response)
        }

        renderItem = ({ item, index }) => {
            return (
                <TouchableOpacity style={styles.item} onPress={() => this.movimentar(item, index)}>
                    <View>
                        <Image source={item.avatar} style={styles.image} />
                    </View>
                </TouchableOpacity>
            )
        }

        render() {
            return <FlatList
                keyExtractor={(_, index) => index}
                contentContainerStyle={styles.container}
                numColumns={numberGrid} data={this.state.data}
                renderItem={this.renderItem} />
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginVertical: 130,
        },
        item: {
            backgroundColor: '#4D243D',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            margin: 1,
            height: Dimensions.get('window').width / numColumns, // approximate a square
        },
        itemInvisible: {
            backgroundColor: 'transparent',
        },
        itemText: {
            color: '#fff',
        },
        image: {
            flex: 1,
            width: 80,
            resizeMode: 'contain'
        }
    });
=======
    const getInfoPlayer = async () => {
        const idUser = await AsyncStorage.getItem("id")

        await api.get(`/users/infoPlayers/${idUser}`)
        .then(response => {
            if(response.data.code == 200){
                const { user } = response.data
                setUser(user.name)
                setNickname(user.name)
                setPdl(user.PDL)
                setWins(user.vitorias)
                setLoses(user.derrotas)
            }
          })
        .catch(error => {
            alert(error)
        })

    }

    getInfoPlayer()

    //logout()

    

    return( 
        <View style={styles.container}>
            <StatusBar translucent backgroundColor={styles.container.backgroundColor}/>

            
            <Image
                style={styles.img}
                source={require('../../images/hero.png')}
            />


            <View style={styles.header}>
                <Text style={styles.headerText}>{nickname}</Text>
            </View>

            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Text style={styles.values}>{pdl}</Text>
                    <Text style={styles.labels}>PDL</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.values}>{wins}</Text>
                    <Text style={styles.labels}>WINS</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.values}>{loses}</Text>
                    <Text style={styles.labels}>LOSES</Text>
                </View>

            </View>

            <TouchableOpacity style={styles.button} onPress={newGame}>
                <Text style={styles.buttonText}>PLAY</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6a1b9a'
    },

    header:{
        width: '100%',
        height:46,
        alignItems: "center",
        justifyContent: "center"
    },

    headerText: {
        fontFamily: "PressStart",
        color: "#FFF",
        fontSize: 20
    },

    card: {
        backgroundColor: "#FFF",
        width: 100,
        height:100,
        justifyContent:"center",
        alignItems:"center",
        marginRight: 5,
        marginLeft: 5
    },

    values:{
        fontFamily: "PressStart",
        fontSize: 35
    },

    labels:{
        fontFamily: "PressStart",
        fontSize: 10
    },

    cardContainer: {
        flexDirection: "row"
    },

    button:{
        borderWidth:2,
        borderColor: '#FFF',
        width: 200,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 40,
    },

    buttonText:{
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 17
    },

    img: {
        marginRight: 30,
        marginBottom: 30
    },
})
>>>>>>> 19d0067939cb2572373b1cf0684ab62dd44b7000
