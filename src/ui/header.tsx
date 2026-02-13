import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { textStyles } from '../style/font';

interface HeaderProps {
  style?: StyleProp<ViewStyle>;
  title: string;
}
export const Header = (props: HeaderProps) => {
  const { style, title } = props;

  return (
    <View style={[style, styles.container]}>
      <Text style={textStyles.header}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
});
