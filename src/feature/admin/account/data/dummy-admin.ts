import { ProfileFormData } from "@/components/core/profile-section/profile-form";

// Simulated in-memory data (can be replaced with API calls later)
const mockProfiles: Record<string, ProfileFormData> = {
  "1": {
    // Application form fields - Personal Information
    name: "Luke Skywalker",
    gender: "male",
    primaryPhone: "(+880)1795448106",
    secondaryPhone: "(+880)1795448107",
    currentCity: "Karachi",
    permanentCity: "Lahore",
    email: "luke.skywalker@email.com",
    
    // Application form fields - Education
    yearsOfEducation: "16",
    highestDegree: "BS",
    majors: "Computer Science",
    university: "National University of Sciences and Technology",
    yearOfCompletion: "2020",
    
    // Application form fields - Experience
    totalExperience: "3",
    experienceUnit: "years",
    experiences: [
      {
        organization: "Tech Solutions Inc.",
        designation: "Software Engineer",
        from: new Date("2020-01-01"),
        to: new Date("2023-01-01"),
      },
      {
        organization: "Innovative Systems",
        designation: "Senior Developer",
        from: new Date("2023-01-01"),
        to: undefined,
      },
    ],
  },
  "2": {
    // Application form fields - Personal Information
    name: "Leia Organa",
    gender: "female",
    primaryPhone: "(+880)1795448107",
    currentCity: "Islamabad",
    permanentCity: "Karachi",
    email: "leia.organa@email.com",
    
    // Application form fields - Education
    yearsOfEducation: "18",
    highestDegree: "MS",
    majors: "Political Science",
    university: "Harvard University",
    yearOfCompletion: "2018",
    
    // Application form fields - Experience
    totalExperience: "5",
    experienceUnit: "years",
    experiences: [
      {
        organization: "Galactic Senate",
        designation: "Senator",
        from: new Date("2018-01-01"),
        to: new Date("2023-01-01"),
      },
    ],
  },
};

// ✅ Fetch user data by ID (mocked)
export async function fetchUserProfile(id: string): Promise<ProfileFormData> {
  await new Promise((resolve) => setTimeout(resolve, 300)); // simulate delay
  const profile = mockProfiles[id];
  if (!profile) throw new Error("Profile not found");
  return profile;
}