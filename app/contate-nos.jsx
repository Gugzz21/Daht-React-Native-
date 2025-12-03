import { useRouter } from 'expo-router';
import { Image, ImageBackground, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');

export default function ContateNosScreen() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    }

    const handleSendEmail = () => {
        Linking.openURL('mailto:gdinizz21@outlook.com');
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground
                source={BACKGROUND_IMAGE}
                style={styles.container}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.header}>
                        <Text style={styles.title}>CONTATE-NOS</Text>
                        <View style={styles.dividerLarge} />

                        <Image
                            source={DAHT_LOGO}
                            style={styles.logoSmall}
                            resizeMode="contain"
                        />

                        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                            <Text style={styles.backButtonText}>{'<'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contentContainer}>
                        <Text style={styles.description}>
                            Tem alguma dúvida, sugestão ou encontrou algum problema? Entre em contato conosco!
                        </Text>

                        <TouchableOpacity style={styles.emailButton} onPress={handleSendEmail}>
                            <Text style={styles.emailButtonText}>Enviar Email</Text>
                            <Text style={styles.emailText}>gdinizz21@outlook.com</Text>
                        </TouchableOpacity>
                    </View>

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
        top: 1,
        right: 1,
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
    contentContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    description: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 30,
    },
    emailButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: 'white',
    },
    emailButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    emailText: {
        fontSize: 16,
        color: '#ddd',
    },
});