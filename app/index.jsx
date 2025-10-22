import { Redirect } from 'expo-router';

export default function StartPage() {
  // Redireciona para a tela de login
  return <Redirect href="/(auth)/login" />;
}