// Arquivo: app/home.jsx

import { Link, useRouter } from 'expo-router'; // Importa Link e useRouter
import React, { useEffect, useState } from 'react'; // Importa useEffect
import {
  Alert // Importa Alert
  ,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// CORREÇÃO DA IMPORTAÇÃO (estava '../(services)/api')
import api from './services/api'; // Importa a configuração da API

// Caminhos dos Assets
const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');
const SETTINGS_ICON = require('../assets/configuracao-icon.png'); 
const CHARACTER_AVATAR = require('../assets/snoopy.png'); 
const HEART_ICON = require('../assets/heart-icon.png'); 
const COIN_ICON = require('../assets/coin-icon.png'); 
const ENERGY_ICON = require('../assets/energy-icon.png'); 
const SHOP_ICON = require('../assets/coin-icon.png'); // Reutilizando o ícone de moeda para a loja

// --- Componente Reusável para Barras de Status ---
const StatusBar = ({ value, color, iconSource }) => ( 
  <View style={statusStyles.barContainer}>
    <View style={[statusStyles.barLabel, { backgroundColor: color }]}>
      {iconSource && (
        <Image 
          source={iconSource} 
          style={statusStyles.iconImage} 
          resizeMode="contain" 
        />
      )}
    </View>
    <View style={statusStyles.barValue}>
      <Text style={statusStyles.valueText}>{value}</Text>
    </View>
  </View>
);

// --- Componente para Item de Missão (com Checkbox) ---
// Adicionada a prop 'onEdit'
const MissionItem = React.memo(({ description, completed, onToggle, onEdit }) => (
  <View style={missionStyles.itemContainer}>
    <TouchableOpacity 
      style={missionStyles.checkbox} 
      onPress={onToggle}
    >
      {completed && <View style={missionStyles.checkedMark} />}
    </TouchableOpacity>
    
    <View style={missionStyles.textContainer}>
      <Text style={[missionStyles.description, completed && missionStyles.completedText]}>
        MISSÃO: {description}
      </Text>
      <Text style={missionStyles.dateText}>
        {completed ? "Finalizada" : "data finalizacao"}
      </Text>
    </View>
    
    {/* Marcador amarelo clicável para EDITAR */}
    <TouchableOpacity style={missionStyles.bookmark} onPress={onEdit}>
      <View />
    </TouchableOpacity>
  </View>
));

// --- Tela Principal ---
export default function TelaPrincipalScreen() {
  const [missions, setMissions] = useState([]); // Inicia com array vazio
  const router = useRouter(); // Instancia o router

  // Busca as missões da API quando a tela é carregada
  useEffect(() => {
    // TODO: Você precisa do ID do personagem logado!
    // Estou usando '1' como exemplo.
    const personagemId = 1; 

    const fetchMissions = async () => {
      try {
        // NOTA: O ideal seria o backend ter: /api/missao/listarPorPersonagem/{personagemId}
        const response = await api.get('/missao/listar'); // Usando /listar por enquanto
        setMissions(response.data.map(m => ({
          ...m,
          // Ajuste 'completed' com base no seu DTO (Ex: m.status === 'COMPLETA')
          completed: m.status === -1 // Assumindo que status -1 = deletado/completo
        })));
      } catch (error) {
        console.error("Erro ao buscar missões:", error);
        Alert.alert("Erro", "Não foi possível carregar as missões.");
      }
    };
    
    fetchMissions();
    // TODO: Adicionar um listener de 'focus' para recarregar as missões
    // quando o usuário voltar do modal de criação/edição.
  }, []);

  const toggleMission = (id) => {
    // TODO: Implementar a lógica de 'completar' (PUT /api/missao/atualizar)
    console.log("Marcar como completa (não implementado):", id);
    // Atualiza o estado localmente (visualmente)
    setMissions(missions.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ));
  };
  
  // Navega para o modal de criação de missão
  const handleAddMission = () => {
      router.push('/missaoModal'); // Abre o modal sem passar ID
  };

  // Deleta (logicamente) as missões marcadas como completas
  const handleDeleteMissions = () => {
    Alert.alert(
      "Excluir Missões",
      "Deseja excluir (logicamente) todas as missões completadas?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            const completedMissions = missions.filter(m => m.completed);
            try {
              // Deleta uma por uma
              for (const mission of completedMissions) {
                // DELETE /api/missao/deletar/{id}
                await api.delete(`/missao/deletar/${mission.id}`);
              }
              // Atualiza a lista na tela
              setMissions(missions.filter(m => !m.completed));
              Alert.alert("Sucesso", "Missões completadas foram excluídas.");
            } catch (error) {
              console.error("Erro ao deletar missões:", error);
              Alert.alert("Erro", "Não foi possível excluir as missões.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}> 
      <ImageBackground 
        source={BACKGROUND_IMAGE} 
        style={styles.container}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* === HEADER CENTRALIZADO (ESTILO IMAGEM DE REFERÊNCIA) === */}
          <View style={styles.header}>
            
            {/* Ícones Absolutos no Canto Superior Direito */}
            <View style={styles.absoluteIcons}>
              <Image source={DAHT_LOGO} style={styles.dahtLogo} resizeMode="contain" />
              
                {/* =================================================
                  CORREÇÃO DO ERRO 'asChild':
                  Cada <Link> envolve exatamente UM <TouchableOpacity>
                  =================================================
                */}

                {/* Botão para a Loja de Prêmios */}
              <Link href="/premios" asChild>
                <TouchableOpacity style={styles.settingsButton}>
                  <Image source={SHOP_ICON} style={styles.settingsImage} resizeMode="contain" />
                </TouchableOpacity>
              </Link>

                {/* Botão para Configurações */}
              <Link href="/configuracoes" asChild>
                <TouchableOpacity style={styles.settingsButton}>
                  <Image source={SETTINGS_ICON} style={styles.settingsImage} resizeMode="contain" />
                </TouchableOpacity>
              </Link>
            </View>
            
            {/* Avatar Principal */}
            <Link href="/config-personagem" asChild>
              <TouchableOpacity style={styles.avatarLink}>
                <View style={styles.avatarContainer}>
                  <Image source={CHARACTER_AVATAR} style={styles.avatarImage} resizeMode="cover" />
                  <View style={styles.starBadge} /> 
                </View>
              </TouchableOpacity>
            </Link>


            {/* Nome do Personagem */}
            <Text style={styles.characterName}>PERSONAGEM NOME</Text>

            {/* Barras de Status - Linha 1 */}
            <View style={styles.statusRow}>
              <StatusBar value={100} color="#E83A41" iconSource={HEART_ICON} /> 
              <StatusBar value={1000} color="#FFD700" iconSource={COIN_ICON} /> 
            </View>
            
            {/* Barras de Status - Linha 2 (Centralizada) */}
            <View style={styles.statusRowBottom}>
              <StatusBar value={100} color="#38B000" iconSource={ENERGY_ICON} />
            </View>
          </View>

          {/* === SEÇÃO DE MISSÕES COM SCROLL === */}
          <Text style={styles.missionsTitle}>Missões</Text>
          
          {/* CONTAINER DA LISTA DE MISSÕES COM SCROLL PRÓPRIO */}
          <View style={styles.missionsScrollWrapper}>
              <ScrollView style={styles.missionsScrollView} contentContainerStyle={styles.missionsContainer}>
                  {missions.map(mission => (
                    <MissionItem 
                      key={mission.id} 
                      description={mission.descricao} // Usa a descrição da API
                      completed={mission.completed} 
                      onToggle={() => toggleMission(mission.id)}
                      // Passa o ID da missão para o modal de edição
                      onEdit={() => router.push({ pathname: '/missaoModal', params: { id: mission.id }})}
                    />
                  ))}
              </ScrollView>
          </View>
          
        </ScrollView>

        {/* Botões Flutuantes (Lixeira e Adicionar) - FORA DO SCROLL VIEW PRINCIPAL */}
        <View style={styles.floatButtons}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteMissions}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddMission}>
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// --- Estilos para as Barras de Status ---
const statusStyles = StyleSheet.create({
    barContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        overflow: 'hidden',
        marginHorizontal: 3, 
        borderWidth: 2,
        borderColor: 'black',
        flex: 1,
        maxWidth: 150,
        minWidth: 100,
    },
    barLabel: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        width: 20, 
        height: 20,
    },
    barValue: {
        backgroundColor: 'white',
        padding: 5,
        flex: 1,
    },
    valueText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right',
    }
});

