import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Index apenas redireciona e não precisa de cabeçalho */}
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      
      {/* O grupo (auth) é configurado no seu próprio arquivo _layout.jsx */}
      
      {/* Telas Principais */}
      <Stack.Screen 
        name="home" 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen 
        name="configuracoes" 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen 
        name="personagem" 
        options={{ headerShown: false, title: 'Criação' }} 
      />
    </Stack>
  );
}