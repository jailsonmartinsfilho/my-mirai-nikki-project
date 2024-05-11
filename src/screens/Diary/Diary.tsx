import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PageSelector from '../../components/PageSelector/PageSelector';

export default function Diary({ navigation }: any) {

  useFonts({ 'Araboto': require('../../assets/Araboto.ttf') });

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {return true;};
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const [pageKeys, setPageKeys] = useState<string[]>([]);

  useEffect(() => {
    verificarPagesKeys();
  }, []);

  const verificarPagesKeys = async () => {
      const todasChaves = await AsyncStorage.getAllKeys();
      const pageKeys = todasChaves.filter(key => key.startsWith('page'));
      pageKeys.sort((a, b) => {
        const numeroA = parseInt(a.replace('page', ''), 10);
        const numeroB = parseInt(b.replace('page', ''), 10);
        return numeroA - numeroB;
      });
      setPageKeys(pageKeys);
  };

  const adicionarPageSelector = async () => {
    console.log(pageKeys)
    const dataAtual = new Date();
    const mesIndex = dataAtual.getMonth();

    const nomeMeses = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    const dia = dataAtual.getDate();
    const nomeMes = nomeMeses[mesIndex];
    const ano = dataAtual.getFullYear();
    const dataCompleta = `${dia} de ${nomeMes} de ${ano}`
    let newChave;

    if (pageKeys.length === 0) {
      newChave = 'page1';
    } else if (pageKeys.length > 0) {
      const ultimaChavePagina = pageKeys[pageKeys.length - 1]; 
      const numeroUltimaPagina = parseInt(ultimaChavePagina.replace('page', ''));
      newChave = `page${numeroUltimaPagina + 1}`;
    }

    const dadosPagina = {titulo: `Página ${newChave}`, conteudo: '', dataCompleta: dataCompleta};
    await AsyncStorage.setItem(`${newChave}`, JSON.stringify(dadosPagina));
    verificarPagesKeys();
  }

  const excluirPageSelector = (key: any) => {
    AsyncStorage.removeItem(`page${key}`);
    verificarPagesKeys();
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#5C765F" />
          <View style={styles.header}>
            <ImageBackground source={require('@assets/backgroundvhs.png')} style={styles.backgroundImage}>
              <Text style={styles.diarytext}>Diary</Text>

                <View style={{borderColor: 'white', width: '95%', borderWidth: 1, marginTop: 5}}></View>
                <View style={styles.navbar}>
                  <TouchableOpacity onPress={adicionarPageSelector}>
                    <Image source={require('@assets/newpage.png')} style={{width: 22, height: 26}} />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
          </View>

          <ImageBackground source={require('@assets/backgroundvhs.png')} style={styles.backgroundImage2}>
            <ScrollView style={styles.containerPageSelectors}>
              {pageKeys.map((key) => {
                const numeroPagina = parseInt(key.replace('page', ''), 10);

                return (
                  <PageSelector key={key} numeroPagina={numeroPagina} navigation={navigation} onDelete={() => excluirPageSelector(numeroPagina)} />
                );
              })}
            </ScrollView>
          </ImageBackground>
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: 22,
  },
  containerPageSelectors: {
    flex: 1,
    paddingTop: 15
  },
  header: {
    backgroundColor: '#335C31',
    height: 108,
    zIndex: 1,
  }, 
  backgroundImage: {
    flex: 1,
    width: "100%",
    resizeMode: 'cover', 
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center'
  },
  navbar: {
    flex: 1,
    width: "100%",
    resizeMode: 'cover', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20
  },
  backgroundImage2: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: 'cover', 
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center'
  },
  diarytext: {
    fontSize: 30,
    fontFamily: 'Araboto',
    color: 'white',
    marginTop: 10,
  },
  text: {
    marginTop: 20,
    fontSize: 20,
    fontFamily: 'Araboto',
  }
});
