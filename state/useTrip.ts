import { create } from 'zustand';
import { Day, Event, OptionGroup, TravelLeg, Trip } from '../lib/types';

type Dict<T> = Record<string, T>;

type TripState = {
  trip: Trip;
  days: Dict<Day>;
  events: Dict<Event>;
  legs: Dict<TravelLeg>;
  options: Dict<OptionGroup>;
  guestMode: boolean;

  selectOption: (groupId: string, optionId: string) => void;
  toggleGuestMode: () => void;

  // selectors
  dayById: (id: string) => Day | undefined;
};

const d1: Day = {
  id: '2025-10-21',
  date: '2025-10-21',
  items: [
    { kind: 'event', id: 'evt-arrive' },
    { kind: 'leg',   id: 'leg-airport-hotel' },
    { kind: 'event', id: 'evt-checkin' },
    { kind: 'option', id: 'opt-lunch' },
    { kind: 'leg',   id: 'leg-lunch-next' },
    { kind: 'event', id: 'evt-afternoon-stroll' },
    { kind: 'event', id: 'evt-apple' }, // 🍎 private block
  ],
  sleepTargetHrs: 8,
};

const events: Dict<Event> = {
  'evt-arrive': { id: 'evt-arrive', title: 'Arrive in Paris (CDG)', durationMin: 45, priority: 'HARD' },
  'evt-checkin': { id: 'evt-checkin', title: 'Hotel Check‑in', durationMin: 30, priority: 'MUST' },
  'evt-afternoon-stroll': { id: 'evt-afternoon-stroll', title: 'Stroll along the Seine', durationMin: 90, priority: 'WANT_8' },
  'evt-lunch-a': { id: 'evt-lunch-a', title: 'Lunch A — vegan bistro', durationMin: 75, priority: 'WANT_10' },
  'evt-lunch-b': { id: 'evt-lunch-b', title: 'Lunch B — crêpes végétariennes', durationMin: 75, priority: 'WANT_9' },
  'evt-lunch-c': { id: 'evt-lunch-c', title: 'Lunch C — chic pescatarian café', durationMin: 75, priority: 'WANT_8' },
  'evt-apple':  { id: 'evt-apple', title: '🍎 Private time', durationMin: 60, priority: 'APPLE' },
};

const legs: Dict<TravelLeg> = {
  'leg-airport-hotel': { id: 'leg-airport-hotel', fromId: 'evt-arrive', toId: 'evt-checkin', mode: 'transit', estimated: true },
  'leg-lunch-next':    { id: 'leg-lunch-next', fromId: 'evt-checkin', toId: 'evt-afternoon-stroll', mode: 'walk', estimated: true },
};

const options: Dict<OptionGroup> = {
  'opt-lunch': { id: 'opt-lunch', title: 'Lunch choice', options: ['evt-lunch-a','evt-lunch-b','evt-lunch-c'], selectedId: 'evt-lunch-a' },
};

export const useTrip = create<TripState>()((set, get) => ({
  trip: { id: 'trip-france-2025', city: 'Paris', days: [d1.id] },
  days: { [d1.id]: d1 },
  events,
  legs,
  options,
  guestMode: false,

  selectOption: (groupId, optionId) =>
    set((s) => {
      const g = s.options[groupId];
      if (!g) return {};
      return { options: { ...s.options, [groupId]: { ...g, selectedId: optionId } } };
    }),

  toggleGuestMode: () => set((s) => ({ guestMode: !s.guestMode })),

  dayById: (id) => get().days[id],
}));
