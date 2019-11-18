import React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, StatusBar } from 'react-native'

export default function Main(){
    return( 
        <View style={styles.container}>
            <StatusBar translucent backgroundColor={styles.container.backgroundColor}/>

            <View style={styles.header}>
                <Text style={styles.headerText}>Dungeons</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#19A36F'
    },

    header:{
        backgroundColor: '#FFF',
        width: '100%',
        height:46,
        alignItems: "center",
        justifyContent: "center",
    },

    headerText: {
        fontFamily: "PressStart"
    }
})