export const B2B_BUILDING_DEFAULT_PAYLOAD = {
  isActive: true,
  length: 5,
  width: 5,
  height: 5,
};

export const B2B_ROOM_DEFAULT_PAYLOAD = {
  population: 0,
  isActive: true,
  isCoolingPadExist: false,
  floorTypeId: '123abc63-6f69-4609-83f1-133af2df7abc',
};

export const B2B_SMART_MONITORING_CONFIG_DEFAULT = {
  ammonia: {
    min: 0,
    max: 10,
  },
  temperature: {
    min: 24,
    max: 32,
  },
  relativeHumidity: {
    min: 30,
    max: 50,
  },
  heatStressIndex: {
    min: 100,
    max: 160,
  },
  lights: {
    min: 20,
    max: 100,
  },
  wind: {
    min: 0.2,
    max: 0.8,
  },
  default: {
    min: 20,
    max: 70,
  },
};

export const DEFAULT_ORGANIZATION_PITIK = {
  ORG_ID: '28c8dc47-9db6-4f84-b040-be0ae6bfc856',
  ORG_NAME: 'PT. Pitik Digital Indonesia',
  ORG_OWNER_EXTERNAL_ROLE: 'owner external',
};

export const INTERNAL_ROLE_FOR_EXTERNAL = ['admin'];
