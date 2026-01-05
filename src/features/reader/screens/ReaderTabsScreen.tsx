import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReaderStore } from '../../../app/store';
import { ReaderScreen } from './ReaderScreen';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../shared/theme';
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
      {activeSession && (
        <ReaderScreen 
          key={activeSession.sessionId} 
          sessionId={activeSession.sessionId} 
        />
      )}

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, SPACING.xs) }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContainer}
        >
          {sessions.map((session) => {
            const isActive = session.sessionId === activeSessionId;
            const displayTitle = session.title.length > 20 
              ? session.title.substring(0, 20) + '...' 
              : session.title;

            return (
              <View key={session.sessionId} style={styles.tabWrapper}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    isActive && styles.tabActive,
                  ]}
                  onPress={() => switchSession(session.sessionId)}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]} numberOfLines={1}>
                    {displayTitle}
                  </Text>
                </TouchableOpacity>
                {isActive && (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                      closeSession(session.sessionId);
                      if (sessions.length === 1) {
                        navigation.goBack();
                      }
                    }}
                  >
                    <Text style={styles.closeIcon}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
          
          <TouchableOpacity 
            style={styles.newTabButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.newTabText}>+ New</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.sm,
  },
  tabsScroll: {
    maxHeight: 48,
  },
  tabsContainer: {
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  tabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
    backgroundColor: COLORS.card,
    minWidth: 80,
    maxWidth: 160,
  },
  tabActive: {
    backgroundColor: COLORS.text,
  },
  tabText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
    backgroundColor: COLORS.card,
    borderRadius: 12,
  },
  closeIcon: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '300',
  },
  newTabButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  newTabText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

