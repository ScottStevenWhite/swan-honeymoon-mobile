export type Priority = 'HARD' | 'MUST' | 'WANT_10' | 'WANT_9' | 'WANT_8' | 'APPLE';

export type Event = {
  id: string;
  title: string;
  durationMin: number;
  priority: Priority;
  note?: string;
};

export type TravelMode = 'walk' | 'transit' | 'uber' | 'train' | 'metro';

export type TravelLeg = {
  id: string;
  fromId: string;
  toId: string;
  mode: TravelMode;
  estimated?: boolean;
  minutes?: number;
};

export type ItemRef = { kind: 'event' | 'leg' | 'option'; id: string };

export type OptionGroup = {
  id: string;
  title: string;
  options: string[];   // references to Event ids
  selectedId?: string; // chosen Event id
};

export type Day = {
  id: string;  // ISO date
  date: string;
  items: ItemRef[];
  sleepTargetHrs?: number;
};

export type Trip = {
  id: string;
  city: string;
  days: string[]; // Day ids
};
