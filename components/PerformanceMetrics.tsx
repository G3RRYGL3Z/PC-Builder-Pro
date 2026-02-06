import { Monitor, Cpu, TrendingUp, Target, Gamepad2, Video, Code, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { GameBenchmarks } from './GameBenchmarks';

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

interface PerformanceMetricsProps {
  performance: PerformanceMetrics;
  contributions: ComponentPerformanceContribution[];
  gamePerformances: GamePerformance[];
  applicationPerformances: ApplicationPerformance[];
  selectedCount: number;
}

const componentNames: Record<string, string> = {
  'processor': 'CPU',
  'gpu': 'GPU',
  'memory': 'RAM',
  'storage': 'Storage'
};

const componentIcons: Record<string, any> = {
  'processor': Cpu,
  'gpu': Monitor,
  'memory': Zap,
  'storage': Target
};

export function PerformanceMetrics({ 
  performance, 
  contributions, 
  gamePerformances, 
  applicationPerformances, 
  selectedCount 
}: PerformanceMetricsProps) {
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceRating = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const estimateFrameRates = (score: number, resolution: string) => {
    const baseMultiplier = score / 100;
    const resolutionMultipliers = {
      '1080p': 1.0,
      '1440p': 0.65,
      '4k': 0.35
    };
    const multiplier = resolutionMultipliers[resolution as keyof typeof resolutionMultipliers] || 1.0;
    const baseFps = 144 * baseMultiplier * multiplier;
    
    return {
      high: Math.round(baseFps),
      medium: Math.round(baseFps * 1.2),
      low: Math.round(baseFps * 1.4)
    };
  };

  if (selectedCount < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select CPU and GPU to see performance estimates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Performance Metrics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="gaming">Gaming</TabsTrigger>
              <TabsTrigger value="productivity">Productivity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Overall Performance Score */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-semibold">{Math.round(performance.overall)}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${getPerformanceColor(performance.overall)} bg-transparent`}
                >
                  {getPerformanceRating(performance.overall)} Performance
                </Badge>
              </div>

              <Separator />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Gamepad2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Gaming</span>
                  </div>
                  <div className={`text-lg font-semibold ${getPerformanceColor(performance.gaming.averageFps)}`}>
                    {Math.round(performance.gaming.averageFps)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Video className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Productivity</span>
                  </div>
                  <div className={`text-lg font-semibold ${getPerformanceColor(performance.productivity.overall)}`}>
                    {Math.round(performance.productivity.overall)}
                  </div>
                </div>
              </div>

              {/* Component Contributions */}
              <div className="space-y-3">
                <h4 className="font-medium">Component Performance Impact</h4>
                {contributions.map((contrib) => {
                  const IconComponent = componentIcons[contrib.component];
                  const avgContribution = (contrib.gamingContribution + contrib.productivityContribution) / 2;
                  
                  return (
                    <div key={contrib.component} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {IconComponent && <IconComponent className="w-4 h-4 text-primary" />}
                          <span>{componentNames[contrib.component]}</span>
                        </div>
                        <span className="font-medium">{Math.round(avgContribution)}%</span>
                      </div>
                      <Progress value={avgContribution} className="h-2" />
                      {contrib.bottleneck && (
                        <p className="text-xs text-destructive">{contrib.bottleneck}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="gaming" className="space-y-4 mt-4">
              {/* Gaming Performance by Resolution */}
              <div className="space-y-4">
                {[
                  { res: '1080p', score: performance.gaming.resolution1080p, label: '1920×1080' },
                  { res: '1440p', score: performance.gaming.resolution1440p, label: '2560×1440' },
                  { res: '4k', score: performance.gaming.resolution4k, label: '3840×2160' }
                ].map(({ res, score, label }) => {
                  const frameRates = estimateFrameRates(score, res);
                  
                  return (
                    <div key={res} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{label} Gaming</h4>
                          <p className="text-sm text-muted-foreground">Estimated performance</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-semibold ${getPerformanceColor(score)}`}>
                            {Math.round(score)}/100
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {getPerformanceRating(score)}
                          </Badge>
                        </div>
                      </div>
                      
                      <Progress value={score} className="h-3" />
                      
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-medium">{frameRates.high} FPS</div>
                          <div className="text-muted-foreground">High Settings</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-medium">{frameRates.medium} FPS</div>
                          <div className="text-muted-foreground">Medium Settings</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-medium">{frameRates.low} FPS</div>
                          <div className="text-muted-foreground">Low Settings</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="productivity" className="space-y-4 mt-4">
              {/* Productivity Tasks */}
              <div className="space-y-4">
                {[
                  { task: 'videoEditing', score: performance.productivity.videoEditing, label: 'Video Editing', icon: Video },
                  { task: 'rendering3d', score: performance.productivity.rendering3d, label: '3D Rendering', icon: Monitor },
                  { task: 'programming', score: performance.productivity.programming, label: 'Programming', icon: Code },
                  { task: 'streaming', score: performance.productivity.streaming, label: 'Live Streaming', icon: Zap }
                ].map(({ task, score, label, icon: IconComponent }) => (
                  <div key={task} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-primary" />
                        <span className="font-medium">{label}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-semibold ${getPerformanceColor(score)}`}>
                          {Math.round(score)}/100
                        </span>
                      </div>
                    </div>
                    <Progress value={score} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {getPerformanceRating(score)} performance for {label.toLowerCase()}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Game Benchmarks Card */}
      <GameBenchmarks 
        gamePerformances={gamePerformances}
        applicationPerformances={applicationPerformances}
        selectedCount={selectedCount}
      />
    </div>
  );
}