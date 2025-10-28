import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import api from './services/api'; // Importando nossa API

const BACKGROUND_IMAGE = require('../assets/fundo-site.png');

const PremioItem = ({ item, onComprar }) => (
  <View style={styles.premioContainer}>
    <View>
      <Text style={styles.premioNome}>{item.nome}</Text>
      <Text style={styles.premioPreco}>💰 {item.preco}</Text>
    </View>
    <TouchableOpacity 
      style={styles.comprarButton} 
      onPress={() => onComprar(item)}
    >
      <Text style={styles.comprarButtonText}>Comprar</Text>
    </TouchableOpacity>
  </View>
);

export default function PremiosScreen() {
  const router = useRouter();
  const [premios, setPremios] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Buscar os prêmios da API
  useEffect(() => {
    const fetchPremios = async () => {
      try {
        // GET /api/premio/listar
        const response = await api.get('/premio/listar');
        setPremios(response.data);
      } catch (error) {
        console.error("Erro ao buscar prêmios:", error);
        Alert.alert("Erro", "Não foi possível carregar a loja de prêmios.");
      } finally {
        setLoading(false);
      }
    };
    fetchPremios();
  }, []);

  // 2. Lógica para comprar
  const handleComprar = async (premio) => {
    // TODO: Você precisa do ID do personagem logado!
    // Estou usando '1' como exemplo.
    const personagemId = 1; 

    const payload = {
      personagemId: personagemId,
      premioId: premio.id
      // O status provavelmente é definido no backend
    };

    try {
      // POST /api/tabelapremio/criar
      await api.post('/tabelapremio/criar', payload);
      Alert.alert("Sucesso!", `Você comprou: ${premio.nome}!`);
      // TODO: Atualizar o ouro do personagem na tela (contexto global)
    } catch (error) {
      console.error("Erro ao comprar prêmio:", error.response?.data || error);
      Alert.alert("Erro", "Não foi possível realizar a compra.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={BACKGROUND_IMAGE} 
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>LOJA DE PRÊMIOS</Text>
        </View>
        
        {loading ? (
          <Text style={styles.loadingText}>Carregando prêmios...</Text>
        ) : (
          <FlatList
            data={premios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PremioItem item={item} onComprar={handleComprar} />
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FF8C00' },
  container: { flex: 1 },
  header: {
    width: '100%',
    paddingVertical: 20,
    paddingTop: 50,
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  backButton: {
    position: 'absolute',
    top: 50, 
    left: 20,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  premioContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premioNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  premioPreco: {
    fontSize: 16,
    color: '#A88A00',
    fontWeight: 'bold',
    marginTop: 5,
  },
  comprarButton: {
    backgroundColor: '#38B000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'black',
  },
  comprarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});