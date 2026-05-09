import { Monitor, Cpu, TrendingUp, Target, Gamepad2, Video, Code, Zap, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { GameBenchmarks } from './GameBenchmarks';

// FIX: Import shared helpers from the utility so color/rating thresholds
// are defined in one place only. If you update them in performanceBenchmarking.ts
// they automatically apply here too.
import { getPerformanceRating, estimateFrameRates } from '../utils/performanceBenchmarking';

// ── Interfaces ─────────────────────────────────────────────────────────────

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
  // FIX: Added systemEfficiency — was missing from local interface,
  // causing TS to treat it as unknown and the UI to render NaN/100
  systemEfficiency: number;
  overall: number;
}

interface ComponentPerformanceContribution {
  component: string;
  gamingContribution: number;
  productivityContribution: number;
  bottleneck?: string;
  // FIX: Added explicit status field from updated analyzePerformanceBottlenecks().
  // Previously the UI derived "Optimal" from bottleneck === undefined,
  // which printed "Optimal" even when contribution scores were 16/100.
  status: 'optimal' | 'adequate' | 'bottleneck';
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

interface PerformanceMetricsProps {
  performance: PerformanceMetrics;
  contributions: ComponentPerformanceContribution[];
  gamePerformances: GamePerformance[];
  applicationPerformances: ApplicationPerformance[];
  selectedCount: number;
  onViewDetails?: () => void;
  onViewGameBenchmarks?: () => void;
  onViewApplicationBenchmarks?: () => void;
}

// ── Static maps ─────────────────────────────────────────────────────────────

const componentNames: Record<string, string> = {
  processor: 'CPU',
  gpu:       'GPU',
  memory:    'RAM',
  storage:   'Storage'
};

const componentIcons: Record<string, any> = {
  processor: Cpu,
  gpu:       Monitor,
  memory:    Zap,
  storage:   Target
};

// ── Color helper (local — display only, not shared with scoring logic) ──────

function getScoreColor(score: number): string {
  if (score <= 0)  return 'text-muted-foreground';
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 60) return 'text-orange-600';
  return 'text-red-600';
}

// FIX: Status badge helper — uses the explicit `status` field from
// analyzePerformanceBottlenecks() instead of deriving from undefined.
function getStatusBadge(status: ComponentPerformanceContribution['status']) {
  switch (status) {
    case 'optimal':
      return <Badge variant="outline" className="text-xs text-green-600 border-green-300">✓ Optimal</Badge>;
    case 'adequate':
      return <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">~ Adequate</Badge>;
    case 'bottleneck':
      return <Badge variant="destructive" className="text-xs">⚠ Bottleneck</Badge>;
  }
}

// ── Component ───────────────────────────────────────────────────────────────

