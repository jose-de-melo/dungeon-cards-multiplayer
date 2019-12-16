import React, { Component } from 'react';
import {
    View, StyleSheet, Dimensions, FlatList,
    TouchableOpacity, Image, Text, ToastAndroid, Vibration, StatusBar
} from 'react-native';
import imagens from '../../../assets/imagens'
import axios from 'axios';
import io from "socket.io-client";
import AsyncStorage from '@react-native-community/async-storage';

const api = axios.create({
    baseURL: 'http://192.168.0.110:3000',
});

let numberGrid = 3
let numColumns = 3
let player_y = 0;
let player_x = 0;

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
    state = {
        data: [],
        playerLive: false,
        nickname: '',
        gameOn: false,
        mainPage: true,
        pdl: 0,
        wins: 0,
        loses:0,
        players: 0,
        coins: 0,
        playersLived: 0,
        win: false,
        died: false
    }

    componentDidMount = async () => {
        
        this.iniciar()

        this.socket = io.connect("http://192.168.0.110:3001")



        this.socket.on('newPlayer', nPlayers => {
            this.state.players = nPlayers
            this.setState(this.state)
        })

        //this.socket.emit('entraSala', nick);

        this.socket.on("renderizaMatriz", matriz => {
            this.state.gameOn = true
            this.setState(this.state)
            this.renderizarMatriz(JSON.parse(matriz))
        });

        this.socket.on('win', async () => {
            this.state.win = true
            this.state.gameOn = false
            this.state.playersLived = 0
            this.setState(this.state)
            this.socket.close()
            this.socket = null
            await this.attInfo()
        })

        this.socket.on('invalidMove', message => {
            Toast(message)
        })

        this.socket.on("died", async (matriz) => {
            this.state.died = true
            this.state.gameOn = false
            this.state.playersLived = 0
            this.setState(this.state)
            this.renderizarMatriz(JSON.parse(matriz))
            this.socket.close()
            this.socket = null
            await this.attInfo()
        });
    }

    attInfo = async () => {
        var us = await AsyncStorage.getItem("user")
        us = JSON.parse(us)

        await api.get(`/users/getInfoPlayer/${us._id}`).
        then(async (response) => {
            if(response.data.code == 200){
                const { user } = response.data
                us = JSON.parse(user)
                await AsyncStorage.setItem("user", user)
            }
          })
        .catch(error => {
            alert(error)
        })

        this.state.nickname = us.name
        this.state.pdl = us.PDL
        this.state.wins = us.vitorias
        this.state.loses = us.derrotas
        this.setState(this.state)
    }

    iniciar = async () => {
        var us = await AsyncStorage.getItem("user")
        us = JSON.parse(us)

        this.state.nickname = us.name
        this.state.pdl = us.PDL
        this.state.wins = us.vitorias
        this.state.loses = us.derrotas
        this.setState(this.state)
    }

    renderizarMatriz = (matriz) => {
        this.state.playersLived = 0
        this.setState(this.state)
        for (var i = 0; i < matriz.length; i++) {
            for (var j = 0; j < matriz[i].length; j++) {
                let item = matriz[i][j]
                if (item.nick == this.state.nickname) {
                    //console.log(item);
                    player_x = item.x
                    player_y = item.y
                }

                if(item.tipo === 'heroi' || item.tipo === 'heroi_armado'){
                    this.state.playersLived+=1
                }
            }
        }

        this.setState(this.state)

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
        this.state.coins = matriz[player_x][player_y].bounty
        this.setState(this.state)
    }

    newGame = () => {
        if(this.socket == null)
            this.socket = io.connect("http://192.168.0.110:3001")
        this.state.players = 0
        this.socket.emit('pushPlayer', this.state.nickname)
        this.state.mainPage = false
        this.setState(this.state)
    }

    movimentar = async (item, index) => {

        let y_atual = player_y
        let x_atual = player_x
        let x_mov = item.x
        let y_mov = item.y
        let nome_player = this.state.nickname

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

    renderMainPage = () => {
        return <View style={styles.containerMain}>
            <StatusBar translucent backgroundColor={styles.containerMain.backgroundColor}/>
            
            <Image
                style={styles.img}
                source={require('../../images/hero.png')}
            />

            <View style={styles.header}>
                <Text style={styles.headerText}>{this.state.nickname}</Text>
            </View>

            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Text style={styles.values}>{this.state.pdl}</Text>
                    <Text style={styles.labels}>PDL</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.values}>{this.state.wins}</Text>
                    <Text style={styles.labels}>WINS</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.values}>{this.state.loses}</Text>
                    <Text style={styles.labels}>LOSES</Text>
                </View>

            </View>

            <TouchableOpacity style={styles.button} onPress={this.newGame}>
                <Text style={styles.buttonText}>PLAY</Text>
            </TouchableOpacity>
        </View>
    }

    backToMain = () => {
        this.state.win = false
        this.state.died = false
        this.state.mainPage = true
        this.state.gameOn = false
        this.setState(this.state)
    }

    renderWinLose = (message) => {
        return <View style={(this.state.win) ? styles.winScreen : styles.loseScreen}>
                    <StatusBar translucent backgroundColor={(this.state.win) ? styles.winScreen.backgroundColor : styles.loseScreen.backgroundColor}/>
                    <Text style={styles.textWinLose}>{message}</Text>
                    <TouchableOpacity style={styles.button} onPress={this.backToMain}>
                        <Text style={styles.buttonText}>MAIN</Text>
                    </TouchableOpacity>
               </View>
    }

    render() {
        //console.log(this.state.mainPage)
        if(this.state.mainPage){
            return this.renderMainPage()
        }

        if(this.state.died){
            return this.renderWinLose("You lose!")
        }

        if(this.state.win){
            return this.renderWinLose("You win!")
        }

        if(this.state.gameOn){
            return <View style={styles.v_container}>
                        <StatusBar translucent backgroundColor={styles.v_container.backgroundColor}/>
                        <View style={styles.viewCoins}>
                            <Image style={styles.imageGame} source={require('../../../assets/imagens/item/moeda.png')}/>
                            <Text style={styles.textCoins}>{this.state.coins}</Text>

                            <Text style={styles.textPlayer}>{this.state.nickname}</Text>
                        </View>
                        <Text style={styles.textPlayers}>Players: {this.state.playersLived}/4</Text>
                        <FlatList
                            keyExtractor={(_, index) => index}
                            contentContainerStyle={styles.container}
                            numColumns={numberGrid}
                            data={this.state.data}
                            renderItem={this.renderItem} />
                    </View>
        }else{
            return <>
                        <StatusBar translucent backgroundColor={styles.waiting.backgroundColor}/>
                        <View style={styles.waiting}>
                            <Text style={styles.textWaiting}>
                                Aguardando{"\n\n"}players...
                            </Text>

                            <Text style={styles.textWaiting}>
                                {"\n"}{this.state.players}/4
                            </Text>
                        </View>
            </>
        }
    }
}

