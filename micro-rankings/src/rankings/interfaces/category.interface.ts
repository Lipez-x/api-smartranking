export interface Category {
  readonly id: string;
  readonly category: string;
  description: string;
  events: Array<Event>;
}

interface Event {
  name: string;
  operation: string;
  value: number;
}
