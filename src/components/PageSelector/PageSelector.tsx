import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PageSelector({ numeroPagina, navigation, onDelete }: any) {

    useFonts({ 'Araboto': require('../../assets/Araboto.ttf') });

    const handleLongPress = () => {
        Alert.alert(
            'Excluir página',
            'Tem certeza de que deseja excluir esta página?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', onPress: onDelete },
            ],
        );
    };

    const [dataCompleta, setDataCompleta] = useState('');

    useEffect(() => {
        const carregarPagina = async () => {
            const dadosPagina = await AsyncStorage.getItem(`page${numeroPagina}`);
            dadosPagina && setDataCompleta(JSON.parse(dadosPagina).dataCompleta);
        };
        carregarPagina();
      }, [numeroPagina])

    return (
        <TouchableWithoutFeedback onLongPress={handleLongPress} onPress={() => navigation.navigate('Page', { numeroPagina: numeroPagina, dataCompleta: dataCompleta})}>
            <View style={styles.container}>
                <Image source={require('@assets/book.png')} />
                <Text style={styles.diarytext}> {dataCompleta} | Página {numeroPagina}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
        resizeMode: 'cover', 
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center'
      },
    container: {
        borderBottomWidth: 5,
        borderColor: '#C9C9C9',
        borderRadius: 11,
        padding: 10,
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        backgroundColor: 'white',
        overflow: 'hidden',
        marginBottom: 8,
        height: 65,
        width: 340
    },
    diarytext: {
        fontSize: 15,
        fontFamily: 'Araboto',
        color: 'gray'
    },
});
