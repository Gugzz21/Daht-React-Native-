import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../../services/api';

const BACKGROUND_IMAGE = require('../../assets/fundo-site.png');

const MissionItem = ({ mission, onReactivate }) => (
  <View style={missionStyles.itemBox}>
    <TouchableOpacity style={missionStyles.checkbox} onPress={onReactivate}>
      {/* Sempre marcado pois esta é a tela de realizadas */}
      <View style={missionStyles.checked} />
    </TouchableOpacity>

    <View style={missionStyles.textArea}>
      <Text style={[missionStyles.title, missionStyles.completed]}>
        {mission.descricao}
      </Text>
      <Text style={missionStyles.subtitle}>
          Concluída em: {mission.dataFinalizacao ? mission.dataFinalizacao.split('-').reverse().join('/') : '-'}
      </Text>
    </View>
  </View>
);

export default function MissoesRealizadasScreen() {
  const router = useRouter();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
        const charId = await AsyncStorage.getItem('personagemId');
        if (charId) {
            const missoesRes = await api.get('/missao/listar');
            // Filtra STATUS 2 (Concluídas)
            const realizadas = missoesRes.data.filter(m => {
                const idNaMissao = m.personagemId || (m.personagem && m.personagem.id);
                // status 2 = concluída
                return idNaMissao == charId && m.status === 2; 
            });
            setMissions(realizadas);
        }
    } catch (e) {
        console.log("Erro ao carregar realizadas", e);
    } finally {
        setLoading(false);
    }
  };

  const handleReactivate = async (mission) => {
      Alert.alert("Reativar", "Deseja tornar esta missão pendente novamente?", [
          { text: "Não", style: "cancel" },
          { text: "Sim", onPress: async () => {
              try {
                  await api.put(`/missao/atualizar/${mission.id}`, {
                      ...mission,
                      status: 1, // Volta para Ativa
                      personagemId: mission.personagemId || (mission.personagem && mission.personagem.id)
                  });
                  fetchData(); // Recarrega lista
              } catch (e) {
                  Alert.alert("Erro", "Não foi possível reativar.");
              }
          }}
      ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
        
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backText}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Histórico</Text>
        </View>

        <Text style={styles.title}>Missões Realizadas</Text>
        
        <View style={styles.missionsBox}>
          {loading ? (
              <Text style={styles.emptyText}>Carregando...</Text>
          ) : missions.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma missão concluída ainda.</Text>
          ) : (
            <ScrollView>
                {missions.map((mission) => (
                <MissionItem
                    key={mission.id}
                    mission={mission}
                    onReactivate={() => handleReactivate(mission)}
                />
                ))}
            </ScrollView>
          )}
        </View>

      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 40 },
  header: { width: '90%', flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { backgroundColor: 'white', padding: 8, borderRadius: 5, borderWidth: 2 },
  backText: { fontWeight: 'bold' },
  headerTitle: { fontSize: 20, color: 'white', fontWeight: 'bold', marginLeft: 20, textShadowColor:'black', textShadowRadius:5 },
  title: { fontSize: 24, color: 'white', backgroundColor: '#38B000', borderWidth: 3, borderColor: 'black', fontWeight: 'bold', paddingHorizontal: 30, paddingVertical: 5, marginBottom: 10 },
  missionsBox: { width: '90%', height: '70%', backgroundColor: '#6DAAE8', borderColor: '#000', borderWidth: 5, borderRadius: 10, padding: 10 },
  emptyText: { textAlign: 'center', marginTop: 20, fontStyle: 'italic', fontSize: 16 },
});

const missionStyles = StyleSheet.create({
  itemBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3EEF9', borderWidth: 2, borderColor: '#000', borderRadius: 8, marginBottom: 10, paddingHorizontal: 10, paddingVertical: 5, opacity: 0.8 },
  checkbox: { width: 25, height: 25, borderColor: '#000', borderWidth: 2, marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  checked: { width: 15, height: 15, backgroundColor: 'black' },
  textArea: { flex: 1 },
  title: { fontWeight: 'bold', color: 'black' },
  completed: { textDecorationLine: 'line-through', color: 'gray' },
  subtitle: { fontSize: 12, color: 'gray' },
});