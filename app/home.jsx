import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ganhoService from '../services/ganhoService';
import missaoService from '../services/missaoService';
import personagemService from '../services/personagemService';

// Assets
const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');
const DEFAULT_AVATAR = require('../assets/default-avatar.png');
const SETTINGS_ICON = require('../assets/configuracao-icon.png'); // Corrected filename
const SHOP_ICON = require('../assets/shop-icon.png'); // Placeholder
const HEART_ICON = require('../assets/heart-icon.png'); // Placeholder
const COIN_ICON = require('../assets/coin-icon.png'); // Placeholder
const ENERGY_ICON = require('../assets/energy-icon.png'); // Placeholder

// Components
const StatusBar = ({ value, iconSource, barColor }) => (
  <View style={statusStyles.barContainer}>
    <View style={[statusStyles.fill, { backgroundColor: barColor, width: '100%' }]}>
      <Image source={iconSource} style={statusStyles.icon} resizeMode="contain" />
      <Text style={statusStyles.value}>{value}</Text>
    </View>
  </View>
);

const MissionItem = ({ mission, onToggle }) => (
  <View style={missionStyles.itemBox}>
    <TouchableOpacity style={missionStyles.checkbox} onPress={onToggle}>
      {mission.concluida && <View style={missionStyles.checked} />}
    </TouchableOpacity>
    <View style={missionStyles.textArea}>
      <Text style={[missionStyles.title, mission.concluida && missionStyles.completed]}>{mission.descricao}</Text>
      <Text style={missionStyles.subtitle}>Recompensa: {mission.dificuldade * 10} XP</Text>
    </View>
  </View>
);

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState(null);
  const [missions, setMissions] = useState([]);
  const [avatarUri, setAvatarUri] = useState(null);

  const getXpRequired = (level) => level * 100; // Example logic

  const fetchData = async () => {
    try {
      const charRes = await personagemService.listar();
      // Assuming returns list, pick first or specific
      // Or if returns one object
      const charData = Array.isArray(charRes.data) ? charRes.data[0] : charRes.data;

      if (charData) {
        setCharacter(charData);
        // Load missions
        const missoesRes = await missaoService.listar(); // Filter by char if needed
        setMissions(missoesRes.data.filter(m => !m.concluida)); // Show active missions
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleToggleMission = async (mission) => {
    try {
      // Complete mission logic
      await missaoService.atualizar(mission.id, { ...mission, concluida: true, dataFinalizacao: new Date().toISOString().split('T')[0] });
      // Update character XP/Gold
      await ganhoService.criar({
        personagem: { id: character.id },
        xp: mission.dificuldade * 10,
        ouro: mission.dificuldade * 5,
        descricao: `Missão: ${mission.descricao}`
      });
      fetchData();
    } catch (e) {
      Alert.alert("Erro", "Falha ao concluir missão.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <ImageBackground source={BACKGROUND_IMAGE} style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Carregando...</Text>
      </ImageBackground>
    )
  }

  if (!character) {
    return (
      <ImageBackground source={BACKGROUND_IMAGE} style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Personagem não encontrado.</Text>
        <Link href="/personagem" asChild>
          <TouchableOpacity style={{ marginTop: 20, backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
            <Text>Criar Novo Personagem</Text>
          </TouchableOpacity>
        </Link>
      </ImageBackground>
    )
  }

  const xpNecessarioAtual = getXpRequired(character.nivel);
  const xpDisplay = `${Math.floor(character.xp)}/${xpNecessarioAtual}`;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">

        <View style={styles.topRightCorner}>
          <Image source={DAHT_LOGO} style={styles.logoTop} resizeMode="contain" />
          <Link href="/configuracoes" asChild>
            <TouchableOpacity><Image source={SETTINGS_ICON} style={styles.configTop} resizeMode="contain" /></TouchableOpacity>
          </Link>
          <Link href="/premios" asChild>
            <TouchableOpacity><Image source={SHOP_ICON} style={styles.shopIcon} resizeMode="contain" /></TouchableOpacity>
          </Link>
        </View>

        <View style={styles.header}>
          <Link href="/config-personagem" asChild>
            <TouchableOpacity style={styles.avatarSection} activeOpacity={0.8}>
              <Image
                source={avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR}
                style={styles.avatar}
                resizeMode="cover"
              />
              <View style={styles.star}>
                <Text style={styles.levelText}>{character.nivel}</Text>
              </View>
            </TouchableOpacity>
          </Link>
          <Text style={styles.characterName}>{character.nickname}</Text>

          <View style={styles.statusGroup}>
            <StatusBar value={character.vida} iconSource={HEART_ICON} barColor="#E83A41" />
            <StatusBar value={character.ouro} iconSource={COIN_ICON} barColor="#FFD700" />
          </View>
          <View style={styles.statusSingle}>
            <StatusBar value={xpDisplay} iconSource={ENERGY_ICON} barColor="#38B000" />
          </View>
        </View>

        <Text style={styles.title}>Missões</Text>
        <View style={styles.missionsBox}>
          {missions.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20, fontStyle: 'italic' }}>Nenhuma missão ativa.</Text>
          ) : (
            <ScrollView>
              {missions.map((mission) => (
                <MissionItem
                  key={mission.id}
                  mission={mission}
                  onToggle={() => handleToggleMission(mission)}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.bottomButtons}>
          <Link href="/missoes/realizadas" asChild>
            <TouchableOpacity style={styles.historyButton}>
              <Text style={styles.iconText}>📋</Text>
            </TouchableOpacity>
          </Link>

          <Link href={{ pathname: "/missoes/nova", params: { charId: character.id } }} asChild>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.iconText}>＋</Text>
            </TouchableOpacity>
          </Link>
        </View>

      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 20 },
  shopIcon: { width: 42, height: 42 },
  topRightCorner: { position: 'absolute', top: 10, right: 10, alignItems: 'center', zIndex: 10 },
  logoTop: { width: 32, height: 32 },
  configTop: { width: 42, height: 42 },
  header: { alignItems: 'center', marginBottom: 10 },
  avatarSection: {
    marginTop: 50,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 55
  },
  star: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    width: 25,
    height: 25,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20
  },
  levelText: { fontSize: 12, fontWeight: 'bold', color: 'black' },
  characterName: { fontWeight: 'bold', fontSize: 16, color: 'black', marginTop: 5, backgroundColor: 'white', borderColor: 'black', borderWidth: 2, paddingHorizontal: 8, paddingVertical: 3 },
  statusGroup: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 10 },
  statusSingle: { flexDirection: 'row', justifyContent: 'center', marginTop: 5 },
  title: { fontSize: 24, color: 'white', backgroundColor: '#0047FF', borderWidth: 3, borderColor: 'black', fontWeight: 'bold', paddingHorizontal: 30, paddingVertical: 5, marginVertical: 10 },
  missionsBox: { width: '90%', height: 350, backgroundColor: '#6DAAE8', borderColor: '#000', borderWidth: 5, borderRadius: 10, padding: 10 },
  bottomButtons: { position: 'absolute', bottom: 20, right: 20, flexDirection: 'row', gap: 10 },
  addButton: { backgroundColor: '#38B000', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'black' },
  historyButton: { backgroundColor: '#F0E68C', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'black' },
  iconText: { fontSize: 30, color: 'white' },
});
const statusStyles = StyleSheet.create({
  barContainer: { width: 130, height: 25, borderColor: '#000', borderWidth: 2, borderRadius: 5, overflow: 'hidden' },
  fill: { flexDirection: 'row', alignItems: 'center', height: '100%', paddingHorizontal: 5 },
  icon: { width: 18, height: 18, marginRight: 5 },
  value: { fontWeight: 'bold', color: '#000', textAlign: 'center', flex: 1 },
});
const missionStyles = StyleSheet.create({
  itemBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3EEF9', borderWidth: 2, borderColor: '#000', borderRadius: 8, marginBottom: 10, paddingHorizontal: 10, paddingVertical: 5 },
  checkbox: { width: 25, height: 25, borderColor: '#000', borderWidth: 2, marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  checked: { width: 15, height: 15, backgroundColor: 'black' },
  textArea: { flex: 1 },
  title: { fontWeight: 'bold', color: 'black' },
  completed: { textDecorationLine: 'line-through', color: 'gray' },
  subtitle: { fontSize: 12, color: 'gray' },
  iconRight: { marginLeft: 10 },
  bookIcon: { fontSize: 18 },
});