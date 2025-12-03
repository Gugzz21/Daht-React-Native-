// Registro Screen
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DahtLogo from '../../components/DahtLogo';
import usuarioService from '../../services/usuarioService';

const BACKGROUND_IMAGE = require('../../assets/fundo-site.png');
const DAHT_LOGO = require('../../assets/daht-logo.png');
const { width } = Dimensions.get('window');
// Slightly increased logo size for better visibility on modern devices
const LOGO_SIZE = Math.min(180, width * 0.48);

const inputStyles = StyleSheet.create({
  group: { width: '100%', marginBottom: 15 },
  label: { color: 'white', fontSize: 16, marginBottom: 5 },
  input: { width: '100%', height: 35, borderBottomWidth: 1, borderBottomColor: 'white', color: 'white', fontSize: 18, padding: 0 },
});

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

  // --- Validações e Máscaras ---

  // Máscara de Data (DD/MM/AAAA)
  const handleDateChange = (text) => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length > 2) cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    if (cleaned.length > 5) cleaned = cleaned.substring(0, 5) + '/' + cleaned.substring(5, 9);
    if (cleaned.length > 10) cleaned = cleaned.substring(0, 10);
    setDataNascimento(cleaned);
  };

  // Máscara de Telefone (Apenas Números)
  const handlePhoneChange = (text) => {
    // Remove tudo que não for número
    const numericValue = text.replace(/[^0-9]/g, '');
    setTelefone(numericValue);
  };

  // Validação de Idade (> 8 anos)
  const isOldEnough = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    // Ajusta a idade se o aniversário ainda não aconteceu este ano
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 8;
  };

  // Validação de Data Geral
  const isValidDate = (dateString) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateString)) return false;
    const [d, m, y] = dateString.split('/').map(Number);
    const currentYear = new Date().getFullYear();

    // Ano válido (entre 1900 e hoje)
    if (y < 1900 || y > currentYear) return false;
    // Mês válido
    if (m === 0 || m > 12) return false;

    // Dias válidos por mês
    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (y % 400 === 0 || (y % 100 !== 0 && y % 4 === 0)) monthLength[1] = 29; // Bissexto

    return d > 0 && d <= monthLength[m - 1];
  };

  // Validação de Email (Regex simples)
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const convertDateToApi = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };
  // --------------------------------------------

  const handleRegister = async () => {
    // 1. Validação de Campos Vazios
    if (!nome || !email || !senha || !dataNascimento || !telefone) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    // 2. Validação de Email
    if (!isValidEmail(email)) {
      Alert.alert('Email Inválido', 'Por favor, insira um endereço de email válido.');
      return;
    }

    // 3. Validação de Senha (>= 4 caracteres)
    if (senha.length < 4) {
      Alert.alert('Senha Fraca', 'A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro de Senha', 'As senhas não coincidem.');
      return;
    }

    // 4. Validação de Data e Idade
    if (!isValidDate(dataNascimento)) {
      Alert.alert('Data Inválida', 'Insira uma data válida (DD/MM/AAAA).');
      return;
    }

    if (!isOldEnough(dataNascimento)) {
      Alert.alert('Restrição de Idade', 'Você precisa ter pelo menos 8 anos para se registrar.');
      return;
    }

    try {
      const payload = {
        nome,
        email,
        senha,
      };

      await usuarioService.criar(payload);

      // Auto-login após registro
      const loginRes = await usuarioService.login({ email, password: senha });
      if (loginRes.data && loginRes.data.id) {
        await AsyncStorage.setItem('usuarioId', loginRes.data.id.toString());
        router.replace('/home');
      } else {
        Alert.alert('Sucesso', 'Conta criada! Faça login.');
        router.replace('/(auth)/login');
      }

    } catch (error) {
      console.error("Erro Registro:", error);
      Alert.alert('Erro', 'Falha ao registrar usuário.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <DahtLogo size={LOGO_SIZE} containerStyle={{ marginBottom: 20 }} />

          <View style={styles.formContainer}>
            <FormInput label="Nome" value={nome} onChangeText={setNome} />

            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="exemplo@email.com"
            />

            <FormInput
              label="Telefone (Apenas números)"
              value={telefone}
              onChangeText={handlePhoneChange}
              keyboardType="numeric"
              placeholder="11999999999"
              maxLength={11}
            />

            <FormInput
              label="Data de Nascimento"
              value={dataNascimento}
              onChangeText={handleDateChange}
              keyboardType="numeric"
              maxLength={10}
              placeholder="DD/MM/AAAA"
            />

            <FormInput label="Senha (Min 4 caracteres)" value={senha} onChangeText={setSenha} secureTextEntry={true} />
            <FormInput label="Confirmar Senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry={true} />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>

            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={styles.backLinkContainer}>
                <Text style={styles.backLinkText}>Voltar para o Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContainer: { alignItems: 'center', paddingTop: 40, paddingBottom: 50 },
  formContainer: { width: '80%' },
  registerButton: { width: '100%', height: 50, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginTop: 20, borderWidth: 2, borderColor: 'black' },
  buttonText: { color: 'black', fontSize: 20, fontWeight: 'bold' },
  backLinkContainer: { marginTop: 20, alignSelf: 'center' },
  backLinkText: { color: 'white', fontSize: 16, textDecorationLine: 'underline' },
});