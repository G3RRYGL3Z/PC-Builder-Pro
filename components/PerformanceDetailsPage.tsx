import { ArrowLeft, TrendingUp, Gamepad2, Video, Code, Zap, Cpu, Monitor, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

interface PerformanceData {
  overall: number;
  efficiency: number;
  powerEfficiency: number;
  thermal: number;
  memoryBandwidth: number;
  storageSpeed: number;
  gaming: {
    averageFps: number;
    fps1080p: number;
    fps1440p: number;
    fps4k: number;
  };
  productivity: {
    overall: number;
    rendering: number;
    modeling: number;
    compilation: number;
    streaming: number;
  };
}

interface Contribution {
  component: string;
  gamingContribution: number;
  productivityContribution: number;
  bottleneck?: string;
  status: 'optimal' | 'adequate' | 'bottleneck';
}

interface PerformanceDetailsPageProps {
  performance: PerformanceData;
  contributions: Contribution[];
  onBack: () => void;
}

function getScoreColor(score: number): string {
  if (score <= 0)  return 'text-muted-foreground';
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 60) return 'text-orange-600';
  return 'text-red-600';
}

function getRating(score: number): string {
  if (score <= 0)  return 'N/A';
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Poor';
}

const componentNames: Record<string, string> = {
  processor: 'CPU', gpu: 'GPU', memory: 'RAM', storage: 'Storage'
};

export function PerformanceDetailsPage({ performance, contributions, onBack }: PerformanceDetailsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Builder
        </Button>
        <h2 className="text-xl font-semibold">Performance Analysis</h2>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <span className={`text-5xl font-bold ${getScoreColor(performance.overall)}`}>
              {Math.round(performance.overall)}
            </span>
            <span className="text-xl text-muted-foreground">/100</span>
            <p className="mt-2">
              <Badge variant="secondary">{getRating(performance.overall)} Performance</Badge>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Efficiency',        score: performance.efficiency,        icon: Zap     },
              { label: 'Power Efficiency',   score: performance.powerEfficiency,   icon: Zap     },
              { label: 'Thermal',            score: performance.thermal,           icon: Target  },
              { label: 'Memory Bandwidth',   score: performance.memoryBandwidth,   icon: Monitor },
            ].map(({ label, score, icon: Icon }) => (
              <div key={label} className="text-center p-3 bg-muted rounded-lg">
                <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className={`text-lg font-semibold ${getScoreColor(score)}`}>{Math.round(score)}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gaming */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-primary" /> Gaming Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: '1080p', score: performance.gaming.fps1080p },
            { label: '1440p', score: performance.gaming.fps1440p },
            { label: '4K',    score: performance.gaming.fps4k    },
          ].map(({ label, score }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{label} Gaming</span>
                <span className={`font-semibold ${getScoreColor(score)}`}>{Math.round(score)}/100</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Productivity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" /> Productivity Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Video Editing', score: performance.productivity.rendering,   icon: Video   },
            { label: '3D Modeling',   score: performance.productivity.modeling,     icon: Monitor },
            { label: 'Compilation',   score: performance.productivity.compilation, icon: Code    },
            { label: 'Streaming',     score: performance.productivity.streaming,   icon: Zap     },
          ].map(({ label, score, icon: Icon }) => (
            <div key={label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" /> {label}
                </div>
                <span className={`font-semibold ${getScoreColor(score)}`}>{Math.round(score)}/100</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Component Contributions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" /> Component Contributions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {contributions.map((c) => {
            const avg = Math.round((c.gamingContribution + c.productivityContribution) / 2);
            return (
              <div key={c.component} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{componentNames[c.component] ?? c.component}</span>
                    <Badge
                      variant={c.status === 'bottleneck' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {c.status === 'optimal' ? '✓ Optimal' : c.status === 'adequate' ? '~ Adequate' : '⚠ Bottleneck'}
                    </Badge>
                  </div>
                  <span className="font-medium tabular-nums">{avg}/100</span>
                </div>
                <Progress value={avg} className="h-2" />
                {c.bottleneck && <p className="text-xs text-destructive">{c.bottleneck}</p>}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
