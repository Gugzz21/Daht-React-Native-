import { Redirect } from 'expo-router';
import 'react-native-reanimated';

export default function StartPage() {
  // Redireciona para a tela de login
  return <Redirect href="/(auth)/login" />;
}