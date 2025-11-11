import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// === Assets ===
const ICON_HEART = require('../assets/heart-icon.png');
const ICON_GOLD = require('../assets/coin-icon.png');
const ICON_XP = require('../assets/energy-icon.png');
const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');
const CHARACTER_AVATAR = require('../assets/character-avatar.png');
const SETTINGS_ICON = require('../assets/configuracao-icon.png');
const DEFAULT_AVATAR = require('../assets/default-avatar.png');

// === Barra de Status ===
const StatusBar = ({ value, iconSource, barColor }) => (
  <View style={[statusStyles.barContainer]}>
    <View style={[statusStyles.fill, { backgroundColor: barColor }]}>
      <Image source={iconSource} style={statusStyles.icon} resizeMode="contain" />
      <Text style={statusStyles.value}>{value}</Text>
    </View>
  </View>
);




// === Tela Configuração de Personagem ===
export default function ConfigPersonagemScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState('PERSONAGEM NOME');
  const [newNickname, setNewNickname] = useState('');

  const handleSave = () => {
    Alert.alert(
      'Salvo',
      `As configurações do personagem foram salvas! Novo Nickname: ${
        newNickname || nickname
      }`
    );
    router.replace('/home');
  };

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* === Ícones no canto superior direito === */}
        <View style={styles.topRightCorner}>
          <Image source={DAHT_LOGO} style={styles.logoTop} resizeMode="contain" />
          <TouchableOpacity onPress={() => router.push('/configuracoes')}>
            <Image source={SETTINGS_ICON} style={styles.configTop} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* === Cabeçalho do Personagem === */}
        <View style={styles.header}>
          <Image source={CHARACTER_AVATAR || DEFAULT_AVATAR} style={styles.avatar} resizeMode="contain" />

          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>1</Text>
          </View>

          <Text style={styles.characterName}>{nickname}</Text>

          {/* Barras de Status */}
          <View style={styles.statusGroup}>
        <StatusBar value={100} iconSource={ICON_HEART} barColor="#E83A41" />
        <StatusBar value={1000} iconSource={ICON_GOLD} barColor="#FFD700" />
      </View>
      <View style={styles.statusSingle}>
        <StatusBar value={100} iconSource={ICON_XP} barColor="#38B000" />
      </View>

             </View>

    


        {/* === Formulário de Configuração === */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Alterar Nickname:</Text>
          <TextInput
            style={styles.inputLine}
            placeholderTextColor="white"
            value={newNickname}
            onChangeText={setNewNickname}
            placeholder={nickname}
          />

          <Text style={styles.label}>Alterar foto de Perfil:</Text>
          <Text style={styles.uploadLabel}>Upload imagem:</Text>
          <View style={styles.uploadBox} />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

// === Estilos das Barras de Status ===
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



// === Estilos da Tela ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 60,
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


  // === Ícones no canto superior direito ===
  topRightCorner: {
    position: 'absolute',
    top: 15,
    right: 15,
    alignItems: 'center',
    zIndex: 10,
  },
  logoTop: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  configTop: {
    width: 28,
    height: 28,
  },

  // === Cabeçalho ===
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 50,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  levelBadge: {
    position: 'absolute',
    top: 100,
    left: '55%',
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: 'black',
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: 'black',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    marginTop: 15,
  },

  // === Formulário ===
  formContainer: {
    width: '80%',
    alignItems: 'flex-start',
  },
  label: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 5,
  },
  uploadLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  inputLine: {
    width: '100%',
    height: 30,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    color: 'white',
    fontSize: 18,
    paddingHorizontal: 5,
  },
  uploadBox: {
    width: '100%',
    height: 40,
    backgroundColor: '#D3D3D3',
    borderWidth: 2,
    borderColor: 'black',
  },
  saveButton: {
    width: '70%',
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 60,
    borderWidth: 4,
    borderColor: 'black',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
