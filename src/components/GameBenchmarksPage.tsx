import { ArrowLeft, Gamepad2, Monitor, TrendingUp, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface GameBenchmarksPageProps {
  gamePerformances: any[];
  onBack: () => void;
}

export function GameBenchmarksPage({ gamePerformances, onBack }: GameBenchmarksPageProps) {
  const getPerformanceColor = (fps: number) => {
    if (fps >= 120) return 'text-green-600';
    if (fps >= 60) return 'text-blue-600';
    if (fps >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceLabel = (fps: number) => {
    if (fps >= 120) return 'Excellent';
    if (fps >= 60) return 'Good';
    if (fps >= 30) return 'Playable';
    return 'Poor';
  };

  const getProgressColor = (fps: number) => {
    if (fps >= 120) return 'bg-green-600';
    if (fps >= 60) return 'bg-blue-600';
    if (fps >= 30) return 'bg-yellow-600';
    return 'bg-red-600';
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
            <h3 className="mb-2">No Gaming Components Selected</h3>
            <p className="text-muted-foreground">
              Add a CPU and GPU to see game performance benchmarks
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Gamepad2 className="w-6 h-6 text-primary" />
              Game Benchmarks
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-world gaming performance across {gamePerformances.length} popular titles
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {gamePerformances.length} Games Tested
        </Badge>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average 1080p</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(
              gamePerformances.reduce((sum, g) => sum + g.fps1080p, 0) / gamePerformances.length
            )}`}>
              {Math.round(gamePerformances.reduce((sum, g) => sum + g.fps1080p, 0) / gamePerformances.length)} FPS
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {getPerformanceLabel(gamePerformances.reduce((sum, g) => sum + g.fps1080p, 0) / gamePerformances.length)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average 1440p</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(
              gamePerformances.reduce((sum, g) => sum + g.fps1440p, 0) / gamePerformances.length
            )}`}>
              {Math.round(gamePerformances.reduce((sum, g) => sum + g.fps1440p, 0) / gamePerformances.length)} FPS
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {getPerformanceLabel(gamePerformances.reduce((sum, g) => sum + g.fps1440p, 0) / gamePerformances.length)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average 4K</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(
              gamePerformances.reduce((sum, g) => sum + g.fps4k, 0) / gamePerformances.length
            )}`}>
              {Math.round(gamePerformances.reduce((sum, g) => sum + g.fps4k, 0) / gamePerformances.length)} FPS
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {getPerformanceLabel(gamePerformances.reduce((sum, g) => sum + g.fps4k, 0) / gamePerformances.length)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FPS Reference Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="w-4 h-4" />
            FPS Performance Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
              <p className="font-medium text-green-600">120+ FPS</p>
              <p className="text-xs text-muted-foreground mt-1">Excellent - High refresh rate gaming</p>
            </div>
            <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
              <p className="font-medium text-blue-600">60-120 FPS</p>
              <p className="text-xs text-muted-foreground mt-1">Good - Smooth gameplay</p>
            </div>
            <div className="p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
              <p className="font-medium text-yellow-600">30-60 FPS</p>
              <p className="text-xs text-muted-foreground mt-1">Playable - Acceptable</p>
            </div>
            <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg">
              <p className="font-medium text-red-600">&lt;30 FPS</p>
              <p className="text-xs text-muted-foreground mt-1">Poor - Needs upgrade</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Game Benchmarks */}
      <div className="space-y-4">
        {gamePerformances.map((game) => (
          <Card key={game.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{game.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{game.category}</p>
                </div>
                <Badge variant="outline">
                  {game.requirements}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="1080p" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="1080p">1080p</TabsTrigger>
                  <TabsTrigger value="1440p">1440p</TabsTrigger>
                  <TabsTrigger value="4k">4K</TabsTrigger>
                </TabsList>
                
                <TabsContent value="1080p" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">1920x1080</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-semibold ${getPerformanceColor(game.fps1080p)}`}>
                        {Math.round(game.fps1080p)} FPS
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getPerformanceLabel(game.fps1080p)}
                      </p>
                    </div>
                  </div>
                  <Progress value={(game.fps1080p / 240) * 100} className={getProgressColor(game.fps1080p)} />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Min FPS</p>
                      <p className="font-medium">{Math.round(game.fps1080p * 0.8)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg FPS</p>
                      <p className="font-medium">{Math.round(game.fps1080p)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max FPS</p>
                      <p className="font-medium">{Math.round(game.fps1080p * 1.15)}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="1440p" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">2560x1440</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-semibold ${getPerformanceColor(game.fps1440p)}`}>
                        {Math.round(game.fps1440p)} FPS
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getPerformanceLabel(game.fps1440p)}
                      </p>
                    </div>
                  </div>
                  <Progress value={(game.fps1440p / 240) * 100} className={getProgressColor(game.fps1440p)} />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Min FPS</p>
                      <p className="font-medium">{Math.round(game.fps1440p * 0.8)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg FPS</p>
                      <p className="font-medium">{Math.round(game.fps1440p)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max FPS</p>
                      <p className="font-medium">{Math.round(game.fps1440p * 1.15)}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="4k" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">3840x2160</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-semibold ${getPerformanceColor(game.fps4k)}`}>
                        {Math.round(game.fps4k)} FPS
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getPerformanceLabel(game.fps4k)}
                      </p>
                    </div>
                  </div>
                  <Progress value={(game.fps4k / 240) * 100} className={getProgressColor(game.fps4k)} />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Min FPS</p>
                      <p className="font-medium">{Math.round(game.fps4k * 0.8)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg FPS</p>
                      <p className="font-medium">{Math.round(game.fps4k)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max FPS</p>
                      <p className="font-medium">{Math.round(game.fps4k * 1.15)}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
