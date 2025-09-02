import { useThemeColor } from '@/hooks/useThemeColor';
import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'default'
    | 'title'
    | 'defaultSemiBold'
    | 'subtitle'
    | 'link'
    | 'display'   // big serif hero
    | 'headline'  // medium serif
    | 'caption';  // small muted
};

export function ThemedText({
  style, lightColor, darkColor, type = 'default', ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return (
    <Text
      style={[
        { color },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'defaultSemiBold' && styles.defaultSemiBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'display' && styles.display,
        type === 'headline' && styles.headline,
        type === 'caption' && styles.caption,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24 },
  defaultSemiBold: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: 'bold', lineHeight: 32 },
  subtitle: { fontSize: 20, fontWeight: 'bold' },
  link: { lineHeight: 30, fontSize: 16, color: '#0a7ea4' },
  display: { fontFamily: SERIF, fontSize: 34, lineHeight: 38, letterSpacing: 0.2 },
  headline: { fontFamily: SERIF, fontSize: 22, lineHeight: 28 },
  caption: { fontSize: 12, lineHeight: 16, opacity: 0.7 },
});
