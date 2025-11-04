import { z } from "zod"

// Combined schema for the entire application form
export const applicationFormSchema = z.object({
  // Personal Information
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender is required",
  }),
  primaryPhone: z.string().min(1, "Primary phone is required"),
  secondaryPhone: z.string().optional(),
  currentCity: z.string().min(1, "Current city is required"),
  permanentCity: z.string().min(1, "Permanent city is required"),
  email: z.string().email("Invalid email address"),

  // Education
  yearsOfEducation: z.enum(["12", "14", "16", "18"], {
    message: "Years of education is required",
  }),
  highestDegree: z.enum(["HSSC", "A-Levels", "BS", "BSc", "MS", "MSc"], {
    message: "Highest degree is required",
  }),
  majors: z.string().min(1, "Majors is required"),
  university: z.string().min(1, "University is required"),
  yearOfCompletion: z.string().min(1, "Year of completion is required"),

  // Experience
  totalExperience: z.string().min(1, "Total experience is required"),
  experienceUnit: z.enum(["months", "years"], {
    message: "Experience unit is required",
  }),
  experiences: z.array(z.object({
    organization: z.string().optional(),
    designation: z.string().optional(),
    from: z.date().optional(),
    to: z.date().optional(),
  })).optional(),

  // Availability & Interests
  workingDays: z.enum(["yes", "no"], {
    message: "Please select availability on working days",
  }),
  weekends: z.enum(["yes", "no"], {
    message: "Please select availability on weekends",
  }),
  onsiteSessions: z.enum(["yes", "no"], {
    message: "Please select availability for onsite sessions",
  }),
  remoteSessions: z.enum(["yes", "no"], {
    message: "Please select availability for remote sessions",
  }),
  blueTeam: z.boolean(),
  redTeam: z.boolean(),
  grc: z.boolean(),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to the use of PII",
  }),
}).refine(
  (data) => data.blueTeam || data.redTeam || data.grc,
  {
    message: "Please select at least one area of interest",
    path: ["blueTeam"],
  }
).refine(
  (data) => data.blueTeam || data.redTeam || data.grc,
  {
    message: "Please select at least one area of interest",
    path: ["redTeam"],
  }
).refine(
  (data) => data.blueTeam || data.redTeam || data.grc,
  {
    message: "Please select at least one area of interest",
    path: ["grc"],
  }
)

export type ApplicationFormData = z.infer<typeof applicationFormSchema>