import { Link } from 'expo-router';
import { useState } from 'react'; // <-- Importado useState
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Caminho corrigido: assets está no mesmo nível
const DAHT_LOGO = require('../assets/daht-logo.png'); 
const CHARACTER_AVATAR = require('../assets/default-avatar.png'); 

// Componente para a barra de status (ex: Vida, Ouro)
const StatusBar = ({ label, value, color }) => (
  <View style={statusStyles.barContainer}>
    <View style={[statusStyles.barLabel, { backgroundColor: color }]}>
      <Text style={statusStyles.labelIcon}>{label === 'Vida' ? '❤️' : label === 'Ouro' ? '💰' : '✨'}</Text>
    </View>
    <View style={statusStyles.barValue}>
      <Text style={statusStyles.valueText}>{value}</Text>
    </View>
  </View>
);

// Componente para a Missão (AGORA COM CHECKBOX)
const MissionItem = ({ description, date }) => {
  const [checked, setChecked] = useState(false); // Estado para controlar se a missão está completa

  return (
    <View style={missionStyles.itemContainer}>
      
      {/* Checkbox (agora um TouchableOpacity) */}
      <TouchableOpacity 
        style={[
          missionStyles.checkbox, 
          checked && missionStyles.checkboxChecked // Aplica estilo se checked for true
        ]} 
        onPress={() => setChecked(!checked)} // Alterna o estado ao pressionar
      >
        {/* Adiciona um checkmark visual quando a missão está completa */}
        {checked && <Text style={missionStyles.checkmark}>✓</Text>} 
      </TouchableOpacity>
      
      <View style={missionStyles.textContainer}>
        <Text style={missionStyles.descriptionText}>MISSÃO: {description}</Text>
        <Text style={missionStyles.dateText}>{date}</Text>
      </View>
      <View style={missionStyles.bookmark} />
    </View>
  );
};

export default function TelaPrincipalScreen() {
  const missions = [
    { desc: 'derrotar 10 inimigos', date: 'data: 2025-10-25' },
    { desc: 'coletar 5 itens raros', date: 'data: 2025-10-26' },
    { desc: 'falar com o NPC X', date: 'data: 2025-10-27' },
    { desc: 'completar tutorial', date: 'data: 2025-10-28' },
    { desc: 'ganhar uma batalha', date: 'data: 2025-10-29' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Superior */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tela Principal</Text>
          <View style={styles.headerIcons}>
            <Image 
              source={DAHT_LOGO} 
              style={styles.logoIcon} 
              resizeMode="contain"
            />
            
            {/* Link para Configurações */}
            <Link href="/configuracoes" asChild>
              <TouchableOpacity style={styles.settingsIcon} />
            </Link>
            
            {/* Link para Criação de Personagem */}
            <Link href="/personagem" asChild>
              <TouchableOpacity style={styles.avatarButton}>
                <Image source={CHARACTER_AVATAR} style={styles.avatarMini} resizeMode="contain" />
              </TouchableOpacity>
            </Link>

          </View>
        </View>

        {/* Informações do Personagem */}
        <View style={styles.characterInfo}>
          <Image 
            source={CHARACTER_AVATAR} 
            style={styles.avatar} 
            resizeMode="contain"
          />
          <Text style={styles.characterName}>PERSONAGEM NOME</Text>
          
          <View style={styles.statusRow}>
            <StatusBar label="Vida" value={100} color="#E83A41" />
            <StatusBar label="Ouro" value={1000} color="#FFD700" />
            <StatusBar label="Energia" value={100} color="#38B000" />
          </View>
        </View>

        {/* Seção Missões */}
        <View style={styles.missionsSection}>
          <Text style={styles.missionsTitle}>Missões</Text>
          <View style={styles.missionsList}>
            {missions.map((mission, index) => (
              <MissionItem 
                key={index}
                description={mission.desc}
                date={mission.date}
              />
            ))}
          </View>
        </View>

        {/* Botões do Rodapé */}
        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.trashButton} />
          <TouchableOpacity style={styles.addButton} />
        </View>

      </ScrollView>
    </View>
  );
}

const statusStyles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
  barLabel: {
    padding: 5,
    backgroundColor: 'red',
  },
  labelIcon: {
    fontSize: 18,
  },
  barValue: {
    backgroundColor: 'white',
    padding: 5,
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
  }
});

const missionStyles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 10,
    backgroundColor: '#fff',
    justifyContent: 'center', // Adicionado para centralizar o checkmark
    alignItems: 'center',     // Adicionado para centralizar o checkmark
  },
  checkboxChecked: {
      backgroundColor: '#38B000', // Verde quando a missão está completa
      borderColor: 'black',
  },
  checkmark: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
  },
  bookmark: {
    width: 20,
    height: 25,
    backgroundColor: 'blue',
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 50,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  settingsIcon: {
    width: 30,
    height: 30,
    backgroundColor: 'gray',
    borderRadius: 5,
    marginRight: 10,
  },
  avatarButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMini: {
    width: 20,
    height: 20,
    tintColor: 'gray',
  },
  characterInfo: {
    width: '90%',
    backgroundColor: '#FFFACD',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 4,
    borderColor: '#E8C000',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  missionsSection: {
    width: '90%',
    alignItems: 'center',
  },
  missionsTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    backgroundColor: '#00BFFF',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'black',
  },
  missionsList: {
    width: '100%',
    backgroundColor: 'lightgray',
    borderRadius: 15,
    padding: 15,
    borderWidth: 5,
    borderColor: '#333',
  },
  footerButtons: {
    flexDirection: 'row',
    marginTop: 30,
    width: '90%',
    justifyContent: 'flex-end',
  },
  trashButton: {
    width: 50,
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 25,
    marginRight: 20,
    borderWidth: 3,
    borderColor: 'black',
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: 'green',
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'black',
  }
});