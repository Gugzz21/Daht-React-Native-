import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Rota inicial/Auth layout */}
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      {/* Agrupamento das telas de autenticação */}
      <Stack.Screen 
        name="(auth)/_layout" 
        options={{ headerShown: false }} 
      />
      {/* Tela Home - Tela Principal */}
      <Stack.Screen 
        name="home" 
        options={{ headerShown: false }} 
      />
      {/* Tela de Criação de Personagem */}
      <Stack.Screen 
        name="personagem" 
        options={{ headerShown: false }} 
      />
      {/* Tela de Configurações Gerais */}
      <Stack.Screen 
        name="configuracoes" 
        options={{ headerShown: false }} 
      />
      
      {/* Tela de Configuração do Personagem */}
      <Stack.Screen 
        name="config-personagem" 
        options={{ headerShown: false, title: 'Config. Personagem' }} 
      />
    </Stack>
  );
}