import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../ui/screen';

export const FavoriteScreen = () => {

    return (
    <Screen>
      <View style={styles.screen}>
        <Text>Favorite</Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
