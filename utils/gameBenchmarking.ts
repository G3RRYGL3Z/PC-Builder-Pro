import { gameBenchmarks, applicationBenchmarks, cpuApplicationBenchmarks } from '../data/gameBenchmarks';

// ── Interfaces ─────────────────────────────────────────────────────────────

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
    resolution4k:    { low: number; medium: number; high: number; ultra: number };
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

// ── CPU modifier lookup ────────────────────────────────────────────────────

const CPU_SCORES: Record<string, number> = {
  'cpu-1': 1.00,  // Intel i9-13900K (baseline)
  'cpu-2': 0.96,  // AMD Ryzen 9 7900X
  'cpu-3': 0.88,  // Intel i5-13600K
  'cpu-4': 0.82   // AMD Ryzen 5 7600X
};

function getCPUModifier(cpuId: string, impact: number): number {
  const baseScore = CPU_SCORES[cpuId] ?? 0.80;
  return 1.0 + (baseScore - 1.0) * impact;
}

// ── Game performance ───────────────────────────────────────────────────────

export function calculateGamePerformance(selectedComponents: SelectedComponents): GamePerformance[] {
  const gpu = selectedComponents.gpu;
  const cpu = selectedComponents.processor;

  if (!gpu) return [];

  const gamePerformances: GamePerformance[] = [];

  gameBenchmarks.forEach(game => {
    const baseBenchmark = game.benchmarks[gpu.id];
    if (!baseBenchmark) return;

    let cpuModifier = 1.0;
    if (cpu) {
      const impactByCategory: Record<string, number> = {
        esports: 0.15,
        fps:     0.12,
        aaa:     0.08,
        indie:   0.05,
        vr:      0.05
      };
      cpuModifier = getCPUModifier(cpu.id, impactByCategory[game.category] ?? 0.05);
    }

    // Helper so we don't repeat the rounding logic 12 times
    const applyModifier = (fps: number) => Math.max(0, Math.round(fps * cpuModifier));

    const adjustedFps = {
      resolution1080p: {
        low:    applyModifier(baseBenchmark.resolution1080p.low),
        medium: applyModifier(baseBenchmark.resolution1080p.medium),
        high:   applyModifier(baseBenchmark.resolution1080p.high),
        ultra:  applyModifier(baseBenchmark.resolution1080p.ultra)
      },
      resolution1440p: {
        low:    applyModifier(baseBenchmark.resolution1440p.low),
        medium: applyModifier(baseBenchmark.resolution1440p.medium),
        high:   applyModifier(baseBenchmark.resolution1440p.high),
        ultra:  applyModifier(baseBenchmark.resolution1440p.ultra)
      },
      resolution4k: {
        low:    applyModifier(baseBenchmark.resolution4k.low),
        medium: applyModifier(baseBenchmark.resolution4k.medium),
        high:   applyModifier(baseBenchmark.resolution4k.high),
        ultra:  applyModifier(baseBenchmark.resolution4k.ultra)
      }
    };

    // FIX: averageFps was using only the `high` quality tier at each resolution,
    // then dividing by 3 — producing a number ~30-40% lower than the real
    // 1080p high FPS. Most users think "average FPS" means typical 1080p gameplay.
    // Now we use the medium quality tier at 1080p as the headline number,
    // which best represents what most users will actually experience.
    const averageFps = adjustedFps.resolution1080p.medium;

    gamePerformances.push({
      gameId:  game.id,
      name:    game.name,
      category: game.category,
      icon:    game.icon,
      fps:     adjustedFps,
      averageFps,
      playabilityRating: getPlayabilityRating(averageFps, game.category)
    });
  });

  const categoryOrder: Record<string, number> = {
    esports: 0, fps: 1, aaa: 2, indie: 3, vr: 4
  };

  return gamePerformances.sort((a, b) =>
    (categoryOrder[a.category] ?? 99) - (categoryOrder[b.category] ?? 99)
  );
}

// ── Application performance ────────────────────────────────────────────────

