import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import type { ProjectListItem } from '../api/client';
import { api } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export default function HistoryScreen({ navigation }: Props) {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      api
        .listProjects()
        .then(({ projects }) => setProjects(projects))
        .finally(() => setLoading(false));
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={projects.length === 0 ? styles.empty : styles.list}
      data={projects}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.emptyView}>
          <Text style={styles.emptyTitle}>No projects yet</Text>
          <Text style={styles.emptySubtitle}>Generate your first app from the home screen.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Project', { id: item.id })}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <View style={[styles.badge, item.status === 'completed' ? styles.badgeGreen : styles.badgeYellow]}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.cardDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  list: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyView: { alignItems: 'center' },
  emptyTitle: { fontSize: 18, color: '#64748b', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#475569' },
  card: {
    backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: 1,
    borderRadius: 12, padding: 16, marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#fff', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  badgeGreen: { backgroundColor: 'rgba(34,197,94,0.2)' },
  badgeYellow: { backgroundColor: 'rgba(234,179,8,0.2)' },
  badgeText: { fontSize: 11, color: '#22c55e' },
  cardDesc: { fontSize: 14, color: '#94a3b8', marginBottom: 8 },
  cardDate: { fontSize: 12, color: '#475569' },
});
