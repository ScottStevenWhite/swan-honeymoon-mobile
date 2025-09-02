// app/(tabs)/index.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useMemo } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useTrip } from '../../state/useTrip';

function openInMaps(lat: number, lon: number) {
  const u = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=walking`;
  Linking.openURL(u);
}

export default function Itinerary() {
  const { trip, days, events, legs, options, guestMode, selectOption, toggleGuestMode } = useTrip();
  const day = days[trip.days[0]];

  const renderItem = (item: (typeof day.items)[number]) => {
    if (item.kind === 'event') {
      const e = events[item.id];
      if (!e) return null;
      if (guestMode && e.priority === 'APPLE') return null;
      return (
        <ThemedView style={styles.card} key={e.id}>
          <ThemedText type="defaultSemiBold">{e.title}</ThemedText>
          <ThemedText>{e.durationMin} min — {e.priority}</ThemedText>
        </ThemedView>
      );
    }
    if (item.kind === 'option') {
      const g = options[item.id];
      const choices = g.options.map((id) => ({ id, title: events[id]?.title ?? id }));
      return (
        <ThemedView style={styles.card} key={g.id}>
          <ThemedText type="defaultSemiBold">{g.title}</ThemedText>
          <View style={styles.row}>
            {choices.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => selectOption(g.id, c.id)}
                style={[styles.choice, g.selectedId === c.id && styles.choiceSelected]}>
                <ThemedText>{c.title}</ThemedText>
              </Pressable>
            ))}
          </View>
        </ThemedView>
      );
    }
    if (item.kind === 'leg') {
      const l = legs[item.id];
      const label = l.mode.toUpperCase() + (l.estimated ? ' (est.)' : '');
      return (
        <ThemedView style={[styles.card, styles.leg]} key={l.id}>
          <ThemedText>{label}</ThemedText>
        </ThemedView>
      );
    }
    return null;
  };

  const items = useMemo(() => day.items.map(renderItem), [day, events, legs, options, guestMode]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="title">Itinerary — {trip.city}</ThemedText>
        <Pressable onPress={toggleGuestMode} style={styles.guest}>
          <ThemedText>{guestMode ? 'Guest Mode: On' : 'Guest Mode: Off'}</ThemedText>
        </Pressable>
      </View>
      <View style={styles.list}>{items}</View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  list: { gap: 12 },
  card: { padding: 12, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth },
  leg: { opacity: 0.7 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 8 },
  choice: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth },
  choiceSelected: { borderWidth: 2 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  guest: { padding: 8 },
});
