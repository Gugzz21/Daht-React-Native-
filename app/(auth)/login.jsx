import { Link, useRouter } from 'expo-router';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const BACKGROUND_IMAGE = require('../../assets/fundo-site.png');
const DAHT_LOGO = require('../../assets/daht-logo.png'); 
const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter(); 
  
  const handleLogin = () => {
    // AÇÃO CORRIGIDA: Redireciona para a tela de criação de personagem
    router.replace('/personagem'); 
  };

  return (
    <ImageBackground 
        source={BACKGROUND_IMAGE} 
        style={styles.container}
        resizeMode="cover" 
    >
      
      {/* Logo DAHT */}
      <View style={styles.logoContainer}>
        <Image 
          source={DAHT_LOGO} 
          style={styles.logo} 
          resizeMode="contain" 
        />
      </View>

      <View style={styles.formContainer}>
        
        {/* Campo Email */}
        <Text style={styles.label}>Email:</Text>
        <TextInput style={styles.input} />

        {/* Campo Senha */}
        <Text style={styles.label}>Senha:</Text>
        <TextInput style={styles.input} secureTextEntry={true} />

        {/* Link para o Registro */}
        <Link href="/(auth)/registro" asChild> 
          <TouchableOpacity>
            <Text style={styles.registerLink}>ainda não possui conta?</Text>
          </TouchableOpacity>
        </Link>

        {/* Botão Logar */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Logar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.15,
    marginBottom: 50,
  },
  logo: {
    width: 110,
    height: 110,
  },
  formContainer: {
    width: '80%',
    alignItems: 'flex-start',
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
  },
  input: {
    width: '100%',
    height: 35,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
    fontSize: 18,
    padding: 0,
    marginBottom: 5,
  },
  registerLink: {
    color: 'white',
    fontSize: 14,
    alignSelf: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  loginButton: {
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
  }
});