import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

interface TransformedGamePerformance {
  gameId: string;
  name: string;
  category: string;
  icon: string;
  fps1080p: number;
  fps1440p: number;
  fps4k: number;
  averageFps: number;
  playabilityRating: string;
  requirements: string;
  fps: any;
}

interface GameBenchmarksPageProps {
  gamePerformances: TransformedGamePerformance[];
  onBack: () => void;
}

function getFpsColor(fps: number): string {
  if (fps >= 120) return 'text-green-600';
  if (fps >= 60)  return 'text-blue-600';
  if (fps >= 30)  return 'text-yellow-600';
  return 'text-red-600';
}

function getRatingBadgeVariant(rating: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (rating.includes('Excellent') || rating.includes('Competitive')) return 'default';
  if (rating.includes('Great') || rating.includes('Good')) return 'secondary';
  if (rating.includes('Poor')) return 'destructive';
  return 'outline';
}

export function GameBenchmarksPage({ gamePerformances, onBack }: GameBenchmarksPageProps) {
  if (gamePerformances.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Builder
          </Button>
          <h2 className="text-xl font-semibold">Game Benchmarks</h2>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Select a GPU to see game benchmarks.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Builder
        </Button>
        <h2 className="text-xl font-semibold">Game Benchmarks</h2>
        <Badge variant="secondary">{gamePerformances.length} games</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {gamePerformances.map((game) => (
          <Card key={game.gameId}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{game.icon}</span>
                  {game.name}
                </CardTitle>
                <Badge variant={getRatingBadgeVariant(game.playabilityRating)}>
                  {game.playabilityRating}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs capitalize">{game.category}</Badge>
                <Badge variant="outline" className="text-xs">{game.requirements} Req.</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: '1080p High', fps: game.fps1080p },
                { label: '1440p High', fps: game.fps1440p },
                { label: '4K High',    fps: game.fps4k    },
              ].map(({ label, fps }) => (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className={`font-semibold tabular-nums ${getFpsColor(fps)}`}>{fps} FPS</span>
                  </div>
                  <Progress value={Math.min(100, (fps / 144) * 100)} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
