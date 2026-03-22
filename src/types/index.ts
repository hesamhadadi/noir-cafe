import type * as THREE from "three";

export type ProductKey = "espresso" | "latte" | "cappuccino" | "coldbrew";

export interface ProductDef {
  cupC: number;
  sauC: number;
  liqC: number;
  cremaC: number;
  milkC: number | null;
  foamC: number | null;
  hasIce: boolean;
  label: string;
  price: string;
  desc: string;
  s3lbl: string;
  s3ttl: string;
  s3desc: string;
  s3v1: string;
  s3k1: string;
  s3v2: string;
  s3k2: string;
  s4ttl: string;
  s4desc: string;
  s4v1: string;
  s4v2: string;
}

export interface JourneyStage {
  g: THREE.Group;
  tick: (t: number, p: number) => void;
}

export interface BeanData {
  px: number;
  py: number;
  pz: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
}
