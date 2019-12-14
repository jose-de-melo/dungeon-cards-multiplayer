import React, { useState } from 'react';
import { Text, FlatList, View, Dimensions, StyleSheet, Image, TouchableOpacity, StatusBar, YellowBox } from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'
import io from 'socket.io-client'
import imagens  from './../../../assets/imagens'

const config = require('../../config/config')

let numberGrid = 3
let numColumns = 3
var socket = null

var player_x = 0
var player_y = 0



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

    const renderizarMatriz = async (matriz) => {
        
        await getUser()
        //console.log(user)
        
        // Encontrar jogador
        for (var i = 0; i < matriz.length; i++) {
            for (var j = 0; j < matriz[i].length; j++) {
                let item = matriz[i][j]
                console.log(item)
                if (item.nick == user) {
                    console.log("ENTROU")
                    //console.log(item);
                    player_x = item.x
                    player_y = item.y
                }
            }
        }

        // Encontrar x e y a ser exibido no FlatList
        let x_view = 0 
        let y_view = 0

        //console.log(player_x)
        //console.log(player_y)
        switch(player_x){
            case 0: x_view = 0; break;
            case 5: x_view = player_x - 2; break;
            default: x_view = player_x - 1
        }

        switch(player_y){
            case 0: y_view = 0; break;
            case 5: y_view = player_y - 2; break;
            default: y_view = player_y - 1
        }

        var list = []
        //console.log('inicio', x_view)
        //console.log('inicio', y_view)

        for(var x=x_view; x < (x_view+3); x++){
            for(var y=y_view; y < (y_view+3); y++){
                
                let item = matriz[x][y]
                console.log(item)
                list.push(item)
                //console.log(x, y)
            }
        }

        setData(list)
        //console.log(matriz)
    }

    if(socket == null)
        socket = io.connect(config.IP_SOCKET_IO)

    if(user != '' && emit){    
        socket.emit('pushPlayer', user)
        socket.emit('pushPlayer', 'Ricardo')
        socket.emit('pushPlayer', 'Domith')
        socket.emit('pushPlayer', 'Lucas')
        setEmit(false)
    }

    socket.on('attMatriz', matriz => {
        setData(JSON.parse(matriz))
    })

    socket.on('newPlayer', numberOfPlayers => {
        //console.log("NEW PLAYER")
        setPlayers(numberOfPlayers)
    })

    socket.on('gameStart', matriz => {
        renderizarMatriz(JSON.parse(matriz))
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
