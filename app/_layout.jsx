import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ 
        contentStyle: { backgroundColor: '#FF8C00' }
    }}>
      {/* ... (suas rotas existentes: index, (auth), home, etc) ... */}
      
      {/* Rota inicial/Auth layout */}
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      {/* Agrupamento das telas de autenticação */}
      <Stack.Screen 
        name="(auth)"
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

      {/* === NOVAS TELAS ADICIONADAS === */}
      
      {/* Tela da Loja de Prêmios */}
      <Stack.Screen 
        name="premios" 
        options={{ headerShown: false }} 
      />
      
      {/* Modal de Criar/Editar Missão */}
      <Stack.Screen 
        name="missaoModal" 
        options={{ 
          headerShown: false, 
          presentation: 'modal' // Abre como um modal por cima
        }} 
      />
    </Stack>
  );
}