export function calculateApplicationPerformance(selectedComponents: SelectedComponents): ApplicationPerformance[] {
  const gpu = selectedComponents.gpu;
  const cpu = selectedComponents.processor;

  const appPerformances: ApplicationPerformance[] = [];

  // GPU-accelerated applications
  if (gpu) {
    applicationBenchmarks.forEach(app => {
      const baseBenchmark = app.benchmarks[gpu.id];
      if (!baseBenchmark) return;

      // FIX: Guard against empty task array before mapping
      if (!Array.isArray(baseBenchmark) || baseBenchmark.length === 0) return;

      const tasks = baseBenchmark.map(task => ({
        ...task,
        rating: getTaskRating(task.value, app.metric, app.category)
      }));

      const overallScore = calculateOverallScore(tasks, app.metric, app.category);

      appPerformances.push({
        appId:    app.id,
        name:     app.name,
        category: app.category,
        icon:     app.icon,
        metric:   app.metric,
        unit:     app.unit,
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

      // FIX: Same guard
      if (!Array.isArray(baseBenchmark) || baseBenchmark.length === 0) return;

      const tasks = baseBenchmark.map(task => ({
        ...task,
        rating: getTaskRating(task.value, app.metric, app.category)
      }));

      const overallScore = calculateOverallScore(tasks, app.metric, app.category);

      appPerformances.push({
        appId:    app.id,
        name:     app.name,
        category: app.category,
        icon:     app.icon,
        metric:   app.metric,
        unit:     app.unit,
        tasks,
        overallScore
      });
    });
  }

  return appPerformances.sort((a, b) => a.name.localeCompare(b.name));
}

// ── Scoring helpers ────────────────────────────────────────────────────────

// FIX: calculateOverallScore had two bugs:
//
// Bug A — time metric: formula `100 - (avgTime * 2)` returned 0 for any
// task averaging 50+ units. A 10-minute Premiere export (value: 10) returned
// 100 - 20 = 80 which was fine, but a 60-second HandBrake job (value: 60 if
// stored in seconds) returned 0. Fix: normalize against category-specific
// reference times so scores stay in 0-100 regardless of raw unit values.
//
// Bug B — score metric: averaging raw task values works IF values are already
// 0-100. If they aren't, results are unpredictable. Added a clamp to be safe.
//
// Bug C — division by zero when tasks.length === 0. Added guard.
function calculateOverallScore(tasks: any[], metric: string, category: string): number {
  // FIX: Guard empty tasks — prevents NaN from 0/0 division
  if (!tasks || tasks.length === 0) return 0;

  if (metric === 'time') {
    // Lower time = better performance. We convert time → score using
    // category-specific reference points (what "Good" performance looks like).
    // This replaces the broken `100 - (avgTime * 2)` formula.
    const referenceTimes: Record<string, number> = {
      video:       30,  // 30 units = baseline "Good" for video tasks
      rendering:   60,  // 60 units = baseline for rendering
      development: 90,  // 90 units = baseline for compilation/dev tasks
      design:      20,  // 20 units = baseline for design app tasks
    };

    const reference = referenceTimes[category] ?? 30;
    const avgTime = tasks.reduce((sum: number, t: any) => sum + (t.value ?? 0), 0) / tasks.length;

    // FIX: Guard against avgTime === 0 (prevents Infinity)
    if (avgTime <= 0) return 100; // instant = perfect score

    // Score = (reference / actual) clamped to 0-100.
    // If actual < reference, score > 100 → clamped to 100 (Excellent).
    // If actual > reference, score < 100 (slower than baseline).
    const score = (reference / avgTime) * 75; // 75 = "Good" at baseline
    return Math.round(Math.min(100, Math.max(0, score)));

  } else if (metric === 'score') {
    // Task values are already 0-100 scores — just average them
    const avg = tasks.reduce((sum: number, t: any) => sum + (t.value ?? 0), 0) / tasks.length;
    // FIX: clamp in case raw data has values outside 0-100
    return Math.round(Math.min(100, Math.max(0, avg)));
  }

  // FIX: Unknown metric type — return 0 instead of silently returning 75
  // so bad data is visible rather than hidden behind a fake "Good" score
  return 0;
}

// FIX: getTaskRating now covers all metric types explicitly.
// Previously any metric outside 'time'/'score' silently returned 'Good'
// regardless of the actual value.
function getTaskRating(value: number, metric: string, category: string): string {
  if (metric === 'time') {
    // Lower is better — thresholds in same units as the task values
    const thresholds: Record<string, { excellent: number; great: number; good: number; fair: number }> = {
      video:       { excellent: 10, great: 20,  good: 40,  fair: 80  },
      rendering:   { excellent: 20, great: 40,  good: 80,  fair: 160 },
      development: { excellent: 30, great: 60,  good: 120, fair: 240 },
      design:      { excellent: 5,  great: 10,  good: 20,  fair: 40  },
    };

    const t = thresholds[category] ?? thresholds.video;
    if (value <= t.excellent) return 'Excellent';
    if (value <= t.great)     return 'Great';
    if (value <= t.good)      return 'Good';
    if (value <= t.fair)      return 'Fair';
    return 'Poor';

  } else if (metric === 'score') {
    // Higher is better
    if (value >= 90) return 'Excellent';
    if (value >= 80) return 'Great';
    if (value >= 70) return 'Good';
    if (value >= 60) return 'Fair';
    return 'Poor';
  }

  // FIX: Unknown metric — use value as a 0-100 score with same thresholds
  if (value >= 90) return 'Excellent';
  if (value >= 70) return 'Good';
  if (value >= 50) return 'Fair';
  return 'Poor';
}

function getPlayabilityRating(averageFps: number, category: string): string {
  if (category === 'esports') {
    if (averageFps >= 240) return 'Competitive Pro';
    if (averageFps >= 144) return 'Competitive';
    if (averageFps >= 60)  return 'Casual';
    return 'Playable';
  } else if (category === 'fps') {
    if (averageFps >= 120) return 'Excellent';
    if (averageFps >= 90)  return 'Great';
    if (averageFps >= 60)  return 'Good';
    return 'Fair';
  } else {
    // AAA, indie, VR
    if (averageFps >= 90) return 'Excellent';
    if (averageFps >= 60) return 'Great';
    if (averageFps >= 45) return 'Good';
    if (averageFps >= 30) return 'Fair';
    return 'Poor';
  }
}

// ── Utility exports ────────────────────────────────────────────────────────

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
  const currentGame  = currentGames.find(g => g.gameId === gameId) ?? null;

  const updatedComponents = { ...currentComponents, [componentType]: newComponent };
  const newGames = calculateGamePerformance(updatedComponents);
  const newGame  = newGames.find(g => g.gameId === gameId) ?? null;

  return {
    current: currentGame,
    new:     newGame,
    improvement: {
      averageFps:          (newGame?.averageFps                ?? 0) - (currentGame?.averageFps                ?? 0),
      resolution1080pHigh: (newGame?.fps.resolution1080p.high  ?? 0) - (currentGame?.fps.resolution1080p.high  ?? 0),
      resolution1440pHigh: (newGame?.fps.resolution1440p.high  ?? 0) - (currentGame?.fps.resolution1440p.high  ?? 0),
      resolution4kHigh:    (newGame?.fps.resolution4k.high     ?? 0) - (currentGame?.fps.resolution4k.high     ?? 0),
    }
  };
}

export function getTopPerformingGames(
  gamePerformances: GamePerformance[],
  count: number = 5
): GamePerformance[] {
  return [...gamePerformances]
    .sort((a, b) => b.averageFps - a.averageFps)
    .slice(0, count);
}

export function getGamesByCategory(
  gamePerformances: GamePerformance[],
  category: string
): GamePerformance[] {
  return gamePerformances.filter(g => g.category === category);
}

export function getGamePerformanceRating(
  fps: number,
  resolution: string,
  quality: string
): { rating: string; color: string; description: string } {
  let thresholds = { excellent: 60, good: 45, fair: 30 };

  if (resolution === '4k' || quality === 'ultra') {
    thresholds = { excellent: 45, good: 30, fair: 20 };
  } else if (resolution === '1440p' || quality === 'high') {
    thresholds = { excellent: 75, good: 60, fair: 45 };
  } else {
    thresholds = { excellent: 100, good: 75, fair: 60 };
  }

  if (fps >= thresholds.excellent) return {
    rating: 'Excellent',
    color: 'text-green-600',
    description: 'Smooth gameplay with excellent visual quality'
  };
  if (fps >= thresholds.good) return {
    rating: 'Good',
    color: 'text-blue-600',
    description: 'Good performance with smooth gameplay'
  };
  if (fps >= thresholds.fair) return {
    rating: 'Fair',
    color: 'text-yellow-600',
    description: 'Acceptable performance for casual gaming'
  };
  return {
    rating: 'Poor',
    color: 'text-red-600',
    description: 'Performance may not provide smooth gameplay'
  };
}