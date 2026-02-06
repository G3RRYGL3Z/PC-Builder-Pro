import { AlertTriangle, CheckCircle, XCircle, Info, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RecommendationPanel } from './RecommendationPanel';

interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  component: string;
  message: string;
  affectedComponents: string[];
}

interface CompatibilityStatus {
  status: 'error' | 'warning' | 'compatible';
  message: string;
  color: 'destructive' | 'secondary' | 'default';
}

interface ComponentRecommendation {
  componentType: string;
  component: any;
  reason: string;
  resolvesIssues: string[];
  priceImpact: 'lower' | 'similar' | 'higher';
  priority: 'high' | 'medium' | 'low';
}

interface CompatibilityPanelProps {
  issues: CompatibilityIssue[];
  status: CompatibilityStatus;
  selectedCount: number;
  recommendations?: ComponentRecommendation[];
  selectedComponents?: any;
  onSelectRecommendation?: (componentType: string, component: any) => void;
  onViewDetails?: () => void;
}

const componentNames: Record<string, string> = {
  'processor': 'Processor',
  'cpu-cooler': 'CPU Cooler',
  'motherboard': 'Motherboard',
  'gpu': 'GPU',
  'memory': 'Memory',
  'storage': 'Storage',
  'power-supply': 'Power Supply',
  'case': 'Case'
};

export function CompatibilityPanel({ 
  issues, 
  status, 
  selectedCount, 
  recommendations = [],
  selectedComponents = {},
  onSelectRecommendation,
  onViewDetails
}: CompatibilityPanelProps) {
  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const hasErrors = issues.some(issue => issue.type === 'error');
  const hasRecommendations = recommendations.length > 0;

  if (selectedCount < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-muted-foreground" />
            Compatibility Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select at least 2 components to check compatibility.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {status.status === 'compatible' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {status.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
            {status.status === 'error' && <XCircle className="w-5 h-5 text-destructive" />}
            Compatibility Analysis
          </CardTitle>
          {onViewDetails && (
            <Button variant="ghost" size="sm" onClick={onViewDetails} className="gap-1">
              View Details
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Status */}
        <div className="flex items-center gap-2 mb-4">
          <Badge 
            variant={status.color === 'destructive' ? 'destructive' : status.color === 'secondary' ? 'secondary' : 'default'}
            className={status.status === 'compatible' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
          >
            {status.message}
          </Badge>
        </div>

        {issues.length === 0 && selectedCount >= 2 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="font-medium mb-2">Perfect Compatibility!</h3>
            <p className="text-sm text-muted-foreground">
              No compatibility issues detected with your current selection.
            </p>
          </div>
        ) : (
          <Tabs defaultValue={hasErrors && hasRecommendations ? "recommendations" : "issues"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="issues" className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Issues ({issues.length})
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2" disabled={!hasRecommendations}>
                <CheckCircle className="w-4 h-4" />
                Solutions ({recommendations.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="issues" className="mt-4">
              {issues.length > 0 && (
                <div className="space-y-3">
                  {issues.map((issue, index) => (
                    <Alert 
                      key={index} 
                      variant={issue.type === 'error' ? 'destructive' : 'default'}
                      className="border-l-4"
                    >
                      <div className="flex items-start gap-2">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <AlertDescription className="mb-2">
                            {issue.message}
                          </AlertDescription>
                          <div className="flex gap-1 flex-wrap">
                            {issue.affectedComponents.map((component) => (
                              <Badge 
                                key={component} 
                                variant="outline" 
                                className="text-xs"
                              >
                                {componentNames[component] || component}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-4">
              {hasRecommendations && onSelectRecommendation ? (
                <RecommendationPanel 
                  recommendations={recommendations}
                  selectedComponents={selectedComponents}
                  onSelectRecommendation={onSelectRecommendation}
                />
              ) : (
                <div className="text-center py-8">
                  <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Recommendations Available</h3>
                  <p className="text-sm text-muted-foreground">
                    We couldn't find suitable alternatives for the current compatibility issues.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}