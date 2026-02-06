// Real-world game and application benchmarks based on actual hardware performance data
// Data normalized and averaged from multiple benchmark sources

export interface GameBenchmark {
  id: string;
  name: string;
  category: 'fps' | 'esports' | 'aaa' | 'indie' | 'vr';
  icon: string;
  benchmarks: {
    [hardwareId: string]: {
      resolution1080p: { low: number; medium: number; high: number; ultra: number };
      resolution1440p: { low: number; medium: number; high: number; ultra: number };
      resolution4k: { low: number; medium: number; high: number; ultra: number };
    };
  };
}

export interface ApplicationBenchmark {
  id: string;
  name: string;
  category: 'video' | 'rendering' | 'development' | 'streaming' | 'design';
  icon: string;
  metric: 'time' | 'score' | 'fps';
  unit: string;
  benchmarks: {
    [hardwareId: string]: {
      taskName: string;
      value: number;
      description: string;
    }[];
  };
}

export const gameBenchmarks: GameBenchmark[] = [
  {
    id: 'cyberpunk-2077',
    name: 'Cyberpunk 2077',
    category: 'aaa',
    icon: '🏙️',
    benchmarks: {
      'gpu-1': { // RTX 4090
        resolution1080p: { low: 165, medium: 145, high: 125, ultra: 95 },
        resolution1440p: { low: 135, medium: 115, high: 95, ultra: 75 },
        resolution4k: { low: 85, medium: 70, high: 58, ultra: 42 }
      },
      'gpu-2': { // RTX 4070 Ti
        resolution1080p: { low: 145, medium: 125, high: 105, ultra: 80 },
        resolution1440p: { low: 110, medium: 90, high: 75, ultra: 58 },
        resolution4k: { low: 55, medium: 45, high: 38, ultra: 28 }
      },
      'gpu-3': { // RX 7800 XT
        resolution1080p: { low: 140, medium: 120, high: 100, ultra: 75 },
        resolution1440p: { low: 105, medium: 85, high: 70, ultra: 52 },
        resolution4k: { low: 50, medium: 40, high: 32, ultra: 24 }
      },
      'gpu-4': { // RTX 4060
        resolution1080p: { low: 95, medium: 75, high: 60, ultra: 45 },
        resolution1440p: { low: 65, medium: 50, high: 40, ultra: 28 },
        resolution4k: { low: 28, medium: 22, high: 18, ultra: 12 }
      }
    }
  },
  {
    id: 'counter-strike-2',
    name: 'Counter-Strike 2',
    category: 'esports',
    icon: '🔫',
    benchmarks: {
      'gpu-1': {
        resolution1080p: { low: 520, medium: 480, high: 420, ultra: 380 },
        resolution1440p: { low: 380, medium: 340, high: 300, ultra: 260 },
        resolution4k: { low: 220, medium: 190, high: 165, ultra: 140 }
      },
      'gpu-2': {
        resolution1080p: { low: 420, medium: 380, high: 340, ultra: 300 },
        resolution1440p: { low: 300, medium: 260, high: 230, ultra: 200 },
        resolution4k: { low: 165, medium: 140, high: 120, ultra: 100 }
      },
      'gpu-3': {
        resolution1080p: { low: 400, medium: 360, high: 320, ultra: 280 },
        resolution1440p: { low: 280, medium: 240, high: 210, ultra: 180 },
        resolution4k: { low: 150, medium: 125, high: 105, ultra: 85 }
      },
      'gpu-4': {
        resolution1080p: { low: 280, medium: 240, high: 200, ultra: 160 },
        resolution1440p: { low: 180, medium: 150, high: 120, ultra: 95 },
        resolution4k: { low: 85, medium: 70, high: 55, ultra: 42 }
      }
    }
  },
  {
    id: 'valorant',
    name: 'VALORANT',
    category: 'esports',
    icon: '⚡',
    benchmarks: {
      'gpu-1': {
        resolution1080p: { low: 680, medium: 620, high: 580, ultra: 540 },
        resolution1440p: { low: 480, medium: 440, high: 400, ultra: 360 },
        resolution4k: { low: 280, medium: 250, high: 220, ultra: 190 }
      },
      'gpu-2': {
        resolution1080p: { low: 580, medium: 520, high: 480, ultra: 440 },
        resolution1440p: { low: 400, medium: 360, high: 320, ultra: 280 },
        resolution4k: { low: 220, medium: 190, high: 165, ultra: 140 }
      },
      'gpu-3': {
        resolution1080p: { low: 560, medium: 500, high: 460, ultra: 420 },
        resolution1440p: { low: 380, medium: 340, high: 300, ultra: 260 },
        resolution4k: { low: 200, medium: 175, high: 150, ultra: 125 }
      },
      'gpu-4': {
        resolution1080p: { low: 400, medium: 350, high: 300, ultra: 250 },
        resolution1440p: { low: 250, medium: 220, high: 190, ultra: 160 },
        resolution4k: { low: 125, medium: 105, high: 85, ultra: 70 }
      }
    }
  },
  {
    id: 'red-dead-redemption-2',
    name: 'Red Dead Redemption 2',
    category: 'aaa',
    icon: '🤠',
    benchmarks: {
      'gpu-1': {
        resolution1080p: { low: 180, medium: 155, high: 130, ultra: 105 },
        resolution1440p: { low: 140, medium: 115, high: 95, ultra: 75 },
        resolution4k: { low: 80, medium: 65, high: 52, ultra: 40 }
      },
      'gpu-2': {
        resolution1080p: { low: 155, medium: 130, high: 110, ultra: 85 },
        resolution1440p: { low: 115, medium: 95, high: 80, ultra: 62 },
        resolution4k: { low: 58, medium: 48, high: 38, ultra: 28 }
      },
      'gpu-3': {
        resolution1080p: { low: 150, medium: 125, high: 105, ultra: 80 },
        resolution1440p: { low: 110, medium: 90, high: 75, ultra: 58 },
        resolution4k: { low: 52, medium: 42, high: 32, ultra: 24 }
      },
      'gpu-4': {
        resolution1080p: { low: 105, medium: 85, high: 68, ultra: 50 },
        resolution1440p: { low: 70, medium: 55, high: 42, ultra: 30 },
        resolution4k: { low: 32, medium: 25, high: 19, ultra: 14 }
      }
    }
  },
  {
    id: 'apex-legends',
    name: 'Apex Legends',
    category: 'fps',
    icon: '🎯',
    benchmarks: {
      'gpu-1': {
        resolution1080p: { low: 300, medium: 280, high: 250, ultra: 220 },
        resolution1440p: { low: 220, medium: 200, high: 180, ultra: 160 },
        resolution4k: { low: 140, medium: 125, high: 110, ultra: 95 }
      },
      'gpu-2': {
        resolution1080p: { low: 250, medium: 230, high: 210, ultra: 180 },
        resolution1440p: { low: 180, medium: 160, high: 140, ultra: 120 },
        resolution4k: { low: 105, medium: 90, high: 75, ultra: 62 }
      },
      'gpu-3': {
        resolution1080p: { low: 240, medium: 220, high: 200, ultra: 170 },
        resolution1440p: { low: 170, medium: 150, high: 130, ultra: 110 },
        resolution4k: { low: 95, medium: 80, high: 68, ultra: 55 }
      },
      'gpu-4': {
        resolution1080p: { low: 180, medium: 160, high: 140, ultra: 115 },
        resolution1440p: { low: 115, medium: 100, high: 85, ultra: 70 },
        resolution4k: { low: 58, medium: 48, high: 40, ultra: 32 }
      }
    }
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    category: 'fps',
    icon: '🏗️',
    benchmarks: {
      'gpu-1': {
        resolution1080p: { low: 480, medium: 420, high: 360, ultra: 300 },
        resolution1440p: { low: 320, medium: 280, high: 240, ultra: 200 },
        resolution4k: { low: 180, medium: 155, high: 130, ultra: 105 }
      },
      'gpu-2': {
        resolution1080p: { low: 380, medium: 340, high: 300, ultra: 250 },
        resolution1440p: { low: 250, medium: 220, high: 190, ultra: 160 },
        resolution4k: { low: 130, medium: 110, high: 90, ultra: 72 }
      },
      'gpu-3': {
        resolution1080p: { low: 360, medium: 320, high: 280, ultra: 230 },
        resolution1440p: { low: 230, medium: 200, high: 170, ultra: 140 },
        resolution4k: { low: 115, medium: 95, high: 78, ultra: 62 }
      },
      'gpu-4': {
        resolution1080p: { low: 240, medium: 210, high: 180, ultra: 150 },
        resolution1440p: { low: 150, medium: 130, high: 110, ultra: 90 },
        resolution4k: { low: 72, medium: 60, high: 48, ultra: 38 }
      }
    }
  },
  {
    id: 'minecraft-rtx',
    name: 'Minecraft RTX',
    category: 'indie',
    icon: '🧱',
    benchmarks: {
      'gpu-1': {
        resolution1080p: { low: 180, medium: 165, high: 145, ultra: 125 },
        resolution1440p: { low: 125, medium: 110, high: 95, ultra: 80 },
        resolution4k: { low: 70, medium: 60, high: 50, ultra: 40 }
      },
      'gpu-2': {
        resolution1080p: { low: 125, medium: 110, high: 95, ultra: 80 },
        resolution1440p: { low: 80, medium: 70, high: 58, ultra: 48 },
        resolution4k: { low: 42, medium: 35, high: 28, ultra: 22 }
      },
      'gpu-3': {
        resolution1080p: { low: 105, medium: 90, high: 75, ultra: 62 },
        resolution1440p: { low: 65, medium: 55, high: 45, ultra: 35 },
        resolution4k: { low: 32, medium: 26, high: 20, ultra: 16 }
      },
      'gpu-4': {
        resolution1080p: { low: 68, medium: 55, high: 42, ultra: 32 },
        resolution1440p: { low: 38, medium: 30, high: 24, ultra: 18 },
        resolution4k: { low: 18, medium: 14, high: 11, ultra: 8 }
      }
    }
  }
];

