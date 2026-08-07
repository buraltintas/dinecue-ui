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
  quota?: ProfileQuotaDto | null;
};

export type ProfileQuotaDto = {
  plan: "free" | "pro" | string;
  monthlyLimit: number;
  usedThisPeriod: number;
  remainingThisPeriod: number;
  periodKey: string;
  periodEndsAt: string;
  proAvailable: boolean;
  proStatus?: "coming_soon" | string | null;
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
  mode: "text" | "current" | "map_pin";
  text?: string | null;
  lat?: number | null;
  lng?: number | null;
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
  /** Google place id. Lets a card start a fit check without searching for the place again. */
  providerPlaceId: string;
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

/**
 * The context block shared by the find, menu scan, and fit check flows. Every field is optional:
 * allergies, dietary restrictions, spice tolerance, kids, and budget already live in the stored
 * taste/dining profiles, so what the diner types here is only the layer for this particular moment.
 */
export type MomentContext = {
  partySize: number;
  withKids: boolean;
  mealMoment: string;
};

export type MenuImageUpload = {
  objectName: string;
  contentType: string;
  sizeBytes: number;
  uploadedAt: string;
};

export type MenuScanRequest = {
  imageObjectNames: string[];
  rawText?: string | null;
  selectedCues?: string[] | null;
  restaurantPlaceId?: string | null;
  language?: SupportedLanguage;
  context?: Record<string, unknown> | null;
};

export type MenuScanAccepted = {
  menuScanId: string;
  status: string;
  statusUrl: string;
};

export type MenuSectionDto = {
  name: string;
  itemNames: string[];
};

export type MenuItemDto = {
  name: string;
  description: string;
  category: string;
  priceText?: string | null;
  possibleAllergens: string[];
  isKidFriendly: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
};

export type MenuRecommendationDto = {
  itemName: string;
  reason: string;
  /** 0..1, where 1 is an excellent fit for this diner. */
  suitabilityScore: number;
  warnings: string[];
};

export type MenuScanDetail = {
  menuScanId: string;
  detectedLanguage: SupportedLanguage;
  summary: string;
  sections: MenuSectionDto[];
  items: MenuItemDto[];
  recommendedItems: MenuRecommendationDto[];
  warnings: string[];
  questionsToAskStaff: string[];
  status: "queued" | "running" | "completed" | "failed" | string;
  currentStep?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  createdAt?: string | null;
  completedAt?: string | null;
  imageCount: number;
  restaurantPlaceId?: string | null;
};

export type RestaurantSearchRequest = {
  query: string;
  location?: LocationInput | null;
  language?: SupportedLanguage;
};

export type RestaurantSearchResultDto = {
  provider: string;
  providerPlaceId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number | null;
  ratingCount?: number | null;
  priceLevel?: number | null;
  reservation: ReservationDto;
};

export type RestaurantDetailsDto = RestaurantSearchResultDto & {
  websiteUrl?: string | null;
  googleMapsUri?: string | null;
  phoneNumber?: string | null;
};

export type RestaurantFitCheckRequest = {
  rawText?: string | null;
  language?: SupportedLanguage;
  context?: Record<string, unknown> | null;
};

export type RestaurantFitCheckResponse = {
  fitScore: number;
  verdict: string;
  summary: string;
  pros: string[];
  cons: string[];
  questionsToAsk: string[];
  /** 0..1, mirroring recommendation confidence. */
  confidence: number;
  /**
   * Which signals moved the score. The live analyzer returns `{ value, impact }` per signal; the local
   * mock returns bare scalars, so read it defensively rather than assuming a shape.
   */
  relevantSignals: Record<string, unknown>;
  reservationAdvice: string;
  reservation: ReservationDto;
};
