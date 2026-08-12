import { ArrowLeft, Video, Layers, Code, Image, Info, CheckCircle, XCircle, CheckSquare, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface ApplicationBenchmarksPageProps {
  applicationPerformances: any[];
  onBack: () => void;
}

export function ApplicationBenchmarksPage({ applicationPerformances, onBack }: ApplicationBenchmarksPageProps) {
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const getBadgeVariant = (score: number): "default" | "secondary" | "outline" | "destructive" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const isTaskPassed = (task: any) => {
    if (task.rating) {
      return ['Excellent', 'Very Good', 'Great', 'Good'].includes(task.rating);
    }
    if (typeof task.performance === 'number') {
      return task.performance >= 60;
    }
    return true;
  };

  const appIcons: { [key: string]: any } = {
    'Adobe Premiere Pro': Video,
    'DaVinci Resolve': Video,
    'Blender': Layers,
    'Cinema 4D': Layers,
    'Visual Studio Code': Code,
    'IntelliJ IDEA': Code,
    'Photoshop': Image,
    'Adobe Photoshop': Image,
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
            <h3 className="mb-2 font-semibold text-lg">No Components Selected</h3>
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
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <Video className="w-6 h-6 text-primary" />
              Application Benchmarks
            </h1>
            <p className="text-sm text-muted-foreground">
              Productivity and creative application capability rating across {applicationPerformances.length} apps
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
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
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
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Video Editing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(
              applicationPerformances.filter(app => app.category === 'Video Editing' || app.category === 'video')
                .reduce((sum, app) => sum + app.score, 0) /
              (applicationPerformances.filter(app => app.category === 'Video Editing' || app.category === 'video').length || 1)
            )}`}>
              {Math.round(applicationPerformances.filter(app => app.category === 'Video Editing' || app.category === 'video')
                .reduce((sum, app) => sum + app.score, 0) /
                (applicationPerformances.filter(app => app.category === 'Video Editing' || app.category === 'video').length || 1))}/100
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {applicationPerformances.filter(app => app.category === 'Video Editing' || app.category === 'video').length} apps
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">3D Rendering</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(
              applicationPerformances.filter(app => app.category === '3D Rendering' || app.category === 'rendering')
                .reduce((sum, app) => sum + app.score, 0) /
              (applicationPerformances.filter(app => app.category === '3D Rendering' || app.category === 'rendering').length || 1)
            )}`}>
              {Math.round(applicationPerformances.filter(app => app.category === '3D Rendering' || app.category === 'rendering')
                .reduce((sum, app) => sum + app.score, 0) /
                (applicationPerformances.filter(app => app.category === '3D Rendering' || app.category === 'rendering').length || 1))}/100
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {applicationPerformances.filter(app => app.category === '3D Rendering' || app.category === 'rendering').length} apps
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${getPerformanceColor(
              applicationPerformances.filter(app => app.category === 'Development' || app.category === 'development')
                .reduce((sum, app) => sum + app.score, 0) /
              (applicationPerformances.filter(app => app.category === 'Development' || app.category === 'development').length || 1)
            )}`}>
              {Math.round(applicationPerformances.filter(app => app.category === 'Development' || app.category === 'development')
                .reduce((sum, app) => sum + app.score, 0) /
                (applicationPerformances.filter(app => app.category === 'Development' || app.category === 'development').length || 1))}/100
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {applicationPerformances.filter(app => app.category === 'Development' || app.category === 'development').length} apps
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Score Guide */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="w-4 h-4" />
            Performance Score Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
              <p className="font-medium text-green-600 dark:text-green-400">90-100</p>
              <p className="text-xs text-muted-foreground mt-1">Excellent</p>
            </div>
            <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
              <p className="font-medium text-blue-600 dark:text-blue-400">80-89</p>
              <p className="text-xs text-muted-foreground mt-1">Very Good</p>
            </div>
            <div className="p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
              <p className="font-medium text-yellow-600 dark:text-yellow-400">70-79</p>
              <p className="text-xs text-muted-foreground mt-1">Good</p>
            </div>
            <div className="p-3 bg-orange-600/10 border border-orange-600/20 rounded-lg">
              <p className="font-medium text-orange-600 dark:text-orange-400">60-69</p>
              <p className="text-xs text-muted-foreground mt-1">Fair</p>
            </div>
            <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg">
              <p className="font-medium text-red-600 dark:text-red-400">&lt;60</p>
              <p className="text-xs text-muted-foreground mt-1">Poor</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Application Benchmarks as Capability Checklists */}
      <div className="space-y-4">
        {applicationPerformances.map((app) => {
          const Icon = appIcons[app.name] || Video;
          const checkedCount = app.tasks.filter((t: any) => isTaskPassed(t)).length;
          const totalTasks = app.tasks.length;

          return (
            <Card key={app.name} className="overflow-hidden border">
              <CardHeader className="bg-muted/20 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold">{app.name}</CardTitle>
                        <Badge variant="outline" className="text-xs capitalize">
                          {app.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <ListChecks className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium text-foreground">
                          {checkedCount} of {totalTasks} items checked off
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className={`text-2xl font-bold tabular-nums ${getPerformanceColor(app.score)}`}>
                          {Math.round(app.score)}/100
                        </span>
                        <Badge variant={getBadgeVariant(app.score)}>
                          {getPerformanceLabel(app.score)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {checkedCount === totalTasks
                          ? 'All capability items checked'
                          : `${checkedCount}/${totalTasks} capability items met`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {/* Capability Checklist - List format without measuring progress lines */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-primary" /> Capability Checklist &amp; Task Ratings
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {checkedCount}/{totalTasks} Checked Off
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {app.tasks.map((task: any, index: number) => {
                      const passed = isTaskPassed(task);
                      return (
                        <div
                          key={index}
                          className={`p-3.5 rounded-lg border flex flex-col justify-between transition-colors ${passed
                            ? 'bg-emerald-500/5 border-emerald-500/25'
                            : 'bg-destructive/5 border-destructive/20'
                            }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                {passed ? (
                                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <h4 className="text-sm font-semibold leading-tight">{task.name}</h4>
                                  {task.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">Rating Score</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold tabular-nums text-sm ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                                }`}>
                                {Math.round(task.performance)}/100
                              </span>
                              {task.rating && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                  {task.rating}
                                </Badge>
                              )}
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
                    <strong className="text-foreground font-medium">Performance Rating Notes:</strong>{' '}
                    {app.notes ||
                      `Based on checking off ${checkedCount} out of ${totalTasks} benchmark tasks, this build receives a ${getPerformanceLabel(app.score)} rating for ${app.name}.`
                    }
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

