# DineCue Product Brief

DineCue is a smart dining assistant. It helps people decide where to eat by matching restaurants to the user's current mood, location, preferences, and dining context.

## Positioning

DineCue is not a generic restaurant directory or an admin panel. It should feel like a warm, premium dining concierge: fast, trustworthy, emotionally appetizing, and useful when someone has a vague craving but needs a real decision.

Core slogan: **Eat by mood.**

## Main User Flows

- Public visitor lands on the SEO-friendly homepage, understands the product, and starts with email.
- User signs in through email OTP.
- User describes the meal they want using natural language, cue chips, location text, language, party size, kids, and meal moment.
- DineCue creates an async recommendation session.
- The UI shows a calm generation screen and polls the BFF session detail endpoint.
- When completed, the user receives up to three decision-friendly recommendation cards.
- User can save places, share returned share text, open reservation/map URLs, and revisit history.
- User can update profile and language preferences.

## Current Backend Capabilities

- Email OTP auth.
- JWT access and refresh tokens.
- `/me`, profile, taste profile, and dining profile endpoints.
- Async recommendation session creation.
- Session detail endpoint as source of truth.
- Google Places and OpenAI-backed recommendation generation.
- History and saved places.
- Save, unsave, feedback, and share text endpoints.
- Menu scan and restaurant fit-check backend contracts.
- SignalR recommendation status notifications at `/hubs/recommendations`.

## Future Features

- Menu scan with image upload, OCR, and food-aware recommendations.
- Fit check for a specific restaurant against the current mood/context.
- Saved/history improvements and richer memory.
- Feed for personalized dining inspiration.
- Mobile app.