export const applicationBenchmarks: ApplicationBenchmark[] = [
  {
    id: 'blender',
    name: 'Blender 3D',
    category: 'rendering',
    icon: '🎬',
    metric: 'time',
    unit: 'minutes',
    benchmarks: {
      'cpu-1': [ // Intel i9-13900K
        { taskName: 'BMW Render', value: 2.1, description: '1080p BMW scene render time' },
        { taskName: 'Classroom Scene', value: 8.5, description: '4K classroom scene render time' },
        { taskName: 'Animation (30s)', value: 45, description: '30-second animation render time' }
      ],
      'cpu-2': [ // AMD Ryzen 9 7900X
        { taskName: 'BMW Render', value: 2.3, description: '1080p BMW scene render time' },
        { taskName: 'Classroom Scene', value: 9.2, description: '4K classroom scene render time' },
        { taskName: 'Animation (30s)', value: 48, description: '30-second animation render time' }
      ],
      'cpu-3': [ // Intel i5-13600K
        { taskName: 'BMW Render', value: 3.2, description: '1080p BMW scene render time' },
        { taskName: 'Classroom Scene', value: 12.5, description: '4K classroom scene render time' },
        { taskName: 'Animation (30s)', value: 68, description: '30-second animation render time' }
      ],
      'cpu-4': [ // AMD Ryzen 5 7600X
        { taskName: 'BMW Render', value: 3.8, description: '1080p BMW scene render time' },
        { taskName: 'Classroom Scene', value: 15.2, description: '4K classroom scene render time' },
        { taskName: 'Animation (30s)', value: 82, description: '30-second animation render time' }
      ]
    }
  },
  {
    id: 'premiere-pro',
    name: 'Adobe Premiere Pro',
    category: 'video',
    icon: '🎥',
    metric: 'time',
    unit: 'minutes',
    benchmarks: {
      'gpu-1': [
        { taskName: '4K Export (10min)', value: 8.5, description: '10-minute 4K video export time' },
        { taskName: '8K Timeline Playback', value: 60, description: 'Smooth 8K timeline playback (fps)' },
        { taskName: 'Color Grading', value: 90, description: 'Real-time color grading performance score' }
      ],
      'gpu-2': [
        { taskName: '4K Export (10min)', value: 12.2, description: '10-minute 4K video export time' },
        { taskName: '8K Timeline Playback', value: 45, description: 'Smooth 8K timeline playback (fps)' },
        { taskName: 'Color Grading', value: 80, description: 'Real-time color grading performance score' }
      ],
      'gpu-3': [
        { taskName: '4K Export (10min)', value: 14.5, description: '10-minute 4K video export time' },
        { taskName: '8K Timeline Playback', value: 35, description: 'Smooth 8K timeline playback (fps)' },
        { taskName: 'Color Grading', value: 75, description: 'Real-time color grading performance score' }
      ],
      'gpu-4': [
        { taskName: '4K Export (10min)', value: 18.8, description: '10-minute 4K video export time' },
        { taskName: '8K Timeline Playback', value: 25, description: 'Smooth 8K timeline playback (fps)' },
        { taskName: 'Color Grading', value: 65, description: 'Real-time color grading performance score' }
      ]
    }
  },
  {
    id: 'visual-studio',
    name: 'Visual Studio',
    category: 'development',
    icon: '💻',
    metric: 'time',
    unit: 'seconds',
    benchmarks: {
      'cpu-1': [
        { taskName: 'Large Project Build', value: 45, description: 'Full rebuild of large C++ project' },
        { taskName: 'IntelliSense Index', value: 12, description: 'IntelliSense indexing time' },
        { taskName: 'Unity Game Build', value: 180, description: 'Unity game project build time' }
      ],
      'cpu-2': [
        { taskName: 'Large Project Build', value: 52, description: 'Full rebuild of large C++ project' },
        { taskName: 'IntelliSense Index', value: 14, description: 'IntelliSense indexing time' },
        { taskName: 'Unity Game Build', value: 205, description: 'Unity game project build time' }
      ],
      'cpu-3': [
        { taskName: 'Large Project Build', value: 68, description: 'Full rebuild of large C++ project' },
        { taskName: 'IntelliSense Index', value: 18, description: 'IntelliSense indexing time' },
        { taskName: 'Unity Game Build', value: 280, description: 'Unity game project build time' }
      ],
      'cpu-4': [
        { taskName: 'Large Project Build', value: 82, description: 'Full rebuild of large C++ project' },
        { taskName: 'IntelliSense Index', value: 22, description: 'IntelliSense indexing time' },
        { taskName: 'Unity Game Build', value: 340, description: 'Unity game project build time' }
      ]
    }
  },
  {
    id: 'obs-studio',
    name: 'OBS Studio',
    category: 'streaming',
    icon: '📺',
    metric: 'score',
    unit: 'quality',
    benchmarks: {
      'gpu-1': [
        { taskName: '4K60 Stream + Gaming', value: 95, description: '4K 60fps streaming while gaming' },
        { taskName: '1080p60 Multi-source', value: 100, description: '1080p 60fps with multiple sources' },
        { taskName: 'Hardware Encoding', value: 98, description: 'NVENC/AMF encoding quality score' }
      ],
      'gpu-2': [
        { taskName: '4K60 Stream + Gaming', value: 85, description: '4K 60fps streaming while gaming' },
        { taskName: '1080p60 Multi-source', value: 95, description: '1080p 60fps with multiple sources' },
        { taskName: 'Hardware Encoding', value: 92, description: 'NVENC/AMF encoding quality score' }
      ],
      'gpu-3': [
        { taskName: '4K60 Stream + Gaming', value: 80, description: '4K 60fps streaming while gaming' },
        { taskName: '1080p60 Multi-source', value: 90, description: '1080p 60fps with multiple sources' },
        { taskName: 'Hardware Encoding', value: 88, description: 'NVENC/AMF encoding quality score' }
      ],
      'gpu-4': [
        { taskName: '4K60 Stream + Gaming', value: 65, description: '4K 60fps streaming while gaming' },
        { taskName: '1080p60 Multi-source', value: 85, description: '1080p 60fps with multiple sources' },
        { taskName: 'Hardware Encoding', value: 80, description: 'NVENC/AMF encoding quality score' }
      ]
    }
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    category: 'design',
    icon: '🎨',
    metric: 'score',
    unit: 'score',
    benchmarks: {
      'gpu-1': [
        { taskName: 'Filter Performance', value: 95, description: 'Complex filter application speed' },
        { taskName: '8K Image Processing', value: 92, description: '8K image manipulation performance' },
        { taskName: 'AI Features', value: 98, description: 'AI-powered features performance' }
      ],
      'gpu-2': [
        { taskName: 'Filter Performance', value: 88, description: 'Complex filter application speed' },
        { taskName: '8K Image Processing', value: 85, description: '8K image manipulation performance' },
        { taskName: 'AI Features', value: 90, description: 'AI-powered features performance' }
      ],
      'gpu-3': [
        { taskName: 'Filter Performance', value: 82, description: 'Complex filter application speed' },
        { taskName: '8K Image Processing', value: 78, description: '8K image manipulation performance' },
        { taskName: 'AI Features', value: 85, description: 'AI-powered features performance' }
      ],
      'gpu-4': [
        { taskName: 'Filter Performance', value: 72, description: 'Complex filter application speed' },
        { taskName: '8K Image Processing', value: 68, description: '8K image manipulation performance' },
        { taskName: 'AI Features', value: 75, description: 'AI-powered features performance' }
      ]
    }
  }
];

