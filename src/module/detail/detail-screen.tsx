import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../ui/screen';

export const DetailScreen = () => {
  return (
    <Screen>
      <View style={styles.screen}>
        <Text>Detail</Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
