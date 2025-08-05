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
  overall: number;
}

interface ComponentPerformanceContribution {
  component: string;
  gamingContribution: number;
  productivityContribution: number;
  bottleneck?: string;
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

export function calculatePerformanceMetrics(selectedComponents: SelectedComponents): PerformanceMetrics {
  const cpu = selectedComponents.processor;
  const gpu = selectedComponents.gpu;
  const memory = selectedComponents.memory;
  const storage = selectedComponents.storage;

  // Get component ratings
  const cpuRating = cpu ? COMPONENT_RATINGS.processor[cpu.id as keyof typeof COMPONENT_RATINGS.processor] : null;
  const gpuRating = gpu ? COMPONENT_RATINGS.gpu[gpu.id as keyof typeof COMPONENT_RATINGS.gpu] : null;
  const memoryRating = memory ? COMPONENT_RATINGS.memory[memory.id as keyof typeof COMPONENT_RATINGS.memory] : null;
  const storageRating = storage ? COMPONENT_RATINGS.storage[storage.id as keyof typeof COMPONENT_RATINGS.storage] : null;

  // Calculate gaming performance
  const gaming = {
    resolution1080p: calculateGamingScore(cpuRating, gpuRating, memoryRating, storageRating, '1080p'),
    resolution1440p: calculateGamingScore(cpuRating, gpuRating, memoryRating, storageRating, '1440p'),
    resolution4k: calculateGamingScore(cpuRating, gpuRating, memoryRating, storageRating, '4k'),
    averageFps: 0
  };
  
  gaming.averageFps = (gaming.resolution1080p + gaming.resolution1440p + gaming.resolution4k) / 3;

  // Calculate productivity performance
  const productivity = {
    videoEditing: calculateProductivityScore(cpuRating, gpuRating, memoryRating, storageRating, 'videoEditing'),
    rendering3d: calculateProductivityScore(cpuRating, gpuRating, memoryRating, storageRating, 'rendering'),
    programming: calculateProductivityScore(cpuRating, gpuRating, memoryRating, storageRating, 'programming'),
    streaming: calculateProductivityScore(cpuRating, gpuRating, memoryRating, storageRating, 'streaming'),
    overall: 0
  };

  productivity.overall = (productivity.videoEditing + productivity.rendering3d + productivity.programming + productivity.streaming) / 4;

  const overall = (gaming.averageFps * 0.5) + (productivity.overall * 0.5);

  return {
    gaming,
    productivity,
    overall
  };
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
    case '1080p':
      gpuScore = gpuRating.performance1080p || 0;
      break;
    case '1440p':
      gpuScore = gpuRating.performance1440p || 0;
      break;
    case '4k':
      gpuScore = gpuRating.performance4k || 0;
      break;
  }

  const cpuScore = cpuRating.gaming || 0;
  const memoryScore = memoryRating?.gaming || 70; // Default if no memory
  const storageScore = storageRating?.gaming || 70; // Default if no storage

  const score = (
    gpuScore * weights.gpu +
    cpuScore * weights.processor +
    memoryScore * weights.memory +
    storageScore * weights.storage
  );

  return Math.round(Math.min(100, Math.max(0, score)));
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
  
  const cpuScore = cpuRating.productivity || 0;
  const gpuScore = gpuRating?.productivity || 50; // Some tasks benefit from GPU
  const memoryScore = memoryRating?.productivity || 70;
  const storageScore = storageRating?.productivity || 70;

  let taskMultiplier = 1;
  
  // Adjust weights based on specific task requirements
  switch (task) {
    case 'videoEditing':
      taskMultiplier = memoryRating?.capacity > 80 ? 1.1 : 0.9; // Benefits from more RAM
      break;
    case 'rendering':
      taskMultiplier = gpuRating ? 1.15 : 0.8; // Heavily benefits from GPU
      break;
    case 'programming':
      taskMultiplier = storageRating?.speed > 80 ? 1.1 : 0.95; // Benefits from fast storage
      break;
    case 'streaming':
      taskMultiplier = cpuRating.multiCore > 85 ? 1.1 : 0.9; // Benefits from multi-core
      break;
  }

  const score = (
    cpuScore * weights.processor +
    gpuScore * weights.gpu +
    memoryScore * weights.memory +
    storageScore * weights.storage
  ) * taskMultiplier;

  return Math.round(Math.min(100, Math.max(0, score)));
}

