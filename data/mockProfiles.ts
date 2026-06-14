export type Profile = {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: string;
  bio: string;
  interests: string[];
  experience: string;
  ethnicity: string;
  activityPerWeek: string;
  mainImage: string;
  workoutPlansImage: string;
  weightLossImage: string;
};

export const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Natasha",
    age: 23,
    location: "New York",
    distance: "25 Mi Away",
    bio: "Adventurous spirit with a love for the outdoors and spontaneous road trips! 🏕️🧗‍♀️",
    interests: ["Parkour", "Animals", "Boxing", "Cycling", "Swimming", "Food", "Yoga & Mindfulness", "Action"],
    experience: "Beginner · 0 - 1 Years",
    ethnicity: "American",
    activityPerWeek: "1 - 2 Days",
    mainImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    workoutPlansImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    weightLossImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    name: "Hannah",
    age: 26,
    location: "New York",
    distance: "25 Mi Away",
    bio: "Adventurous spirit with a love for the outdoors and spontaneous road trips! 🏕️🧗‍♀️",
    interests: ["Parkour", "Animals", "Boxing", "Cycling", "Swimming", "Food", "Yoga & Mindfulness", "Action"],
    experience: "Beginner · 0 - 1 Years",
    ethnicity: "American",
    activityPerWeek: "1 - 2 Days",
    mainImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
    workoutPlansImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    weightLossImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    name: "Jessica",
    age: 24,
    location: "Los Angeles",
    distance: "10 Mi Away",
    bio: "Fitness enthusiast, always looking for a new challenge! 💪🏃‍♀️",
    interests: ["Running", "Weightlifting", "Yoga & Mindfulness", "Food"],
    experience: "Intermediate · 2 - 3 Years",
    ethnicity: "American",
    activityPerWeek: "3 - 4 Days",
    mainImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    workoutPlansImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    weightLossImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
  }
];
