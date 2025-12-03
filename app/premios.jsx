import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import api from '../services/api';

const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');
const SETTINGS_ICON = require('../assets/configuracao-icon.png');
const COIN_ICON = require('../assets/coin-icon.png');
const BACK_ICON = require('../assets/back-icon.png');

export default function PremiosScreen() {
  const [premios, setPremios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState(null);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const carregarDados = async () => {
    try {
      setLoading(true);
      // 1. Busca a lista de prêmios disponíveis (Catálogo)
      const responsePremios = await api.get('/api/premio/listar');

      // Filtra apenas prêmios ativos (status 1) se necessário
      const premiosAtivos = responsePremios.data.filter(p => p.status === 1);
      setPremios(premiosAtivos);

      // 2. Busca dados do personagem para saber saldo de ouro
      const charId = await AsyncStorage.getItem('personagemId');
      if (charId) {
        const responseChar = await api.get(`/api/personagem/listarPorId/${charId}`);
        setCharacter(responseChar.data);
      }

    } catch (error) {
      console.error("Erro ao carregar loja:", error);
      Alert.alert("Erro", "Não foi possível carregar a loja.");
    } finally {
      setLoading(false);
    }
  };

  const handlePressPremio = (premio) => {
    if (!character) return;

    // 1. Verifica Saldo
    if (character.ouro < premio.preco) {
      Alert.alert(
        "Ouro Insuficiente 🚫",
        `Você tem ${Math.floor(character.ouro)} moedas, mas o item custa ${premio.preco}.`
      );
      return;
    }

    // 2. Confirmação de Compra
    Alert.alert(
      "Confirmar Compra 🛒",
      `Deseja comprar "${premio.nome}" por ${premio.preco} moedas?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "CONFIRMAR",
          onPress: () => realizarCompra(premio)
        }
      ]
    );
  };

  const realizarCompra = async (premio) => {
    try {
      // --- PASSO A: ATUALIZAR SALDO DO PERSONAGEM ---
      const novoSaldo = character.ouro - premio.preco;

      // Precisamos do ID do usuário para o update, se o objeto character não tiver completo, pegamos do storage
      const userId = character.usuarioId || character.usuario?.id || await AsyncStorage.getItem('usuarioId');

      const charPayload = {
        ...character,
        id: character.id,
        ouro: novoSaldo,
        usuarioId: parseInt(userId)
      };

      // Atualiza o personagem no banco
      await api.put(`/api/personagem/atualizar/${character.id}`, charPayload);

      // --- PASSO B: VINCULAR PRÊMIO AO PERSONAGEM (INVENTÁRIO) ---
      await api.post('/api/tabelapremio/criar', {
        personagemId: character.id,
        premioId: premio.id,
        status: 1 // 1 = Ativo/Comprado
      });

      // --- PASSO C: REGISTRAR NO HISTÓRICO (GANHOS) ---
      // Registra uma perda de ouro (valor negativo)
      await api.post('/api/ganho/criar', {
        ouro: -premio.preco,
        xp: 0,
        vida: 0,
        nivel: character.nivel,
        personagemId: character.id
      });

      // --- PASSO D: ATUALIZAR TELA ---
      setCharacter(prev => ({ ...prev, ouro: novoSaldo }));
      Alert.alert("Sucesso! 🎉", `Você comprou ${premio.nome}!`);

    } catch (error) {
      console.error("Erro na compra:", error);
      Alert.alert("Erro", "Falha ao processar a compra. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <ImageBackground source={BACKGROUND_IMAGE} style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={{ color: 'white', marginTop: 10, fontWeight: 'bold' }}>Abrindo Loja...</Text>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
      {/* Cabeçalho */}
      <View style={styles.topBar}>
        <Link href="/home" asChild>
          <TouchableOpacity>
            <Image source={BACK_ICON} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
        </Link>

        <Text style={styles.title}>LOJA</Text>

        <View style={styles.topRightCorner}>
          <Image source={DAHT_LOGO} style={styles.logoTop} resizeMode="contain" />
          <Link href="/configuracoes" asChild>
            <TouchableOpacity>
              <Image source={SETTINGS_ICON} style={styles.configTop} resizeMode="contain" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Exibe Saldo do Usuário */}
      {character && (
        <View style={styles.saldoContainer}>
          <Text style={styles.saldoLabel}>SEU OURO:</Text>
          <View style={styles.saldoValueBox}>
            <Image source={COIN_ICON} style={styles.coinIconLarge} />
            <Text style={styles.saldoText}>{Math.floor(character.ouro)}</Text>
          </View>
        </View>
      )}

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {premios.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum item à venda no momento.</Text>
            </View>
          ) : (
            premios.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => handlePressPremio(item)}
              >
                <View style={styles.imageBox}>
                  <Text style={{ fontSize: 35 }}>🎁</Text>
                </View>

                <Text style={styles.desc} numberOfLines={2}>{item.nome}</Text>

                <View style={styles.priceTag}>
                  <Text style={styles.priceText}>{item.preco}</Text>
                  <Image source={COIN_ICON} style={styles.coinIconSmall} />
                </View>
              </TouchableOpacity>
            ))
          )}
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
  // Estilos do Saldo
  saldoContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  saldoLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    textShadowColor: 'black',
    textShadowRadius: 3,
  },
  saldoValueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700', // Dourado
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'black',
  },
  coinIconLarge: {
    width: 24,
    height: 24,
    marginRight: 8
  },
  saldoText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20
  },

  // Estilos da Lista
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
    width: '100%'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10
  },
  card: {
    width: 140,
    height: 180,
    backgroundColor: '#F0F0F0',
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 10,
    padding: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  imageBox: {
    width: '100%',
    height: 80,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#CCC',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5
  },
  desc: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    height: 40, // Altura fixa para alinhar
    textAlignVertical: 'center'
  },
  priceTag: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#38B000', // Verde de preço
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black',
    width: '100%'
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 5,
  },
  coinIconSmall: {
    width: 16,
    height: 16,
  },
  emptyContainer: {
    marginTop: 50,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});