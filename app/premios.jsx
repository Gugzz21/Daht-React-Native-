import { Link } from 'expo-router';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');
const SETTINGS_ICON = require('../assets/configuracao-icon.png');
const COIN_ICON = require('../assets/coin-icon.png');
const BACK_ICON = require('../assets/back-icon.png');

export default function PremiosScreen() {
  const premios = [
    { id: 1, descricao: 'Prêmio 1', preco: 100 },
    { id: 2, descricao: 'Prêmio 2', preco: 100 },
    { id: 3, descricao: 'Prêmio 3', preco: 100 },
    { id: 4, descricao: 'Prêmio 4', preco: 100 },
    { id: 5, descricao: 'Prêmio 5', preco: 100 },
    { id: 6, descricao: 'Prêmio 6', preco: 100 },
  ];

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
      {/* Cabeçalho */}
      <View style={styles.topBar}>
        <Link href="/home" asChild>
          <TouchableOpacity>
            <Image source={BACK_ICON} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
        </Link>

        <Text style={styles.title}>Prêmios</Text>

        <View style={styles.topRightCorner}>
          <Image source={DAHT_LOGO} style={styles.logoTop} resizeMode="contain" />
          <Link href="/configuracoes" asChild>
            <TouchableOpacity>
              <Image source={SETTINGS_ICON} style={styles.configTop} resizeMode="contain" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {premios.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.imageBox} />
              <Text style={styles.desc}>Descrição: {item.descricao}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>{item.preco}</Text>
                <Image source={COIN_ICON} style={styles.coinIcon} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    marginTop: 25,
  },
  backIcon: {
    width: 32,
    height: 32,
  },
  logoTop: { width: 40, height: 40 },
  configTop: { width: 28, height: 28, marginTop: 5 },
  topRightCorner: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    color: 'white',
    backgroundColor: '#0047FF',
    borderWidth: 3,
    borderColor: 'black',
    fontWeight: 'bold',
    paddingHorizontal: 40,
    paddingVertical: 5,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  card: {
    width: 130,
    height: 160,
    backgroundColor: '#C0C0C0',
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 10,
    padding: 8,
    justifyContent: 'space-between',
  },
  imageBox: {
    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
  },
  desc: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 3,
  },
  coinIcon: {
    width: 16,
    height: 16,
  },
});
