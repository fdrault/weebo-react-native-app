import { colors } from '@/style/color';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface ScreenProps {
  children?: React.ReactNode;
}

export function Screen(props: ScreenProps) {
  const { children } = props;

  return (
    <SafeAreaProvider style={styles.background}>
      <StatusBar barStyle={'light-content'} />
      {children}
    </SafeAreaProvider>
  );
}
export function ScrollableScreen(props: ScreenProps) {
  const { children } = props;

  return (
    <Screen>
      <ScrollView
        style={styles.scrollview}
        contentContainerStyle={styles.scrollviewContainer}
      >
        {children}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.darkBg80,
  },
  scrollview: {
    flexGrow: 1,
    flexBasis: 0,
  },
  scrollviewContainer: {
    flexGrow: 1,
  },
});
