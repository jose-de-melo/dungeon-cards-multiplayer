import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import imagens from './../../../assets/imagens'
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.105:3000/',
});

let numberGrid = 3
let numColumns = 3
let nickname = "Outro Ze"
let player_y = 0;
let player_x = 0;

export default class App extends Component {
    state = {
        data: [],
        playerLive: false
    }

    componentDidMount() {
        //this.cadastrar_usuario()
        //this.iniciar()
    }

    iniciar = async () => {
        const response = await api.get('/game/iniciar')
        this.renderizarMatriz(response.data.matriz)
    }

    renderizarMatriz = (matriz) => {

        // Encontrar jogador
        for (var i = 0; i < matriz.length; i++) {
            for (var j = 0; j < matriz[i].length; j++) {
                let item = matriz[i][j]
                if (item.nick == nickname) {
                    //console.log(item);
                    player_x = item.x
                    player_y = item.y
                }
            }
        }

        // Encontrar x e y a ser exibido no FlatList
        let x_view = 0 
        let y_view = 0

        console.log(player_x)
        console.log(player_y)
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

        this.state.data = []
        console.log('inicio', x_view)
        console.log('inicio', y_view)
        for(var x=x_view; x < (x_view+3); x++){
            for(var y=y_view; y < (y_view+3); y++){
                let item = matriz[x][y]
                this.state.data.push(item)
                console.log(x, y)
            }
        }
        this.setState(this.state)
    }

    movimentar = async (item, index) => {

        let y_atual = player_y
        let x_atual = player_x
        let x_mov = item.x
        let y_mov = item.y

        const response = await api.post(
            "/game/movimento",
            { x_atual, y_atual, x_mov, y_mov }
        )

        if (response.data.message == 0) {
            alert("Movimento Inválido");
        } else {
            this.renderizarMatriz(response.data.matriz)
        }
    };

    cadastrar_usuario = async () => {
        //const response = await api.post('/game/join/', {nickname: "Lucas Heber", socket: 1})
        //const response = await api.post('/game/join/', {nickname: "Domith", socket: 2})
        //const response = await api.post('/game/join/', {nickname: "Ricardo", socket: 3})
        const response = await api.post('/game/join/', { nickname: nickname, socket: 4 })

        //console.log(response)
    }

    renderItem = ({ item, index }) => {
        //console.log(item.tipo, item.image)
        return (
            <TouchableOpacity style={styles.item} onPress={() => this.movimentar(item, index)}>
                <View>
                    <Text style={styles.life}>{item.name}</Text>
                    <Image
                        source={imagens[item.tipo][item.image]}
                        style={styles.image}
                    />
                    <Text style={styles.life}>{item.life == 0 ? '' : item.life}</Text>
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
        width: 100,
        resizeMode: 'contain'
    },
    life: {
        marginLeft: 20,
        color: '#fff',
        fontSize: 8,
        fontFamily: 'PressStart'
    }
});