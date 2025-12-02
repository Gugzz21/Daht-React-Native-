import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Oculta o cabeçalho padrão para as telas de login e registro */}
      <Stack.Screen name="login" />
      <Stack.Screen name="registro" />
    </Stack>
  );
}