const styles = StyleSheet.create({
    v_container: {
        flex: 1,
        backgroundColor: '#2A2A2A'
    },
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
        //height: 200
        height: (Dimensions.get('window').width / numColumns) + 50, // approximate a square
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
        marginLeft: 25,
        marginBottom: 5,
        position: "absolute",
        bottom: 0,
    },
    icon_life: {
        width: '100%',
        // height: 15,
        position: "absolute",
        bottom: 0,
        marginBottom: -50,
        resizeMode: 'contain',
        left: 0,
        marginLeft: -50
    },
    damage: {
        color: '#fff',
        marginLeft: 10,
        marginBottom: 5,
        position: "absolute",
        bottom: 0,
        right: 0,
        marginRight: 5,
    },
    icon_damage: {
        resizeMode: 'contain',
        width: '80%',
        // height: 15,
        position: "absolute",
        bottom: 0,
        right: 0,
        marginRight: -13
    },

    // Styles MainPage
    containerMain: {
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
        fontFamily: 'PressStart',
        color: '#FFF',
        fontSize: 17,
        top:5
    },

    img: {
        marginRight: 30,
        marginBottom: 30
    },

    // Waiting for players
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
        
    },

    textGame: {
        textAlign: 'center',
        fontFamily: 'PressStart',
        //marginTop: 25
    },

    textPlayer: {
        fontSize: 20,
        fontFamily: 'PressStart',
        top: 16,
        right: -100,
        color: '#FFF'
    },

    imageGame: {
        position: 'absolute',
        left:0,
        top: -2,
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },

    viewCoins: {
        marginTop: 25,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFF'
    },

    textCoins: {
        position: 'absolute',
        left:45,
        fontFamily: 'PressStart',
        top: 16,
        color: '#FFF'
    },

    textPlayers: {
        top: 16,
        fontFamily: 'PressStart',
        fontSize: 10,
        left: 20,
        marginBottom: 25,
        color: '#FFF'
    },

    // Estilos das telas de vitória e derrota

    textWinLose: {
        color: '#FFF',
        fontFamily: 'PressStart',
        fontSize: 35,
    },


    winScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: '#43a047'
    },

    loseScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: '#c62828'
    },

});