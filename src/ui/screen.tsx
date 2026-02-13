import React from "react";
import { StatusBar, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../style/color";

interface ScreenProps {
    children?: React.ReactNode;
}

export function Screen(props: ScreenProps) {
    const {children} = props;

  return (
    <SafeAreaProvider style={styles.background}>
      <StatusBar barStyle={'light-content'}  />
      {children}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: colors.darkBg80
    }
})