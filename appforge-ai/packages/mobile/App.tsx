import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import ProjectScreen from './src/screens/ProjectScreen';
import HistoryScreen from './src/screens/HistoryScreen';

export type RootStackParamList = {
  Home: undefined;
  Project: { id: string };
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: '#0f172a' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'AppForge AI' }}
        />
        <Stack.Screen
          name="Project"
          component={ProjectScreen}
          options={{ title: 'Project' }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
