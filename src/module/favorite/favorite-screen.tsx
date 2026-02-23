import { layout } from '@/style/layout';
import { Grid } from '@/ui/grid';
import { Header } from '@/ui/header';
import { ScrollableScreen } from '@/ui/screen';
import { StyleSheet, View } from 'react-native';

export const FavoriteScreen = () => {
  const data = new Array(9).fill(0);
  return (
    <ScrollableScreen>
      <Header
        style={[layout.horizontalPaddedContainer, layout.topScreen]}
        title="Mes Favoris"
      />
      <Grid
        data={data}
        renderItem={(it, index) => (
          <View
            key={index}
            style={{ backgroundColor: randomColor(), height: 100 }}
          />
        )}
        rowSize={3}
        rowGap={10}
        columnGap={2}
      />
    </ScrollableScreen>
  );
};

const hexa = '0123456789abcdef';
const randomHex = () => hexa[Math.round(Math.random() * 16)];
const randomColor = () =>
  `#${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}`;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
