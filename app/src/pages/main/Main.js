import React, {Component} from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Alert, TouchableOpacity } from 'react-native';

const numColumns = 3;
var posAtual;

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
    }

    return data;
};

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [
                { key: 'A', pos: 0}, { key: 'B' , pos: 1}, { key: '' , pos: 2},
                { key: '' , pos: 3}, { key: '' , pos: 4}, { key: '' , pos: 5},
                { key: '' , pos: 6}, { key: '' , pos: 7}, { key: '' , pos: 8},
            ],
        };
    }

    movimentar = (item, index) => {
        //this.setState({data: []});
        var data = this.state.data
        data[2].key = "C";
        this.setState({ data });
        //console.log(this.state.data[0])
        this.forceUpdate();
    }

    renderItem = ({ item, index }) => {
        if (item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }

        return (
            <TouchableOpacity style={styles.item} onPress={() => this.movimentar(item, index)} >
                <View  >
                    <Text style={styles.itemText}>{item.key}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    render() {

        return (
            <FlatList
                extraData={this.state}
                data={this.state.data}
                style={styles.container}
                renderItem={this.renderItem}
                numColumns={numColumns}
            />
        );
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
});