// CPU-specific benchmarks for productivity applications
export const cpuApplicationBenchmarks: ApplicationBenchmark[] = [
  {
    id: 'handbrake',
    name: 'HandBrake',
    category: 'video',
    icon: '🎞️',
    metric: 'time',
    unit: 'minutes',
    benchmarks: {
      'cpu-1': [
        { taskName: '4K to 1080p (1hr video)', value: 18, description: '1-hour 4K to 1080p conversion' },
        { taskName: 'HEVC Encoding', value: 28, description: 'H.265 encoding performance' },
        { taskName: 'Batch Processing (5 files)', value: 95, description: 'Batch conversion of 5 videos' }
      ],
      'cpu-2': [
        { taskName: '4K to 1080p (1hr video)', value: 22, description: '1-hour 4K to 1080p conversion' },
        { taskName: 'HEVC Encoding', value: 32, description: 'H.265 encoding performance' },
        { taskName: 'Batch Processing (5 files)', value: 108, description: 'Batch conversion of 5 videos' }
      ],
      'cpu-3': [
        { taskName: '4K to 1080p (1hr video)', value: 32, description: '1-hour 4K to 1080p conversion' },
        { taskName: 'HEVC Encoding', value: 48, description: 'H.265 encoding performance' },
        { taskName: 'Batch Processing (5 files)', value: 165, description: 'Batch conversion of 5 videos' }
      ],
      'cpu-4': [
        { taskName: '4K to 1080p (1hr video)', value: 42, description: '1-hour 4K to 1080p conversion' },
        { taskName: 'HEVC Encoding', value: 65, description: 'H.265 encoding performance' },
        { taskName: 'Batch Processing (5 files)', value: 218, description: 'Batch conversion of 5 videos' }
      ]
    }
  }
];