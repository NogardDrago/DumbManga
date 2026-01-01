import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReaderStore } from '../../../app/store';
import { ReaderScreen } from './ReaderScreen';
import { colors, spacing, typography } from '../../../shared/theme';
import { EmptyState } from '../../../shared/components';

export const ReaderTabsScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { sessions, activeSessionId, switchSession, closeSession } = useReaderStore();

  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No open readers"
        description="Open a manga or book to start reading"
      />
    );
  }

  const activeSession = sessions.find((s) => s.sessionId === activeSessionId);

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, spacing.sm) }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Library</Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContainer}
        >
          {sessions.map((session) => (
            <View key={session.sessionId} style={styles.tabWrapper}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  session.sessionId === activeSessionId && styles.tabActive,
                ]}
                onPress={() => switchSession(session.sessionId)}
              >
                <Text
                  style={[
                    styles.tabTitle,
                    session.sessionId === activeSessionId && styles.tabTitleActive,
                  ]}
                  numberOfLines={1}
                >
                  {session.title}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => closeSession(session.sessionId)}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.addTabButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.addTabText}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {activeSession && (
        <ReaderScreen sessionId={activeSession.sessionId} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.gray900,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray800,
    paddingBottom: 0,
    minHeight: 50,
  },
  backButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray800,
    marginLeft: spacing.sm,
    marginBottom: spacing.xs,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  backText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  tabsScroll: {
    flex: 1,
  },
  tabsContainer: {
    paddingLeft: spacing.xs,
    alignItems: 'flex-end',
    paddingBottom: 0,
  },
  tabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray800,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    minWidth: 100,
    maxWidth: 160,
    borderBottomWidth: 0,
  },
  tabActive: {
    backgroundColor: colors.black,
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopColor: colors.white,
    borderLeftColor: colors.gray700,
    borderRightColor: colors.gray700,
  },
  tabTitle: {
    ...typography.bodySmall,
    color: colors.gray400,
    flex: 1,
  },
  tabTitleActive: {
    color: colors.white,
    fontWeight: '600',
  },
  closeButton: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
    borderRadius: 4,
  },
  closeText: {
    color: colors.gray600,
    fontSize: 14,
  },
  addTabButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray800,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginLeft: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  addTabText: {
    color: colors.gray400,
    fontSize: 18,
    fontWeight: '300',
  },
});

