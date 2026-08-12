import { ArrowLeft, Gamepad2, Monitor, Info, CheckCircle, XCircle, ListChecks, Crosshair, Shield, Trophy, Zap, Flame, Swords, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface TransformedGamePerformance {
  gameId: string;
  name: string;
  category: string;
  icon?: string;
  fps1080p?: number;
  fps1440p?: number;
  fps4k?: number;
  averageFps?: number;
  playabilityRating?: string;
  requirements?: string;
  fps?: any;
}

interface GameBenchmarksPageProps {
  gamePerformances: TransformedGamePerformance[];
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Builder
          </Button>
          <h2 className="text-xl font-semibold">Game Benchmarks</h2>
          <Badge variant="secondary">{gamePerformances.length} games</Badge>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <span className={getPerformanceColor(overallAvg)}>
            Avg: {overallAvg} FPS
          </span>
        </Badge>
      </div>

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

          const met60Count = resolutions.filter((r) => r.fps >= 60).length;
          const mainRating = game.playabilityRating || getPerformanceLabel(gameAverage);

          return (
            <Card key={game.name || game.gameId} className="overflow-hidden border">
              <CardHeader className="bg-muted/20 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold">{game.name}</CardTitle>
                        <Badge variant="outline" className="text-xs capitalize">{game.category}</Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <ListChecks className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{met60Count} of 3 resolutions above 60 FPS</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-bold ${getPerformanceColor(gameAverage)}`}>
                        {gameAverage} FPS
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {mainRating}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-primary" /> Resolution Performance
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {resolutions.map((res) => {
                      const passed = res.fps >= 60;
                      const avgFps = Math.round(res.fps);

                      return (
                        <div
                          key={res.name}
                          className={`p-3 rounded-lg border flex flex-col justify-between ${
                            passed
                              ? 'bg-emerald-500/5 border-emerald-500/25'
                              : res.fps >= 30
                                ? 'bg-amber-500/5 border-amber-500/20'
                                : 'bg-destructive/5 border-destructive/20'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {passed ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="text-sm font-semibold">{res.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{res.resolution}</p>
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Avg FPS</span>
                            <span className={`font-bold ${getPerformanceColor(avgFps)}`}>
                              {avgFps} FPS
                            </span>
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
                    <strong className="text-foreground font-medium">Game Notes:</strong>{' '}
                    {`Tested on High graphics settings. ${game.name} averages ${fps1080} FPS at 1080p, ${fps1440} FPS at 1440p, and ${fps4kVal} FPS at 4K.`}
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

