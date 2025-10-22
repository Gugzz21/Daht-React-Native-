import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Caminhos dos Assets
const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');
const SETTINGS_ICON = require('../assets/configuracao-icon.png'); 
const CHARACTER_AVATAR = require('../assets/snoopy.png'); 
const HEART_ICON = require('../assets/heart-icon.png'); 
const COIN_ICON = require('../assets/coin-icon.png'); 
const ENERGY_ICON = require('../assets/energy-icon.png'); 

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
const MissionItem = React.memo(({ description, completed, onToggle }) => (
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
        data finalizacao
      </Text>
    </View>
    <View style={missionStyles.bookmark} />
  </View>
));

// --- Tela Principal ---
export default function TelaPrincipalScreen() {
  const [missions, setMissions] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      description: `descrição da missão ${i + 1}`,
      completed: i % 3 === 0, 
    }))
  );

  const toggleMission = (id) => {
    setMissions(missions.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ));
  };
  
  const handleAddMission = () => {
      const newMission = {
          id: missions.length + 1,
          description: `Nova Missão ${missions.length + 1}`,
          completed: false,
      };
      setMissions([...missions, newMission]);
      console.log("Adicionar Missão");
  };

  const handleDeleteMissions = () => {
      setMissions(missions.filter(m => !m.completed));
      console.log("Deletar Missões");
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
                      description={mission.description} 
                      completed={mission.completed} 
                      onToggle={() => toggleMission(mission.id)}
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
        width: 15,
        height: 15,
        backgroundColor: '#FFD700', 
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
  safeArea: {
    flex: 1,
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
    top: 20,
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
    marginLeft: 5,
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