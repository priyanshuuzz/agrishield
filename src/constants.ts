import { Crop, District } from './types';

export const CROPS: Crop[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    type: 'Rabi',
    baseYield: 3.5,
    rainResilience: 70,
    tempResilience: 60,
    droughtResilience: 50,
    soilCompatibility: { 'Loamy': 95, 'Clayey': 70, 'Sandy': 40 },
    description: 'A staple cereal crop requiring moderate temperature and rainfall.'
  },
  {
    id: 'rice',
    name: 'Rice',
    type: 'Kharif',
    baseYield: 4.5,
    rainResilience: 90,
    tempResilience: 65,
    droughtResilience: 30,
    soilCompatibility: { 'Clayey': 95, 'Loamy': 80, 'Sandy': 30 },
    description: 'High water-consuming crop, very resilient to flooding but sensitive to drought.'
  },
  {
    id: 'bajra',
    name: 'Bajra',
    type: 'Kharif',
    baseYield: 1.5,
    rainResilience: 40,
    tempResilience: 95,
    droughtResilience: 90,
    soilCompatibility: { 'Sandy': 95, 'Loamy': 70, 'Clayey': 40 },
    description: 'Extremely drought-tolerant millet, thrives in high temperatures and sandy soils.'
  },
  {
    id: 'mustard',
    name: 'Mustard',
    type: 'Rabi',
    baseYield: 1.8,
    rainResilience: 50,
    tempResilience: 80,
    droughtResilience: 70,
    soilCompatibility: { 'Loamy': 90, 'Sandy': 80, 'Clayey': 50 },
    description: 'Oilseed crop with good heat tolerance during maturation.'
  },
  {
    id: 'soybean',
    name: 'Soybean',
    type: 'Kharif',
    baseYield: 2.2,
    rainResilience: 75,
    tempResilience: 70,
    droughtResilience: 60,
    soilCompatibility: { 'Loamy': 95, 'Clayey': 85, 'Sandy': 50 },
    description: 'Legume with balanced resilience, sensitive to extreme monsoon delays.'
  },
  {
    id: 'pigeonpea',
    name: 'Pigeon Pea',
    type: 'Kharif',
    baseYield: 1.1,
    rainResilience: 60,
    tempResilience: 85,
    droughtResilience: 85,
    soilCompatibility: { 'Loamy': 90, 'Sandy': 70, 'Clayey': 60 },
    description: 'Deep-rooted pulse crop with excellent drought recovery.'
  }
];

export const DISTRICTS: District[] = [
  { id: 'haryana-karnal', name: 'Karnal', state: 'Haryana', baseRainfall: 700, baseTemp: 25, soilType: 'Loamy' },
  { id: 'haryana-hisar', name: 'Hisar', state: 'Haryana', baseRainfall: 450, baseTemp: 28, soilType: 'Sandy' },
  { id: 'haryana-rohtak', name: 'Rohtak', state: 'Haryana', baseRainfall: 600, baseTemp: 26, soilType: 'Loamy' },
  { id: 'haryana-sirsa', name: 'Sirsa', state: 'Haryana', baseRainfall: 350, baseTemp: 30, soilType: 'Sandy' },
  { id: 'haryana-panipat', name: 'Panipat', state: 'Haryana', baseRainfall: 650, baseTemp: 25, soilType: 'Loamy' },
  { id: 'maharashtra-nashik', name: 'Nashik', state: 'Maharashtra', baseRainfall: 850, baseTemp: 24, soilType: 'Loamy' },
  { id: 'karnataka-belgaum', name: 'Belgaum', state: 'Karnataka', baseRainfall: 1200, baseTemp: 22, soilType: 'Clayey' }
];
