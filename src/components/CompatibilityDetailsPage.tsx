import { ArrowLeft, XCircle, AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';

interface CompatibilityDetailsPageProps {
  issues: any[];
  status: any;
  recommendations: any[];
  onBack: () => void;
}

export function CompatibilityDetailsPage({ issues, status, recommendations, onBack }: CompatibilityDetailsPageProps) {
  const errorIssues = issues.filter(i => i.type === 'error');
  const warningIssues = issues.filter(i => i.type === 'warning');
  const infoIssues = issues.filter(i => i.type === 'info');

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-5 h-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getIssueBadgeVariant = (type: string) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  const getIssueBackground = (type: string) => {
    switch (type) {
      case 'error': return 'bg-destructive/5 border-destructive/20';
      case 'warning': return 'bg-yellow-600/5 border-yellow-600/20';
      default: return 'bg-blue-600/5 border-blue-600/20';
    }
  };

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
              {status.status === 'compatible' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : status.status === 'error' ? (
                <XCircle className="w-6 h-6 text-destructive" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              )}
              Compatibility Analysis
            </h1>
            <p className="text-sm text-muted-foreground">
              Detailed compatibility check for your build
            </p>
          </div>
        </div>
        <Badge 
          variant={status.status === 'compatible' ? 'default' : status.status === 'error' ? 'destructive' : 'secondary'}
          className="text-lg px-4 py-2"
        >
          {status.message}
        </Badge>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle>Compatibility Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-destructive" />
                  <span className="font-medium">Errors</span>
                </div>
                <span className="text-2xl font-semibold text-destructive">{errorIssues.length}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {errorIssues.length === 0 
                  ? 'No critical issues found'
                  : 'Must be resolved before use'
                }
              </p>
            </div>

            <div className="p-4 bg-yellow-600/5 border border-yellow-600/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">Warnings</span>
                </div>
                <span className="text-2xl font-semibold text-yellow-600">{warningIssues.length}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {warningIssues.length === 0 
                  ? 'No warnings'
                  : 'Recommended to address'
                }
              </p>
            </div>

            <div className="p-4 bg-green-600/5 border border-green-600/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Recommendations</span>
                </div>
                <span className="text-2xl font-semibold text-green-600">{recommendations.length}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {recommendations.length === 0 
                  ? 'Build is well balanced'
                  : 'Optimization suggestions'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Issues */}
      {errorIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              Critical Compatibility Errors
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These issues must be resolved before your build will function properly
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {errorIssues.map((issue, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getIssueBackground(issue.type)}`}>
                  <div className="flex items-start gap-3">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{issue.message}</h4>
                        <Badge variant={getIssueBadgeVariant(issue.type)} className="text-xs">
                          {issue.severity || issue.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {issue.description || 'This configuration may cause issues.'}
                      </p>
                      {issue.affectedComponents && issue.affectedComponents.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-muted-foreground">Affected components:</span>
                          {issue.affectedComponents.map((comp: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {comp.replace('-', ' ')}
                            </Badge>
                          ))}
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

      {/* Warning Issues */}
      {warningIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-5 h-5" />
              Compatibility Warnings
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These issues may affect performance or require attention
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warningIssues.map((issue, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getIssueBackground(issue.type)}`}>
                  <div className="flex items-start gap-3">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{issue.message}</h4>
                        <Badge variant={getIssueBadgeVariant(issue.type)} className="text-xs">
                          {issue.severity || issue.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {issue.description || 'Consider addressing this for optimal performance.'}
                      </p>
                      {issue.affectedComponents && issue.affectedComponents.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-muted-foreground">Affected components:</span>
                          {issue.affectedComponents.map((comp: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {comp.replace('-', ' ')}
                            </Badge>
                          ))}
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
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{rec.title || 'Performance Optimization'}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.description || rec.reason}
                      </p>
                      {rec.suggestedComponent && (
                        <div className="bg-card p-3 rounded-md border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">
                                {rec.suggestedComponent.brand} {rec.suggestedComponent.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {rec.improvement || 'Better performance'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${rec.suggestedComponent.price.toLocaleString()}</p>
                              {rec.priceDifference && (
                                <p className="text-xs text-muted-foreground">
                                  {rec.priceDifference > 0 ? '+' : ''}{rec.priceDifference > 0 ? `$${rec.priceDifference}` : 'Cheaper'}
                                </p>
                              )}
                            </div>
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
      {errorIssues.length === 0 && warningIssues.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h3 className="text-green-600 mb-2">All Components Compatible!</h3>
            <p className="text-muted-foreground">
              Your build has no compatibility issues. All components work together perfectly.
            </p>
          </CardContent>
        </Card>
      )}

      {/* General Compatibility Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Compatibility Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <AlertDescription>
                <strong>Socket Compatibility:</strong> Ensure your CPU and motherboard have matching sockets (e.g., AM5 for AMD Ryzen 7000, LGA1700 for Intel 13th/14th gen).
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription>
                <strong>RAM Compatibility:</strong> Check that your motherboard supports your RAM's speed and capacity. Also verify DDR4 vs DDR5 compatibility.
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription>
                <strong>Power Supply:</strong> Your PSU should provide 20-30% more wattage than your system's total draw for efficiency and headroom.
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription>
                <strong>Case Clearance:</strong> Verify that your GPU, CPU cooler, and PSU fit within your case's dimensions, including width and length restrictions.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
