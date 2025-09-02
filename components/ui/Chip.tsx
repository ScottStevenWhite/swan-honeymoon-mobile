import { useThemeColor } from '@/hooks/useThemeColor';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Chip({ label, selected, onPress, style }: Props) {
  const bg = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');
  const text = useThemeColor({}, 'text');

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        { backgroundColor: selected ? tint : bg, borderColor: selected ? tint : '#D9D4EA' },
        style,
      ]}
    >
      <Text style={[styles.text, { color: selected ? '#fff' : text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: { fontSize: 14, fontWeight: '600' },
});
