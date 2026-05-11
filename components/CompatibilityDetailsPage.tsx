import { ArrowLeft, XCircle, AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface CompatibilityDetailsPageProps {
  issues: any[];
  status: any;
  recommendations: any[];
  onBack: () => void;
}

export function CompatibilityDetailsPage({ issues, status, recommendations, onBack }: CompatibilityDetailsPageProps) {
  const errorIssues   = issues.filter(i => i.type === 'error');
  const warningIssues = issues.filter(i => i.type === 'warning');
  const infoIssues    = infoIssues_actual; // Wait, let's fix the variable name logic below

  // Re-filtering for safety in the render block
  const errorIssues_actual   = issues.filter(i => i.type === 'error');
  const warningIssues_actual = issues.filter(i => i.type === 'warning');
  const infoIssues_actual    = issues.filter(i => i.type === 'info');

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':   return <XCircle       className="w-5 h-5 text-red-500 shrink-0"    />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />;
      default:        return <Info          className="w-5 h-5 text-blue-500 shrink-0"   />;
    }
  };

  // FIX: Replaced tinted backgrounds with a solid left-border style.
  // Tinted backgrounds (bg-yellow-600/5) were near-white in light mode, making
  // text invisible. A left border on a neutral card background is readable on
  // any theme without fighting CSS variable inheritance.
  const getIssueStyle = (type: string): string => {
    switch (type) {
      case 'error':   return 'border-l-4 border-l-red-500   bg-card';
      case 'warning': return 'border-l-4 border-l-yellow-500 bg-card';
      default:        return 'border-l-4 border-l-blue-500  bg-card';
    }
  };

  const getIssueBadgeVariant = (type: string) => {
    switch (type) {
      case 'error':   return 'destructive' as const;
      case 'warning': return 'secondary'   as const;
      default:        return 'outline'     as const;
    }
  };

  // Reusable issue card — used for errors, warnings, and info
  const IssueCard = ({ issue, index }: { issue: any; index: number }) => (
    <div key={index} className={`p-4 rounded-lg border ${getIssueStyle(issue.type)}`}>
      <div className="flex items-start gap-3">
        {getIssueIcon(issue.type)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-medium text-foreground">{issue.message}</h4>
            <Badge variant={getIssueBadgeVariant(issue.type)} className="text-xs shrink-0">
              {issue.severity || issue.type}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {issue.description || (
              issue.type === 'error'
                ? 'This configuration may cause issues.'
                : 'Consider addressing this for optimal performance.'
            )}
          </p>
          {issue.affectedComponents?.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground">Affected:</span>
              {issue.affectedComponents.map((comp: string, i: number) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {comp.replace(/-/g, ' ')}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Builder
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-foreground">
              {status.status === 'compatible'
                ? <CheckCircle  className="w-6 h-6 text-green-500"  />
                : status.status === 'error'
                ? <XCircle      className="w-6 h-6 text-red-500"    />
                : <AlertTriangle className="w-6 h-6 text-yellow-500" />
              }
              Compatibility Analysis
            </h1>
            <p className="text-sm text-muted-foreground">Detailed compatibility check for your build</p>
          </div>
        </div>
        <Badge
          variant={status.status === 'compatible' ? 'default' : status.status === 'error' ? 'destructive' : 'secondary'}
          className="text-base px-4 py-2"
        >
          {status.message}
        </Badge>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader><CardTitle>Compatibility Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Errors */}
            <div className="p-4 border-l-4 border-l-red-500 bg-card rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-foreground">Errors</span>
                </div>
                <span className="text-2xl font-semibold text-red-500">{errorIssues_actual.length}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {errorIssues_actual.length === 0 ? 'No critical issues found' : 'Must be resolved before use'}
              </p>
            </div>

            {/* Warnings */}
            <div className="p-4 border-l-4 border-l-yellow-500 bg-card rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-foreground">Warnings</span>
                </div>
                <span className="text-2xl font-semibold text-yellow-500">{warningIssues_actual.length}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {warningIssues_actual.length === 0 ? 'No warnings' : 'Recommended to address'}
              </p>
            </div>

            {/* Recommendations */}
            <div className="p-4 border-l-4 border-l-green-500 bg-card rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-foreground">Recommendations</span>
                </div>
                <span className="text-2xl font-semibold text-green-500">{recommendations.length}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {recommendations.length === 0 ? 'Build is well balanced' : 'Optimization suggestions'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Errors */}
      {errorIssues_actual.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <XCircle className="w-5 h-5" />
              Critical Compatibility Errors
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These issues must be resolved before your build will function properly
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {errorIssues_actual.map((issue, i) => <IssueCard key={i} issue={issue} index={i} />)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {warningIssues_actual.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="w-5 h-5" />
              Compatibility Warnings
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These issues may affect performance or require attention
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {warningIssues_actual.map((issue, i) => <IssueCard key={i} issue={issue} index={i} />)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      {infoIssues_actual.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-500">
              <Info className="w-5 h-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {infoIssues_actual.map((issue, i) => <IssueCard key={i} issue={issue} index={i} />)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Optimization Recommendations
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Suggestions to improve your build's performance and value
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 border-l-4 border-l-primary bg-card rounded-lg border">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground mb-1">
                        {rec.title || 'Performance Optimization'}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.description || rec.reason}
                      </p>
                      {rec.suggestedComponent && (
                        <div className="bg-muted p-3 rounded-md border mt-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">
                                {rec.suggestedComponent.brand} {rec.suggestedComponent.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {rec.improvement || 'Better performance'}
                              </p>
                            </div>
                            <p className="font-semibold text-foreground shrink-0">
                              ${rec.suggestedComponent.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Clear */}
      {errorIssues_actual.length === 0 && warningIssues_actual.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-green-500 mb-2">All Components Compatible!</h3>
            <p className="text-muted-foreground">
              Your build has no compatibility issues. All components work together perfectly.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Compatibility Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: 'Socket Compatibility', body: 'Ensure your CPU and motherboard have matching sockets (e.g., AM5 for AMD Ryzen 7000, LGA1700 for Intel 13th/14th gen).' },
              { title: 'RAM Compatibility',    body: 'Check that your motherboard supports your RAM\'s speed and capacity. Also verify DDR4 vs DDR5 compatibility.' },
              { title: 'Power Supply',         body: 'Your PSU should provide 20-30% more wattage than your system\'s total draw for efficiency and headroom.' },
              { title: 'Case Clearance',       body: 'Verify that your GPU, CPU cooler, and PSU fit within your case\'s dimensions, including width and length restrictions.' },
            ].map(({ title, body }) => (
              <Alert key={title}>
                <AlertDescription>
                  <strong>{title}:</strong> {body}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
