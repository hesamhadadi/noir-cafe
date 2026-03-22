import * as THREE from "three";
import type { ProductKey, ProductDef, JourneyStage, BeanData } from "@/types";

// ── Material shorthand ────────────────────────────────────────
export function phong(
  color: number,
  shininess = 100,
  specular = 0x443322,
  transparent = false,
  opacity = 1
): THREE.MeshPhongMaterial {
  return new THREE.MeshPhongMaterial({ color, shininess, specular, transparent, opacity });
}

// ── Coffee bean ───────────────────────────────────────────────
export function makeBeanGroup(col: number, spec: number): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.21, 32, 20),
    phong(col, 55, spec)
  );
  body.scale.set(1, 1.52, 0.58);
  g.add(body);
  const crease = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.34, 8),
    new THREE.MeshPhongMaterial({ color: 0x000000, transparent: true, opacity: 0.4 })
  );
  crease.rotation.z = Math.PI / 2;
  crease.rotation.y = 0.14;
  g.add(crease);
  return g;
}

// ── Scene lights ──────────────────────────────────────────────
export function addJourneyLights(scene: THREE.Scene): void {
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));
  const kl = new THREE.PointLight(0xffd080, 4.5, 20);
  kl.position.set(3, 4, 3);
  scene.add(kl);
  const fl = new THREE.PointLight(0x2a1040, 2, 14);
  fl.position.set(-4, -2, 2);
  scene.add(fl);
  const rl = new THREE.PointLight(0xff9030, 1.5, 10);
  rl.position.set(0, -4, -1);
  scene.add(rl);
}

// ── Background star field ─────────────────────────────────────
export function addBgParticles(scene: THREE.Scene): void {
  const bp = new Float32Array(500 * 3);
  for (let i = 0; i < 500; i++) {
    bp[i * 3]     = (Math.random() - 0.5) * 14;
    bp[i * 3 + 1] = (Math.random() - 0.5) * 9;
    bp[i * 3 + 2] = (Math.random() - 0.5) * 5 - 3;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(bp, 3));
  scene.add(
    new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0x6a4418, size: 0.02, transparent: true, opacity: 0.35 })
    )
  );
}

// ── Cup base (shared) ─────────────────────────────────────────
export function makeCupGroup(def: ProductDef): THREE.Group {
  const g = new THREE.Group();

  g.add(
    Object.assign(
      new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.42, 1.08, 64), phong(def.cupC, 160, 0x664433)),
    )
  );

  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.23, 0.068, 12, 32, Math.PI),
    phong(def.cupC, 160)
  );
  handle.rotation.y = Math.PI / 2;
  handle.position.set(0.6, 0, 0);
  g.add(handle);

  const saucer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.84, 0.1, 64),
    phong(def.sauC, 100)
  );
  saucer.position.y = -0.6;
  g.add(saucer);

  const liquid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.52, 0.52, 0.9, 64),
    phong(def.liqC, 380, 0x9a5a20, true, 0.97)
  );
  liquid.position.y = -0.02;
  g.add(liquid);

  return g;
}

// ── Random bean data ──────────────────────────────────────────
export function randomBeanData(count = 34): BeanData[] {
  return Array.from({ length: count }, () => {
    const ang = Math.random() * Math.PI * 2;
    const r   = 0.25 + Math.random() * 0.95;
    return {
      px: Math.cos(ang) * r * (1 + Math.random() * 0.3),
      py: (Math.random() - 0.5) * 1.5,
      pz: (Math.random() - 0.5) * 0.45,
      rx: Math.random() * Math.PI * 2,
      ry: Math.random() * Math.PI * 2,
      rz: Math.random() * Math.PI * 2,
      s:  0.55 + Math.random() * 0.58,
    };
  });
}

