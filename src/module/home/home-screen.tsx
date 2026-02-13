import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../ui/screen';
import { useNavigation } from '../../navigation/use-navigation';
import { Route } from '../../navigation/route';
import { Header } from '../../ui/header';
import { layout } from '../../style/layout';

export const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <Screen>
      <Header style={[layout.horizontalPaddedContainer, layout.topScreen]} title="Découvrir" />
      <Pressable onPress={() => navigation.navigate(Route.Detail)}>
        <View style={styles.button}>
          <Text>Go to detail</Text>
        </View>
      </Pressable>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  button: {
    height: 60,
  },
});
