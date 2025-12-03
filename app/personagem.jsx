import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../services/api';

const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');
const DEFAULT_AVATAR = require('../assets/default-avatar.png'); 

export default function CriacaoPersonagemScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const [nickname, setNickname] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadId = async () => {
        if (params.userId) {
            setUserId(parseInt(params.userId, 10));
            return;
        }
        const storedId = await AsyncStorage.getItem('usuarioId');
        if (storedId) {
            setUserId(parseInt(storedId, 10));
        } else {
            Alert.alert("Erro", "Usuário não identificado. Faça login novamente.");
            router.replace('/(auth)/login');
        }
    };
    loadId();
  }, [params.userId]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    if (!nickname) {
      Alert.alert('Atenção', 'Por favor, escolha um apelido.');
      return;
    }

    if (!userId) {
        Alert.alert("Erro", "ID do usuário inválido.");
        return;
    }

    try {
      const payload = {
        nickname: nickname,
        vida: 50.0,
        ouro: 100.0,
        xp: 0.0,
        nivel: 1,
        status: 1,
        usuarioId: userId 
      };

      const response = await api.post('/api/personagem/criar', payload);

      if (response.status === 201 || response.status === 200) {
        const charId = response.data.id.toString();
        await AsyncStorage.setItem('personagemId', charId);
        
        // SALVA COM CHAVE ÚNICA BASEADA NO ID
        if(imageUri) await AsyncStorage.setItem(`avatar_${charId}`, imageUri);

        Alert.alert('Sucesso', 'Personagem criado!');
        router.replace('/home'); 
      }
    } catch (error) {
      console.error("Erro Criação Personagem:", error);
      Alert.alert('Erro', 'Falha ao criar personagem.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image source={DAHT_LOGO} style={styles.dahtLogo} resizeMode="contain" />
          <Text style={styles.title}>Crie seu Avatar</Text>
          
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatarImage} />
            ) : (
              <Image source={DEFAULT_AVATAR} style={styles.avatarImage} resizeMode="contain" />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
             <Text style={styles.uploadButtonText}>Selecionar Imagem</Text>
          </TouchableOpacity>

          <View style={styles.formContainer}>
              <Text style={styles.label}>Apelido (Nickname):</Text>
              <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Ex: GuerreiroDaht"
                placeholderTextColor="#DDD"
              />
          </View>

          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.buttonText}>Começar Aventura</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingTop: 50, paddingHorizontal: 20 },
  dahtLogo: { position: 'absolute', top: 10, right: 10, width: 40, height: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 20, marginTop: 40 },
  avatarContainer: { width: 150, height: 150, borderRadius: 75, backgroundColor: 'lightgray', borderWidth: 5, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarImage: { width: '100%', height: '100%', borderRadius: 70 },
  uploadButton: { backgroundColor: '#E0E0E0', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, borderWidth: 2, borderColor: 'black', marginBottom: 20 },
  uploadButtonText: { color: 'black', fontWeight: 'bold', fontSize: 16 },
  formContainer: { width: '90%' },
  label: { fontSize: 18, color: '#FFF', fontWeight: 'bold', marginTop: 15 },
  input: { width: '100%', height: 45, borderBottomWidth: 2, borderBottomColor: '#FFF', color: '#FFF', fontSize: 20, marginTop: 10 },
  createButton: { marginTop: 60, paddingVertical: 15, paddingHorizontal: 40, backgroundColor: '#38B000', borderRadius: 10, borderWidth: 3, borderColor: '#000' },
  buttonText: { fontSize: 22, fontWeight: 'bold', color: '#FFF' }
});