// ═══════════════════════════════════════════════════════════════
// STAGE 0 — Green beans
// ═══════════════════════════════════════════════════════════════
export function buildStage0_Beans(bdat: BeanData[]): JourneyStage {
  const g = new THREE.Group();
  for (const bd of bdat) {
    const b = makeBeanGroup(0x6a9a48, 0x334420);
    b.position.set(bd.px, bd.py, bd.pz);
    b.rotation.set(bd.rx, bd.ry, bd.rz);
    b.scale.setScalar(bd.s);
    g.add(b);
  }
  return {
    g,
    tick: () => {
      g.rotation.y += 0.005;
      g.children.forEach((c) => { c.rotation.x += 0.003; c.rotation.z += 0.002; });
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// STAGE 1 — Roasting
// ═══════════════════════════════════════════════════════════════
export function buildStage1_Roast(bdat: BeanData[]): JourneyStage {
  const g = new THREE.Group();
  for (const bd of bdat) {
    const b = makeBeanGroup(0x6a9a48, 0x334420);
    b.position.set(bd.px, bd.py, bd.pz);
    b.rotation.set(bd.rx, bd.ry, bd.rz);
    b.scale.setScalar(bd.s);
    g.add(b);
  }

  // Ember particles
  const eC = 280;
  const eP = new Float32Array(eC * 3);
  const eV: { x: number; y: number }[] = [];
  for (let i = 0; i < eC; i++) {
    eP[i * 3]     = (Math.random() - 0.5) * 2.8;
    eP[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
    eP[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    eV.push({ x: (Math.random() - 0.5) * 0.013, y: 0.009 + Math.random() * 0.022 });
  }
  const eGeo = new THREE.BufferGeometry();
  eGeo.setAttribute("position", new THREE.BufferAttribute(eP, 3));
  g.add(new THREE.Points(eGeo, new THREE.PointsMaterial({ color: 0xff5500, size: 0.065, transparent: true, opacity: 0.8 })));

  // Heat rings
  [0.8, 1.3, 1.9].forEach((r, i) => {
    const tr = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.008, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0xff6010, transparent: true, opacity: 0.12 - i * 0.03 })
    );
    tr.rotation.x = Math.PI / 2;
    g.add(tr);
  });

  return {
    g,
    tick: (_t: number, p: number) => {
      const col = new THREE.Color().lerpColors(
        new THREE.Color(0x6a9a48),
        new THREE.Color(0x190704),
        Math.min(p * 1.5, 1)
      );
      g.children.forEach((ch) => {
        const grp = ch as THREE.Group;
        if (grp.children?.length) {
          grp.children.forEach((m) => {
            const mesh = m as THREE.Mesh;
            const mat  = mesh.material as THREE.MeshPhongMaterial;
            if (mat?.color && mesh.geometry?.type === "SphereGeometry") mat.color.set(col);
          });
        }
      });
      g.rotation.y += 0.007;
      const ea = eGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < eC; i++) {
        ea[i * 3]     += eV[i].x;
        ea[i * 3 + 1] += eV[i].y;
        if (ea[i * 3 + 1] > 2.4) { ea[i * 3 + 1] = -2.2; ea[i * 3] = (Math.random() - 0.5) * 2.8; }
      }
      eGeo.attributes.position.needsUpdate = true;
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// STAGE 2 — Grinding
// ═══════════════════════════════════════════════════════════════
export function buildStage2_Grind(): JourneyStage {
  const g = new THREE.Group();

  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 1.1, 48), phong(0x222222, 220, 0x999999));
  drum.position.y = 0.55; g.add(drum);

  const drumBot = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.1, 48), phong(0x1a1a1a, 200));
  drumBot.position.y = 0; g.add(drumBot);

  const drumTop = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.08, 48), phong(0x1a1a1a, 200));
  drumTop.position.y = 1.12; g.add(drumTop);

  const bladeGrp = new THREE.Group();
  bladeGrp.position.y = 1.16;
  for (let b = 0; b < 8; b++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.08), phong(0x999999, 350, 0xffffff));
    blade.rotation.y = (b / 8) * Math.PI * 2;
    blade.position.x = 0.24;
    bladeGrp.add(blade);
  }
  g.add(bladeGrp);

  const pile = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    phong(0x130702, 6)
  );
  pile.position.y = -0.65; pile.scale.set(1.25, 1, 1.25); g.add(pile);

  const pC = 400; const pP = new Float32Array(pC * 3); const pV: number[] = [];
  for (let i = 0; i < pC; i++) {
    pP[i * 3] = (Math.random() - 0.5) * 0.4;
    pP[i * 3 + 1] = -0.12 + Math.random() * 1.9;
    pP[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    pV.push(0.014 + Math.random() * 0.02);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pP, 3));
  g.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x180803, size: 0.033, transparent: true, opacity: 0.9 })));

  return {
    g,
    tick: () => {
      bladeGrp.rotation.y += 0.2;
      const pa = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pC; i++) {
        pa[i * 3 + 1] -= pV[i];
        if (pa[i * 3 + 1] < -0.62) { pa[i * 3 + 1] = 1.75 + Math.random() * 0.3; pa[i * 3] = (Math.random() - 0.5) * 0.4; }
      }
      pGeo.attributes.position.needsUpdate = true;
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// STAGE 3 — Product-specific process
// ═══════════════════════════════════════════════════════════════
export function buildStage3_Process(key: ProductKey, def: ProductDef): JourneyStage {
  const g = new THREE.Group();

  if (key === "coldbrew") {
    const jar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.62, 1.9, 48),
      new THREE.MeshPhongMaterial({ color: 0x0d1822, shininess: 400, specular: 0x88aabb, transparent: true, opacity: 0.65, side: THREE.DoubleSide })
    );
    g.add(jar);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.08, 48), phong(0x18252e, 200));
    lid.position.y = 0.99; g.add(lid);

    const gC = 250; const gP = new Float32Array(gC * 3);
    for (let i = 0; i < gC; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.random() * 0.48;
      gP[i * 3] = Math.cos(a) * r; gP[i * 3 + 1] = -1.15 + Math.random() * 2.3; gP[i * 3 + 2] = Math.sin(a) * r;
    }
    const gGeo = new THREE.BufferGeometry(); gGeo.setAttribute("position", new THREE.BufferAttribute(gP, 3));
    g.add(new THREE.Points(gGeo, new THREE.PointsMaterial({ color: 0x0a0402, size: 0.04, transparent: true, opacity: 0.9 })));

    const bC = 90; const bP = new Float32Array(bC * 3); const bV: number[] = [];
    for (let i = 0; i < bC; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.random() * 0.42;
      bP[i * 3] = Math.cos(a) * r; bP[i * 3 + 1] = -1.1 + Math.random() * 2.1; bP[i * 3 + 2] = Math.sin(a) * r;
      bV.push(0.005 + Math.random() * 0.006);
    }
    const bGeo = new THREE.BufferGeometry(); bGeo.setAttribute("position", new THREE.BufferAttribute(bP, 3));
    g.add(new THREE.Points(bGeo, new THREE.PointsMaterial({ color: 0x3a7a94, size: 0.032, transparent: true, opacity: 0.45 })));

    ([ [-0.25, 0.35, 0.08], [0.2, 0.1, -0.05], [-0.08, 0.58, 0.03], [0.22, 0.48, -0.08], [0, 0.28, 0.14] ] as [number, number, number][]).forEach(([x, y, z]) => {
      const ice = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), new THREE.MeshPhongMaterial({ color: 0xc8e8f8, transparent: true, opacity: 0.45, shininess: 500, specular: 0xffffff }));
      ice.position.set(x, y, z); ice.rotation.set(Math.random(), Math.random(), Math.random()); g.add(ice);
    });

    return { g, tick: () => {
      const ba = bGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < bC; i++) { ba[i * 3 + 1] += bV[i]; if (ba[i * 3 + 1] > 0.98) ba[i * 3 + 1] = -1.05; }
      bGeo.attributes.position.needsUpdate = true; g.rotation.y += 0.003;
    }};
  }

  if (key === "latte" || key === "cappuccino") {
    const pitcher = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 1.25, 48), phong(0x7a7a7a, 320, 0xffffff));
    g.add(pitcher);
    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.085, 0.28, 16), phong(0x6a6a6a, 300));
    spout.position.set(0.44, 0.38, 0); spout.rotation.z = -0.48; g.add(spout);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 8, 24, Math.PI), phong(0x6a6a6a, 300));
    handle.rotation.y = -Math.PI / 2; handle.position.set(-0.44, 0.1, 0); g.add(handle);

    const milkCol = key === "cappuccino" ? 0xfaf6f0 : 0xf8f0e2;
    const mliq = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.85, 48), new THREE.MeshPhongMaterial({ color: milkCol, shininess: 80, transparent: true, opacity: 0.88 }));
    mliq.position.y = -0.1; g.add(mliq);

    const stC = 150; const stP = new Float32Array(stC * 3); const stV: number[] = [];
    for (let i = 0; i < stC; i++) {
      stP[i * 3] = (Math.random() - 0.5) * 0.18; stP[i * 3 + 1] = 0.75 + Math.random() * 1.8; stP[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
      stV.push(0.009 + Math.random() * 0.011);
    }
    const stGeo = new THREE.BufferGeometry(); stGeo.setAttribute("position", new THREE.BufferAttribute(stP, 3));
    g.add(new THREE.Points(stGeo, new THREE.PointsMaterial({ color: 0xf0e8d8, size: 0.052, transparent: true, opacity: 0.3 })));

    const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.7, 12), new THREE.MeshPhongMaterial({ color: milkCol, shininess: 80, transparent: true, opacity: 0.8 }));
    stream.position.set(0.38, -0.22, 0); stream.rotation.z = 0.18; g.add(stream);

    let t = 0;
    return { g, tick: () => {
      t += 0.01;
      const sa = stGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < stC; i++) {
        sa[i * 3 + 1] += stV[i]; sa[i * 3] += (Math.random() - 0.5) * 0.002;
        if (sa[i * 3 + 1] > 2.8) sa[i * 3 + 1] = 0.75;
      }
      stGeo.attributes.position.needsUpdate = true;
      (stream.material as THREE.MeshPhongMaterial).opacity = 0.65 + Math.sin(t * 4) * 0.18;
    }};
  }

  // Espresso machine extraction
  const mach = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.7), phong(0x1a1a1a, 300, 0x888888));
  mach.position.y = 1.45; g.add(mach);
  const grp = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.7), phong(0x111111, 200));
  grp.position.y = 1.19; g.add(grp);
  const pf = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.14, 48), phong(0x3a3a3a, 280, 0xbbbbbb));
  pf.position.y = 1.12; g.add(pf);
  const pfh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.65, 12), phong(0x3a3a3a, 280));
  pfh.rotation.z = Math.PI / 2; pfh.position.set(-0.58, 1.12, 0); g.add(pfh);

  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.85, 12), new THREE.MeshPhongMaterial({ color: 0x9a5a20, shininess: 350, transparent: true, opacity: 0.82 }));
  stream.position.y = 0.68; g.add(stream);

  const pool = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 48), phong(0x0e0503, 350, 0x8a3a10));
  pool.position.y = 0.24; pool.scale.set(0.5, 0.5, 0.5); g.add(pool);

  const dC = 70; const dP = new Float32Array(dC * 3); const dV: number[] = [];
  for (let i = 0; i < dC; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.random() * 0.03;
    dP[i * 3] = Math.cos(a) * r; dP[i * 3 + 1] = 0.72 + Math.random() * 1; dP[i * 3 + 2] = Math.sin(a) * r;
    dV.push(0.022 + Math.random() * 0.016);
  }
  const dGeo = new THREE.BufferGeometry(); dGeo.setAttribute("position", new THREE.BufferAttribute(dP, 3));
  g.add(new THREE.Points(dGeo, new THREE.PointsMaterial({ color: 0xb86822, size: 0.042, transparent: true, opacity: 0.82 })));

  let t2 = 0;
  return { g, tick: () => {
    t2 += 0.01;
    const da = dGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < dC; i++) {
      da[i * 3 + 1] -= dV[i];
      if (da[i * 3 + 1] < 0.26) { da[i * 3 + 1] = 1.72; da[i * 3] = (Math.random() - 0.5) * 0.035; }
    }
    dGeo.attributes.position.needsUpdate = true;
    (stream.material as THREE.MeshPhongMaterial).opacity = 0.65 + Math.sin(t2 * 5) * 0.18;
    if (pool.scale.x < 1.55) { pool.scale.x += 0.004; pool.scale.z = pool.scale.x; }
  }};
}