export function analyzePerformanceBottlenecks(selectedComponents: SelectedComponents): ComponentPerformanceContribution[] {
  const contributions: ComponentPerformanceContribution[] = [];
  
  const cpu = selectedComponents.processor;
  const gpu = selectedComponents.gpu;
  const memory = selectedComponents.memory;
  const storage = selectedComponents.storage;

  if (cpu) {
    const cpuRating = COMPONENT_RATINGS.processor[cpu.id as keyof typeof COMPONENT_RATINGS.processor];
    if (cpuRating) {
      contributions.push({
        component: 'processor',
        gamingContribution: cpuRating.gaming * PERFORMANCE_WEIGHTS.gaming.processor,
        productivityContribution: cpuRating.productivity * PERFORMANCE_WEIGHTS.productivity.processor,
        bottleneck: cpuRating.gaming < 80 ? 'May limit gaming performance' : undefined
      });
    }
  }

  if (gpu) {
    const gpuRating = COMPONENT_RATINGS.gpu[gpu.id as keyof typeof COMPONENT_RATINGS.gpu];
    if (gpuRating) {
      const avgGamingPerf = (gpuRating.performance1080p + gpuRating.performance1440p + gpuRating.performance4k) / 3;
      contributions.push({
        component: 'gpu',
        gamingContribution: avgGamingPerf * PERFORMANCE_WEIGHTS.gaming.gpu,
        productivityContribution: gpuRating.productivity * PERFORMANCE_WEIGHTS.productivity.gpu,
        bottleneck: avgGamingPerf < 70 ? 'Primary gaming bottleneck' : undefined
      });
    }
  }

  if (memory) {
    const memoryRating = COMPONENT_RATINGS.memory[memory.id as keyof typeof COMPONENT_RATINGS.memory];
    if (memoryRating) {
      contributions.push({
        component: 'memory',
        gamingContribution: memoryRating.gaming * PERFORMANCE_WEIGHTS.gaming.memory,
        productivityContribution: memoryRating.productivity * PERFORMANCE_WEIGHTS.productivity.memory,
        bottleneck: memoryRating.capacity < 70 ? 'Insufficient for demanding tasks' : undefined
      });
    }
  }

  if (storage) {
    const storageRating = COMPONENT_RATINGS.storage[storage.id as keyof typeof COMPONENT_RATINGS.storage];
    if (storageRating) {
      contributions.push({
        component: 'storage',
        gamingContribution: storageRating.gaming * PERFORMANCE_WEIGHTS.gaming.storage,
        productivityContribution: storageRating.productivity * PERFORMANCE_WEIGHTS.productivity.storage,
        bottleneck: storageRating.speed < 50 ? 'Slow loading times' : undefined
      });
    }
  }

  return contributions;
}

export function comparePerformance(currentComponents: SelectedComponents, recommendedComponent: any, componentType: string): {
  currentPerformance: PerformanceMetrics;
  newPerformance: PerformanceMetrics;
  improvement: {
    gaming: number;
    productivity: number;
    overall: number;
  };
} {
  const current = calculatePerformanceMetrics(currentComponents);
  
  const updatedComponents = {
    ...currentComponents,
    [componentType]: recommendedComponent
  };
  const updated = calculatePerformanceMetrics(updatedComponents);

  const improvement = {
    gaming: updated.gaming.averageFps - current.gaming.averageFps,
    productivity: updated.productivity.overall - current.productivity.overall,
    overall: updated.overall - current.overall
  };

  return {
    currentPerformance: current,
    newPerformance: updated,
    improvement
  };
}

export function getPerformanceRating(score: number): {
  rating: string;
  color: string;
  description: string;
} {
  if (score >= 90) {
    return {
      rating: 'Excellent',
      color: 'text-green-600',
      description: 'Top-tier performance for all tasks'
    };
  } else if (score >= 80) {
    return {
      rating: 'Very Good',
      color: 'text-blue-600',
      description: 'Great performance for most tasks'
    };
  } else if (score >= 70) {
    return {
      rating: 'Good',
      color: 'text-yellow-600',
      description: 'Solid performance for typical use'
    };
  } else if (score >= 60) {
    return {
      rating: 'Fair',
      color: 'text-orange-600',
      description: 'Adequate for basic tasks'
    };
  } else {
    return {
      rating: 'Poor',
      color: 'text-red-600',
      description: 'May struggle with demanding tasks'
    };
  }
}

export function estimateFrameRates(performanceScore: number, resolution: string): {
  low: number;
  medium: number;
  high: number;
  ultra: number;
} {
  // Base frame rates for different performance scores at 1080p
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

  // Find closest performance score
  const scores = Object.keys(baseFrameRates).map(Number).sort((a, b) => b - a);
  const closestScore = scores.find(score => performanceScore >= score) || 30;
  
  let frameRates = baseFrameRates[closestScore as keyof typeof baseFrameRates];

  // Adjust for resolution
  const resolutionMultipliers = {
    '1080p': 1.0,
    '1440p': 0.65,
    '4k': 0.35
  };

  const multiplier = resolutionMultipliers[resolution as keyof typeof resolutionMultipliers] || 1.0;

  return {
    low: Math.round(frameRates.low * multiplier),
    medium: Math.round(frameRates.medium * multiplier),
    high: Math.round(frameRates.high * multiplier),
    ultra: Math.round(frameRates.ultra * multiplier)
  };
}