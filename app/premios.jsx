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
import { ITEMS_DB, ITEM_TYPE } from '../constants/Items'; // Importa a BD de Itens
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
      const responsePremios = await api.get('/api/premio/listar');
      // Filtra apenas ativos
      const premiosAtivos = responsePremios.data.filter(p => p.status === 1);
      setPremios(premiosAtivos);

      const charId = await AsyncStorage.getItem('personagemId');
      if (charId) {
        const responseChar = await api.get(`/api/personagem/listarPorId/${charId}`);
        setCharacter(responseChar.data);
      }

    } catch (error) {
      console.error("Erro ao carregar loja:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePressPremio = (premio) => {
    if (!character) return;

    const itemVisual = ITEMS_DB[premio.id];

    // Se não tiver imagem configurada, avisa mas permite comprar (opcional)
    if (!itemVisual) {
      Alert.alert("Item sem visual", "Este item existe no banco mas não tem imagem no App. Deseja comprar mesmo assim?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Comprar", onPress: () => realizarCompra(premio, { type: ITEM_TYPE.MOLDURA }) } // Default
      ]);
      return;
    }

    if (character.ouro < premio.preco) {
      Alert.alert("Ouro Insuficiente", `Precisa de ${premio.preco} moedas.`);
      return;
    }

    Alert.alert(
      "Comprar Item",
      `Deseja comprar "${premio.nome}" por ${premio.preco}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "COMPRAR", onPress: () => realizarCompra(premio, itemVisual) }
      ]
    );
  };

  const realizarCompra = async (premio, itemVisual) => {
    try {
      const novoSaldo = character.ouro - premio.preco;
      const userId = character.usuarioId || character.usuario?.id || await AsyncStorage.getItem('usuarioId');

      const charPayload = {
        ...character,
        id: character.id,
        ouro: novoSaldo,
        usuarioId: parseInt(userId),
        // Equipa automaticamente baseando-se no tipo
        molduraId: itemVisual?.type === ITEM_TYPE.MOLDURA ? premio.id : character.molduraId,
        cabecaId: itemVisual?.type === ITEM_TYPE.CABECA ? premio.id : character.cabecaId,
        maoId: itemVisual?.type === ITEM_TYPE.MAO ? premio.id : character.maoId,
      };

      await api.put(`/api/personagem/atualizar/${character.id}`, charPayload);

      await api.post('/api/tabelapremio/criar', {
        personagemId: character.id,
        premioId: premio.id,
        status: 1
      });

      await api.post('/api/ganho/criar', {
        ouro: -premio.preco,
        xp: 0,
        vida: 0,
        nivel: character.nivel,
        personagemId: character.id
      });

      setCharacter(charPayload);
      Alert.alert("Sucesso!", `Comprou ${premio.nome}!`);

    } catch (error) {
      console.error("Erro na compra:", error);
      Alert.alert("Erro", "Falha ao processar.");
    }
  };

  if (loading) {
    return (
      <ImageBackground source={BACKGROUND_IMAGE} style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
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
            <TouchableOpacity><Image source={SETTINGS_ICON} style={styles.configTop} resizeMode="contain" /></TouchableOpacity>
          </Link>
        </View>
      </View>

      {character && (
        <View style={styles.saldoContainer}>
          <Text style={styles.saldoLabel}>SEU OURO:</Text>
          <View style={styles.saldoValueBox}>
            <Image source={COIN_ICON} style={styles.coinIconLarge} />
            <Text style={styles.saldoText}>{Math.floor(character.ouro)}</Text>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {premios.length === 0 ? (
            <View style={styles.emptyContainer}><Text style={styles.emptyText}>Loja vazia.</Text></View>
          ) : (
            premios.map((item) => {
              const visual = ITEMS_DB[item.id];
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={() => handlePressPremio(item)}
                >
                  <View style={styles.imageBox}>
                    {visual ? (
                      <Image source={visual.source} style={{ width: 60, height: 60 }} resizeMode="contain" />
                    ) : (
                      <Text style={{ fontSize: 30 }}>🎁</Text>
                    )}
                  </View>
                  <Text style={styles.desc} numberOfLines={2}>{item.nome}</Text>
                  <View style={styles.priceTag}>
                    <Text style={styles.priceText}>{item.preco}</Text>
                    <Image source={COIN_ICON} style={styles.coinIconSmall} />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '95%', marginTop: 25 },
  backIcon: { width: 32, height: 32 },
  logoTop: { width: 40, height: 40 },
  configTop: { width: 28, height: 28, marginTop: 5 },
  topRightCorner: { alignItems: 'center' },
  title: { fontSize: 26, color: 'white', backgroundColor: '#0047FF', borderWidth: 3, borderColor: 'black', fontWeight: 'bold', paddingHorizontal: 40, paddingVertical: 5 },

  saldoContainer: { marginTop: 10, alignItems: 'center', marginBottom: 10 },
  saldoLabel: { color: 'white', fontWeight: 'bold', fontSize: 12, marginBottom: 2 },
  saldoValueBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFD700', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 20, borderWidth: 2, borderColor: 'black' },
  coinIconLarge: { width: 20, height: 20, marginRight: 5 },
  saldoText: { fontWeight: 'bold', color: 'black', fontSize: 18 },

  scrollContent: { alignItems: 'center', paddingBottom: 40, width: '100%' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, marginTop: 10 },
  card: { width: 130, height: 170, backgroundColor: '#F0F0F0', borderWidth: 3, borderColor: 'black', borderRadius: 10, padding: 8, justifyContent: 'space-between', alignItems: 'center', elevation: 4 },
  imageBox: { width: '100%', height: 70, backgroundColor: 'white', borderWidth: 2, borderColor: '#CCC', borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  desc: { fontSize: 13, color: '#333', fontWeight: 'bold', textAlign: 'center', height: 35, textAlignVertical: 'center' },
  priceTag: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#38B000', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, borderWidth: 1, borderColor: 'black', width: '100%' },
  priceText: { fontSize: 14, fontWeight: 'bold', color: 'white', marginRight: 5 },
  coinIconSmall: { width: 14, height: 14 },
  emptyContainer: { marginTop: 50, padding: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10 },
  emptyText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});