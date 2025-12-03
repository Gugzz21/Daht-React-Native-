import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DahtLogo from '../../components/DahtLogo';
import usuarioService from '../../services/usuarioService';

const BACKGROUND_IMAGE = require('../../assets/fundo-site.png');
const DAHT_LOGO = require('../../assets/daht-logo.png');
const { width, height } = Dimensions.get('window');
// Slightly increased logo size for better visibility on modern devices
const LOGO_SIZE = Math.min(200, width * 0.52);

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await usuarioService.login({ email, password });

      if (response.data && response.data.id) {
        await AsyncStorage.setItem('usuarioId', response.data.id.toString());
        router.replace('/home');
      } else {
        Alert.alert('Erro', 'Credenciais inválidas.');
      }
    } catch (error) {
      console.error("Erro Login:", error);
      Alert.alert('Erro', 'Falha ao realizar login.');
    }
  };

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
      <DahtLogo size={LOGO_SIZE} containerStyle={{ marginTop: height * 0.12, marginBottom: 36 }} />

      <View style={styles.formContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <Link href="/(auth)/registro" asChild>
          <TouchableOpacity>
            <Text style={styles.registerLink}>ainda não possui conta?</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Logar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  formContainer: { width: '80%', alignItems: 'flex-start' },
  label: { color: 'white', fontSize: 16, marginTop: 20 },
  input: { width: '100%', height: 35, borderBottomWidth: 1, borderBottomColor: 'white', color: 'white', fontSize: 18, padding: 0, marginBottom: 5 },
  registerLink: { color: 'white', fontSize: 14, alignSelf: 'center', marginTop: 20, textDecorationLine: 'underline' },
  loginButton: { width: '100%', height: 50, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginTop: 40, borderWidth: 2, borderColor: 'black' },
  buttonText: { color: 'black', fontSize: 20, fontWeight: 'bold' }
});