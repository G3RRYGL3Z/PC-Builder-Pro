import { ArrowLeft, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

interface TransformedTask {
  name: string;
  performance: number;
  description: string;
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

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 60) return 'text-orange-600';
  return 'text-red-600';
}

function getRating(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Poor';
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
            <Zap className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Select a CPU or GPU to see application benchmarks.</p>
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
        <h2 className="text-xl font-semibold">Application Benchmarks</h2>
        <Badge variant="secondary">{applicationPerformances.length} apps</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {applicationPerformances.map((app) => (
          <Card key={app.appId}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{app.icon}</span>
                  {app.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(app.score)}`}>
                    {Math.round(app.score)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {getRating(app.score)}
                  </Badge>
                </div>
              </div>
              <Badge variant="outline" className="text-xs capitalize w-fit">{app.category}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {app.tasks.map((task) => (
                <div key={task.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{task.name}</span>
                    <span className="font-medium tabular-nums">
                      {task.performance} {app.unit}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{task.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
