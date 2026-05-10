import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  description: string;
  affectedComponents: string[];
}

interface CompatibilityStatus {
  status: 'compatible' | 'warning' | 'error';
  message: string;
}

interface Recommendation {
  componentType: string;
  currentComponent: any;
  suggestedComponent: any;
  title?: string;
  description?: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

interface CompatibilityDetailsPageProps {
  issues: CompatibilityIssue[];
  status: CompatibilityStatus;
  recommendations: Recommendation[];
  onBack: () => void;
}

export function CompatibilityDetailsPage({ issues, status, recommendations, onBack }: CompatibilityDetailsPageProps) {
  const errors   = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  const infos    = issues.filter(i => i.type === 'info');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Builder
        </Button>
        <h2 className="text-xl font-semibold">Compatibility Analysis</h2>
      </div>

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {status.status === 'compatible'
              ? <CheckCircle className="w-6 h-6 text-green-600" />
              : status.status === 'error'
              ? <XCircle className="w-6 h-6 text-destructive" />
              : <AlertTriangle className="w-6 h-6 text-yellow-600" />
            }
            <div>
              <CardTitle>{status.message}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {errors.length} error{errors.length !== 1 ? 's' : ''}, {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Errors */}
      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" /> Errors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {errors.map((issue, i) => (
              <div key={i} className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                <h4 className="font-medium text-foreground">{issue.message}</h4>
                <p className="text-sm text-foreground/70">
                  {issue.description || 'Note: review this for optimal configuration.'}
                </p>
                <div className="flex gap-1 mt-2">
                  {issue.affectedComponents.map(c => (
                    <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-5 h-5" /> Warnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {warnings.map((issue, i) => (
              <div key={i} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-foreground">{issue.message}</h4>
                <p className="text-sm text-foreground/70">
                  {issue.description || 'Note: review this for optimal configuration.'}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Info */}
      {infos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {infos.map((issue, i) => (
              <div key={i} className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                <h4 className="font-medium text-foreground">{issue.message}</h4>
                <p className="text-sm text-foreground/70">
                  {issue.description || 'Note: review this for optimal configuration.'}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" /> Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm capitalize">{rec.componentType}</span>
                  <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs">
                    {rec.priority}
                  </Badge>
                </div>
                <h4 className="font-medium text-foreground mb-1">{rec.title || 'Performance Optimization'}</h4>
                <p className="text-sm text-foreground/70 mb-2">
                  {rec.description || rec.reason}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {issues.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600 opacity-50" />
            <p className="text-muted-foreground">All components are fully compatible!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
