import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Assumindo que os assets estão disponíveis no diretório 'assets'
const DAHT_LOGO = require('../assets/daht-logo.png');
const CHARACTER_AVATAR = require('../assets/character-avatar.png'); 
const SETTINGS_ICON = require('../assets/configuracao-icon.png'); // Substitua pelo caminho real do ícone de engrenagem
const DEFAULT_AVATAR = require('../assets/default-avatar.png'); // Imagem de usuário genérica

// --- Componente Reusável para Barras de Status (como em home.jsx) ---
const StatusBar = ({ value, color, icon }) => (
  <View style={statusStyles.barContainer}>
    <View style={[statusStyles.barLabel, { backgroundColor: color }]}>
      <Text style={statusStyles.labelIcon}>{icon}</Text>
    </View>
    <View style={statusStyles.barValue}>
      <Text style={statusStyles.valueText}>{value}</Text>
    </View>
  </View>
);

// --- Tela de Configuração do Personagem ---
export default function ConfigPersonagemScreen() {
  const router = useRouter(); 
  const [nickname, setNickname] = useState('PERSONAGEM NOME'); // Nome atual
  const [newNickname, setNewNickname] = useState('');

  const handleSave = () => {
    // Implemente a lógica de salvamento aqui (API, AsyncStorage, etc.)
    Alert.alert("Salvo", `As configurações do personagem foram salvas! Novo Nickname: ${newNickname || nickname}`);
    // Após salvar, você pode voltar para a tela principal
    router.replace('/home');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      
      {/* Informações do Personagem (Topo da Tela) */}
      <View style={styles.header}>
        <Image 
          source={CHARACTER_AVATAR} // Usando o avatar do personagem
          style={styles.avatar} 
          resizeMode="contain"
        />
        {/* Nível (Assumindo que o pequeno ícone amarelo com '1' é um nível) */}
        <View style={styles.levelBadge}>
            <Text style={styles.levelText}>1</Text>
        </View>
        
        <Text style={styles.characterName}>{nickname}</Text>
        
        {/* Ícones de Canto */}
        <Image source={DAHT_LOGO} style={styles.logoCorner} resizeMode="contain" />
        
        {/* Barras de Status */}
        <View style={styles.statusRow}>
          <StatusBar value={100} color="#E83A41" icon="❤️" />
          <StatusBar value={1000} color="#FFD700" icon="💰" />
          <StatusBar value={100} color="#38B000" icon="✨" />
        </View>
      </View>

      {/* Formulário de Configuração (Parte inferior da imagem) */}
      <View style={styles.formContainer}>
        
        {/* Alterar Nickname */}
        <Text style={styles.label}>Alterar Nickname:</Text>
        <TextInput 
          style={styles.inputLine} 
          placeholderTextColor="white" 
          value={newNickname}
          onChangeText={setNewNickname}
          placeholder={nickname}
        />

        {/* Alterar Foto de Perfil */}
        <Text style={styles.label}>Alterar foto de Perfil:</Text>
        <Text style={styles.uploadLabel}>Upload imagem:</Text>
        <View style={styles.uploadBox} /> 
        {/* Aqui seria a lógica para selecionar e fazer upload da imagem */}

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
      
    </ScrollView>
  );
}

const statusStyles = StyleSheet.create({
    barContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        overflow: 'hidden',
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: 'black',
    },
    barLabel: {
        padding: 5,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00', // Laranja de fundo
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 50,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  logoCorner: {
    position: 'absolute',
    top: 0,
    right: 55,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 4,
    borderColor: 'white',
  },
  levelBadge: {
    position: 'absolute',
    top: 80, // Ajuste para posicionar sobre o avatar
    left: '50%',
    marginLeft: 30, // Ajuste fino
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: 'black',
    zIndex: 10,
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
    marginBottom: 20,
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
  formContainer: {
    width: '80%',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
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
    backgroundColor: '#D3D3D3', // Simula o input cinza da imagem
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
    // Sombra para efeito 3D (opcional)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  }
});