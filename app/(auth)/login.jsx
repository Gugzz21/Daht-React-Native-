import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../services/api';

const BACKGROUND_IMAGE = require('../../assets/fundo-site.png');
const DAHT_LOGO = require('../../assets/daht-logo.png'); 
const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const loginPayload = { email: email, password: password }; 
      const response = await api.post('/usuario/login', loginPayload);

      if (response.status === 200) {
        const { token } = response.data;
        await AsyncStorage.setItem('token', token);
        // Assumindo que o usuário já tem personagem. A Home vai tentar carregar.
        router.replace('/home'); 
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Credenciais inválidas.');
    }
  };

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.logoContainer}>
        <Image source={DAHT_LOGO} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput 
            style={styles.input} 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
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
  logoContainer: { width: 150, height: 150, borderRadius: 75, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', marginTop: height * 0.15, marginBottom: 50 },
  logo: { width: 110, height: 110 },
  formContainer: { width: '80%', alignItems: 'flex-start' },
  label: { color: 'white', fontSize: 16, marginTop: 20 },
  input: { width: '100%', height: 35, borderBottomWidth: 1, borderBottomColor: 'white', color: 'white', fontSize: 18, padding: 0, marginBottom: 5 },
  registerLink: { color: 'white', fontSize: 14, alignSelf: 'center', marginTop: 20, textDecorationLine: 'underline' },
  loginButton: { width: '100%', height: 50, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginTop: 40, borderWidth: 2, borderColor: 'black' },
  buttonText: { color: 'black', fontSize: 20, fontWeight: 'bold' }
});