// ═══════════════════════════════════════════════════════════════
// STAGE 4 — Final cup
// ═══════════════════════════════════════════════════════════════
export function buildStage4_FinalCup(key: ProductKey, def: ProductDef): JourneyStage {
  const g   = new THREE.Group();
  const cg  = makeCupGroup(def);

  if (key === "latte") {
    const ml = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.26, 64), new THREE.MeshPhongMaterial({ color: def.milkC!, shininess: 60, transparent: true, opacity: 0.88 }));
    ml.position.y = 0.36; cg.add(ml);
    const cr = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.07, 64), phong(def.cremaC, 220));
    cr.position.y = 0.5; cg.add(cr);
  } else if (key === "cappuccino") {
    const foam = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhongMaterial({ color: def.foamC!, shininess: 16, transparent: true, opacity: 0.93 }));
    foam.position.y = 0.58; foam.scale.set(1, 1.3, 1); cg.add(foam);
    const cP = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) { const a = Math.random() * Math.PI * 2, r = Math.random() * 0.44; cP[i * 3] = Math.cos(a) * r; cP[i * 3 + 1] = 0.64; cP[i * 3 + 2] = Math.sin(a) * r; }
    const cacGeo = new THREE.BufferGeometry(); cacGeo.setAttribute("position", new THREE.BufferAttribute(cP, 3));
    cg.add(new THREE.Points(cacGeo, new THREE.PointsMaterial({ color: 0x3a1a08, size: 0.028, transparent: true, opacity: 0.7 })));
  } else if (key === "coldbrew") {
    ([ [-0.16, 0.35, 0.1], [0.14, 0.12, -0.06], [-0.04, 0.52, 0.03], [0.18, 0.42, -0.1], [0.02, 0.22, 0.12] ] as [number, number, number][]).forEach(([x, y, z]) => {
      const ice = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.19, 0.19), new THREE.MeshPhongMaterial({ color: 0xc8e8f8, transparent: true, opacity: 0.5, shininess: 500, specular: 0xffffff }));
      ice.position.set(x, y, z); ice.rotation.set(Math.random(), Math.random(), Math.random()); cg.add(ice);
    });
  } else {
    const cr = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.08, 64), phong(def.cremaC, 230, 0xd4a043));
    cr.position.y = 0.48; cg.add(cr);
  }
  g.add(cg);

  // Steam wisps
  const swGrp = new THREE.Group();
  if (key !== "coldbrew") {
    for (let i = 0; i < 6; i++) {
      const sw = new THREE.Mesh(
        new THREE.TorusGeometry(0.18 + i * 0.045, 0.009, 6, 40),
        new THREE.MeshPhongMaterial({ color: 0xf0e8d8, transparent: true, opacity: 0.1 })
      );
      sw.position.y = 0.72 + i * 0.24; sw.rotation.x = Math.PI / 2; sw.rotation.z = i * 0.48;
      swGrp.add(sw);
    }
  }
  g.add(swGrp);

  const aC = 110; const aP = new Float32Array(aC * 3);
  for (let i = 0; i < aC; i++) { aP[i * 3] = (Math.random() - 0.5) * 0.75; aP[i * 3 + 1] = 0.85 + Math.random() * 2.8; aP[i * 3 + 2] = (Math.random() - 0.5) * 0.38; }
  const aGeo = new THREE.BufferGeometry(); aGeo.setAttribute("position", new THREE.BufferAttribute(aP, 3));
  const aPts = new THREE.Points(aGeo, new THREE.PointsMaterial({ color: key === "coldbrew" ? 0x4a8aaa : 0xc89040, size: 0.03, transparent: true, opacity: 0.38 }));
  g.add(aPts);

  let t = 0;
  return {
    g,
    tick: () => {
      t += 0.01;
      g.rotation.y += 0.0038;
      g.position.y = Math.sin(t * 0.5) * 0.06;
      swGrp.children.forEach((sw, i) => {
        const mesh = sw as THREE.Mesh;
        mesh.rotation.z += 0.005;
        (mesh.material as THREE.MeshPhongMaterial).opacity = 0.07 + Math.sin(t * 0.7 + i) * 0.04;
        mesh.position.y = 0.72 + i * 0.24 + Math.sin(t * 0.6 + i) * 0.04;
      });
      const aa = aGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < aC; i++) { aa[i * 3 + 1] += 0.0038; aa[i * 3] += (Math.random() - 0.5) * 0.001; if (aa[i * 3 + 1] > 3.8) aa[i * 3 + 1] = 0.85; }
      aGeo.attributes.position.needsUpdate = true;
    },
  };
}
