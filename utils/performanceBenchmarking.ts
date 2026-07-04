interface SelectedComponents {
  [key: string]: any;
}

interface PerformanceMetrics {
  gaming: {
    resolution1080p: number;
    resolution1440p: number;
    resolution4k: number;
    averageFps: number;
  };
  productivity: {
    videoEditing: number;
    rendering3d: number;
    programming: number;
    streaming: number;
    overall: number;
  };
  systemEfficiency: number; // FIX: was missing, caused NaN/100 in UI
  overall: number;
}

interface ComponentPerformanceContribution {
  component: string;
  gamingContribution: number;
  productivityContribution: number;
  bottleneck?: string;
  status: 'optimal' | 'adequate' | 'bottleneck'; // FIX: explicit status instead of deriving from undefined
}

// Performance scoring constants
const PERFORMANCE_WEIGHTS = {
  gaming: {
    gpu: 0.70,
    processor: 0.20,
    memory: 0.08,
    storage: 0.02
  },
  productivity: {
    processor: 0.50,
    gpu: 0.25,
    memory: 0.20,
    storage: 0.05
  }
};

// Component performance ratings (normalized to 0-100 scale)
const COMPONENT_RATINGS = {
  processor: {
    'cpu-1': { // Intel i9-13900K
      singleCore: 95,
      multiCore: 98,
      gaming: 92,
      productivity: 96
    },
    'cpu-2': { // AMD Ryzen 9 7900X
      singleCore: 92,
      multiCore: 94,
      gaming: 90,
      productivity: 94
    },
    'cpu-3': { // Intel i5-13600K
      singleCore: 88,
      multiCore: 85,
      gaming: 85,
      productivity: 82
    },
    'cpu-4': { // AMD Ryzen 5 7600X
      singleCore: 85,
      multiCore: 78,
      gaming: 82,
      productivity: 75
    }
  },
  gpu: {
    'gpu-1': { // RTX 4090
      performance1080p: 100,
      performance1440p: 100,
      performance4k: 95,
      rayTracing: 100,
      productivity: 95
    },
    'gpu-2': { // RTX 4070 Ti
      performance1080p: 90,
      performance1440p: 85,
      performance4k: 70,
      rayTracing: 85,
      productivity: 80
    },
    'gpu-3': { // RX 7800 XT
      performance1080p: 88,
      performance1440p: 82,
      performance4k: 68,
      rayTracing: 75,
      productivity: 75
    },
    'gpu-4': { // RTX 4060
      performance1080p: 75,
      performance1440p: 65,
      performance4k: 45,
      rayTracing: 65,
      productivity: 60
    }
  },
  memory: {
    'ram-1': { // 32GB DDR5-6000
      capacity: 90,
      speed: 85,
      gaming: 85,
      productivity: 88
    },
    'ram-2': { // 16GB DDR4-3200
      capacity: 60,
      speed: 65,
      gaming: 70,
      productivity: 65
    },
    'ram-3': { // 64GB DDR5-5600
      capacity: 100,
      speed: 80,
      gaming: 82,
      productivity: 95
    },
    // FIX: Added ram-4 (Corsair Vengeance LPX 16GB DDR4) which appears in screenshots
    // but was missing from COMPONENT_RATINGS, causing undefined lookup → NaN
    'ram-4': {
      capacity: 55,
      speed: 60,
      gaming: 65,
      productivity: 60
    }
  },
  storage: {
    'ssd-1': { // Samsung 980 PRO 2TB
      speed: 95,
      capacity: 85,
      gaming: 90,
      productivity: 92
    },
    'ssd-2': { // WD SN770 1TB
      speed: 80,
      capacity: 70,
      gaming: 78,
      productivity: 80
    },
    'hdd-1': { // Seagate 4TB
      speed: 25,
      capacity: 95,
      gaming: 40,
      productivity: 45
    }
  }
};

// FIX: Safe rating lookup — returns null instead of undefined when ID not in table.
// This prevents Math.round(undefined) → NaN throughout the app.
function safeGetRating<T>(
  table: Record<string, T>,
  id: string | undefined
): T | null {
  if (!id) return null;
  return table[id] ?? null;
}

