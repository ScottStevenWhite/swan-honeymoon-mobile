import { useThemeColor } from '@/hooks/useThemeColor';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export function Card({ children }: { children: ReactNode }) {
  const card = useThemeColor({}, 'card' as any) as string;
  const border = useThemeColor({}, 'border' as any) as string;
  return <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
});
