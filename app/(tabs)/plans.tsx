import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { useTrip } from '@/state/useTrip';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, View } from 'react-native';

type BadgeProps = {
    label: string,
    tone: string
}

function Badge({ label, tone = 'default' as 'default' | 'hard' | 'must' }: BadgeProps) {
  const palette: Record<string, { bg: string; fg: string }> = {
    default: { bg: 'rgba(123,97,255,0.12)', fg: '#7B61FF' },
    hard:    { bg: 'rgba(220,38,38,0.12)',  fg: '#DC2626' },
    must:    { bg: 'rgba(16,185,129,0.12)', fg: '#10B981' },
  };
  const p = palette[tone];
  return (
    <View style={{ backgroundColor: p.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
      <ThemedText style={{ color: p.fg, fontWeight: '700', fontSize: 12 }}>{label}</ThemedText>
    </View>
  );
}

export default function PlanScreen() {
  const { trip, dayById, events, options, legs, guestMode, toggleGuestMode, selectOption } = useTrip();
  const day = dayById(trip.days[0]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <ThemedText type="display">Paris</ThemedText>
        <ThemedText type="caption">Trip · {day?.date}</ThemedText>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <Chip
            label={guestMode ? 'Guest mode · On' : 'Guest mode · Off'}
            selected={guestMode}
            onPress={toggleGuestMode}
          />
        </View>
      </View>

      {/* Day items */}
      {day?.items.map((it) => {
        if (it.kind === 'event') {
          const ev = events[it.id];
          if (!ev) return null;
          if (guestMode && ev.priority === 'APPLE') return null;

          const tone = ev.priority === 'HARD' ? 'hard' : ev.priority === 'MUST' ? 'must' : 'default';

          return (
            <Card key={it.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <ThemedText type="headline">{ev.title}</ThemedText>
                <Badge label={ev.priority.replace('_', ' ')} tone={tone as any} />
              </View>
              <ThemedText type="caption" style={{ marginTop: 6 }}>
                ~{ev.durationMin} min
              </ThemedText>
            </Card>
          );
        }

        if (it.kind === 'leg') {
          const lg = legs[it.id];
          if (!lg) return null;
          const iconName =
            lg.mode === 'walk' ? 'directions-walk' :
            lg.mode === 'transit' ? 'train' :
            lg.mode === 'uber' ? 'local-taxi' :
            'directions-transit';

          return (
            <Card key={it.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <MaterialIcons name={iconName as any} size={20} />
                <ThemedText type="defaultSemiBold">
                  Transfer: {lg.mode}{lg.estimated ? ' · est.' : ''}{lg.minutes ? ` · ${lg.minutes} min` : ''}
                </ThemedText>
              </View>
            </Card>
          );
        }

        if (it.kind === 'option') {
          const group = options[it.id];
          if (!group) return null;
          const selected = group.selectedId;

          return (
            <Card key={it.id}>
              <ThemedText type="headline" style={{ marginBottom: 8 }}>{group.title}</ThemedText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {group.options.map((eid) => {
                  const ev = events[eid];
                  if (!ev) return null;
                  return (
                    <Chip
                      key={eid}
                      label={ev.title.replace(/^Lunch [A-C] —\s*/, '')}
                      selected={selected === eid}
                      onPress={() => selectOption(group.id, eid)}
                    />
                  );
                })}
              </View>
              {!!selected && (
                <ThemedText type="caption" style={{ marginTop: 10 }}>
                  Selected: {events[selected].title} · {events[selected].durationMin} min
                </ThemedText>
              )}
            </Card>
          );
        }

        return null;
      })}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  hero: {
    marginBottom: 12,
    paddingVertical: 8,
  },
});
