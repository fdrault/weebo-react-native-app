import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../ui/screen';
import { Header } from '../../ui/header';
import { layout } from '../../style/layout';

export const FavoriteScreen = () => {

    return (
    <Screen>
      <Header style={[layout.horizontalPaddedContainer, layout.topScreen]} title="Mes Favoris" />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
