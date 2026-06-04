You are a senior React Native Expo engineer and product designer. Build a polished MVP prototype for a startup called “GYM +1”.

## Product context
GYM +1 is a fitness-tech app focused on helping users find a compatible gym partner (“+1”) and feel more confident, consistent, and supported in their fitness journey.

This is NOT a production build.
This is a prototype for TestFlight, early validation, and investor/founder demos.

## Core product goal
Demonstrate the vision of:
1. onboarding users based on fitness preferences
2. AI-style compatibility matching for gym partners
3. lightweight social/accountability experience
4. polished mobile UX that feels startup-ready

## Important constraints
- Build with Expo React Native
- Use TypeScript
- Use Expo Router
- Use local mock data only
- No backend
- No authentication
- No real chat server
- No real payment
- No real AI API
- Simulate AI outputs locally using deterministic mock logic
- App must feel realistic and investor-demo ready
- Prioritize beautiful UI, clean architecture, and smooth flows
- Keep code modular and easy to extend later into real backend APIs

## Brand/product vibe
The product should feel:
- modern
- energetic
- supportive
- social
- premium but approachable
- slightly feminine-friendly / inclusive, but not exclusively feminine
- clean and mobile-first

Think:
fitness accountability + friendship + confidence + smart recommendations

## MVP user story
A user downloads the app, completes onboarding, gets matched with a compatible gym partner using an “AI compatibility score”, sees suggested workout/accountability insights, can view partner profiles, and can simulate sending a gym buddy request / message.

## Main app sections / screens
Create the following screens and flows:

### 1. Welcome / Landing screen
- App name: GYM +1
- Short tagline:
  “Find your perfect gym partner.”
- CTA buttons:
  - Get Started
  - Preview Demo
- Visually strong hero section
- Optional illustration placeholders / gradient cards

### 2. Onboarding flow
Create a multi-step onboarding flow to collect:
- first name
- age range
- gender preference for gym partner
- fitness goal:
  - lose weight
  - build muscle
  - improve consistency
  - confidence in the gym
  - general fitness
- workout style:
  - strength training
  - cardio
  - classes
  - functional fitness
  - mixed
- fitness level:
  - beginner
  - intermediate
  - advanced
- gym frequency:
  - 1–2 times/week
  - 3–4 times/week
  - 5+ times/week
- preferred workout time:
  - early morning
  - morning
  - afternoon
  - evening
- motivation style:
  - encouragement
  - discipline
  - accountability check-ins
  - fun/social
- personality vibe:
  - calm
  - energetic
  - focused
  - chatty
- location / area (mock selectable list)
- gym type:
  - commercial gym
  - women-only gym
  - local/community gym
  - luxury gym
- confidence level in gym:
  - low
  - medium
  - high

At the end of onboarding:
- show a “Generating your best matches...” loading state
- then navigate to compatibility results

### 3. AI Match Results screen
This is the core wow moment.

Show:
- top 3 compatible gym buddies from mock data
- each with:
  - profile photo placeholder / avatar
  - name
  - age
  - gym area
  - fitness goal
  - workout style
  - confidence level
  - compatibility score (e.g. 87%)
  - short AI-generated explanation like:
    “You both prefer evening workouts, value accountability, and are at a similar fitness stage.”

Each card should have:
- View Profile
- Send Request

Also include:
- “Why this match?”
- “Best time to train together”
- “Likely accountability style”

### 4. Match Profile screen
Detailed partner profile with:
- avatar
- name
- short bio
- goals
- fitness level
- preferred days
- preferred time
- gym style
- motivation style
- personality vibe
- “AI Match Insights” card
- CTA:
  - Send Gym Request
  - Start Intro Chat

### 5. Buddy Request success flow
When user taps Send Request:
- show a polished success modal
- message like:
  “Request sent. Your future +1 might be one workout away.”
- options:
  - Continue Exploring
  - Go to Dashboard

### 6. Dashboard / Home screen
After onboarding, user lands on a dashboard showing:
- greeting
- next suggested workout day
- accountability summary
- current match status
- quick stats cards
- suggested actions

