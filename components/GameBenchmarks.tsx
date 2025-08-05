import { useState } from 'react';
import { Gamepad2, Video, Code, Monitor, Clock, Award, TrendingUp, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

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

interface GameBenchmarksProps {
  gamePerformances: GamePerformance[];
  applicationPerformances: ApplicationPerformance[];
  selectedCount: number;
}

export function GameBenchmarks({ gamePerformances, applicationPerformances, selectedCount }: GameBenchmarksProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const getFpsColor = (fps: number, category: string) => {
    if (category === 'esports') {
      if (fps >= 240) return 'text-green-600';
      if (fps >= 144) return 'text-blue-600';
      if (fps >= 60) return 'text-yellow-600';
    } else {
      if (fps >= 100) return 'text-green-600';
      if (fps >= 60) return 'text-blue-600';
      if (fps >= 30) return 'text-yellow-600';
    }
    return 'text-red-600';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excellent': return 'text-green-600';
      case 'Great': case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'video': case 'rendering': return Video;
      case 'development': return Code;
      case 'streaming': case 'design': return Monitor;
      default: return TrendingUp;
    }
  };

  if (selectedCount < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-muted-foreground" />
            Game & Application Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select CPU and GPU to see detailed game and application performance data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-primary" />
          Game & Application Benchmarks
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-world performance data for popular games and professional applications
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Games ({gamePerformances.length})
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Applications ({applicationPerformances.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {gamePerformances.slice(0, 8).map((game) => (
                <Card 
                  key={game.gameId}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedGame === game.gameId ? 'ring-2 ring-primary border-primary' : ''
                  }`}
                  onClick={() => setSelectedGame(selectedGame === game.gameId ? null : game.gameId)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{game.icon}</span>
                        <div>
                          <h4 className="font-medium">{game.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {game.category.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${getFpsColor(game.averageFps, game.category)}`}>
                          {Math.round(game.averageFps)} FPS
                        </div>
                        <p className="text-xs text-muted-foreground">Average</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className={getRatingColor(game.playabilityRating)}>
                        {game.playabilityRating}
                      </Badge>
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        selectedGame === game.gameId ? 'rotate-90' : ''
                      }`} />
                    </div>

                    {selectedGame === game.gameId && (
                      <>
                        <Separator className="my-3" />
                        <div className="space-y-3">
                          {[
                            { res: '1080p', data: game.fps.resolution1080p, label: '1920×1080' },
                            { res: '1440p', data: game.fps.resolution1440p, label: '2560×1440' },
                            { res: '4k', data: game.fps.resolution4k, label: '3840×2160' }
                          ].map(({ res, data, label }) => (
                            <div key={res} className="space-y-2">
                              <h5 className="text-sm font-medium">{label}</h5>
                              <div className="grid grid-cols-4 gap-2 text-xs">
                                {(['low', 'medium', 'high', 'ultra'] as const).map(quality => (
                                  <div key={quality} className="text-center p-1 bg-muted rounded">
                                    <div className={`font-medium ${getFpsColor(data[quality], game.category)}`}>
                                      {data[quality]}
                                    </div>
                                    <div className="text-muted-foreground capitalize">
                                      {quality}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {gamePerformances.length > 8 && (
              <div className="text-center">
                <Button variant="outline" size="sm">
                  View All Games ({gamePerformances.length})
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {applicationPerformances.map((app) => {
                const IconComponent = getCategoryIcon(app.category);
                
                return (
                  <Card 
                    key={app.appId}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedApp === app.appId ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                    onClick={() => setSelectedApp(selectedApp === app.appId ? null : app.appId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-primary/10 rounded">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{app.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {app.category.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${getRatingColor(app.tasks[0]?.rating || 'Good')}`}>
                            {Math.round(app.overallScore)}
                          </div>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {app.tasks.length} benchmarks
                          </span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          selectedApp === app.appId ? 'rotate-90' : ''
                        }`} />
                      </div>

                      {selectedApp === app.appId && (
                        <>
                          <Separator className="my-3" />
                          <div className="space-y-3">
                            {app.tasks.map((task, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{task.taskName}</p>
                                  <p className="text-xs text-muted-foreground">{task.description}</p>
                                </div>
                                <div className="text-right">
                                  <div className={`text-sm font-medium ${getRatingColor(task.rating)}`}>
                                    {task.value} {app.unit}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {task.rating}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}