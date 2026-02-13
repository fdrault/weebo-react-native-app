import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../ui/screen';
import { Header } from '../../ui/header';
import { layout } from '../../style/layout';

export const SearchScreen = () => {

    return (
    <Screen>
      <Header style={[layout.horizontalPaddedContainer, layout.topScreen]} title="Recherche" />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
