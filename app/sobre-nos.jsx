import { useRouter } from 'expo-router';
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BACKGROUND_IMAGE = require('../assets/android-icon-foreground.png');
const DAHT_LOGO = require('../assets/daht-logo.png');

export default function SobreNosScreen() {
    const router = useRouter();

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

                    <View style={styles.header}>
                        <Text style={styles.title}>SOBRE NÓS</Text>
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
                        <Text style={styles.text}>
                            O Daht é um aplicativo focado na criação de hábitos de maneira gamificada.
                        </Text>
                        <Text style={styles.text}>
                            Nossa ideia principal é transformar a rotina diária em uma jornada divertida e recompensadora.
                            Ao completar suas tarefas e manter seus hábitos, você evolui seu personagem e conquista prêmios!
                        </Text>
                        <Text style={styles.text}>
                            Acreditamos que a constância é a chave para o sucesso, e nada melhor do que se divertir enquanto constrói uma vida melhor.
                        </Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
        borderRadius: 15,
    },
    text: {
        fontSize: 18,
        color: 'white',
        marginBottom: 15,
        lineHeight: 24,
        textAlign: 'justify',
    },
});