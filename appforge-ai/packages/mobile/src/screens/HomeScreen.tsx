import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const EXAMPLES = [
  'A todo app with categories',
  'A blog platform',
  'An e-commerce store',
  'A dashboard app',
];

export default function HomeScreen({ navigation }: Props) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const { project } = await api.generateProject(description.trim());
      navigation.navigate('Project', { id: project.id });
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Describe your app,{'\n'}we'll build it</Text>
      <Text style={styles.subtitle}>
        Turn your idea into a complete codebase in seconds.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Describe the app you want to build..."
        placeholderTextColor="#64748b"
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={2000}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, (!description.trim() || loading) && styles.buttonDisabled]}
        onPress={handleGenerate}
        disabled={!description.trim() || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Generate App</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.examplesLabel}>Try an example:</Text>
      <View style={styles.examples}>
        {EXAMPLES.map((ex) => (
          <TouchableOpacity
            key={ex}
            style={styles.exampleChip}
            onPress={() => setDescription(ex)}
          >
            <Text style={styles.exampleText}>{ex}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.historyLink}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.historyText}>View project history</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24, alignItems: 'center', paddingTop: 48 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#94a3b8', textAlign: 'center', marginBottom: 32 },
  input: {
    width: '100%', height: 120, backgroundColor: '#1e293b', borderColor: '#334155',
    borderWidth: 1, borderRadius: 12, padding: 16, color: '#fff', fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    width: '100%', backgroundColor: '#3b82f6', paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', marginTop: 16,
  },
  buttonDisabled: { backgroundColor: '#334155' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  examplesLabel: { color: '#64748b', fontSize: 14, marginTop: 24, alignSelf: 'flex-start' },
  examples: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, width: '100%' },
  exampleChip: {
    paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#1e293b',
    borderColor: '#334155', borderWidth: 1, borderRadius: 20,
  },
  exampleText: { color: '#94a3b8', fontSize: 13 },
  historyLink: { marginTop: 32 },
  historyText: { color: '#3b82f6', fontSize: 14 },
});
