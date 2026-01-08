import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mapping } from '@/lib/schema';
import { v4 as uuidv4 } from 'uuid';
export interface Profile extends Mapping {
  id: string;
  createdAt: string;
  updatedAt: string;
}
interface ProfileState {
  profiles: Profile[];
  addProfile: (mapping: Mapping) => Profile;
  updateProfile: (id: string, mapping: Mapping) => void;
  deleteProfile: (id: string) => void;
  importProfile: (json: string) => Profile | null;
}
export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      addProfile: (mapping: Mapping) => {
        const newProfile: Profile = {
          ...mapping,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          profiles: [...state.profiles, newProfile],
        }));
        return newProfile;
      },
      updateProfile: (id: string, mapping: Mapping) => {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id
              ? { ...p, ...mapping, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },
      deleteProfile: (id: string) => {
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
        }));
      },
      importProfile: (json: string) => {
        try {
          const parsed = JSON.parse(json);
          // We assume validation is done before calling this or we trust the source for now
          // Ideally we should validate against MappingSchema here too
          const newProfile = get().addProfile(parsed);
          return newProfile;
        } catch (e) {
          console.error("Failed to import profile", e);
          return null;
        }
      },
    }),
    {
      name: 'profile-storage',
    }
  )
);