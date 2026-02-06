import { gameBenchmarks, applicationBenchmarks, cpuApplicationBenchmarks } from '../data/gameBenchmarks';

interface SelectedComponents {
  [key: string]: any;
}

interface GamePerformance {
  gameId: string;
  name: string;
  category: string;
  icon: string;
  fps: {
    resolution1080p: { low: number; medium: number; high: number; ultra: number };
    resolution1440p: { low: number; medium: number; high: number; ultra: number };
    resolution4k: { low: number; medium: number; high: number; ultra: number };
  };
  averageFps: number;
  playabilityRating: string;
}

interface ApplicationPerformance {
  appId: string;
  name: string;
  category: string;
  icon: string;
  metric: string;
  unit: string;
  tasks: {
    taskName: string;
    value: number;
    description: string;
    rating: string;
  }[];
  overallScore: number;
}

export function calculateGamePerformance(selectedComponents: SelectedComponents): GamePerformance[] {
  const gpu = selectedComponents.gpu;
  const cpu = selectedComponents.processor;
  
  if (!gpu) return [];
  
  const gamePerformances: GamePerformance[] = [];
  
  gameBenchmarks.forEach(game => {
    const baseBenchmark = game.benchmarks[gpu.id];
    if (!baseBenchmark) return;
    
    // Apply CPU modifier for CPU-dependent games
    let cpuModifier = 1.0;
    if (cpu) {
      // CPU impact varies by game category
      switch (game.category) {
        case 'esports':
          cpuModifier = getCPUModifier(cpu.id, 0.15); // High CPU dependency
          break;
        case 'aaa':
          cpuModifier = getCPUModifier(cpu.id, 0.08); // Medium CPU dependency
          break;
        case 'fps':
          cpuModifier = getCPUModifier(cpu.id, 0.12); // Medium-high CPU dependency
          break;
        default:
          cpuModifier = getCPUModifier(cpu.id, 0.05); // Low CPU dependency
      }
    }
    
    const adjustedFps = {
      resolution1080p: {
        low: Math.round(baseBenchmark.resolution1080p.low * cpuModifier),
        medium: Math.round(baseBenchmark.resolution1080p.medium * cpuModifier),
        high: Math.round(baseBenchmark.resolution1080p.high * cpuModifier),
        ultra: Math.round(baseBenchmark.resolution1080p.ultra * cpuModifier)
      },
      resolution1440p: {
        low: Math.round(baseBenchmark.resolution1440p.low * cpuModifier),
        medium: Math.round(baseBenchmark.resolution1440p.medium * cpuModifier),
        high: Math.round(baseBenchmark.resolution1440p.high * cpuModifier),
        ultra: Math.round(baseBenchmark.resolution1440p.ultra * cpuModifier)
      },
      resolution4k: {
        low: Math.round(baseBenchmark.resolution4k.low * cpuModifier),
        medium: Math.round(baseBenchmark.resolution4k.medium * cpuModifier),
        high: Math.round(baseBenchmark.resolution4k.high * cpuModifier),
        ultra: Math.round(baseBenchmark.resolution4k.ultra * cpuModifier)
      }
    };
    
    const averageFps = (
      adjustedFps.resolution1080p.high + 
      adjustedFps.resolution1440p.high + 
      adjustedFps.resolution4k.high
    ) / 3;
    
    gamePerformances.push({
      gameId: game.id,
      name: game.name,
      category: game.category,
      icon: game.icon,
      fps: adjustedFps,
      averageFps,
      playabilityRating: getPlayabilityRating(averageFps, game.category)
    });
  });
  
  // Sort by popularity/relevance
  return gamePerformances.sort((a, b) => {
    const categoryOrder = { esports: 0, fps: 1, aaa: 2, indie: 3, vr: 4 };
    return categoryOrder[a.category as keyof typeof categoryOrder] - 
           categoryOrder[b.category as keyof typeof categoryOrder];
  });
}

export function calculateApplicationPerformance(selectedComponents: SelectedComponents): ApplicationPerformance[] {
  const gpu = selectedComponents.gpu;
  const cpu = selectedComponents.processor;
  
  const appPerformances: ApplicationPerformance[] = [];
  
  // GPU-accelerated applications
  if (gpu) {
    applicationBenchmarks.forEach(app => {
      const baseBenchmark = app.benchmarks[gpu.id];
      if (!baseBenchmark) return;
      
      const tasks = baseBenchmark.map(task => ({
        ...task,
        rating: getTaskRating(task.value, app.metric, app.category)
      }));
      
      const overallScore = calculateOverallScore(tasks, app.metric);
      
      appPerformances.push({
        appId: app.id,
        name: app.name,
        category: app.category,
        icon: app.icon,
        metric: app.metric,
        unit: app.unit,
        tasks,
        overallScore
      });
    });
  }
  
  // CPU-dependent applications
  if (cpu) {
    cpuApplicationBenchmarks.forEach(app => {
      const baseBenchmark = app.benchmarks[cpu.id];
      if (!baseBenchmark) return;
      
      const tasks = baseBenchmark.map(task => ({
        ...task,
        rating: getTaskRating(task.value, app.metric, app.category)
      }));
      
      const overallScore = calculateOverallScore(tasks, app.metric);
      
      appPerformances.push({
        appId: app.id,
        name: app.name,
        category: app.category,
        icon: app.icon,
        metric: app.metric,
        unit: app.unit,
        tasks,
        overallScore
      });
    });
  }
  
  return appPerformances.sort((a, b) => a.name.localeCompare(b.name));
}

