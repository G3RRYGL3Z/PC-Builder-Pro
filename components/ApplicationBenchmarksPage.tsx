import { ArrowLeft, Video, Layers, Code, Image, Info, CheckCircle, XCircle, CheckSquare, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface TransformedTask {
  name: string;
  performance: number;
  description: string;
  rating?: string;
}

interface TransformedAppPerformance {
  appId: string;
  name: string;
  category: string;
  icon: string;
  metric: string;
  unit: string;
  score: number;
  tasks: TransformedTask[];
  notes: string;
}

interface ApplicationBenchmarksPageProps {
  applicationPerformances: TransformedAppPerformance[];
  onBack: () => void;
}

function getPerformanceColor(score: number): string {
  if (score >= 90) return 'text-green-600 dark:text-green-400';
  if (score >= 80) return 'text-blue-600 dark:text-blue-400';
  if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 60) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

function getPerformanceLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Poor';
}

function isTaskPassed(task: TransformedTask): boolean {
  if (task.rating) {
    return ['Excellent', 'Very Good', 'Great', 'Good'].includes(task.rating);
  }
  if (typeof task.performance === 'number') {
    return task.performance >= 60;
  }
  return true;
}

export function ApplicationBenchmarksPage({ applicationPerformances, onBack }: ApplicationBenchmarksPageProps) {
  if (applicationPerformances.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Builder
          </Button>
          <h2 className="text-xl font-semibold">Application Benchmarks</h2>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Select a CPU or GPU to see application benchmarks.</p>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Builder
          </Button>
          <h2 className="text-xl font-semibold">Application Benchmarks</h2>
          <Badge variant="secondary">{applicationPerformances.length} apps</Badge>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <span className={getPerformanceColor(averageScore)}>
            Avg: {averageScore}/100
          </span>
        </Badge>
      </div>

      <div className="space-y-4">
        {applicationPerformances.map((app) => {
          const checkedCount = app.tasks.filter(isTaskPassed).length;
          const totalTasks = app.tasks.length;

          return (
            <Card key={app.appId || app.name} className="overflow-hidden border">
              <CardHeader className="bg-muted/20 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{app.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold">{app.name}</CardTitle>
                        <Badge variant="outline" className="text-xs capitalize">{app.category}</Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <ListChecks className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{checkedCount} of {totalTasks} items checked off</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-bold ${getPerformanceColor(app.score)}`}>
                        {Math.round(app.score)}/100
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getPerformanceLabel(app.score)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-primary" /> Capability Checklist
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {app.tasks.map((task) => {
                      const passed = isTaskPassed(task);
                      return (
                        <div
                          key={task.name}
                          className={`p-3 rounded-lg border flex flex-col justify-between ${
                            passed ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-destructive/5 border-destructive/20'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {passed ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="text-sm font-semibold">{task.name}</p>
                              {task.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Rating Score</span>
                            <span className={`font-bold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                              {Math.round(task.performance)}/100
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {app.notes && (
                  <>
                    <Separator />
                    <p className="text-xs text-muted-foreground">
                      <strong>Performance Notes:</strong> {app.notes}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

