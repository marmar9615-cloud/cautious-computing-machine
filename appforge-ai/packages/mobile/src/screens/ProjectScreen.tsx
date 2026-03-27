import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import type { Project } from '../api/client';
import { api } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Project'>;

export default function ProjectScreen({ route }: Props) {
  const { id } = route.params;
  const [project, setProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [tab, setTab] = useState<'files' | 'code'>('files');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProject(id)
      .then(({ project }) => {
        setProject(project);
        if (project.files.length > 0) setSelectedFile(project.files[0].path);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!project) return null;

  const currentFile = project.files.find((f) => f.path === selectedFile);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{project.name}</Text>
        <Text style={styles.desc} numberOfLines={1}>{project.description}</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'files' && styles.activeTab]}
          onPress={() => setTab('files')}
        >
          <Text style={[styles.tabText, tab === 'files' && styles.activeTabText]}>Files</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'code' && styles.activeTab]}
          onPress={() => setTab('code')}
        >
          <Text style={[styles.tabText, tab === 'code' && styles.activeTabText]}>Code</Text>
        </TouchableOpacity>
      </View>

      {tab === 'files' ? (
        <ScrollView style={styles.fileList}>
          {project.files.map((file) => (
            <TouchableOpacity
              key={file.path}
              style={[styles.fileItem, selectedFile === file.path && styles.fileItemActive]}
              onPress={() => {
                setSelectedFile(file.path);
                setTab('code');
              }}
            >
              <Text style={[styles.fileName, selectedFile === file.path && styles.fileNameActive]}>
                {file.path}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={styles.codeView}>
          {currentFile && (
            <>
              <Text style={styles.codePath}>{currentFile.path}</Text>
              <ScrollView horizontal>
                <Text style={styles.codeContent}>{currentFile.content}</Text>
              </ScrollView>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#334155' },
  name: { fontSize: 18, fontWeight: '600', color: '#fff' },
  desc: { fontSize: 14, color: '#64748b', marginTop: 4 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#334155' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#3b82f6' },
  tabText: { fontSize: 14, color: '#64748b' },
  activeTabText: { color: '#3b82f6', fontWeight: '600' },
  fileList: { flex: 1 },
  fileItem: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  fileItemActive: { backgroundColor: '#1e293b' },
  fileName: { fontSize: 14, color: '#94a3b8', fontFamily: 'monospace' },
  fileNameActive: { color: '#60a5fa' },
  codeView: { flex: 1, padding: 16 },
  codePath: { fontSize: 12, color: '#64748b', fontFamily: 'monospace', marginBottom: 12 },
  codeContent: { fontSize: 13, color: '#e2e8f0', fontFamily: 'monospace', lineHeight: 20 },
});
