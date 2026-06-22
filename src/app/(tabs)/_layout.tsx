import { Tabs } from 'expo-router';
import { BottomNav } from '@/components/prism/BottomNav';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
      detachInactiveScreens={false}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="subscriptions" />
      <Tabs.Screen name="offers" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
