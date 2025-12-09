import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DahtLogo from '../../components/DahtLogo';
import api from '../../services/api';

const BACKGROUND_IMAGE = require('../../assets/android-icon-foreground.png');
const { width, height } = Dimensions.get('window');
const LOGO_SIZE = Math.min(200, width * 0.52);

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const loginPayload = { email: email, password: password };

      // 1. Faz o Login e recebe o Token
      const response = await api.post('/api/usuario/login', loginPayload);

      if (response.status === 200) {
        const { token } = response.data;
        await AsyncStorage.setItem('token', token);

        // --- CORREÇÃO: BUSCAR E SALVAR O ID DO USUÁRIO ---
        try {
          // Usamos o token recém-recebido para autenticar essa busca
          const usersResponse = await api.get('/api/usuario/listar', {
            headers: { Authorization: `Bearer ${token}` }
          });

          // Encontra o usuário dono deste email na lista
          const currentUser = usersResponse.data.find(u => u.email === email);

          if (currentUser) {
            // Salva o ID fundamental para a Home encontrar o personagem
            await AsyncStorage.setItem('usuarioId', currentUser.id.toString());

            // Se o backend já retornar o ID do personagem no usuário, salvamos também para agilizar
            if (currentUser.personagemId) {
              await AsyncStorage.setItem('personagemId', currentUser.personagemId.toString());
            }
          }
        } catch (fetchError) {
          console.log("Erro ao buscar detalhes do usuário no login:", fetchError);
        }
        // -------------------------------------------------
        router.replace('/home');
      } else {
        // Fallback para status diferente de 200 que não caiu no catch
        Alert.alert('Atenção', `Login retornou status inesperado: ${response.status}`);
      }
    } catch (error) {
      console.log("Erro Login:", error);

      let msg = "Não foi possível conectar ao servidor. Verifique sua internet.";

      if (error.response) {
        // O servidor respondeu com um status fora da faixa de 2xx
        msg = error.response.data?.message || `Erro do servidor (${error.response.status})`;
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        msg = "O servidor não respondeu. Tente novamente mais tarde.";
        // Verifique se o endereço do API_URL é acessível do dispositivo
      } else {
        // Algo aconteceu na configuração da requisição
        msg = `Erro na requisição: ${error.message}`;
        if (error.code) {
          msg += ` (Código: ${error.code})`;
        }
      }

      // Append raw error for debugging in release builds if needed
      msg += `\n\nDetalhes: ${JSON.stringify(error)}`;

      Alert.alert('Erro no Login', msg);
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