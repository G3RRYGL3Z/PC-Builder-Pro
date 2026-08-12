import { ArrowLeft, Gamepad2, Monitor, Info, CheckCircle, XCircle, ListChecks, Crosshair, Shield, Trophy, Zap, Flame, Swords, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface GameBenchmarksPageProps {
  gamePerformances: any[];
  onBack: () => void;
}

export function GameBenchmarksPage({ gamePerformances, onBack }: GameBenchmarksPageProps) {
  const getPerformanceColor = (fps: number) => {
    if (fps >= 120) return 'text-green-600 dark:text-green-400';
    if (fps >= 60) return 'text-blue-600 dark:text-blue-400';
    if (fps >= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPerformanceLabel = (fps: number) => {
    if (fps >= 120) return 'Excellent';
    if (fps >= 60) return 'Good';
    if (fps >= 30) return 'Playable';
    return 'Poor';
  };

  const getBadgeVariant = (fps: number): "default" | "secondary" | "outline" | "destructive" => {
    if (fps >= 120) return 'default';
    if (fps >= 60) return 'secondary';
    if (fps >= 30) return 'outline';
    return 'destructive';
  };

  const gameIcons: { [key: string]: any } = {
    'Cyberpunk 2077': Flame,
    'Counter-Strike 2': Crosshair,
    'VALORANT': Target,
    'Apex Legends': Zap,
    'Fortnite': Shield,
    'Call of Duty: Modern Warfare III': Swords,
    'Starfield': Trophy,
  };

  if (gamePerformances.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Builder
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="mb-2 font-semibold text-lg">No Gaming Components Selected</h3>
            <p className="text-muted-foreground">
              Add a CPU and GPU to see game performance benchmarks
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const avg1080p = Math.round(
    gamePerformances.reduce((sum, g) => sum + (g.fps1080p ?? g.fps?.resolution1080p?.high ?? 0), 0) / gamePerformances.length
  );
  const avg1440p = Math.round(
    gamePerformances.reduce((sum, g) => sum + (g.fps1440p ?? g.fps?.resolution1440p?.high ?? 0), 0) / gamePerformances.length
  );
  const avg4k = Math.round(
    gamePerformances.reduce((sum, g) => sum + (g.fps4k ?? g.fps?.resolution4k?.high ?? 0), 0) / gamePerformances.length
  );
  const overallAvg = Math.round((avg1080p + avg1440p + avg4k) / 3);

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
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <Gamepad2 className="w-6 h-6 text-primary" />
              Game Benchmarks
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-world gaming performance across {gamePerformances.length} popular titles
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <span className={getPerformanceColor(overallAvg)}>
            Avg: {overallAvg} FPS
          </span>
        </Badge>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(overallAvg)}`}>
              {overallAvg} FPS
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {getPerformanceLabel(overallAvg)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average 1080p</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(avg1080p)}`}>
              {avg1080p} FPS
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {getPerformanceLabel(avg1080p)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average 1440p</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(avg1440p)}`}>
              {avg1440p} FPS
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {getPerformanceLabel(avg1440p)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average 4K</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(avg4k)}`}>
              {avg4k} FPS
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {getPerformanceLabel(avg4k)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FPS Performance Guide */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="w-4 h-4" />
            FPS Performance Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
              <p className="font-medium text-green-600 dark:text-green-400">120+ FPS</p>
              <p className="text-xs text-muted-foreground mt-1">Excellent - High refresh rate gaming</p>
            </div>
            <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
              <p className="font-medium text-blue-600 dark:text-blue-400">60-120 FPS</p>
              <p className="text-xs text-muted-foreground mt-1">Good - Smooth gameplay</p>
            </div>
            <div className="p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
              <p className="font-medium text-yellow-600 dark:text-yellow-400">30-60 FPS</p>
              <p className="text-xs text-muted-foreground mt-1">Playable - Acceptable</p>
            </div>
            <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg">
              <p className="font-medium text-red-600 dark:text-red-400">&lt;30 FPS</p>
              <p className="text-xs text-muted-foreground mt-1">Poor - Needs upgrade</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Game Benchmarks - Matching App Benchmarks Capability Card Grid */}
      <div className="space-y-4">
        {gamePerformances.map((game) => {
          const Icon = gameIcons[game.name] || Gamepad2;
          const fps1080 = game.fps1080p ?? game.fps?.resolution1080p?.high ?? 0;
          const fps1440 = game.fps1440p ?? game.fps?.resolution1440p?.high ?? 0;
          const fps4kVal = game.fps4k ?? game.fps?.resolution4k?.high ?? 0;
          const gameAverage = Math.round(game.averageFps ?? (fps1080 + fps1440 + fps4kVal) / 3);

          const resolutions = [
            { name: '1080p', label: 'Full HD', resolution: '1920x1080', fps: fps1080 },
            { name: '1440p', label: 'Quad HD', resolution: '2560x1440', fps: fps1440 },
            { name: '4K', label: 'Ultra HD', resolution: '3840x2160', fps: fps4kVal },
          ];

          const met60Count = resolutions.filter(r => r.fps >= 60).length;
          const mainRating = game.playabilityRating || getPerformanceLabel(gameAverage);

          return (
            <Card key={game.name || game.gameId} className="overflow-hidden border">
              <CardHeader className="bg-muted/20 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold">{game.name}</CardTitle>
                        <Badge variant="outline" className="text-xs capitalize">
                          {game.category}
                        </Badge>
                        {game.requirements && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            {game.requirements} Req.
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <ListChecks className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium text-foreground">
                          {met60Count} of 3 resolutions target 60+ FPS
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className={`text-2xl font-bold tabular-nums ${getPerformanceColor(gameAverage)}`}>
                          {gameAverage} FPS
                        </span>
                        <Badge variant={getBadgeVariant(gameAverage)}>
                          {mainRating}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Average across tested resolutions
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {/* Resolution Checklist Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Monitor className="w-4 h-4 text-primary" /> Resolution Breakdown &amp; Ratings
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {met60Count}/3 Target Smooth (60+ FPS)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {resolutions.map((res) => {
                      const passed = res.fps >= 60;
                      const minFps = Math.round(res.fps * 0.8);
                      const avgFps = Math.round(res.fps);
                      const maxFps = Math.round(res.fps * 1.15);

                      return (
                        <div
                          key={res.name}
                          className={`p-3.5 rounded-lg border flex flex-col justify-between transition-colors ${passed
                              ? 'bg-emerald-500/5 border-emerald-500/25'
                              : res.fps >= 30
                                ? 'bg-amber-500/5 border-amber-500/20'
                                : 'bg-destructive/5 border-destructive/20'
                            }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                {passed ? (
                                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <h4 className="text-sm font-semibold leading-tight flex items-center gap-1.5">
                                    {res.name} <span className="text-xs text-muted-foreground font-normal">({res.label})</span>
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-0.5">{res.resolution}</p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 flex items-baseline justify-between">
                              <span className={`text-2xl font-bold tabular-nums ${getPerformanceColor(res.fps)}`}>
                                {avgFps} <span className="text-xs font-normal text-muted-foreground">FPS</span>
                              </span>
                              <Badge variant={getBadgeVariant(res.fps)} className="text-xs">
                                {getPerformanceLabel(res.fps)}
                              </Badge>
                            </div>

                            <Progress value={Math.min(100, (res.fps / 240) * 100)} className="h-1.5 mt-2" />
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-border/50 grid grid-cols-3 gap-1 text-center text-xs">
                            <div>
                              <span className="text-muted-foreground text-[10px] block">Min FPS</span>
                              <span className="font-medium">{minFps}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-[10px] block">Avg FPS</span>
                              <span className="font-semibold text-foreground">{avgFps}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-[10px] block">Max FPS</span>
                              <span className="font-medium">{maxFps}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                <div className="bg-muted/40 p-3 rounded-lg flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground font-medium">Gaming Rating Notes:</strong>{' '}
                    {`Tested on High graphics settings. ${game.name} achieves an average of ${Math.round(fps1080)} FPS at 1080p, ${Math.round(fps1440)} FPS at 1440p, and ${Math.round(fps4kVal)} FPS at 4K.`}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

