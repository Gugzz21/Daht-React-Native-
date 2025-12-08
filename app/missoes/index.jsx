import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// === Imagens ===
const BACKGROUND_IMAGE = require('../../assets/android-icon-foreground.png');
const DAHT_LOGO = require('../../assets/daht-logo.png');
const SETTINGS_ICON = require('../../assets/configuracao-icon.png');
const SHOP_ICON = require('../../assets/shop-icon.png');
const CHARACTER_AVATAR = require('../../assets/snoopy.png');
const HEART_ICON = require('../../assets/heart-icon.png');
const COIN_ICON = require('../../assets/coin-icon.png');
const ENERGY_ICON = require('../../assets/energy-icon.png');

// === Barra de Status ===
const StatusBar = ({ value, iconSource, barColor }) => (
  <View style={statusStyles.barContainer}>
    <View style={[statusStyles.fill, { backgroundColor: barColor }]}>
      <Image source={iconSource} style={statusStyles.icon} resizeMode="contain" />
      <Text style={statusStyles.value}>{value}</Text>
    </View>
  </View>
);

// === Item da Missão ===
const MissionItem = ({ mission, onEdit }) => (
  <View style={missionStyles.itemBox}>
    <TouchableOpacity style={missionStyles.checkbox}>
      {mission.completed && <View style={missionStyles.checked} />}
    </TouchableOpacity>

    <View style={missionStyles.textArea}>
      <Text style={missionStyles.title}>MISSÃO: {mission.description}</Text>
      <Text style={missionStyles.subtitle}>data finalizacao</Text>
    </View>

    <TouchableOpacity style={missionStyles.iconRight} onPress={onEdit}>
      <Text style={missionStyles.bookIcon}>📘</Text>
    </TouchableOpacity>
  </View>
);

export default function MissoesScreen() {
  const router = useRouter();
  const [missions, setMissions] = useState([
    { id: 1, description: 'Derrotar 10 inimigos', completed: false },
    { id: 2, description: 'Coletar 5 moedas raras', completed: false },
  ]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">

        {/* === Ícones no topo === */}
        <View style={styles.topRightCorner}>
          <Image source={DAHT_LOGO} style={styles.logoTop} resizeMode="contain" />
          <TouchableOpacity onPress={() => router.push('/configuracoes')}>
            <Image source={SETTINGS_ICON} style={styles.configTop} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/premios')}>
            <Image source={SHOP_ICON} style={styles.shopIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* === Cabeçalho === */}
        <View style={styles.header}>
          <Image source={CHARACTER_AVATAR} style={styles.avatar} />
          <View style={styles.star}>
            <Text style={styles.levelText}>1</Text>
          </View>
          <Text style={styles.characterName}>PERSONAGEM NOME</Text>

          <View style={styles.statusGroup}>
            <StatusBar value={100} iconSource={HEART_ICON} barColor="#E83A41" />
            <StatusBar value={1000} iconSource={COIN_ICON} barColor="#FFD700" />
          </View>
          <StatusBar value={100} iconSource={ENERGY_ICON} barColor="#38B000" />
        </View>

        {/* === Missões === */}
        <Text style={styles.title}>Missões</Text>
        <View style={styles.missionsBox}>
          <ScrollView>
            {missions.map((mission) => (
              <MissionItem
                key={mission.id}
                mission={mission}
                onEdit={() => router.push(`/missoes/editar?id=${mission.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* === Botões inferiores === */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.iconText}>🗑️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/missoes/nova')}>
            <Text style={styles.iconText}>＋</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// === Estilos ===
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 20 },
  topRightCorner: { position: 'absolute', top: 10, right: 10, alignItems: 'center', zIndex: 10 },
  logoTop: { width: 40, height: 40, marginBottom: 4 },
  configTop: { width: 32, height: 32, marginBottom: 6 },
  shopIcon: { width: 32, height: 32 },
  header: { alignItems: 'center', marginTop: 70 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: 'black', backgroundColor: 'white' },
  star: { position: 'absolute', bottom: 0, right: 50, width: 25, height: 25, backgroundColor: '#FFD700', borderWidth: 2, borderColor: 'black', borderRadius: 12.5, alignItems: 'center', justifyContent: 'center' },
  levelText: { fontSize: 12, fontWeight: 'bold', color: 'black' },
  characterName: { fontWeight: 'bold', fontSize: 16, color: 'black', marginTop: 5, backgroundColor: 'white', borderColor: 'black', borderWidth: 2, paddingHorizontal: 8 },
  statusGroup: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 10 },
  title: { fontSize: 24, color: 'white', backgroundColor: '#0047FF', borderWidth: 3, borderColor: 'black', fontWeight: 'bold', paddingHorizontal: 30, paddingVertical: 5, marginVertical: 10 },
  missionsBox: { width: '90%', height: 400, backgroundColor: '#6DAAE8', borderColor: '#000', borderWidth: 5, borderRadius: 10, padding: 10 },
  bottomButtons: { position: 'absolute', bottom: 20, flexDirection: 'row', right: 20 },
  deleteButton: { backgroundColor: '#E83A41', width: 55, height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'black', marginRight: 10 },
  addButton: { backgroundColor: '#38B000', width: 55, height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'black' },
  iconText: { fontSize: 26, color: 'white' },
});

// === Estilos das Barras e Missões ===
const statusStyles = StyleSheet.create({
  barContainer: { width: 130, height: 25, borderColor: '#000', borderWidth: 2, borderRadius: 5, overflow: 'hidden' },
  fill: { flexDirection: 'row', alignItems: 'center', height: '100%', paddingHorizontal: 5 },
  icon: { width: 18, height: 18, marginRight: 5 },
  value: { fontWeight: 'bold', color: '#000', flex: 1 },
});

const missionStyles = StyleSheet.create({
  itemBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3EEF9', borderWidth: 2, borderColor: '#000', borderRadius: 8, marginBottom: 10, paddingHorizontal: 10, paddingVertical: 5 },
  checkbox: { width: 25, height: 25, borderColor: '#000', borderWidth: 2, marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  checked: { width: 15, height: 15, backgroundColor: 'black' },
  textArea: { flex: 1 },
  title: { fontWeight: 'bold', color: 'black' },
  subtitle: { fontSize: 12, color: 'gray' },
  iconRight: { marginLeft: 10 },
  bookIcon: { fontSize: 20 },
});
