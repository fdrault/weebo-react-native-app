import { StyleSheet, Text, View } from 'react-native';
import { ScrollableScreen } from '../../ui/screen';

export const DetailScreen = () => {
  return (
    <ScrollableScreen>
      <View style={styles.screen}>
        <Text>Detail</Text>
      </View>
    </ScrollableScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
