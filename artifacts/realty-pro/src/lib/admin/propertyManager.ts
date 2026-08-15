import { Property, PropertyInput } from "@workspace/api-client-react";
import { MOCK_PROPERTIES } from "../mock-data";

const STORAGE_KEY = "admin-properties";

// Get all properties (mock + admin-created)
export function getAllProperties(): Property[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  const adminProperties: Property[] = stored ? JSON.parse(stored) : [];
  return [...MOCK_PROPERTIES, ...adminProperties];
}

// Add a new property (for Admin)
export function addProperty(input: PropertyInput): Property {
  const allProperties = getAllProperties();
  const newId = Math.max(...allProperties.map((p) => p.id), 0) + 1;
  
  const newProperty: Property = {
    id: newId,
    title: input.title,
    titleAr: input.titleAr,
    description: input.description,
    descriptionAr: input.descriptionAr,
    type: input.type,
    category: input.category,
    price: input.price,
    priceUnit: input.priceUnit || "EGP",
    area: input.area,
    country: input.country || "Egypt",
    city: input.city,
    cityAr: input.cityAr,
    address: input.address,
    addressAr: input.addressAr,
    lat: input.lat,
    lng: input.lng,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    images: input.images,
    featured: input.featured ?? false,
    amenities: input.amenities || [],
    amenitiesAr: input.amenitiesAr || [],
    yearBuilt: input.yearBuilt || null,
    floor: input.floor || null,
    totalFloors: input.totalFloors || null,
    parkingSpaces: input.parkingSpaces || null,
    agentName: input.agentName,
    agentNameAr: input.agentNameAr,
    agentPhone: input.agentPhone,
    agentEmail: input.agentEmail,
    createdAt: new Date().toISOString(),
  };
  
  const stored = localStorage.getItem(STORAGE_KEY);
  const adminProperties: Property[] = stored ? JSON.parse(stored) : [];
  adminProperties.push(newProperty);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(adminProperties));
  
  return newProperty;
}

// Delete a property (for Admin)
export function deleteProperty(id: number): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;
  
  const adminProperties: Property[] = JSON.parse(stored);
  const filtered = adminProperties.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// Update a property (for Admin)
export function updateProperty(id: number, updates: Partial<PropertyInput>): Property | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  const adminProperties: Property[] = JSON.parse(stored);
  const index = adminProperties.findIndex((p) => p.id === id);
  
  if (index === -1) return null;
  
  adminProperties[index] = {
    ...adminProperties[index],
    ...updates,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(adminProperties));
  return adminProperties[index];
}
