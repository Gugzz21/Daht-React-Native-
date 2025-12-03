import { useRouter } from 'expo-router';
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const SNOOPY_IMAGE = require('../assets/snoopy.png');
const DAHT_LOGO = require('../assets/daht-logo.png');

export default function ConfiguracoesScreen() {
  const settingsOptions = ['Contas', 'Permissões', 'Contate-nos', 'Sobre nós'];
  const router = useRouter();

  const renderOption = (text) => (
    <TouchableOpacity style={styles.optionRow} key={text}>
      <Text style={styles.optionText}>{text}</Text>
      <View style={styles.divider} />
    </TouchableOpacity>
  );

  const handleGoBack = () => {
    router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={BACKGROUND_IMAGE}
        style={styles.container}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Header com Logo e Botão Voltar */}
          <View style={styles.header}>
            <Text style={styles.title}>CONFIGURAÇÕES</Text>
            <View style={styles.dividerLarge} />

            <Image
              source={DAHT_LOGO}
              style={styles.logoSmall}
              resizeMode="contain"
            />

            {/* Botão Voltar */}
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Text style={styles.backButtonText}>{'<'}</Text>
            </TouchableOpacity>
          </View>

          {/* Opções de Configuração */}
          <View style={styles.optionsList}>
            {settingsOptions.map(renderOption)}
          </View>

          {/* Imagem do Snoopy */}
          <View style={styles.snoopyContainer}>
            <Image
              source={SNOOPY_IMAGE}
              style={styles.snoopyImage}
              resizeMode="cover"
            />
          </View>

          {/* Rodapé */}
          <Text style={styles.footerText}>Made by Gustavo Diniz</Text>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  logoSmall: {
    position: 'absolute',
    top: 1, // sobe mais perto da borda
    right: 1, // encosta mais na lateral
    width: 40,
    height: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 5,
  },
  backButtonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
    marginBottom: 5,
    marginTop: 40,
  },
  dividerLarge: {
    width: '70%',
    height: 3,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
  optionsList: {
    width: '100%',
    flex: 1,
  },
  optionRow: {
    marginBottom: 10,
  },
  optionText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: 'white',
    borderRadius: 1,
  },
  snoopyContainer: {
    marginBottom: 20,
  },
  snoopyImage: {
    width: 200,
    height: 200,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: 'black',
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  }
});