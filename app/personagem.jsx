import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');
const DEFAULT_AVATAR = require('../assets/default-avatar.png'); 

export default function CriacaoPersonagemScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');

  const handleCreate = () => {
    // Implementar a lógica de criação
    
    // AÇÃO CORRIGIDA: Vai para a Home
    router.replace('/home'); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={BACKGROUND_IMAGE} 
        style={styles.container}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <Image source={DAHT_LOGO} style={styles.dahtLogo} resizeMode="contain" />

          <Text style={styles.title}>Criação de Personagem</Text>
          
          <View style={styles.avatarContainer}>
            <Image source={DEFAULT_AVATAR} style={styles.avatarImage} resizeMode="contain" />
          </View>

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

          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.buttonText}>Criar</Text>
          </TouchableOpacity>
          
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
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