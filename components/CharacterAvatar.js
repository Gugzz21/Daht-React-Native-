import { Image, StyleSheet, Text, View } from 'react-native';
import { ITEMS_DB } from '../constants/Items'; // Agora deve encontrar o arquivo corretamente

export default function CharacterAvatar({ imageUri, molduraId, cabecaId, maoId, size = 120 }) {

    const molduraItem = ITEMS_DB[molduraId];
    const cabecaItem = ITEMS_DB[cabecaId];
    const maoItem = ITEMS_DB[maoId];

    return (
        <View style={[styles.container, { width: size, height: size }]}>

            {/* 1. CAMADA BASE: FOTO DO USUÁRIO */}
            <View style={[styles.imageContainer, { width: size, height: size, borderRadius: size / 2 }]}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.userImage} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={{ fontSize: size * 0.4 }}>👤</Text>
                    </View>
                )}
            </View>

            {/* 2. CAMADA: MÃO (Atrás da moldura ou na frente, depende do gosto) */}
            {maoItem && (
                <Image
                    source={maoItem.source}
                    style={[styles.handItem, { width: size * 0.5, height: size * 0.5, right: -size * 0.15, bottom: -size * 0.1 }]}
                    resizeMode="contain"
                />
            )}

            {/* 3. CAMADA: MOLDURA (Envolve a foto) */}
            {molduraItem && (
                <Image
                    source={molduraItem.source}
                    style={[styles.fullOverlay, { width: size * 1.15, height: size * 1.15 }]}
                    resizeMode="contain"
                />
            )}

            {/* 4. CAMADA: CABEÇA (Topo, acima da moldura) */}
            {cabecaItem && (
                <Image
                    source={cabecaItem.source}
                    style={[styles.headItem, { width: size * 0.9, height: size * 0.9, top: -size * 0.45 }]}
                    resizeMode="contain"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 10,
        position: 'relative'
    },
    imageContainer: {
        overflow: 'hidden',
        backgroundColor: '#DDDDDD',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF'
    },
    userImage: { width: '100%', height: '100%' },
    placeholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },

    fullOverlay: {
        position: 'absolute',
        zIndex: 10,
    },
    headItem: {
        position: 'absolute',
        zIndex: 20,
    },
    handItem: {
        position: 'absolute',
        zIndex: 15,
    }
});