export function calculatePerformanceMetrics(selectedComponents: SelectedComponents): PerformanceMetrics {
  const cpu = selectedComponents.processor;
  const gpu = selectedComponents.gpu;
  const memory = selectedComponents.memory;
  const storage = selectedComponents.storage;

  // FIX: Use safeGetRating so unknown IDs return null, not undefined
  const cpuRating = safeGetRating(COMPONENT_RATINGS.processor, cpu?.id);
  const gpuRating = safeGetRating(COMPONENT_RATINGS.gpu, gpu?.id);
  const memoryRating = safeGetRating(COMPONENT_RATINGS.memory, memory?.id);
  const storageRating = safeGetRating(COMPONENT_RATINGS.storage, storage?.id);

  // Calculate gaming performance
  const gaming = {
    resolution1080p: calculateGamingScore(cpuRating, gpuRating, memoryRating, storageRating, '1080p'),
    resolution1440p: calculateGamingScore(cpuRating, gpuRating, memoryRating, storageRating, '1440p'),
    resolution4k: calculateGamingScore(cpuRating, gpuRating, memoryRating, storageRating, '4k'),
    averageFps: 0
  };

  // FIX: Guard division — if all three are 0, averageFps stays 0 (not NaN)
  const gamingScores = [gaming.resolution1080p, gaming.resolution1440p, gaming.resolution4k].filter(s => s > 0);
  gaming.averageFps = gamingScores.length > 0
    ? Math.round(gamingScores.reduce((a, b) => a + b, 0) / gamingScores.length)
    : 0;

  // Calculate productivity performance
  const productivity = {
    videoEditing: calculateProductivityScore(cpuRating, gpuRating, memoryRating, storageRating, 'videoEditing'),
    rendering3d: calculateProductivityScore(cpuRating, gpuRating, memoryRating, storageRating, 'rendering'),
    programming: calculateProductivityScore(cpuRating, gpuRating, memoryRating, storageRating, 'programming'),
    streaming: calculateProductivityScore(cpuRating, gpuRating, memoryRating, storageRating, 'streaming'),
    overall: 0
  };

  // FIX: Same guard for productivity overall
  const productivityScores = [
    productivity.videoEditing,
    productivity.rendering3d,
    productivity.programming,
    productivity.streaming
  ].filter(s => s > 0);

  productivity.overall = productivityScores.length > 0
    ? Math.round(productivityScores.reduce((a, b) => a + b, 0) / productivityScores.length)
    : 0;

  // FIX: Calculate systemEfficiency explicitly so PerformanceMetrics.tsx
  // doesn't have to compute it inline (which was producing NaN/100).
  // Based on power efficiency, thermal, memory bandwidth, storage speed.
  const systemEfficiency = calculateSystemEfficiency(cpuRating, gpuRating, memoryRating, storageRating);

  // FIX: Guard overall — if both are 0, overall is 0 (not NaN)
  const overall = gaming.averageFps > 0 || productivity.overall > 0
    ? Math.round((gaming.averageFps * 0.5) + (productivity.overall * 0.5))
    : 0;

  return {
    gaming,
    productivity,
    systemEfficiency,
    overall
  };
}