function getCPUModifier(cpuId: string, impact: number): number {
  const cpuScores = {
    'cpu-1': 1.0,    // Intel i9-13900K (baseline)
    'cpu-2': 0.96,   // AMD Ryzen 9 7900X
    'cpu-3': 0.88,   // Intel i5-13600K
    'cpu-4': 0.82    // AMD Ryzen 5 7600X
  };
  
  const baseScore = cpuScores[cpuId as keyof typeof cpuScores] || 0.8;
  return 1.0 + (baseScore - 1.0) * impact;
}

function getPlayabilityRating(averageFps: number, category: string): string {
  if (category === 'esports') {
    if (averageFps >= 240) return 'Competitive Pro';
    if (averageFps >= 144) return 'Competitive';
    if (averageFps >= 60) return 'Casual';
    return 'Playable';
  } else if (category === 'fps') {
    if (averageFps >= 120) return 'Excellent';
    if (averageFps >= 90) return 'Great';
    if (averageFps >= 60) return 'Good';
    return 'Fair';
  } else { // AAA, indie, VR
    if (averageFps >= 90) return 'Excellent';
    if (averageFps >= 60) return 'Great';
    if (averageFps >= 45) return 'Good';
    if (averageFps >= 30) return 'Fair';
    return 'Poor';
  }
}

function getTaskRating(value: number, metric: string, category: string): string {
  if (metric === 'time') {
    // Lower is better for time-based metrics
    if (category === 'video' || category === 'rendering') {
      if (value <= 10) return 'Excellent';
      if (value <= 20) return 'Great';
      if (value <= 40) return 'Good';
      if (value <= 80) return 'Fair';
      return 'Poor';
    } else if (category === 'development') {
      if (value <= 30) return 'Excellent';
      if (value <= 60) return 'Great';
      if (value <= 120) return 'Good';
      if (value <= 240) return 'Fair';
      return 'Poor';
    }
  } else if (metric === 'score') {
    // Higher is better for score-based metrics
    if (value >= 90) return 'Excellent';
    if (value >= 80) return 'Great';
    if (value >= 70) return 'Good';
    if (value >= 60) return 'Fair';
    return 'Poor';
  }
  
  return 'Good';
}

function calculateOverallScore(tasks: any[], metric: string): number {
  if (metric === 'time') {
    // For time-based metrics, convert to performance score (lower time = higher score)
    const avgTime = tasks.reduce((sum, task) => sum + task.value, 0) / tasks.length;
    return Math.max(0, Math.min(100, 100 - (avgTime * 2))); // Rough conversion
  } else if (metric === 'score') {
    // For score-based metrics, use average
    return tasks.reduce((sum, task) => sum + task.value, 0) / tasks.length;
  }
  
  return 75; // Default score
}

export function compareGamePerformance(
  currentComponents: SelectedComponents,
  newComponent: any,
  componentType: string,
  gameId: string
): {
  current: GamePerformance | null;
  new: GamePerformance | null;
  improvement: {
    averageFps: number;
    resolution1080pHigh: number;
    resolution1440pHigh: number;
    resolution4kHigh: number;
  };
} {
  const currentGames = calculateGamePerformance(currentComponents);
  const currentGame = currentGames.find(g => g.gameId === gameId) || null;
  
  const updatedComponents = { ...currentComponents, [componentType]: newComponent };
  const newGames = calculateGamePerformance(updatedComponents);
  const newGame = newGames.find(g => g.gameId === gameId) || null;
  
  const improvement = {
    averageFps: (newGame?.averageFps || 0) - (currentGame?.averageFps || 0),
    resolution1080pHigh: (newGame?.fps.resolution1080p.high || 0) - (currentGame?.fps.resolution1080p.high || 0),
    resolution1440pHigh: (newGame?.fps.resolution1440p.high || 0) - (currentGame?.fps.resolution1440p.high || 0),
    resolution4kHigh: (newGame?.fps.resolution4k.high || 0) - (currentGame?.fps.resolution4k.high || 0),
  };
  
  return { current: currentGame, new: newGame, improvement };
}

export function getTopPerformingGames(gamePerformances: GamePerformance[], count: number = 5): GamePerformance[] {
  return gamePerformances
    .sort((a, b) => b.averageFps - a.averageFps)
    .slice(0, count);
}

export function getGamesByCategory(gamePerformances: GamePerformance[], category: string): GamePerformance[] {
  return gamePerformances.filter(game => game.category === category);
}

export function getGamePerformanceRating(fps: number, resolution: string, quality: string): {
  rating: string;
  color: string;
  description: string;
} {
  let thresholds = { excellent: 60, good: 45, fair: 30 };
  
  // Adjust thresholds based on resolution and quality
  if (resolution === '4k' || quality === 'ultra') {
    thresholds = { excellent: 45, good: 30, fair: 20 };
  } else if (resolution === '1440p' || quality === 'high') {
    thresholds = { excellent: 75, good: 60, fair: 45 };
  } else {
    thresholds = { excellent: 100, good: 75, fair: 60 };
  }
  
  if (fps >= thresholds.excellent) {
    return {
      rating: 'Excellent',
      color: 'text-green-600',
      description: 'Smooth gameplay with excellent visual quality'
    };
  } else if (fps >= thresholds.good) {
    return {
      rating: 'Good',
      color: 'text-blue-600',
      description: 'Good performance with smooth gameplay'
    };
  } else if (fps >= thresholds.fair) {
    return {
      rating: 'Fair',
      color: 'text-yellow-600',
      description: 'Acceptable performance for casual gaming'
    };
  } else {
    return {
      rating: 'Poor',
      color: 'text-red-600',
      description: 'Performance may not provide smooth gameplay'
    };
  }
}