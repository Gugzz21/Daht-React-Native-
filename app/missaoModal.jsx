import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import api from './services/api'; // Nossa API

const BACKGROUND_IMAGE = require('../assets/fundo-site.png');

export default function MissaoModalScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Pega o ID da URL (se existir)
  const isEditing = !!id; // Se tem ID, estamos editando

  const [descricao, setDescricao] = useState('');
  const [dificuldade, setDificuldade] = useState('1');
  const [dataFinalizacao, setDataFinalizacao] = useState(''); // Formato YYYY-MM-DD
  // TODO: Adicionar campos para 'repeticao', 'efeito', 'dataInicio' se necessário
  
  const [loading, setLoading] = useState(false);

  // Se for edição, busca os dados da missão
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      const fetchMissao = async () => {
        try {
          // GET /api/missao/listarPorId/{id}
          const response = await api.get(`/missao/listarPorId/${id}`);
          const missao = response.data;
          setDescricao(missao.descricao);
          setDificuldade(missao.dificuldade?.toString() || '1');
          setDataFinalizacao(missao.dataFinalizacao || '');
        } catch (error) {
          console.error("Erro ao buscar missão:", error);
          Alert.alert("Erro", "Não foi possível carregar os dados da missão.");
        } finally {
          setLoading(false);
        }
      };
      fetchMissao();
    }
  }, [id, isEditing]);

  const handleSave = async () => {
    if (!descricao) {
      Alert.alert("Erro", "A descrição é obrigatória.");
      return;
    }

    // TODO: Você precisa do ID do personagem logado!
    // Estou usando '1' como exemplo.
    const personagemId = 1; 

    const payload = {
      descricao,
      dificuldade: parseInt(dificuldade, 10) || 1,
      dataFinalizacao: dataFinalizacao || null, // Envia null se estiver vazio
      dataInicio: new Date().toISOString().split('T')[0], // Hoje como data de início
      personagemId: personagemId,
      // Adicione outros campos da entidade Missao aqui
      // repeticao: 0,
      // efeito: 0,
      // status: 1 (provavelmente definido no backend)
    };

    setLoading(true);

    try {
      if (isEditing) {
        // PUT /api/missao/atualizar/{id}
        await api.put(`/missao/atualizar/${id}`, payload);
      } else {
        // POST /api/missao/criar
        await api.post('/missao/criar', payload);
      }
      Alert.alert("Sucesso!", `Missão ${isEditing ? 'atualizada' : 'criada'}!`);
      router.back(); // Volta para a home
      // TODO: Você precisará de um jeito de recarregar as missões na home
    } catch (error) {
      console.error("Erro ao salvar missão:", error.response?.data || error);
      Alert.alert("Erro", "Não foi possível salvar a missão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{isEditing ? 'Atualizar Missão' : 'Criar Missão'}</Text>
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>Descrição da Missão:</Text>
            <TextInput
              style={styles.input}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Ex: Derrotar 10 slimes"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Dificuldade (1-5):</Text>
            <TextInput
              style={styles.input}
              value={dificuldade}
              onChangeText={setDificuldade}
              keyboardType="number-pad"
              maxLength={1}
            />

            <Text style={styles.label}>Data de Finalização (Opcional):</Text>
            <TextInput
              style={styles.input}
              value={dataFinalizacao}
              onChangeText={setDataFinalizacao}
              placeholder="AAAA-MM-DD"
              placeholderTextColor="#aaa"
            />
            {/* TODO: Usar um DateTimePicker seria melhor aqui */}

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleSave} 
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "Salvando..." : "Salvar Missão"}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.buttonCancel]} 
              onPress={() => router.back()}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FF8C00' },
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'black',
    color: 'black',
  },
  button: {
    backgroundColor: '#38B000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 40,
    borderWidth: 2,
    borderColor: 'black',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonCancel: {
    backgroundColor: '#E83A41',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});