import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Rota inicial/Auth layout */}
      <Stack.Screen name="index" />
      {/* Agrupamento das telas de autenticação */}
      <Stack.Screen name="(auth)" />
      {/* Tela Home - Tela Principal */}
      <Stack.Screen name="home" />
      {/* Tela de Criação de Personagem */}
      <Stack.Screen name="personagem" />
      {/* Tela de Configurações Gerais */}
      <Stack.Screen name="configuracoes" />

      {/* Tela de Configuração do Personagem */}
      <Stack.Screen name="config-personagem" options={{ title: 'Config. Personagem' }} />
    </Stack>
  );
}