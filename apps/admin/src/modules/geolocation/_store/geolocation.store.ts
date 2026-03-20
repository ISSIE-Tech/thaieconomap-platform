import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type GeolocationState = {
  geolocation: [number, number] | null;
  setGeolocation: (geolocation: [number, number] | null) => void;
};

export const useGeolocationStore = create<GeolocationState>()(
  devtools((set) => ({
    geolocation: null,
    setGeolocation: (geolocation) => set({ geolocation }),
  }))
);
