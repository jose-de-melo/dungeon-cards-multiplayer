import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import data from './data'
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/',
});

let numberGrid = 3
let numColumns = 3
let postAtual = 0

export default class App extends Component {
    state = {
        data: data
    }

    componentDidMount(){
        this.obterposicoes()
    }

    movimentar = (item, index) => {
        let jogador = this.state.data[postAtual]
        this.state.data[postAtual] = item
        this.state.data[index] = jogador
        postAtual = index

        this.setState(this.state)
        console.log()
    };

    obterposicoes = async () => {
        const response = await api.get('/salas/create')
        console.log(response)
    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.item} onPress={() => this.movimentar(item, index)}>
                 <View>
                    <Image source={item.avatar} style={styles.image}/>
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
        marginVertical: 20,
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