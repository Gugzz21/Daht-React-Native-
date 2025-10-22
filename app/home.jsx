import { Link } from 'expo-router';
import { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Caminhos dos Assets
const DAHT_LOGO = require('../assets/daht-logo.png');
const SETTINGS_ICON = require('../assets/configuracao-icon.png'); 
const CHARACTER_AVATAR_HOME = require('../assets/character-avatar.png'); // Avatar principal (substitua pelo seu avatar com capuz)
const HEART_ICON = require('../assets/heart-icon.png'); 
const COIN_ICON = require('../assets/coin-icon.png'); // Placeholder para moeda
const ENERGY_ICON = require('../assets/energy-icon.png'); // Placeholder para energia

// --- Componente Reusável para Barras de Status ---
const StatusBar = ({ value, color, iconSource }) => (
  <View style={statusStyles.barContainer}>
    <View style={[statusStyles.barLabel, { backgroundColor: color }]}>
      {/* Usa Image Source para o ícone */}
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

// --- Componente para Item de Missão ---
const MissionItem = ({ description, completed, onToggle }) => (
  <View style={missionStyles.itemContainer}>
    {/* Checkbox */}
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
        data finalizacao
      </Text>
    </View>
    {/* Marcador no canto direito (Aba) */}
    <View style={missionStyles.bookmark} />
  </View>
);

// --- Tela Principal ---
export default function TelaPrincipalScreen() {
  const [missions, setMissions] = useState([
    { id: 1, description: 'descrição', completed: false },
    { id: 2, description: 'descrição', completed: false },
    { id: 3, description: 'descrição', completed: false },
    { id: 4, description: 'descrição', completed: false },
    { id: 5, description: 'descrição', completed: false },
  ]);

  const toggleMission = (id) => {
    setMissions(missions.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ));
  };
  
  const handleAddMission = () => {
      console.log("Adicionar Missão");
  };

  const handleDeleteMissions = () => {
      console.log("Deletar Missões");
  };

  return (
    <SafeAreaView style={styles.container}> 
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* === HEADER CENTRALIZADO (ESTILO IMAGEM DE REFERÊNCIA) === */}
        <View style={styles.header}>
          
          {/* Ícones Absolutos no Canto Superior Direito */}
          <View style={styles.absoluteIcons}>
            {/* DAHT Logo */}
            <Image source={DAHT_LOGO} style={styles.dahtLogo} resizeMode="contain" />
            
            {/* Ícone de Engrenagem (Configurações Gerais) */}
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
                <Image source={CHARACTER_AVATAR_HOME} style={styles.avatarImage} resizeMode="cover" />
                <View style={styles.starBadge} /> {/* Estrela/Badge */}
              </View>
            </TouchableOpacity>
          </Link>


          {/* Nome do Personagem */}
          <Text style={styles.characterName}>PERSONAGEM NOME</Text>

          {/* Barras de Status */}
          <View style={styles.statusRow}>
            {/* Vida e Moedas */}
            <StatusBar value={100} color="#E83A41" iconSource={HEART_ICON} /> 
            <StatusBar value={1000} color="#FFD700" iconSource={COIN_ICON} /> 
          </View>
          <View style={styles.statusRowBottom}>
            {/* Energia/XP */}
            <StatusBar value={100} color="#38B000" iconSource={ENERGY_ICON} />
          </View>
        </View>

        {/* === SEÇÃO DE MISSÕES === */}
        <Text style={styles.missionsTitle}>Missões</Text>
        
        {/* Container que segura os itens de missão */}
        <View style={styles.missionsContainer}>
            {missions.map(mission => (
              <MissionItem 
                key={mission.id} 
                description={mission.description} 
                completed={mission.completed} 
                onToggle={() => toggleMission(mission.id)}
              />
            ))}
        </View>
        
      </ScrollView>

      {/* Botões Flutuantes (Lixeira e Adicionar) */}
      <View style={styles.floatButtons}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteMissions}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMission}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>
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
        alignSelf: 'flex-end',
        marginTop: 5,
        position: 'absolute',
        bottom: 5,
        right: 35, 
    },
    bookmark: {
        width: 15,
        height: 15,
        backgroundColor: '#9370DB', // Roxo
        borderWidth: 2,
        borderColor: 'black',
        position: 'absolute',
        top: 0,
        right: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    }
});

// --- Estilos Principais da Tela ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00', 
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
  },
  absoluteIcons: {
    position: 'absolute',
    top: 20,
    right: 10,
    flexDirection: 'row',
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
    borderColor: '#FFD700', // Borda amarela
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
    backgroundColor: '#FFD700', // Placeholder para o badge
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
    justifyContent: 'space-between',
    width: '85%', // Ajuste para centralizar e dar espaço
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
  missionsContainer: {
    width: '90%',
    backgroundColor: '#0000FF', 
    padding: 10,
    borderWidth: 5,
    borderColor: '#000',
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