// --- Estilos para os Itens de Missão ---
const missionStyles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#C0C0C0', 
        padding: 10,
        marginVertical: 4,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#000',
        width: '100%',
        position: 'relative',
        minHeight: 60,
    },
    checkbox: {
        width: 25,
        height: 25,
        borderWidth: 2,
        borderColor: '#000',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    checkedMark: {
        width: 15,
        height: 15,
        backgroundColor: '#000',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column', 
    },
    description: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: 'gray',
    },
    dateText: {
        fontSize: 12,
        color: 'gray',
        alignSelf: 'flex-start',
        marginTop: 2, 
    },
    bookmark: {
        // Estilo do "quadrado amarelo" clicável
        position: 'absolute',
        top: 0,
        right: 0,
        width: 30, // Área de clique
        height: 30, // Área de clique
        // Estilo visual
        borderTopWidth: 15,
        borderRightWidth: 15,
        borderTopColor: '#FFD700',
        borderRightColor: '#FFD700',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderBottomLeftRadius: 3,
    }
});

// --- Estilos Principais da Tela ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF8C00', // Garante que a área segura tenha a cor de fundo
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 0, 
    paddingBottom: 100, 
    minHeight: '100%',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    position: 'relative', 
    marginBottom: 10,
  },
  absoluteIcons: {
    position: 'absolute',
    top: 40, // Ajustado para descer um pouco (devido ao SafeAreaView)
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  dahtLogo: {
    width: 35,
    height: 35,
    marginRight: 5,
  },
  settingsButton: {
    width: 30,
    height: 30,
    marginLeft: 10, // Espaçamento entre os ícones
  },
  settingsImage: {
    width: '100%',
    height: '100%',
  },
  avatarLink: {
    // Para tornar o avatar clicável
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: '#FFD700', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  starBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 25,
    height: 25,
    backgroundColor: '#FFD700', 
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: 'black',
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '85%', 
    marginBottom: 5,
  },
  statusRowBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '85%',
    marginBottom: 20,
  },
  missionsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#0000FF', 
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'black',
  },
  missionsScrollWrapper: {
    width: '90%',
    height: 380, 
    borderWidth: 5,
    borderColor: '#000',
    backgroundColor: '#C0C0C0', 
    padding: 10,
  },
  missionsScrollView: {
      flex: 1,
  },
  missionsContainer: {
    paddingBottom: 10, 
  },
  floatButtons: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    flexDirection: 'row',
    zIndex: 20,
  },
  deleteButton: {
    width: 50,
    height: 50,
    backgroundColor: '#E83A41',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 3,
    borderColor: 'black',
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#38B000',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'black',
  },
  deleteIcon: {
    fontSize: 24,
    color: 'white',
  },
  addIcon: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
});
