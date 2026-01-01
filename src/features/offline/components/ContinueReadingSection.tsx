import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useReaderStore } from '../../../app/store';
import { colors, spacing, typography } from '../../../shared/theme';

export const ContinueReadingSection: React.FC = () => {
  const navigation = useNavigation();
  const { sessions, switchSession } = useReaderStore();

  if (sessions.length === 0) {
    return null;
  }

  const handleContinueReading = (sessionId: string) => {
    switchSession(sessionId);
    (navigation as any).navigate('ReaderTabs');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📖 Continue Reading</Text>
        <TouchableOpacity onPress={() => (navigation as any).navigate('ReaderTabs')}>
          <Text style={styles.viewAllText}>View All ({sessions.length})</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sessions.map((session) => (
          <TouchableOpacity
            key={session.sessionId}
            style={styles.card}
            onPress={() => handleContinueReading(session.sessionId)}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {session.title}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${(session.currentPage / session.totalPages) * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                Page {session.currentPage + 1} of {session.totalPages}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  viewAllText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  card: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  cardContent: {
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
    minHeight: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.gray800,
    borderRadius: 2,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

