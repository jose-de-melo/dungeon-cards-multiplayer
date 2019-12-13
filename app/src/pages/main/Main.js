import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import imagens  from './../../../assets/imagens'
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.105:3000/',
});

let numberGrid = 6
let numColumns = 6
let nickname = "Outro Ze"
let player_y = 0;
let player_X = 0 ;

export default class App extends Component {
    state = {
        data: []
    }

    componentDidMount(){
        //this.cadastrar_usuario()
        this.iniciar()
    }

    iniciar = async () => {
        const response = await api.get('/game/iniciar')
        this.renderizarMatriz(response.data.matriz)
    }

    renderizarMatriz = (matriz) => {
        this.state.data = []

        for(var i=0; i < matriz.length; i++){
            for(var j=0; j < matriz[i].length; j++){
                var item = matriz[i][j]
                this.state.data.push(item)

                if(item.nick == nickname){
                    player_X = item.x
                    player_y = item.y
                    console.log( nickname) 
                }

                console.log(item) 
            }
        }

        this.setState(this.state)
    }

    movimentar = async (item, index) => {

        let y_atual = player_y
        let x_atual = player_X
        let x_mov = item.x
        let y_mov = item.y

        const response = await api.post(
            "/game/movimento",
            {x_atual, y_atual, x_mov, y_mov}
        )

        if ( response.data.message == 0 ) {
            alert("Movimento Inválido");
        } else {
            this.renderizarMatriz(response.data.message)
        }
    };

    cadastrar_usuario = async () => {
        //const response = await api.post('/game/join/', {nickname: "Lucas Heber", socket: 1})
        //const response = await api.post('/game/join/', {nickname: "Domith", socket: 2})
        //const response = await api.post('/game/join/', {nickname: "Ricardo", socket: 3})
        const response = await api.post('/game/join/', {nickname: nickname, socket: 4})

        //console.log(response)
    }

    renderItem = ({ item, index }) => {
        //console.log(item.tipo, item.image)
        return (
            <TouchableOpacity style={styles.item} onPress={() => this.movimentar(item, index)}>
                 <View>
                    <Image 
                        source={imagens[item.tipo][item.image]}
                        style={styles.image}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return <FlatList
            keyExtractor={(_, index) => index}
            contentContainerStyle={styles.container}
            numColumns={numberGrid} 
            data={this.state.data}
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