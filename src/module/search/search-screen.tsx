import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../ui/screen';

export const SearchScreen = () => {

    return (
    <Screen>
      <View style={styles.screen}>
        <Text>Search</Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
