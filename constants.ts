
import { WoodTensor, StyleVector } from './types';
import { furnitureData } from './my-skill/assets/furniture_data';
import { furnitureAnchors } from './my-skill/assets/furniture_anchors';

// Normalization based on experimental range (~ -2.6 to 1.8)
const norm = (val: number) => {
  const min = -2.6;
  const max = 1.8;
  const n = (val - min) / (max - min);
  return Math.max(0, Math.min(1, n));
};

const createVector = (v: number[]): StyleVector => ({
  variety: norm(v[0]),
  gorgeousness: norm(v[1]),
  dynamism: norm(v[2]),
  intensity: norm(v[3]),
  interest: norm(v[4])
});

export const SAMPLE_LABELS: Record<number, string> = furnitureData.labels as any;

export const ALL_SAMPLES_TENSORS: Record<number, WoodTensor[]> = Object.entries(furnitureData.samples).reduce((acc: any, [key, val]) => {
  acc[parseInt(key)] = (val as any).map((item: any) => ({
    angle: item.angle,
    v_wood: createVector(item.v)
  }));
  return acc;
}, {} as any);

export const STYLE_ANCHORS = furnitureAnchors;

export const INITIAL_STYLE: StyleVector = {
  variety: 0.5,
  gorgeousness: 0.5,
  dynamism: 0.5,
  intensity: 0.5,
  interest: 0.5
};
