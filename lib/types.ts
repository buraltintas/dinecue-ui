export type SupportedLanguage = "en" | "tr" | "de";

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
  };
};

export type UserDto = {
  id: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  preferredLanguage: SupportedLanguage;
  country?: string | null;
};

export type ProfileDto = {
  displayName?: string | null;
  preferredLanguage: SupportedLanguage;
  country?: string | null;
  currency: string;
  distanceUnit: string;
};

export type TasteProfileDto = {
  favoriteCuisines: string[];
  dislikedCuisines: string[];
  favoriteDishes: string[];
  dislikedIngredients: string[];
  spiceTolerance: number;
  sweetSaltyPreference: string;
  drinkPreferences: string[];
  dietaryRestrictions: string[];
  allergies: string[];
};

export type DiningProfileDto = {
  usuallyWithKids: boolean;
  prefersQuietPlaces: boolean;
  prefersOutdoor: boolean;
  budgetSensitivity: number;
  likesLocalExperiences: boolean;
  likesPremiumPlaces: boolean;
  needsParking: boolean;
  needsAccessibility: boolean;
  defaultDistanceMeters: number;
};

export type LocationInput = {
  mode: "text" | "current" | "place";
  text?: string | null;
  lat?: number | null;
  lng?: number | null;
  placeId?: string | null;
};

export type RecommendationSessionRequest = {
  rawText: string;
  location?: LocationInput | null;
  selectedCues?: string[] | null;
  language?: SupportedLanguage;
  context?: Record<string, unknown> | null;
};

export type RecommendationAccepted = {
  sessionId: string;
  status: string;
  statusUrl: string;
};

export type ReservationDto = {
  status: string;
  provider: string;
  url?: string | null;
  phoneNumber?: string | null;
  confidence: number;
};

export type RecommendationCardDto = {
  id: string;
  rank: number;
  title: string;
  headline: string;
  placeName: string;
  address: string;
  vibe: string;
  summary: string;
  whyThisPlace: string;
  whatToOrder: string[];
  goodToKnow: string;
  cautions: string[];
  confidence: number;
  reservation: ReservationDto;
  routeUrl?: string | null;
  shareText: string;
};

export type RecommendationSessionDetail = {
  sessionId: string;
  status: "queued" | "running" | "completed" | "failed" | string;
  currentStep?: string | null;
  rawText: string;
  language: SupportedLanguage;
  locationMode: string;
  locationText?: string | null;
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  normalizedContext: Record<string, unknown>;
  assumptions: Record<string, unknown>;
  recommendations: RecommendationCardDto[];
};

export type HistoryItemDto = {
  sessionId: string;
  rawText: string;
  locationMode: string;
  locationText?: string | null;
  createdAt: string;
  results: RecommendationCardDto[];
};

export type SavedPlaceDto = {
  id: string;
  provider: string;
  providerPlaceId: string;
  recommendationResultId?: string | null;
  name: string;
  address: string;
  note?: string | null;
  createdAt: string;
};
