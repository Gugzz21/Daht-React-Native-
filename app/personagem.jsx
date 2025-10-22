import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Caminhos dos Assets (Ajuste conforme seus arquivos)
const DAHT_LOGO = require('../assets/daht-logo.png'); 
const DEFAULT_AVATAR = require('../assets/default-avatar.png'); // Placeholder do avatar cinza

export default function CriacaoPersonagemScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');

  const handleCreate = () => {
    // Aqui estaria a lógica de validação/criação de personagem
    
    // Navega para a Home (substituindo a tela atual para não permitir voltar)
    router.replace('/home'); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Ícone DAHT no canto superior direito */}
        <Image 
            source={DAHT_LOGO} 
            style={styles.dahtLogo} 
            resizeMode="contain"
        />

        <Text style={styles.title}>Criação de Personagem</Text>
        
        {/* Avatar Placeholder/Upload */}
        <View style={styles.avatarContainer}>
          <Image source={DEFAULT_AVATAR} style={styles.avatarImage} resizeMode="contain" />
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
            <Text style={styles.label}>Nickname:</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholderTextColor="#FFF"
            />
            
            <Text style={styles.label}>Upload imagem:</Text>
            <View style={styles.uploadPlaceholder} />
        </View>

        {/* Botão Criar */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.buttonText}>Criar</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF8C00', // Laranja vibrante
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  dahtLogo: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'lightgray', 
    borderWidth: 5,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    width: '90%',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
    color: '#FFF',
    fontSize: 18,
    paddingHorizontal: 5,
  },
  uploadPlaceholder: {
    width: '100%',
    height: 40,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginTop: 5,
  },
  createButton: {
    marginTop: 60,
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  }
});