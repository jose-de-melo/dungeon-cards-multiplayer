import React, { useState } from 'react';
import { Text, FlatList, View, Dimensions, StyleSheet, Image, TouchableOpacity, StatusBar, YellowBox } from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'
import io from 'socket.io-client'

const config = require('../../config/config')

let numberGrid = 6
let numColumns = 6
let postAtual = 0
var socket = null



export default function Room({ navigation }){
    const [data, setData] = useState([])
    const [user, setUser] = useState('')
    const [emit, setEmit] = useState(true)

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

    function move(item, index){
        socket.emit('move', index)
    }

    const renderItem = ({ item, index }) => {
        console.log(item[0].name)
        return (
            <TouchableOpacity style={styles.item}>
                 <View>
                    <Image source={require('../../images/hero.png')} style={styles.image}/>
                </View>
            </TouchableOpacity>
        )
    }


    return (
            <FlatList
                keyExtractor={(_, index) => index}
                contentContainerStyle={styles.container}
                numColumns={numberGrid} data={data}
                renderItem={renderItem}
            />
    )
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
