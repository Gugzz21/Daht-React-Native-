import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import api from '../../services/api';

const BACKGROUND_IMAGE = require('../../assets/fundo-site.png');
const DAHT_LOGO = require('../../assets/daht-logo.png');

const FormInput = ({ label, value, onChangeText, secureTextEntry, keyboardType, maxLength, placeholder }) => (
  <View style={inputStyles.group}>
    <Text style={inputStyles.label}>{label}:</Text>
    <TextInput 
      style={inputStyles.input} 
      secureTextEntry={secureTextEntry} 
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
      keyboardType={keyboardType || 'default'}
      maxLength={maxLength}
      placeholder={placeholder}
      placeholderTextColor="#ccc"
    />
  </View>
);

export default function RegistroScreen() {
  const router = useRouter();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const handleDateChange = (text) => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length > 2) cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    if (cleaned.length > 5) cleaned = cleaned.substring(0, 5) + '/' + cleaned.substring(5, 9);
    if (cleaned.length > 10) cleaned = cleaned.substring(0, 10);
    setDataNascimento(cleaned);
  };

  const convertDateToApi = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleRegister = async () => {
    if (senha !== confirmarSenha) { Alert.alert('Erro', 'Senhas não conferem.'); return; }
    if (!nome || !email || !senha || !dataNascimento) { Alert.alert('Erro', 'Preencha tudo.'); return; }

    try {
      // 1. Criar
      const payload = {
        nome, email, senha, telefone,
        dataNascimento: convertDateToApi(dataNascimento),
        status: 1,
        roles: ["ROLE_USER"]
      };

      const response = await api.post('/usuario/criar', payload);
      
      if (response.status === 201 || response.status === 200) {
        const novoUserId = response.data.id;

        // 2. Logar para pegar Token
        const loginRes = await api.post('/usuario/login', { email, password: senha });
        const token = loginRes.data.token;
        
        if (token) {
            await AsyncStorage.setItem('token', token);
            // SALVA O ID NO STORAGE TAMBÉM (BACKUP DE SEGURANÇA)
            await AsyncStorage.setItem('usuarioId', novoUserId.toString());
        }

        Alert.alert('Sucesso', 'Vamos criar seu personagem!');
        // Passa o ID também via params
        router.replace({ pathname: '/personagem', params: { userId: novoUserId } });
      }

    } catch (error) {
      console.error("Erro Registro:", error);
      Alert.alert('Erro', 'Falha ao registrar.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image source={DAHT_LOGO} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.formContainer}>
            <FormInput label="Nome" value={nome} onChangeText={setNome} />
            <FormInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <FormInput label="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
            <FormInput label="Data de Nascimento" value={dataNascimento} onChangeText={handleDateChange} keyboardType="numeric" maxLength={10} placeholder="DD/MM/AAAA" />
            <FormInput label="Senha" value={senha} onChangeText={setSenha} secureTextEntry={true} />
            <FormInput label="Confirmar Senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry={true} />
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={styles.backLinkContainer}><Text style={styles.backLinkText}>Voltar para o Login</Text></TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const inputStyles = StyleSheet.create({
  group: { width: '100%', marginBottom: 15 },
  label: { color: 'white', fontSize: 16, marginBottom: 5 },
  input: { width: '100%', height: 35, borderBottomWidth: 1, borderBottomColor: 'white', color: 'white', fontSize: 18, padding: 0 },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContainer: { alignItems: 'center', paddingTop: 40, paddingBottom: 50 },
  logoContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logo: { width: 80, height: 80 },
  formContainer: { width: '80%' },
  registerButton: { width: '100%', height: 50, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginTop: 20, borderWidth: 2, borderColor: 'black' },
  buttonText: { color: 'black', fontSize: 20, fontWeight: 'bold' },
  backLinkContainer: { marginTop: 20, alignSelf: 'center' },
  backLinkText: { color: 'white', fontSize: 16, textDecorationLine: 'underline' },
});