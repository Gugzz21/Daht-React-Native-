import { Link } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Caminho corrigido para quem está em app/auth/
const DAHT_LOGO = require('../../assets/daht-logo.png');

// Componente reusável para os campos de entrada
const FormInput = ({ label }) => (
  <View style={inputStyles.group}>
    <Text style={inputStyles.label}>{label}:</Text>
    <TextInput style={inputStyles.input} secureTextEntry={label.includes('Senha')} />
  </View>
);

export default function RegistroScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
      
      <View style={styles.logoContainer}>
        <Image 
          source={DAHT_LOGO} 
          style={styles.logo} 
          resizeMode="contain" 
        />
      </View>

      <View style={styles.formContainer}>
        <FormInput label="Nome" />
        <FormInput label="Email" />
        <FormInput label="Senha" />
        <FormInput label="Endereço" />
        <FormInput label="Data de Nascimento" />
        <FormInput label="Confirmar Senha" />

        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
        
        {/* Link para voltar ao Login */}
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.backLinkContainer}>
            <Text style={styles.backLinkText}>Voltar para o Login</Text>
          </TouchableOpacity>
        </Link>
      </View>

    </ScrollView>
  );
}

const inputStyles = StyleSheet.create({
  group: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 2,
  },
  input: {
    width: '100%',
    height: 35,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
    fontSize: 18,
    padding: 0,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00', 
  },
  scrollContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 50,
  },
  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  formContainer: {
    width: '80%',
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 40,
    borderWidth: 2,
    borderColor: 'black',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backLinkContainer: {
    marginTop: 20,
    alignSelf: 'center',
  },
  backLinkText: {
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});