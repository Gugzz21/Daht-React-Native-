import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ImageBackground, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BACKGROUND_IMAGE = require('../assets/fundo-site.png');
const DAHT_LOGO = require('../assets/daht-logo.png');

export default function PermissoesScreen() {
    const router = useRouter();
    const [cameraStatus, setCameraStatus] = useState('Indeterminado');
    const [mediaLibraryStatus, setMediaLibraryStatus] = useState('Indeterminado');

    useEffect(() => {
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        const camera = await ImagePicker.getCameraPermissionsAsync();
        setCameraStatus(camera.granted ? 'Concedida' : 'Negada');

        const mediaLib = await ImagePicker.getMediaLibraryPermissionsAsync();
        setMediaLibraryStatus(mediaLib.granted ? 'Concedida' : 'Negada');
    };

    const handleGoBack = () => {
        router.back();
    }

    const openSettings = () => {
        Linking.openSettings();
    }

    const renderPermissionItem = (label, status) => (
        <View style={styles.permissionRow}>
            <Text style={styles.permissionLabel}>{label}</Text>
            <Text style={[
                styles.permissionStatus,
                status === 'Concedida' ? styles.granted : styles.denied
            ]}>
                {status}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground
                source={BACKGROUND_IMAGE}
                style={styles.container}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.header}>
                        <Text style={styles.title}>PERMISSÕES</Text>
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
                            Gerencie as permissões concedidas ao aplicativo.
                        </Text>

                        <View style={styles.permissionsList}>
                            {renderPermissionItem('Câmera', cameraStatus)}
                            {renderPermissionItem('Galeria', mediaLibraryStatus)}
                            {renderPermissionItem('Notificações', 'Verificar Configurações')}
                        </View>

                        <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
                            <Text style={styles.settingsButtonText}>Abrir Configurações do Dispositivo</Text>
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
        marginTop: 20,
    },
    description: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 30,
    },
    permissionsList: {
        width: '100%',
        marginBottom: 30,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 10,
        padding: 10,
    },
    permissionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
    },
    permissionLabel: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    permissionStatus: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    granted: {
        color: '#4CAF50', // Green
    },
    denied: {
        color: '#F44336', // Red
    },
    settingsButton: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    settingsButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
});