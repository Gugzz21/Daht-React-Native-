import { Link } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// === Caminhos dos Assets ===
const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');
const SETTINGS_ICON = require('../assets/configuracao-icon.png');
const CHARACTER_AVATAR = require('../assets/snoopy.png');
const HEART_ICON = require('../assets/heart-icon.png');
const COIN_ICON = require('../assets/coin-icon.png');
const ENERGY_ICON = require('../assets/energy-icon.png');
const SHOP_ICON = require('../assets/shop-icon.png'); 

// === Barra de Status ===
const StatusBar = ({ value, iconSource, barColor }) => (
  <View style={[statusStyles.barContainer]}>
    <View style={[statusStyles.fill, { backgroundColor: barColor }]}>
      <Image source={iconSource} style={statusStyles.icon} resizeMode="contain" />
      <Text style={statusStyles.value}>{value}</Text>
    </View>
  </View>
);

// === Item de Missão ===
const MissionItem = ({ description, completed, onToggle }) => (
  <View style={missionStyles.itemBox}>
    <TouchableOpacity style={missionStyles.checkbox} onPress={onToggle}>
      {completed && <View style={missionStyles.checked} />}
    </TouchableOpacity>

    <View style={missionStyles.textArea}>
      <Text style={[missionStyles.title, completed && missionStyles.completed]}>
        MISSÃO: {description}
      </Text>
      <Text style={missionStyles.subtitle}>data finalizacao</Text>
    </View>

    <View style={missionStyles.iconRight}>
      <Text style={missionStyles.bookIcon}>📘</Text>
    </View>
  </View>
);

// === Tela Principal ===
export default function TelaPrincipalScreen() {
  const [missions, setMissions] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      description: `descrição`,
      completed: false,
    }))
  );

  const toggleMission = (id) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleAddMission = () => {
    const newMission = {
      id: missions.length + 1,
      description: `descrição`,
      completed: false,
    };
    setMissions([...missions, newMission]);
  };

  const handleDeleteMissions = () => {
    setMissions(missions.filter((m) => !m.completed));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
        
        {/* === Ícones no canto superior direito === */}
        

<View style={styles.topRightCorner}>
  <Image source={DAHT_LOGO} style={styles.logoTop} resizeMode="contain" />
  
  <Link href="/configuracoes" asChild>
    <TouchableOpacity>
      <Image source={SETTINGS_ICON} style={styles.configTop} resizeMode="contain" />
    </TouchableOpacity>
  </Link>

  <Link href="/premios" asChild>
    <TouchableOpacity>
      <Image source={SHOP_ICON} style={styles.shopIcon} resizeMode="contain" />
    </TouchableOpacity>
  </Link>
</View>



        <View style={styles.header}>
           <Link href="/config-personagem" asChild>
          <TouchableOpacity style={styles.avatarSection} activeOpacity={0.8}>
            <Image source={CHARACTER_AVATAR} style={styles.avatar} />
            <View style={styles.star}>
          <Text style={styles.levelText}>1</Text>
        </View>

          </TouchableOpacity>
        </Link>
          <Text style={styles.characterName}>PERSONAGEM NOME</Text>

          <View style={styles.statusGroup}>
            <StatusBar value={100} iconSource={HEART_ICON} barColor="#E83A41" />
            <StatusBar value={1000} iconSource={COIN_ICON} barColor="#FFD700" />
          </View>
          <View style={styles.statusSingle}>
            <StatusBar value={100} iconSource={ENERGY_ICON} barColor="#38B000" />
          </View>
        </View>

        {/* === Seção Missões === */}
        <Text style={styles.title}>Missões</Text>

        <View style={styles.missionsBox}>
          <ScrollView>
            {missions.map((mission) => (
              <MissionItem
                key={mission.id}
                description={mission.description}
                completed={mission.completed}
                onToggle={() => toggleMission(mission.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* === Botões inferiores === */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteMissions}>
            <Text style={styles.iconText}>🗑️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddMission}>
            <Text style={styles.iconText}>＋</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// === Estilos Gerais ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },

  shopIcon: {
  width: 42,
  height: 42,
},


  // === Ícones no canto superior direito ===
  topRightCorner: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'center',
    zIndex: 10,
  },
  logoTop: {
    width: 32,
    height: 32,
  
  },
 configTop: {
  width: 42,
  height: 42,
},

  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarSection: {
    marginTop: 70,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatar: { width: '95%', height: '95%', borderRadius: 55 },
 star: {
  position: 'absolute',
  bottom: 0,
  right: -5,
  width: 25,
  height: 25,
  backgroundColor: '#FFD700',
  borderWidth: 2,
  borderColor: 'black',
  borderRadius: 12.5,
  alignItems: 'center',
  justifyContent: 'center', // <-- Centraliza o texto!
},
levelText: {
  fontSize: 12,
  fontWeight: 'bold',
  color: 'black',
  textAlign: 'center',
},

  characterName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
    marginTop: 5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 10,
  },
  statusSingle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    color: 'white',
    backgroundColor: '#0047FF',
    borderWidth: 3,
    borderColor: 'black',
    fontWeight: 'bold',
    paddingHorizontal: 30,
    paddingVertical: 5,
    marginVertical: 10,
  },
  missionsBox: {
    width: '90%',
    height: 400,
    backgroundColor: '#6DAAE8',
    borderColor: '#000',
    borderWidth: 5,
    borderRadius: 10,
    padding: 10,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    right: 20,
  },
  deleteButton: {
    backgroundColor: '#E83A41',
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'black',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#38B000',
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'black',
  },
  iconText: { fontSize: 26, color: 'white' },
});

// === Barras de Status ===
const statusStyles = StyleSheet.create({
  barContainer: {
    width: 130,
    height: 25,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 5,
  },
  icon: { width: 18, height: 18, marginRight: 5 },
  value: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
});

// === Missões ===
const missionStyles = StyleSheet.create({
  itemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3EEF9',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderColor: '#000',
    borderWidth: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checked: {
    width: 15,
    height: 15,
    backgroundColor: 'black',
  },
  textArea: { flex: 1 },
  title: {
    fontWeight: 'bold',
    color: 'black',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  subtitle: {
    fontSize: 12,
    color: 'gray',
  },
  iconRight: {
    marginLeft: 10,
  },
  bookIcon: {
    fontSize: 18,
  },
});
