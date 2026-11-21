import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppProvider } from '@/context/app-state';
import { cores } from '@/ui/theme';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: cores.primaria,
          headerTitleStyle: { color: cores.textoForte, fontSize: 16, fontWeight: '700' },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackTitle: 'Voltar',
          contentStyle: { backgroundColor: cores.fundo },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="categoria/[id]" options={{ title: '' }} />
        <Stack.Screen name="loja/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="sacola" options={{ title: 'Sacola' }} />
        <Stack.Screen name="corrida" options={{ title: 'Pedir corrida' }} />
      </Stack>
    </AppProvider>
  );
}
