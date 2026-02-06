import { ArrowLeft, Video, Layers, Code, Image, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface ApplicationBenchmarksPageProps {
  applicationPerformances: any[];
  onBack: () => void;
}

export function ApplicationBenchmarksPage({ applicationPerformances, onBack }: ApplicationBenchmarksPageProps) {
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 80) return 'bg-blue-600';
    if (score >= 70) return 'bg-yellow-600';
    if (score >= 60) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const appIcons: { [key: string]: any } = {
    'Adobe Premiere Pro': Video,
    'DaVinci Resolve': Video,
    'Blender': Layers,
    'Cinema 4D': Layers,
    'Visual Studio Code': Code,
    'IntelliJ IDEA': Code,
    'Photoshop': Image,
    'After Effects': Video,
  };

  if (applicationPerformances.length === 0) {
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
            <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="mb-2">No Components Selected</h3>
            <p className="text-muted-foreground">
              Add components to see productivity application benchmarks
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const averageScore = Math.round(
    applicationPerformances.reduce((sum, app) => sum + app.score, 0) / applicationPerformances.length
  );

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
              <Video className="w-6 h-6 text-primary" />
              Application Benchmarks
            </h1>
            <p className="text-sm text-muted-foreground">
              Productivity and creative application performance across {applicationPerformances.length} apps
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <span className={getPerformanceColor(averageScore)}>
            Avg: {averageScore}/100
          </span>
        </Badge>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(averageScore)}`}>
              {averageScore}/100
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {getPerformanceLabel(averageScore)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Video Editing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(
              applicationPerformances.filter(app => app.category === 'Video Editing')
                .reduce((sum, app) => sum + app.score, 0) / 
              applicationPerformances.filter(app => app.category === 'Video Editing').length || 0
            )}`}>
              {Math.round(applicationPerformances.filter(app => app.category === 'Video Editing')
                .reduce((sum, app) => sum + app.score, 0) / 
                applicationPerformances.filter(app => app.category === 'Video Editing').length || 0)}/100
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {applicationPerformances.filter(app => app.category === 'Video Editing').length} apps
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">3D Rendering</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(
              applicationPerformances.filter(app => app.category === '3D Rendering')
                .reduce((sum, app) => sum + app.score, 0) / 
              applicationPerformances.filter(app => app.category === '3D Rendering').length || 0
            )}`}>
              {Math.round(applicationPerformances.filter(app => app.category === '3D Rendering')
                .reduce((sum, app) => sum + app.score, 0) / 
                applicationPerformances.filter(app => app.category === '3D Rendering').length || 0)}/100
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {applicationPerformances.filter(app => app.category === '3D Rendering').length} apps
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(
              applicationPerformances.filter(app => app.category === 'Development')
                .reduce((sum, app) => sum + app.score, 0) / 
              applicationPerformances.filter(app => app.category === 'Development').length || 0
            )}`}>
              {Math.round(applicationPerformances.filter(app => app.category === 'Development')
                .reduce((sum, app) => sum + app.score, 0) / 
                applicationPerformances.filter(app => app.category === 'Development').length || 0)}/100
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {applicationPerformances.filter(app => app.category === 'Development').length} apps
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Score Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="w-4 h-4" />
            Performance Score Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
              <p className="font-medium text-green-600">90-100</p>
              <p className="text-xs text-muted-foreground mt-1">Excellent</p>
            </div>
            <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
              <p className="font-medium text-blue-600">80-89</p>
              <p className="text-xs text-muted-foreground mt-1">Very Good</p>
            </div>
            <div className="p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
              <p className="font-medium text-yellow-600">70-79</p>
              <p className="text-xs text-muted-foreground mt-1">Good</p>
            </div>
            <div className="p-3 bg-orange-600/10 border border-orange-600/20 rounded-lg">
              <p className="font-medium text-orange-600">60-69</p>
              <p className="text-xs text-muted-foreground mt-1">Fair</p>
            </div>
            <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg">
              <p className="font-medium text-red-600">&lt;60</p>
              <p className="text-xs text-muted-foreground mt-1">Poor</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Application Benchmarks */}
      <div className="space-y-4">
        {applicationPerformances.map((app) => {
          const Icon = appIcons[app.name] || Video;
          return (
            <Card key={app.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{app.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-semibold ${getPerformanceColor(app.score)}`}>
                      {Math.round(app.score)}/100
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getPerformanceLabel(app.score)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={app.score} className={getProgressColor(app.score)} />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {app.tasks.map((task: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{task.name}</span>
                          <span className="font-medium">{Math.round(task.performance)}/100</span>
                        </div>
                        <Progress 
                          value={task.performance} 
                          className={`h-1.5 ${getProgressColor(task.performance)}`}
                        />
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Performance Notes:</strong> {app.notes || 
                        `Your build is ${getPerformanceLabel(app.score).toLowerCase()} for ${app.name}. ` +
                        (app.score >= 80 
                          ? 'Expect smooth performance in most workflows.'
                          : app.score >= 60
                          ? 'Performance is acceptable for moderate workloads.'
                          : 'Consider upgrading components for better performance.')
                      }
                    </p>
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
