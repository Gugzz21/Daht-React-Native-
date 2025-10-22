import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      {/* Oculta o cabeçalho padrão para as telas de login e registro */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="registro" options={{ headerShown: false }} />
    </Stack>
  );
}