export function PerformanceMetrics({
  performance,
  contributions,
  gamePerformances,
  applicationPerformances,
  selectedCount,
  onViewDetails,
  onViewGameBenchmarks,
  onViewApplicationBenchmarks
}: PerformanceMetricsProps) {

  // FIX: Guard — only show the panel when there's meaningful data to display.
  // Previously showed "Poor Performance" for builds with no CPU/GPU.
  const hasMeaningfulScore = performance.overall > 0;

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
            Select a CPU and GPU to see performance estimates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Main Performance Card ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Performance Analysis
            </CardTitle>
            {onViewDetails && (
              <Button variant="ghost" size="sm" onClick={onViewDetails} className="gap-1">
                View Details
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="gaming">Gaming</TabsTrigger>
              <TabsTrigger value="productivity">Productivity</TabsTrigger>
            </TabsList>

            {/* ── Overview Tab ─────────────────────────────────────────────── */}
            <TabsContent value="overview" className="space-y-4 mt-4">

              {/* Overall score */}
              <div className="text-center space-y-2">
                {hasMeaningfulScore ? (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-3xl font-semibold ${getScoreColor(performance.overall)}`}>
                        {Math.round(performance.overall)}
                      </span>
                      <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${getScoreColor(performance.overall)} bg-transparent`}
                    >
                      {/* FIX: Use imported getPerformanceRating from the utility */}
                      {getPerformanceRating(performance.overall).rating} Performance
                    </Badge>
                  </>
                ) : (
                  // FIX: Shows a helpful message instead of "0/100 Poor"
                  // when CPU or GPU is not yet selected
                  <p className="text-sm text-muted-foreground">
                    Add a CPU and GPU to calculate your overall score.
                  </p>
                )}
              </div>

              <Separator />

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Gamepad2 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">Gaming</span>
                  </div>
                  <div className={`text-lg font-semibold ${getScoreColor(performance.gaming.averageFps)}`}>
                    {/* FIX: show '—' instead of NaN — averageFps is now always a number */}
                    {performance.gaming.averageFps > 0 ? Math.round(performance.gaming.averageFps) : '—'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Video className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">Productivity</span>
                  </div>
                  <div className={`text-lg font-semibold ${getScoreColor(performance.productivity.overall)}`}>
                    {performance.productivity.overall > 0 ? Math.round(performance.productivity.overall) : '—'}
                  </div>
                </div>
                {/* FIX: System Efficiency — now reads from performance.systemEfficiency
                    instead of being computed inline (which produced NaN/100) */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">Efficiency</span>
                  </div>
                  <div className={`text-lg font-semibold ${getScoreColor(performance.systemEfficiency)}`}>
                    {performance.systemEfficiency > 0 ? Math.round(performance.systemEfficiency) : '—'}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Component contributions */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Performance by Component</h4>
                {contributions.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Select components to see their performance impact.
                  </p>
                ) : (
                  contributions.map((contrib) => {
                    const IconComponent = componentIcons[contrib.component];
                    const avgContribution = Math.round(
                      (contrib.gamingContribution + contrib.productivityContribution) / 2
                    );

                    return (
                      <div key={contrib.component} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {IconComponent && <IconComponent className="w-4 h-4 text-primary" />}
                            <span>{componentNames[contrib.component] ?? contrib.component}</span>
                            {/* FIX: Status badge now uses explicit `status` field.
                                No more "✓ Optimal" at 16/100. */}
                            {getStatusBadge(contrib.status)}
                          </div>
                          <span className="font-medium tabular-nums">
                            {avgContribution}/100
                          </span>
                        </div>
                        <Progress value={avgContribution} className="h-2" />
                        {contrib.bottleneck && (
                          <p className="text-xs text-destructive">{contrib.bottleneck}</p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* ── Gaming Tab ───────────────────────────────────────────────── */}
            <TabsContent value="gaming" className="space-y-4 mt-4">
              <div className="space-y-4">
                {[
                  { res: '1080p' as const, score: performance.gaming.resolution1080p, label: '1920×1080' },
                  { res: '1440p' as const, score: performance.gaming.resolution1440p, label: '2560×1440' },
                  { res: '4k'    as const, score: performance.gaming.resolution4k,    label: '3840×2160' }
                ].map(({ res, score, label }) => {
                  // FIX: Use the imported estimateFrameRates from performanceBenchmarking.ts
                  // so FPS numbers are consistent with the Game Benchmarks card below.
                  // The old inline version used a different formula (144 * baseMultiplier)
                  // producing different numbers than the utility's lookup table.
                  const frameRates = estimateFrameRates(score, res);

                  return (
                    <div key={res} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{label} Gaming</h4>
                          <p className="text-sm text-muted-foreground">Estimated performance</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-semibold ${getScoreColor(score)}`}>
                            {Math.round(score)}/100
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {getPerformanceRating(score).rating}
                          </Badge>
                        </div>
                      </div>

                      <Progress value={score} className="h-3" />

                      {score > 0 ? (
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          {(['ultra', 'high', 'medium', 'low'] as const).map((setting) => (
                            <div key={setting} className="text-center p-2 bg-muted rounded">
                              <div className="font-medium tabular-nums">
                                {frameRates[setting]} FPS
                              </div>
                              <div className="text-muted-foreground capitalize">{setting}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Add a CPU and GPU to see FPS estimates.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* ── Productivity Tab ─────────────────────────────────────────── */}
            <TabsContent value="productivity" className="space-y-4 mt-4">

              {/* FIX: Show System Efficiency here too — it was previously
                  computed inline in this tab and returning NaN/100 */}
              {hasMeaningfulScore && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">System Efficiency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${getScoreColor(performance.systemEfficiency)}`}>
                      {Math.round(performance.systemEfficiency)}/100
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {getPerformanceRating(performance.systemEfficiency).rating}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {[
                  { key: 'videoEditing', score: performance.productivity.videoEditing, label: 'Video Editing',  icon: Video   },
                  { key: 'rendering3d',  score: performance.productivity.rendering3d,  label: '3D Rendering',  icon: Monitor },
                  { key: 'programming',  score: performance.productivity.programming,  label: 'Programming',   icon: Code    },
                  { key: 'streaming',    score: performance.productivity.streaming,     label: 'Live Streaming', icon: Zap    }
                ].map(({ key, score, label, icon: IconComponent }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-primary" />
                        <span className="font-medium">{label}</span>
                      </div>
                      {/* FIX: Show '—' instead of '0/100' when no CPU is selected */}
                      <span className={`font-semibold ${getScoreColor(score)}`}>
                        {score > 0 ? `${Math.round(score)}/100` : '—'}
                      </span>
                    </div>
                    <Progress value={score} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {score > 0
                        ? `${getPerformanceRating(score).rating} performance for ${label.toLowerCase()}`
                        : `Add a CPU to estimate ${label.toLowerCase()} performance`
                      }
                    </p>
                  </div>
                ))}
              </div>

              {/* Productivity overall */}
              {hasMeaningfulScore && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Overall Productivity</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-semibold ${getScoreColor(performance.productivity.overall)}`}>
                        {Math.round(performance.productivity.overall)}/100
                      </span>
                      <Badge variant="secondary">
                        {getPerformanceRating(performance.productivity.overall).rating}
                      </Badge>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ── Game Benchmarks Card ─────────────────────────────────────────── */}
      <GameBenchmarks
        gamePerformances={gamePerformances}
        applicationPerformances={applicationPerformances}
        selectedCount={selectedCount}
        onViewGameBenchmarks={onViewGameBenchmarks}
        onViewApplicationBenchmarks={onViewApplicationBenchmarks}
      />
    </div>
  );
}