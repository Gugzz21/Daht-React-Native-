import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Rota inicial/Index */}
      <Stack.Screen name="index" />

      {/* Grupo de Autenticação */}
      <Stack.Screen name="(auth)" />

      {/* Telas Principais */}
      <Stack.Screen name="home" />
      <Stack.Screen name="personagem" />
      <Stack.Screen name="configuracoes" />
      <Stack.Screen name="config-personagem" options={{ title: 'Config. Personagem' }} />

      {/* Telas de Missões (Modais e Padrão) */}
      <Stack.Screen name="missoes/nova" options={{ presentation: 'modal' }} />
      <Stack.Screen name="missoes/editar" options={{ presentation: 'modal' }} />
      <Stack.Screen name="missoes/realizadas" />

      <Stack.Screen name="premios" options={{ title: 'Loja' }} />
    </Stack>
  );
}