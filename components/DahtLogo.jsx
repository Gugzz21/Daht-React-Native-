import { Image, StyleSheet, View } from 'react-native';

const DAHT_LOGO = require('../assets/daht-logo.png');

export default function DahtLogo({ size = 120, containerStyle }) {
  const containerSize = size + 24;

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize, borderRadius: containerSize / 2 }, containerStyle]}>
      <Image
        source={DAHT_LOGO}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessible
        accessibilityLabel="Logo Daht"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
});
