import React, { useState } from 'react';
import { Text, FlatList, View, Dimensions, StyleSheet, Image, TouchableOpacity, StatusBar, YellowBox } from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'
import io from 'socket.io-client'
import imagens  from './../../../assets/imagens'

const config = require('../../config/config')

let numberGrid = 6
let numColumns = 6
let postAtual = 0
var socket = null



export default function Room({ navigation }){
    const [data, setData] = useState([])
    const [user, setUser] = useState('')
    const [emit, setEmit] = useState(true)
    const [gameOn, setGameOn] = useState(false)
    const [players, setPlayers] = useState(0)

    const getUser = async () => {
        const nick = await AsyncStorage.getItem('nickname')
        setUser(nick)
    }

    getUser()

    if(socket == null)
        socket = io.connect(config.IP_SOCKET_IO)

    if(user != '' && emit){    
        socket.emit('pushPlayer', user)
        setEmit(false)
    }

    socket.on('attMatriz', matriz => {
        setData(JSON.parse(matriz))
    })

    socket.on('newPlayer', numberOfPlayers => {
        console.log("NEW PLAYER")
        setPlayers(numberOfPlayers)
    })

    socket.on('gameStart', numberOfPlayers => {
        console.log(numberOfPlayers)
        setGameOn(true)
    })

    function move(item, index){
        socket.emit('move', index)
    }

    function exitOfGame(){
        socket.close()
    }

    const renderItem = ({ item, index }) => {
        console.log(item)
        return (
            <TouchableOpacity style={styles.item} onPress={exitOfGame}>
                 <View>
                    <Image
                        source={imagens[item.tipo][item.image]}
                        style={styles.image}
                    />
                </View>
            </TouchableOpacity>
        )
    }


    return ( <>
                {
                    (gameOn) 
                    ?
                            <FlatList
                                keyExtractor={(_, index) => index}
                                contentContainerStyle={styles.container}
                                numColumns={numberGrid} data={data}
                                renderItem={renderItem}
                            />
                    : 
                    <>
                        <StatusBar translucent backgroundColor={styles.waiting.backgroundColor}/>
                        <View style={styles.waiting}>
                            <Text style={styles.textWaiting}>
                                Aguardando{"\n\n"}players...
                            </Text>

                            <Text style={styles.textWaiting}>
                                {"\n"}{players}/4
                            </Text>
                        </View>
                    </>
                }
    
    
    </> )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 130
    },

    item: {
        backgroundColor: '#4D243D',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1,
        height: Dimensions.get('window').width / numColumns
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
    },

    waiting: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        backgroundColor: "#263238"
    },

    textWaiting: {
        fontFamily: "PressStart",
        color: '#FFF',
        fontSize: 25,
        
    }
});
