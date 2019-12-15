import React, { Component } from 'react';
import {
    View, StyleSheet, Dimensions, FlatList,
    TouchableOpacity, Image, Text, ToastAndroid, Vibration,
} from 'react-native';
import imagens from './../../../assets/imagens'
import axios from 'axios';
import io from "socket.io-client";
import AsyncStorage from '@react-native-community/async-storage';

const api = axios.create({
    baseURL: 'http://192.168.0.3:3000',
});

let numberGrid = 3
let numColumns = 3
let nick = "lucas"
let player_y = 0;
let player_x = 0;
let socket;

// a component that calls the imperative ToastAndroid API
const Toast = (message) => {

    if (message) {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
        );
        return null;
    }
    return null;
};

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chatMessage: "",
            chatMessages: []
        };
    }

    state = {
        data: [],
        playerLive: false
    }

    componentDidMount() {
        
        this.iniciar()

        this.socket = io.connect("http://192.168.0.3:3000")

        this.socket.emit('entraSala', nick);

        this.socket.on("renderizaMatriz", matriz => {
            this.renderizarMatriz(JSON.parse(matriz))
        });

        this.socket.on("died", matriz => {
            alert("Você Morreu!")
            this.renderizarMatriz(JSON.parse(matriz))
            this.socket.close()
        });
    }


    iniciar = async () => {
        nick = await AsyncStorage.getItem("nickname")
        alert(nick)
    }

    renderizarMatriz = (matriz) => {

        // Encontrar jogador
        for (var i = 0; i < matriz.length; i++) {
            for (var j = 0; j < matriz[i].length; j++) {
                let item = matriz[i][j]
                if (item.nick == nick) {
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
        switch (player_x) {
            case 0: x_view = 0; break;
            case 5: x_view = player_x - 2; break;
            default: x_view = player_x - 1
        }

        switch (player_y) {
            case 0: y_view = 0; break;
            case 5: y_view = player_y - 2; break;
            default: y_view = player_y - 1
        }

        this.state.data = []
        for (var x = x_view; x < (x_view + 3); x++) {
            for (var y = y_view; y < (y_view + 3); y++) {
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
        let nome_player = nick

        this.socket.emit('movimentaHeroi',
            x_atual, y_atual, x_mov, y_mov, nome_player
        )
    };

    renderItem = ({ item, index }) => {
        let isHeroi = item.tipo == 'heroi' || item.tipo == 'heroi_armado'
        let isMonstro = item.tipo == 'monstro'

        if (isHeroi || isMonstro) {

            return (
                <TouchableOpacity style={styles.item} onPress={() => this.movimentar(item, index)}>
                    <View>
                        <Text style={styles.itemText}>{isHeroi ? item.nick : item.name}</Text>

                        <Image
                            source={imagens[item.tipo][item.image]}
                            style={styles.heroi}
                        />


                        <Image
                            source={isHeroi || isMonstro ? imagens['icones']['life'] : null}
                            style={styles.icon_life}
                        />
                        <Text style={styles.life}>{isHeroi || isMonstro ? item.life : ''}</Text>

                        <Image
                            source={isHeroi || isMonstro ? imagens['icones']['damage'] : null}
                            style={styles.icon_damage}
                        />
                        <Text style={styles.damage}>{isHeroi || isMonstro ? item.damage : ''}</Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity style={styles.item} onPress={() => this.movimentar(item, index)}>
                    <View>
                        <Text style={styles.itemText}>{item.name}</Text>

                        <Image
                            source={imagens[item.tipo][item.image]}
                            style={styles.image}
                        />
                    </View>
                </TouchableOpacity>
            )
        }
    }

    render() {
        return (
            <View style={styles.v_container}>
                <Text>Lucas Heber</Text>
                <FlatList
                    keyExtractor={(_, index) => index}
                    contentContainerStyle={styles.container}
                    numColumns={numberGrid}
                    data={this.state.data}
                    renderItem={this.renderItem} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    v_container: {
        flex: 1,
        backgroundColor: '#fff'

    },
    container: {
        flex: 1,
        marginVertical: 30,
    },
    item: {
        backgroundColor: '#4D243D',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1,
        height: 200
        // height: Dimensions.get('window').width / numColumns, // approximate a square
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemText: {
        color: 'yellow',
        fontSize: 10,
        fontFamily: 'PressStart',
        right: 0,
        marginTop: 10,
        textAlign: 'center'
    },
    heroi: {
        flex: 1,
        width: 100,
        resizeMode: 'contain',
        marginBottom: 40
    },
    image: {
        flex: 1,
        width: 100,
        resizeMode: 'contain',
        // marginBottom: 40
    },
    life: {
        color: '#fff',
        marginLeft: 20,
        marginBottom: 5,
        position: "absolute",
        bottom: 0,
    },
    icon_life: {
        width: '15%',
        // height: 15,
        position: "absolute",
        bottom: 0,
        marginBottom: -50,
        marginLeft: -10
    },
    damage: {
        color: '#fff',
        marginLeft: 20,
        marginBottom: 5,
        position: "absolute",
        bottom: 0,
        right: 0,
        marginRight: 0,
    },
    icon_damage: {
        width: '15%',
        // height: 15,
        position: "absolute",
        bottom: 0,
        right: 0,
        marginRight: 10,
    }
});