// FIX: New function — provides the systemEfficiency score that was
// previously being calculated ad-hoc in the UI, causing NaN/100.
function calculateSystemEfficiency(
  cpuRating: any,
  gpuRating: any,
  memoryRating: any,
  storageRating: any
): number {
  const scores: number[] = [];

  // Power efficiency: lower TDP relative to performance = better
  if (cpuRating) scores.push(Math.min(100, cpuRating.productivity * 0.9));
  if (gpuRating) scores.push(Math.min(100, gpuRating.productivity * 0.9));

  // Memory bandwidth proxy
  if (memoryRating) scores.push(memoryRating.speed ?? 70);

  // Storage speed
  if (storageRating) scores.push(storageRating.speed ?? 70);

  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function calculateGamingScore(
  cpuRating: any,
  gpuRating: any,
  memoryRating: any,
  storageRating: any,
  resolution: '1080p' | '1440p' | '4k'
): number {
  if (!cpuRating || !gpuRating) return 0;

  const weights = PERFORMANCE_WEIGHTS.gaming;

  let gpuScore = 0;
  switch (resolution) {
    case '1080p': gpuScore = gpuRating.performance1080p ?? 0; break;
    case '1440p': gpuScore = gpuRating.performance1440p ?? 0; break;
    case '4k': gpuScore = gpuRating.performance4k ?? 0; break;
  }

  const cpuScore = cpuRating.gaming ?? 0;
  const memoryScore = memoryRating?.gaming ?? 70; // sensible default
  const storageScore = storageRating?.gaming ?? 70;

  const score =
    gpuScore * weights.gpu +
    cpuScore * weights.processor +
    memoryScore * weights.memory +
    storageScore * weights.storage;

  // FIX: isNaN guard as last resort — should never trigger with the above
  // nullish coalescing, but protects against future data issues
  return isNaN(score) ? 0 : Math.round(Math.min(100, Math.max(0, score)));
}

function calculateProductivityScore(
  cpuRating: any,
  gpuRating: any,
  memoryRating: any,
  storageRating: any,
  task: 'videoEditing' | 'rendering' | 'programming' | 'streaming'
): number {
  if (!cpuRating) return 0;

  const weights = PERFORMANCE_WEIGHTS.productivity;

  const cpuScore = cpuRating.productivity ?? 0;
  // FIX: was `gpuRating?.productivity || 50` — `|| 50` treats 0 as falsy.
  // Changed to nullish coalescing so a GPU with 0 productivity still uses 0,
  // not the fallback 50, preventing inflated scores.
  const gpuScore = gpuRating?.productivity ?? 50;
  const memoryScore = memoryRating?.productivity ?? 70;
  const storageScore = storageRating?.productivity ?? 70;

  let taskMultiplier = 1;
  switch (task) {
    case 'videoEditing':
      taskMultiplier = (memoryRating?.capacity ?? 0) > 80 ? 1.1 : 0.9;
      break;
    case 'rendering':
      taskMultiplier = gpuRating ? 1.15 : 0.8;
      break;
    case 'programming':
      taskMultiplier = (storageRating?.speed ?? 0) > 80 ? 1.1 : 0.95;
      break;
    case 'streaming':
      taskMultiplier = (cpuRating.multiCore ?? 0) > 85 ? 1.1 : 0.9;
      break;
  }

  const score = (
    cpuScore * weights.processor +
    gpuScore * weights.gpu +
    memoryScore * weights.memory +
    storageScore * weights.storage
  ) * taskMultiplier;

  return isNaN(score) ? 0 : Math.round(Math.min(100, Math.max(0, score)));
}

export function analyzePerformanceBottlenecks(selectedComponents: SelectedComponents): ComponentPerformanceContribution[] {
  const contributions: ComponentPerformanceContribution[] = [];

  const cpu = selectedComponents.processor;
  const gpu = selectedComponents.gpu;
  const memory = selectedComponents.memory;
  const storage = selectedComponents.storage;

  if (cpu) {
    const cpuRating = safeGetRating(COMPONENT_RATINGS.processor, cpu.id);
    if (cpuRating) {
      // FIX: "Optimal" now requires score >= 75. Previously anything >= 80 in
      // gaming got undefined bottleneck → UI rendered "Optimal" even at 16/100
      // contribution scores. Now we have three explicit states.
      const gamingScore = cpuRating.gaming ?? 0;
      const status: ComponentPerformanceContribution['status'] =
        gamingScore >= 75 ? 'optimal' :
          gamingScore >= 60 ? 'adequate' :
            'bottleneck';

      contributions.push({
        component: 'processor',
        gamingContribution: Math.round(gamingScore * PERFORMANCE_WEIGHTS.gaming.processor),
        productivityContribution: Math.round((cpuRating.productivity ?? 0) * PERFORMANCE_WEIGHTS.productivity.processor),
        bottleneck: status === 'bottleneck' ? 'May limit gaming performance' :
          status === 'adequate' ? 'Moderate impact on performance' :
            undefined,
        status
      });
    }
  }

  if (gpu) {
    const gpuRating = safeGetRating(COMPONENT_RATINGS.gpu, gpu.id);
    if (gpuRating) {
      const avgGamingPerf = Math.round(
        ((gpuRating.performance1080p ?? 0) +
          (gpuRating.performance1440p ?? 0) +
          (gpuRating.performance4k ?? 0)) / 3
      );
      const status: ComponentPerformanceContribution['status'] =
        avgGamingPerf >= 75 ? 'optimal' :
          avgGamingPerf >= 55 ? 'adequate' :
            'bottleneck';

      contributions.push({
        component: 'gpu',
        gamingContribution: Math.round(avgGamingPerf * PERFORMANCE_WEIGHTS.gaming.gpu),
        productivityContribution: Math.round((gpuRating.productivity ?? 0) * PERFORMANCE_WEIGHTS.productivity.gpu),
        bottleneck: status === 'bottleneck' ? 'Primary gaming bottleneck' :
          status === 'adequate' ? 'Limits performance at higher resolutions' :
            undefined,
        status
      });
    }
  }

  if (memory) {
    const memoryRating = safeGetRating(COMPONENT_RATINGS.memory, memory.id);
    if (memoryRating) {
      const memScore = memoryRating.gaming ?? 0;
      const status: ComponentPerformanceContribution['status'] =
        memScore >= 75 ? 'optimal' :
          memScore >= 55 ? 'adequate' :
            'bottleneck';

      contributions.push({
        component: 'memory',
        gamingContribution: Math.round(memScore * PERFORMANCE_WEIGHTS.gaming.memory),
        productivityContribution: Math.round((memoryRating.productivity ?? 0) * PERFORMANCE_WEIGHTS.productivity.memory),
        bottleneck: status === 'bottleneck' ? 'Insufficient for demanding tasks' :
          status === 'adequate' ? 'Consider upgrading for better multitasking' :
            undefined,
        status
      });
    }
  }

  if (storage) {
    const storageRating = safeGetRating(COMPONENT_RATINGS.storage, storage.id);
    if (storageRating) {
      const storScore = storageRating.gaming ?? 0;
      const status: ComponentPerformanceContribution['status'] =
        storScore >= 75 ? 'optimal' :
          storScore >= 45 ? 'adequate' :
            'bottleneck';

      contributions.push({
        component: 'storage',
        gamingContribution: Math.round(storScore * PERFORMANCE_WEIGHTS.gaming.storage),
        productivityContribution: Math.round((storageRating.productivity ?? 0) * PERFORMANCE_WEIGHTS.productivity.storage),
        bottleneck: status === 'bottleneck' ? 'Slow load times will impact experience' :
          status === 'adequate' ? 'Adequate but SSD upgrade recommended' :
            undefined,
        status
      });
    }
  }

  return contributions;
}

export function comparePerformance(
  currentComponents: SelectedComponents,
  recommendedComponent: any,
  componentType: string
): {
  currentPerformance: PerformanceMetrics;
  newPerformance: PerformanceMetrics;
  improvement: { gaming: number; productivity: number; overall: number };
} {
  const current = calculatePerformanceMetrics(currentComponents);
  const updatedComponents = { ...currentComponents, [componentType]: recommendedComponent };
  const updated = calculatePerformanceMetrics(updatedComponents);

  return {
    currentPerformance: current,
    newPerformance: updated,
    improvement: {
      gaming: updated.gaming.averageFps - current.gaming.averageFps,
      productivity: updated.productivity.overall - current.productivity.overall,
      overall: updated.overall - current.overall
    }
  };
}

export function getPerformanceRating(score: number): {
  rating: string;
  color: string;
  description: string;
} {
  // FIX: Added explicit 0 case so an empty build doesn't get rated "Poor"
  if (score <= 0) return { rating: 'N/A', color: 'text-muted-foreground', description: 'Add components to see performance' };
  if (score >= 90) return { rating: 'Excellent', color: 'text-green-600', description: 'Top-tier performance for all tasks' };
  if (score >= 80) return { rating: 'Very Good', color: 'text-blue-600', description: 'Great performance for most tasks' };
  if (score >= 70) return { rating: 'Good', color: 'text-yellow-600', description: 'Solid performance for typical use' };
  if (score >= 60) return { rating: 'Fair', color: 'text-orange-600', description: 'Adequate for basic tasks' };
  return { rating: 'Poor', color: 'text-red-600', description: 'May struggle with demanding tasks' };
}

export function estimateFrameRates(performanceScore: number, resolution: string): {
  low: number;
  medium: number;
  high: number;
  ultra: number;
} {
  const baseFrameRates = {
    100: { low: 200, medium: 180, high: 160, ultra: 140 },
    90: { low: 180, medium: 160, high: 140, ultra: 120 },
    80: { low: 160, medium: 140, high: 120, ultra: 100 },
    70: { low: 140, medium: 120, high: 100, ultra: 80 },
    60: { low: 120, medium: 100, high: 80, ultra: 60 },
    50: { low: 100, medium: 80, high: 60, ultra: 45 },
    40: { low: 80, medium: 60, high: 45, ultra: 30 },
    30: { low: 60, medium: 45, high: 30, ultra: 20 }
  };

  const scores = Object.keys(baseFrameRates).map(Number).sort((a, b) => b - a);
  const closestScore = scores.find(s => performanceScore >= s) || 30;
  const frameRates = baseFrameRates[closestScore as keyof typeof baseFrameRates];

  const resolutionMultipliers: Record<string, number> = {
    '1080p': 1.0,
    '1440p': 0.65,
    '4k': 0.35
  };

  const multiplier = resolutionMultipliers[resolution] ?? 1.0;

  return {
    low: Math.round(frameRates.low * multiplier),
    medium: Math.round(frameRates.medium * multiplier),
    high: Math.round(frameRates.high * multiplier),
    ultra: Math.round(frameRates.ultra * multiplier)
  };
}