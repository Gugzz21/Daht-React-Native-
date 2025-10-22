import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DAHT_LOGO = require('../assets/daht-logo.png');
const DEFAULT_AVATAR = require('../assets/default-avatar.png');

export default function CriacaoPersonagemScreen() {
  const router = useRouter();

  const handleCreate = () => {
    // Após a criação, leva para a tela principal
    router.replace('/home'); 
  }

  return (
    <View style={styles.container}>
      <Image 
        source={DAHT_LOGO} 
        style={styles.logoCorner} 
        resizeMode="contain"
      />

      <Text style={styles.title}>Criação de Personagem</Text>

      {/* Avatar */}
      <View style={styles.avatarCircle}>
        <Image 
          source={DEFAULT_AVATAR} 
          style={styles.avatarImage} 
          resizeMode="contain"
        />
      </View>

      {/* Campo Nickname */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nickname:</Text>
        <TextInput style={styles.inputLine} />
      </View>

      {/* Campo Upload de Imagem */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Upload imagem:</Text>
        <View style={styles.uploadBox}>
          <Text style={styles.uploadText}>Escolher Arquivo</Text>
        </View>
      </View>

      {/* Botão Criar */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.buttonText}>Criar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00', 
    alignItems: 'center',
    paddingTop: 60,
  },
  logoCorner: {
    position: 'absolute',
    top: 50, 
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 50,
    marginBottom: 40,
  },
  avatarCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 5,
    borderColor: 'white',
  },
  avatarImage: {
    width: 100,
    height: 100,
    tintColor: 'gray', 
  },
  inputGroup: {
    width: '80%',
    marginBottom: 25,
  },
  label: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
  },
  inputLine: {
    width: '100%',
    height: 25,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    color: 'white',
    fontSize: 18,
  },
  uploadBox: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  uploadText: {
    color: 'gray',
    fontSize: 16,
  },
  createButton: {
    width: '60%',
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 60,
    borderWidth: 4,
    borderColor: 'black',
  },
  buttonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  }
});