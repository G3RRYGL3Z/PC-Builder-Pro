import { ArrowLeft, TrendingUp, Cpu, MonitorSpeaker, MemoryStick, HardDrive, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface ComponentPerformanceContribution {
  component: string;
  gamingContribution: number;
  productivityContribution: number;
  bottleneck?: string;
}

interface PerformanceDetailsPageProps {
  performance: any;
  contributions: ComponentPerformanceContribution[];
  onBack: () => void;
}

export function PerformanceDetailsPage({ performance, contributions, onBack }: PerformanceDetailsPageProps) {
  // Transform contributions array to object format expected by the UI
  const transformedContributions = contributions.reduce((acc, contrib) => {
    const averageScore = (contrib.gamingContribution + contrib.productivityContribution) / 2;
    acc[contrib.component] = {
      name: contrib.component.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      score: averageScore,
      bottleneck: contrib.bottleneck !== undefined,
      notes: contrib.bottleneck || (averageScore >= 80 ? 'Performing optimally' : averageScore >= 60 ? 'Adequate performance' : 'May be bottlenecking system')
    };
    return acc;
  }, {} as Record<string, any>);

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 80) return 'bg-blue-600';
    if (score >= 70) return 'bg-yellow-600';
    if (score >= 60) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const componentIcons: { [key: string]: any } = {
    processor: Cpu,
    gpu: MonitorSpeaker,
    memory: MemoryStick,
    storage: HardDrive,
    'power-supply': Zap,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Builder
          </Button>
          <div>
            <h1 className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Performance Analysis
            </h1>
            <p className="text-sm text-muted-foreground">
              Detailed performance breakdown of your build
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <span className={getPerformanceColor(performance.overall)}>
            Overall: {Math.round(performance.overall)}/100
          </span>
        </Badge>
      </div>

      {/* Overall Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gaming Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={`text-3xl font-semibold ${getPerformanceColor(performance.gaming.averageFps)}`}>
                {Math.round(performance.gaming.averageFps)} FPS
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>1080p</span>
                  <span className="font-medium">{Math.round(performance.gaming.fps1080p)} FPS</span>
                </div>
                <Progress value={(performance.gaming.fps1080p / 240) * 100} className={getProgressColor(performance.gaming.fps1080p)} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>1440p</span>
                  <span className="font-medium">{Math.round(performance.gaming.fps1440p)} FPS</span>
                </div>
                <Progress value={(performance.gaming.fps1440p / 240) * 100} className={getProgressColor(performance.gaming.fps1440p)} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>4K</span>
                  <span className="font-medium">{Math.round(performance.gaming.fps4k)} FPS</span>
                </div>
                <Progress value={(performance.gaming.fps4k / 240) * 100} className={getProgressColor(performance.gaming.fps4k)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Productivity Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={`text-3xl font-semibold ${getPerformanceColor(performance.productivity.overall)}`}>
                {Math.round(performance.productivity.overall)}/100
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Video Rendering</span>
                  <span className="font-medium">{Math.round(performance.productivity.rendering)}/100</span>
                </div>
                <Progress value={performance.productivity.rendering} className={getProgressColor(performance.productivity.rendering)} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>3D Modeling</span>
                  <span className="font-medium">{Math.round(performance.productivity.modeling)}/100</span>
                </div>
                <Progress value={performance.productivity.modeling} className={getProgressColor(performance.productivity.modeling)} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Code Compilation</span>
                  <span className="font-medium">{Math.round(performance.productivity.compilation)}/100</span>
                </div>
                <Progress value={performance.productivity.compilation} className={getProgressColor(performance.productivity.compilation)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={`text-3xl font-semibold ${getPerformanceColor(performance.efficiency)}`}>
                {Math.round(performance.efficiency)}/100
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Power Efficiency</span>
                  <span className="font-medium">{Math.round(performance.powerEfficiency || 85)}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thermal Performance</span>
                  <span className="font-medium">{Math.round(performance.thermal || 88)}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Memory Bandwidth</span>
                  <span className="font-medium">{Math.round(performance.memoryBandwidth || 92)}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage Speed</span>
                  <span className="font-medium">{Math.round(performance.storageSpeed || 90)}/100</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Component Contributions */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Contributions by Component</CardTitle>
          <p className="text-sm text-muted-foreground">
            How each component contributes to overall system performance
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(transformedContributions).map(([component, data]: [string, any]) => {
              const Icon = componentIcons[component] || Cpu;
              return (
                <div key={component} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {component.replace('-', ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {data.name || 'Not selected'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${getPerformanceColor(data.score)}`}>
                        {Math.round(data.score)}/100
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {data.bottleneck ? '⚠️ Bottleneck' : '✓ Optimal'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress 
                      value={data.score} 
                      className={getProgressColor(data.score)}
                    />
                    {data.notes && (
                      <p className="text-xs text-muted-foreground">{data.notes}</p>
                    )}
                  </div>
                  <Separator className="mt-3" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Optimization Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Balance Your Build</p>
                <p className="text-sm text-muted-foreground">
                  Ensure no single component bottlenecks your system. Aim for similar performance scores across all components.
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Power Supply Headroom</p>
                <p className="text-sm text-muted-foreground">
                  Your PSU should have 20-30% headroom above your system's total power draw for optimal efficiency and longevity.
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
              <MemoryStick className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Memory Speed Matters</p>
                <p className="text-sm text-muted-foreground">
                  Modern CPUs benefit significantly from faster RAM. Consider high-speed memory (3200MHz+) for best results.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
