import { Tabs } from 'expo-router/tabs';
import { Text } from 'react-native';

import { cores } from '@/ui/theme';

function icone(emoji: string) {
  return function Icone({ focused }: { focused: boolean }) {
    return <Text style={{ fontSize: 21, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>;
  };
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSuave,
        headerShown: false,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: icone('🏠') }} />
      <Tabs.Screen name="empresas" options={{ title: 'Empresas', tabBarIcon: icone('🏢') }} />
      <Tabs.Screen name="pedidos" options={{ title: 'Pedidos', tabBarIcon: icone('🧾') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icone('👤') }} />
    </Tabs>
  );
}
