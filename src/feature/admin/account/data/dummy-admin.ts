import { ProfileFormData } from "@/components/core/profile-section/profile-form";

// Simulated in-memory data (can be replaced with API calls later)
const mockProfiles: Record<string, ProfileFormData> = {
  "1": {
    firstName: "Luke",
    lastName: "Skywalker",
    userName: "LukeSkywalker212",
    dateOfBirth: new Date("2000-05-04"),
    country: "United States",
    state: "Pennsylvania",
    city: "Essington",
    street: "500 Powhattan Ave",
    zip: "19029",
    phoneNumber: "(+880)1795448106",
    primaryEmail: "luke.skywalker@email.com",
    secondaryEmail: "luke.alternate@email.com",
  },
  "2": {
    firstName: "Leia",
    lastName: "Organa",
    userName: "GeneralLeia",
    dateOfBirth: new Date("2000-06-04"),
    country: "United States",
    state: "California",
    city: "San Francisco",
    street: "100 Alderaan Ave",
    zip: "94105",
    phoneNumber: "(+880)1795448107",
    primaryEmail: "leia.organa@email.com",
  },
};

// ✅ Fetch user data by ID (mocked)
export async function fetchUserProfile(id: string): Promise<ProfileFormData> {
  await new Promise((resolve) => setTimeout(resolve, 300)); // simulate delay
  const profile = mockProfiles[id];
  if (!profile) throw new Error("Profile not found");
  return profile;
}
