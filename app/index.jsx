import { Redirect } from 'expo-router';

export default function Index() {
  // Redireciona automaticamente para o fluxo de login ao abrir o app
  return <Redirect href="/(auth)/login" />;
}