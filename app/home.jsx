import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';

// Assets (Ajuste os caminhos se necessário)
const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');
const SETTINGS_ICON = require('../assets/configuracao-icon.png');
const SHOP_ICON = require('../assets/shop-icon.png'); 
const DEFAULT_AVATAR = require('../assets/snoopy.png');
const HEART_ICON = require('../assets/heart-icon.png');
const COIN_ICON = require('../assets/coin-icon.png');
const ENERGY_ICON = require('../assets/energy-icon.png');

const StatusBar = ({ value, iconSource, barColor }) => (
  <View style={statusStyles.barContainer}>
    <View style={[statusStyles.fill, { backgroundColor: barColor }]}>
      <Image source={iconSource} style={statusStyles.icon} resizeMode="contain" />
      <Text style={statusStyles.value}>{Math.floor(value)}</Text>
    </View>
  </View>
);

const MissionItem = ({ mission, onToggle }) => (
  <View style={missionStyles.itemBox}>
    <TouchableOpacity style={missionStyles.checkbox} onPress={onToggle}>
      {mission.status === 2 && <View style={missionStyles.checked} />}
    </TouchableOpacity>

    <View style={missionStyles.textArea}>
      <Text style={[missionStyles.title, mission.status === 2 && missionStyles.completed]}>
        MISSÃO: {mission.descricao}
      </Text>
      <Text style={missionStyles.subtitle}>
          Até: {mission.dataFinalizacao ? mission.dataFinalizacao.split('-').reverse().join('/') : 'Sem data'}
      </Text>
    </View>

    <View style={missionStyles.iconRight}>
      <Link href={{ pathname: "/missoes/editar", params: { id: mission.id } }} asChild>
        <TouchableOpacity>
          <Text style={missionStyles.bookIcon}>📘</Text>
        </TouchableOpacity>
      </Link>
    </View>
  </View>
);

export default function TelaPrincipalScreen() {
  const router = useRouter();
  const [character, setCharacter] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
        let charId = await AsyncStorage.getItem('personagemId');
        if (!charId) {
            // Tenta pegar o primeiro personagem se não tiver ID salvo (fallback de desenvolvimento)
            const res = await api.get('/personagem/listar');
            if (res.data.length > 0) charId = res.data[0].id;
        }

        if (charId) {
            const charRes = await api.get(`/personagem/listarPorId/${charId}`);
            setCharacter(charRes.data);
            
            // Filtra missões do personagem no front (idealmente seria no backend)
            const missoesRes = await api.get('/missao/listar');
            const minhasMissoes = missoesRes.data.filter(m => m.personagem && m.personagem.id === parseInt(charId));
            setMissions(minhasMissoes);
        }
    } catch (e) {
        console.log("Erro ao carregar dados", e);
    } finally {
        setLoading(false);
    }
  };

  const calculateRewards = (difficulty, effect) => {
      if (effect !== 1) return { ouro: 0, xp: 0 }; // 1 = Positivo
      
      // Dificuldade: 1=Fácil, 2=Médio, 3=Difícil
      if (difficulty === 1) return { ouro: 20, xp: 20 };
      if (difficulty === 2) return { ouro: 40, xp: 40 };
      if (difficulty === 3) return { ouro: 50, xp: 50 };
      return { ouro: 0, xp: 0 };
  };

  const handleToggleMission = async (mission) => {
    if (mission.status === 2) return; // Já finalizada

    const { ouro, xp } = calculateRewards(mission.dificuldade, mission.efeito);

    let novoOuro = character.ouro + ouro;
    let novoXp = character.xp + xp;
    let novoNivel = character.nivel;
    
    // Regra XP: Nível + 1 * 50
    const xpNecessario = 50 * (character.nivel + 1);

    if (novoXp >= xpNecessario) {
        novoNivel += 1;
        novoXp = novoXp - xpNecessario; 
        Alert.alert("LEVEL UP!", `Parabéns! Você alcançou o nível ${novoNivel}!`);
    } else if (ouro > 0) {
        Alert.alert("Recompensa", `Ganhou ${ouro} Ouro e ${xp} XP!`);
    }

    try {
        await api.put(`/missao/atualizar/${mission.id}`, {
            ...mission,
            status: 2,
            personagem: { id: character.id }
        });

        const updatedChar = {
            ...character,
            ouro: novoOuro,
            xp: novoXp,
            nivel: novoNivel,
            usuario: { id: character.usuario.id }
        };
        await api.put(`/personagem/atualizar/${character.id}`, updatedChar);

        fetchData(); // Recarrega para atualizar a tela

    } catch (error) {
        console.error("Erro ao completar missão", error);
        Alert.alert("Erro", "Falha ao salvar progresso.");
    }
  };

  if (loading || !character) {
      return (
          <ImageBackground source={BACKGROUND_IMAGE} style={[styles.container, {justifyContent:'center'}]}>
              <Text style={{color:'white', fontWeight:'bold', fontSize:20}}>Carregando Aventura...</Text>
          </ImageBackground>
      )
  }

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
                    <Image source={DEFAULT_AVATAR} style={styles.avatar} />
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
                <StatusBar value={character.xp} iconSource={ENERGY_ICON} barColor="#38B000" />
            </View>
        </View>

        <Text style={styles.title}>Missões</Text>
        <View style={styles.missionsBox}>
          {missions.length === 0 ? (
              <Text style={{textAlign:'center', marginTop: 20, fontStyle:'italic'}}>Nenhuma missão ativa.</Text>
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
  avatarSection: { marginTop: 50, width: 110, height: 110, borderRadius: 55, backgroundColor: 'white', borderWidth: 3, borderColor: 'black', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: '95%', height: '95%', borderRadius: 55 },
  star: { position: 'absolute', bottom: 0, right: -5, width: 25, height: 25, backgroundColor: '#FFD700', borderWidth: 2, borderColor: 'black', borderRadius: 12.5, alignItems: 'center', justifyContent: 'center' },
  levelText: { fontSize: 12, fontWeight: 'bold', color: 'black' },
  characterName: { fontWeight: 'bold', fontSize: 16, color: 'black', marginTop: 5, backgroundColor: 'white', borderColor: 'black', borderWidth: 2, paddingHorizontal: 8, paddingVertical: 3 },
  statusGroup: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 10 },
  statusSingle: { flexDirection: 'row', justifyContent: 'center', marginTop: 5 },
  title: { fontSize: 24, color: 'white', backgroundColor: '#0047FF', borderWidth: 3, borderColor: 'black', fontWeight: 'bold', paddingHorizontal: 30, paddingVertical: 5, marginVertical: 10 },
  missionsBox: { width: '90%', height: 350, backgroundColor: '#6DAAE8', borderColor: '#000', borderWidth: 5, borderRadius: 10, padding: 10 },
  bottomButtons: { position: 'absolute', bottom: 20, right: 20 },
  addButton: { backgroundColor: '#38B000', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'black' },
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