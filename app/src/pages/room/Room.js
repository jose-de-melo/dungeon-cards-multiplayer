import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, StatusBar, YellowBox } from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'
import io from 'socket.io-client'

const config = require('../../config/config')


export default function Room({ navigation }){
    const [data, setData] = useState([[]])

    var socket = io.connect(config.IP_SOCKET_IO)

    socket.on('iniciarGame', function(matriz){
        setData(matriz)
    })

    socket.on('attMatriz', function(matriz){
        setData(matriz)
    })

    function move(item, index){
        socket.emit('move', index)
    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.item} onPress={move(item, index)}>
                 <View>
                    <Image source={item.avatar} style={styles.image}/>
                </View>
            </TouchableOpacity>
        )
    }


    return (
        <View>
            <StatusBar translucent backgroundColor={styles.container.backgroundColor}/>

            <FlatList
                keyExtractor={(_, index) => index}
                contentContainerStyle={styles.container}
                numColumns={numberGrid} data={data}
                renderItem={renderItem}
            />
        </View>
        
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
