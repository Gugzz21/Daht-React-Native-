import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';

// Assets
const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');
const SETTINGS_ICON = require('../assets/configuracao-icon.png');
const SHOP_ICON = require('../assets/shop-icon.png');
const HEART_ICON = require('../assets/heart-icon.png');
const COIN_ICON = require('../assets/coin-icon.png');
const ENERGY_ICON = require('../assets/energy-icon.png');

// Componente StatusBar Atualizado para mostrar texto customizado
const StatusBar = ({ value, iconSource, barColor, label }) => (
  <View style={statusStyles.barContainer}>
    <View style={[statusStyles.fill, { backgroundColor: barColor }]}>
      <Image source={iconSource} style={statusStyles.icon} resizeMode="contain" />
      <Text style={statusStyles.value}>
        {label ? label : (typeof value === 'number' ? Math.floor(value) : value)}
      </Text>
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
        Dificuldade: {mission.dificuldade} | Efeito: {mission.efeito === 1 ? 'Positivo' : 'Negativo'}
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
  const [avatarUri, setAvatarUri] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      let charId = await AsyncStorage.getItem('personagemId');

      if (!charId) {
        const userId = await AsyncStorage.getItem('usuarioId');
        if (userId) {
          const res = await api.get('/api/personagem/listar');
          const meuPersonagem = res.data.find(p =>
            (p.usuario && p.usuario.id == userId) ||
            (p.usuarioId == userId)
          );

          if (meuPersonagem) {
            charId = meuPersonagem.id;
            await AsyncStorage.setItem('personagemId', charId.toString());
          }
        }
      }

      if (charId) {
        const storedAvatar = await AsyncStorage.getItem(`avatar_${charId}`);
        setAvatarUri(storedAvatar);

        const charRes = await api.get(`/api/personagem/listarPorId/${charId}`);
        setCharacter(charRes.data);

        const missoesRes = await api.get('/api/missao/listar');
        const minhasMissoes = missoesRes.data.filter(m => {
          const idNaMissao = m.personagemId || (m.personagem && m.personagem.id);
          return idNaMissao == charId && m.status === 1;
        });

        setMissions(minhasMissoes);
      }
    } catch (e) {
      console.log("Erro ao carregar dados Home", e);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de XP Necessário: 150 base + 50 por nível extra
  const getXpRequired = (level) => {
    return 150 + (level - 1) * 50;
  };

  // Cálculo de recompensas/penalidades
  const calculateOutcome = (difficulty, effect) => {
    const diff = Number(difficulty);
    const eff = Number(effect); // 1 = Positivo, 2 = Negativo

    let deltaOuro = 0;
    let deltaXp = 0;
    let deltaVida = 0;

    if (eff === 1) { // POSITIVO
      if (diff === 1) { deltaOuro = 20; deltaXp = 20; }      // Fácil
      else if (diff === 2) { deltaOuro = 40; deltaXp = 40; } // Médio
      else if (diff === 3) { deltaOuro = 50; deltaXp = 50; } // Difícil
    } else if (eff === 2) { // NEGATIVO
      if (diff === 1) { deltaVida = -1; }      // Fácil
      else if (diff === 2) { deltaVida = -3; } // Médio
      else if (diff === 3) { deltaVida = -5; } // Difícil
    }
    return { deltaOuro, deltaXp, deltaVida };
  };

  const handleToggleMission = async (mission) => {
    if (mission.status === 2) return;

    // 1. Calcular Ganhos/Perdas
    const { deltaOuro, deltaXp, deltaVida } = calculateOutcome(mission.dificuldade, mission.efeito);

    let novoOuro = Number(character.ouro) + deltaOuro;
    let novoXp = Number(character.xp) + deltaXp;
    let novaVida = Number(character.vida) + deltaVida;
    let novoNivel = Number(character.nivel);

    let mensagemAlert = "";
    let tituloAlert = "";

    // 2. Lógica de Morte (Vida <= 0)
    if (novaVida <= 0) {
      novaVida = 50; // Reseta vida base
      novoNivel = 1; // Reseta nível
      novoXp = 0;    // Reseta XP
      novoOuro = Math.max(0, novoOuro); // Mantém ouro ou zera? Assumindo manter, mas sem ficar negativo.

      tituloAlert = "VOCÊ MORREU 💀";
      mensagemAlert = "Sua vida chegou a 0.\nVocê voltou para o Nível 1!";
    } else {
      // Se não morreu, verifica se subiu de nível (apenas se ganhou XP)
      if (deltaXp > 0) {
        const xpNecessario = getXpRequired(novoNivel);

        if (novoXp >= xpNecessario) {
          // SUBIU DE NÍVEL
          novoNivel += 1;
          novoXp = novoXp - xpNecessario; // O que sobra fica para o próximo nível

          // Nova vida máxima: 50 + 5 por nível
          // Regra: "regeneraria completamente e ficaria com 5 pontos a mais"
          const novaMaxVida = 50 + (novoNivel - 1) * 5;
          novaVida = novaMaxVida;

          tituloAlert = "LEVEL UP! ⭐";
          mensagemAlert = `Parabéns! Você alcançou o Nível ${novoNivel}!\nVida totalmente regenerada!\nSua vida máxima aumentou!`;
        } else {
          tituloAlert = "Missão Cumprida! 💰";
          mensagemAlert = `Recompensa:\n+${deltaOuro} Ouro\n+${deltaXp} XP`;
        }
      } else if (deltaVida < 0) {
        // Sofreu dano (missão negativa)
        tituloAlert = "Dano Sofrido 🩸";
        mensagemAlert = `Você perdeu ${Math.abs(deltaVida)} de vida por falhar ou efeito negativo.`;
      }
    }

    // Exibe o alerta na tela
    Alert.alert(tituloAlert, mensagemAlert);

    // 3. Atualiza Estado Local (Feedback imediato)
    setCharacter(prev => ({
      ...prev,
      ouro: novoOuro,
      xp: novoXp,
      vida: novaVida,
      nivel: novoNivel
    }));

    // Remove a missão da lista visualmente
    setMissions(prev => prev.map(m => m.id === mission.id ? { ...m, status: 2 } : m));
    setTimeout(() => {
      setMissions(prev => prev.filter(m => m.id !== mission.id));
    }, 1000);

    // 4. Atualiza no Backend
    try {
      // A) Marca missão como concluída
      await api.put(`/api/missao/atualizar/${mission.id}`, {
        ...mission,
        status: 2,
        personagemId: character.id
      });

      const userId = character.usuario?.id || await AsyncStorage.getItem('usuarioId');

      // B) Atualiza status do personagem
      const updatedCharPayload = {
        ...character,
        id: character.id,
        ouro: novoOuro,
        xp: novoXp,
        vida: novaVida,
        nivel: novoNivel,
        usuarioId: parseInt(userId)
      };
      await api.put(`/api/personagem/atualizar/${character.id}`, updatedCharPayload);

      // C) REGISTRA NA TABELA DE GANHOS (Histórico)
      // Aqui enviamos os DELTAS (o que ganhou ou perdeu)
      await api.post('/api/ganho/criar', {
        ouro: deltaOuro, // Ex: 20 ou 0
        xp: deltaXp,     // Ex: 20 ou 0
        vida: deltaVida, // Ex: -5 ou 0 (Enviando negativo para representar perda)
        nivel: novoNivel, // Nível atual após a ação
        personagemId: character.id
      });

    } catch (error) {
      console.error("Erro ao salvar progresso", error);
      Alert.alert("Erro", "Falha de conexão ao salvar seu progresso.");
    }
  };

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

  // Define texto para barra de XP: "Atual / Necessário"
  const xpNecessarioAtual = getXpRequired(character.nivel);
  const xpTexto = `${Math.floor(character.xp)} / ${xpNecessarioAtual}`;

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
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.avatar, { backgroundColor: '#CCCCCC', justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 40 }}>👤</Text>
                </View>
              )}

              {/* Badge de Nível (Ajustado para não ficar escondido) */}
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{character.nivel}</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Text style={styles.characterName}>{character.nickname}</Text>

          <View style={styles.statusGroup}>
            <StatusBar value={character.vida} iconSource={HEART_ICON} barColor="#E83A41" />
            <StatusBar value={character.ouro} iconSource={COIN_ICON} barColor="#FFD700" />
          </View>

          {/* Barra de XP com texto "Atual / Necessário" */}
          <View style={styles.statusSingle}>
            <StatusBar
              value={character.xp}
              label={xpTexto}
              iconSource={ENERGY_ICON}
              barColor="#38B000"
            />
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
    position: 'relative', // Importante para o badge absoluto funcionar bem
    overflow: 'visible'   // Permite que o badge saia um pouco da borda se precisar
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
    overflow: 'hidden', // Corta a imagem redonda
  },
  // ESTILO DO BADGE DE NÍVEL CORRIGIDO
  levelBadge: {
    position: 'absolute',
    bottom: -5,  // Fica na parte inferior
    right: -5,   // Fica na direita
    width: 30,
    height: 30,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999, // Garante que fique por cima de tudo
    elevation: 5 // Sombra no Android
  },
  levelText: { fontSize: 14, fontWeight: 'bold', color: 'black' },
  characterName: { fontWeight: 'bold', fontSize: 16, color: 'black', marginTop: 15, backgroundColor: 'white', borderColor: 'black', borderWidth: 2, paddingHorizontal: 8, paddingVertical: 3 },
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
  barContainer: { width: 150, height: 25, borderColor: '#000', borderWidth: 2, borderRadius: 5, overflow: 'hidden', backgroundColor: 'white' },
  fill: { flexDirection: 'row', alignItems: 'center', height: '100%', paddingHorizontal: 5, justifyContent: 'center' },
  icon: { width: 18, height: 18, marginRight: 5 },
  value: { fontWeight: 'bold', color: '#000', textAlign: 'center', fontSize: 12 },
});
const missionStyles = StyleSheet.create({
  itemBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3EEF9', borderWidth: 2, borderColor: '#000', borderRadius: 8, marginBottom: 10, paddingHorizontal: 10, paddingVertical: 5 },
  checkbox: { width: 25, height: 25, borderColor: '#000', borderWidth: 2, marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  checked: { width: 15, height: 15, backgroundColor: 'black' },
  textArea: { flex: 1 },
  title: { fontWeight: 'bold', color: 'black' },
  completed: { textDecorationLine: 'line-through', color: 'gray' },
  subtitle: { fontSize: 10, color: '#444' }, // Fonte menor para detalhes
  iconRight: { marginLeft: 10 },
  bookIcon: { fontSize: 18 },
});