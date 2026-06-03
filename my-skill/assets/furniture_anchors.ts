
import { StyleVector } from '../../types';

export interface StyleAnchor {
  id: string;
  name: string;
  nameEn: string;
  vector: StyleVector;
  description: string;
}

export const furnitureAnchors: StyleAnchor[] = [
  {
    id: 'ming_chair',
    name: '明式官帽椅',
    nameEn: 'Ming-style Official Chair',
    vector: {
      variety: 0.35,
      gorgeousness: 0.45,
      dynamism: 0.25,
      intensity: 0.50,
      interest: 0.85
    },
    description: 'Refined structure with restrained rhythm, emphasizing the organic interest of the wood\'s natural grain.'
  },
  {
    id: 'bauhaus_steel',
    name: '包豪斯钢管椅',
    nameEn: 'Bauhaus Steel Chair',
    vector: {
      variety: 0.10,
      gorgeousness: 0.15,
      dynamism: 0.10,
      intensity: 0.85,
      interest: 0.20
    },
    description: 'Extremely geometric with low diversity, emphasizing the stark coolness of industrial materials.'
  },
  {
    id: 'rococo_sofa',
    name: '洛可可式长榻',
    nameEn: 'Rococo Sofa',
    vector: {
      variety: 0.95,
      gorgeousness: 1.00,
      dynamism: 0.85,
      intensity: 0.70,
      interest: 0.90
    },
    description: 'Highly ornate with complex curves and strong visual dynamism.'
  },
  {
    id: 'scandi_minimal',
    name: '北欧简约餐椅',
    nameEn: 'Scandi Minimalist',
    vector: {
      variety: 0.40,
      gorgeousness: 0.30,
      dynamism: 0.45,
      intensity: 0.35,
      interest: 0.55
    },
    description: 'Warm and natural with balanced dimensions, emphasizing soft visual transitions.'
  },
  {
    id: 'zen_tea_table',
    name: '禅意枯木茶台',
    nameEn: 'Zen Burl Table',
    vector: {
      variety: 0.75,
      gorgeousness: 0.20,
      dynamism: 0.30,
      intensity: 0.40,
      interest: 0.95
    },
    description: 'Simple yet highly interesting, using irregular forms to enhance visual richness.'
  }
];
