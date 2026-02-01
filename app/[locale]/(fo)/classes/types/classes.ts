export type ClassSessionDto = {
  id: string;
  title: string;
  type: string;
  instructor: string | null;
  notes: string | null;
  startsAt: string;
  endsAt: string;
  capacity: number;
  bookedCount: number;
  remaining: number;
  isFull: boolean;
  myBookingId: string | null;
};
