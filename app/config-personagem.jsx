import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
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
import api from '../services/api';

// Assets
const ICON_HEART = require('../assets/heart-icon.png');
const ICON_GOLD = require('../assets/coin-icon.png');
const ICON_XP = require('../assets/energy-icon.png');
const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');
const SETTINGS_ICON = require('../assets/configuracao-icon.png');
const DEFAULT_AVATAR = require('../assets/default-avatar.png');

const StatusBar = ({ value, iconSource, barColor }) => (
  <View style={statusStyles.barContainer}>
    <View style={[statusStyles.fill, { backgroundColor: barColor }]}>
      <Image source={iconSource} style={statusStyles.icon} resizeMode="contain" />
      <Text style={statusStyles.value}>{Math.floor(value || 0)}</Text>
    </View>
  </View>
);

export default function ConfigPersonagemScreen() {
  const router = useRouter();
  const [character, setCharacter] = useState(null);
  const [newNickname, setNewNickname] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const charId = await AsyncStorage.getItem('personagemId');
      
      if (charId) {
        // Carrega avatar específico
        const storedAvatar = await AsyncStorage.getItem(`avatar_${charId}`);
        if (storedAvatar) setAvatarUri(storedAvatar);

        const response = await api.get(`/api/personagem/listarPorId/${charId}`);
        const charData = response.data;
        setCharacter(charData);
        setNewNickname(charData.nickname); 
      } else {
        Alert.alert("Erro", "Personagem não encontrado.");
        router.back();
      }
    } catch (error) {
      console.error("Erro ao carregar dados", error);
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!character) return;

    try {
      if (avatarUri) {
        // SALVA COM A MESMA CHAVE ÚNICA DA CRIAÇÃO/HOME
        await AsyncStorage.setItem(`avatar_${character.id}`, avatarUri);
      }

      const payload = {
        ...character, 
        nickname: newNickname, 
        usuarioId: character.usuario ? character.usuario.id : await AsyncStorage.getItem('usuarioId')
      };

      await api.put(`/api/personagem/atualizar/${character.id}`, payload);

      Alert.alert('Sucesso', 'Personagem atualizado!');
      router.replace('/home'); 

    } catch (error) {
      console.error("Erro ao atualizar", error);
      Alert.alert('Erro', 'Falha ao salvar alterações.');
    }
  };

  if (loading || !character) {
    return (
      <ImageBackground source={BACKGROUND_IMAGE} style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Carregando...</Text>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.topRightCorner}>
          <Image source={DAHT_LOGO} style={styles.logoTop} resizeMode="contain" />
          <TouchableOpacity onPress={() => router.push('/configuracoes')}>
            <Image source={SETTINGS_ICON} style={styles.configTop} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
             <Image 
                source={avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR} 
                style={styles.avatar} 
                resizeMode="cover" 
             />
          </TouchableOpacity>

          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{character.nivel}</Text>
          </View>

          <Text style={styles.characterName}>{character.nickname}</Text>

          <View style={styles.statusGroup}>
            <StatusBar value={character.vida} iconSource={ICON_HEART} barColor="#E83A41" />
            <StatusBar value={character.ouro} iconSource={ICON_GOLD} barColor="#FFD700" />
          </View>
          <View style={styles.statusSingle}>
            <StatusBar value={character.xp} iconSource={ICON_XP} barColor="#38B000" />
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Alterar Nickname:</Text>
          <TextInput
            style={styles.inputLine}
            placeholderTextColor="#ccc"
            value={newNickname}
            onChangeText={setNewNickname}
            placeholder={character.nickname}
          />

          <Text style={styles.label}>Alterar foto de Perfil:</Text>
          <Text style={styles.uploadLabel}>Toque na imagem acima ou no botão.</Text>
          
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
             <Text style={styles.uploadButtonText}>Selecionar Imagem</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const statusStyles = StyleSheet.create({
  barContainer: { width: 130, height: 25, borderColor: '#000', borderWidth: 2, borderRadius: 5, overflow: 'hidden' },
  fill: { flexDirection: 'row', alignItems: 'center', height: '100%', paddingHorizontal: 5 },
  icon: { width: 18, height: 18, marginRight: 5 },
  value: { fontWeight: 'bold', color: '#000', textAlign: 'center', flex: 1 },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { alignItems: 'center', paddingTop: 60, paddingBottom: 60 },
  topRightCorner: { position: 'absolute', top: 15, right: 15, alignItems: 'center', zIndex: 10 },
  logoTop: { width: 40, height: 40, marginBottom: 5 },
  configTop: { width: 28, height: 28 },
  header: { width: '100%', alignItems: 'center', marginBottom: 40 },
  avatarWrapper: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: 'black', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  avatar: { width: '100%', height: '100%', borderRadius: 60 },
  levelBadge: { position: 'absolute', top: 105, right: '38%', backgroundColor: '#FFD700', borderRadius: 12.5, width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'black', zIndex: 20 },
  levelText: { fontSize: 12, fontWeight: 'bold', color: 'black' },
  characterName: { fontSize: 18, fontWeight: 'bold', color: 'black', marginTop: 15, backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 2, borderWidth: 2, borderColor: 'black' },
  statusGroup: { flexDirection: 'row', justifyContent: 'center', marginTop: 15, gap: 10 },
  statusSingle: { flexDirection: 'row', justifyContent: 'center', marginTop: 5 },
  formContainer: { width: '80%', alignItems: 'flex-start' },
  label: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 5 },
  uploadLabel: { color: '#DDD', fontSize: 14, marginBottom: 10, fontStyle: 'italic' },
  inputLine: { width: '100%', height: 40, borderBottomWidth: 2, borderBottomColor: 'white', color: 'white', fontSize: 18, paddingHorizontal: 5 },
  uploadButton: { width: '100%', height: 40, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', borderRadius: 5, borderWidth: 2, borderColor: 'black', marginTop: 5 },
  uploadButtonText: { color: 'black', fontWeight: 'bold' },
  saveButton: { width: '70%', height: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: 50, borderWidth: 4, borderColor: 'black', alignSelf: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  buttonText: { color: 'black', fontSize: 24, fontWeight: 'bold' },
});