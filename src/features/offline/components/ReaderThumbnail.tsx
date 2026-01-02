import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../../shared/theme';

interface ReaderThumbnailProps {
  uri?: string;
  style?: any;
}

export const ReaderThumbnail: React.FC<ReaderThumbnailProps> = ({ uri, style }) => {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.thumbnail, style]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[styles.thumbnail, styles.placeholder, style]}>
      <Text style={styles.placeholderText}>📚</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
});