Include sections like:
- Your top match
- Weekly consistency target
- Confidence coach insight
- Recommended workout window
- Community prompt

Example content:
- “You’re most likely to stay consistent with evening sessions.”
- “Your ideal partner is someone encouraging but structured.”
- “This week’s goal: 2 completed gym sessions.”

### 7. AI Coach / Confidence screen
Create a screen for a mock AI assistant called:
“+1 Coach”

This screen should simulate AI-powered support with cards such as:
- pre-gym motivation
- confidence tip
- accountability nudge
- workout encouragement
- reschedule suggestion if a workout is missed

Include a chat-like interface, but use local canned responses only.
No real AI integration.

Example user prompts:
- “I feel nervous going to the gym.”
- “Help me stay consistent this week.”
- “Suggest a good time for my next session.”

Return polished mock responses based on the user’s onboarding profile.

### 8. Messages screen (prototype only)
Create a simple chat UI with one matched buddy.
Use static/local mock conversation.
Include:
- friendly intro
- proposed gym meetup
- supportive tone
No backend required.
Input can be non-functional or locally appended.

### 9. Explore screen
Allow the user to browse additional mock gym buddies with filters:
- area
- goal
- workout style
- fitness level
- preferred time

This can be a polished filterable mock list.

### 10. Profile screen
Show current user profile based on onboarding answers:
- personal details
- goals
- preferences
- confidence level
- motivation style
- edit profile button (local state only)

## AI simulation logic
Create a local compatibility scoring utility.
No external AI.
Implement a deterministic scoring function based on:
- same/similar workout style
- same/similar goal
- similar fitness level
- matching preferred workout time
- compatible motivation style
- similar confidence level
- same area / nearby area

Return:
- compatibility score out of 100
- explanation string
- accountability style label
- recommended workout time label

This should feel like AI, but be fully local and mock-driven.

## Mock data
Create a robust mock dataset of at least 12 gym buddy profiles.
Each profile should include:
- id
- name
- age
- gender
- area
- bio
- fitness goal
- workout style
- fitness level
- gym frequency
- preferred workout time
- motivation style
- personality vibe
- confidence level
- gym type
- avatar placeholder
- available days

Ensure the dataset feels realistic and diverse.

## UX requirements
- Use clean, premium card-based UI
- Smooth spacing and hierarchy
- Use rounded corners generously
- Strong CTA buttons
- Nice empty/loading/success states
- Polished onboarding progress indicator
- Bottom tab navigation after onboarding:
  - Home
  - Explore
  - Coach
  - Messages
  - Profile

## Technical requirements
- Expo Router structure
- TypeScript throughout
- Reusable components
- Local state only
- Organize folders cleanly:
  - app/
  - components/
  - features/
  - data/
  - utils/
  - types/
  - constants/
- Separate business logic from UI
- Create utility functions for scoring and mock AI response generation
- Add comments where future backend/API integration would happen

## Design requirements
- Build a consistent design system:
  - colors
  - spacing
  - radius
  - typography
  - shadows
- Use a modern palette suitable for fitness + community
- Avoid overdesign
- Make it feel investor-demo worthy
- Focus on delight and clarity

## Demo mode expectations
The app should support a strong demo narrative:
1. user enters onboarding
2. app generates match
3. user sees AI compatibility
4. user views buddy profile
5. user sends request
6. user checks dashboard
7. user sees +1 Coach insight
8. user previews chat

## Deliverables
Generate:
1. complete folder structure
2. all required screens
3. reusable components
4. mock data
5. compatibility scoring utility
6. mock AI coach response utility
7. navigation setup
8. clean styling and theme constants

## Also do these
- Add a README explaining:
  - what the prototype includes
  - what is mocked
  - how to run it
  - what should be connected later to backend / real AI
- Add TODO comments for future productionization
- Make sure the app runs without needing external services

## Output style
- Write production-quality prototype code
- Keep it clean and maintainable
- Avoid unnecessary complexity
- Build the MVP fully, not just snippets
- If needed, make reasonable product decisions without asking questions