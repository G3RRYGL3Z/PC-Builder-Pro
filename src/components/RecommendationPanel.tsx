import { ArrowRight, TrendingDown, TrendingUp, Minus, Gamepad2, Video, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { comparePerformance } from '../utils/performanceBenchmarking';

interface ComponentRecommendation {
  componentType: string;
  component: any;
  reason: string;
  resolvesIssues: string[];
  priceImpact: 'lower' | 'similar' | 'higher';
  priority: 'high' | 'medium' | 'low';
}

interface RecommendationPanelProps {
  recommendations: ComponentRecommendation[];
  selectedComponents: any;
  onSelectRecommendation: (componentType: string, component: any) => void;
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

export function RecommendationPanel({ recommendations, selectedComponents, onSelectRecommendation }: RecommendationPanelProps) {
  const getPriceIcon = (priceImpact: string) => {
    switch (priceImpact) {
      case 'lower':
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'higher':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'similar':
        return <Minus className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getPerformanceIcon = (improvement: number) => {
    if (improvement > 5) {
      return <ChevronUp className="w-4 h-4 text-green-600" />;
    } else if (improvement < -5) {
      return <ChevronDown className="w-4 h-4 text-red-600" />;
    } else {
      return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPerformanceColor = (improvement: number) => {
    if (improvement > 5) return 'text-green-600';
    if (improvement < -5) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.componentType]) {
      acc[rec.componentType] = [];
    }
    acc[rec.componentType].push(rec);
    return acc;
  }, {} as Record<string, ComponentRecommendation[]>);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-primary" />
          Recommended Alternatives
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          These components would resolve your compatibility issues and may improve performance
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedRecommendations).map(([componentType, recs]) => (
          <div key={componentType}>
            <h4 className="font-medium mb-3 text-primary">
              {componentNames[componentType]} Recommendations
            </h4>
            <div className="space-y-3">
              {recs.slice(0, 3).map((rec, index) => {
                // Calculate performance impact
                const performanceComparison = comparePerformance(
                  selectedComponents, 
                  rec.component, 
                  componentType
                );
                
                return (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium">
                              {rec.component.brand} {rec.component.name}
                            </h5>
                            <Badge 
                              className={`text-xs ${getPriorityColor(rec.priority)}`}
                              variant="outline"
                            >
                              {rec.priority} priority
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {rec.reason}
                          </p>
                          
                          {/* Performance Impact */}
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="flex items-center gap-1 text-sm">
                              <Gamepad2 className="w-3 h-3 text-primary" />
                              <span className="text-muted-foreground">Gaming:</span>
                              {getPerformanceIcon(performanceComparison.improvement.gaming)}
                              <span className={`font-medium ${getPerformanceColor(performanceComparison.improvement.gaming)}`}>
                                {performanceComparison.improvement.gaming > 0 ? '+' : ''}{Math.round(performanceComparison.improvement.gaming)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Video className="w-3 h-3 text-primary" />
                              <span className="text-muted-foreground">Productivity:</span>
                              {getPerformanceIcon(performanceComparison.improvement.productivity)}
                              <span className={`font-medium ${getPerformanceColor(performanceComparison.improvement.productivity)}`}>
                                {performanceComparison.improvement.productivity > 0 ? '+' : ''}{Math.round(performanceComparison.improvement.productivity)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              {getPriceIcon(rec.priceImpact)}
                              <span className="font-medium">
                                ${rec.component.price.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground">
                                ({rec.priceImpact} price)
                              </span>
                            </div>
                            
                            {rec.component.performance && (
                              <Badge variant="secondary" className="text-xs">
                                {rec.component.performance}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => onSelectRecommendation(componentType, rec.component)}
                          className="shrink-0"
                        >
                          Select This
                        </Button>
                      </div>
                      
                      {/* Key specifications preview */}
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(rec.component.specifications)
                            .slice(0, 4)
                            .map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-muted-foreground">{key}:</span>
                                <span>{value}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                      
                      {/* Performance Details */}
                      {(Math.abs(performanceComparison.improvement.gaming) > 5 || 
                        Math.abs(performanceComparison.improvement.productivity) > 5) && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="text-xs space-y-1">
                            <p className="font-medium text-muted-foreground">Performance Impact:</p>
                            {Math.abs(performanceComparison.improvement.gaming) > 5 && (
                              <p className={getPerformanceColor(performanceComparison.improvement.gaming)}>
                                Gaming: {performanceComparison.improvement.gaming > 0 ? 'Improves' : 'Reduces'} by {Math.abs(Math.round(performanceComparison.improvement.gaming))} points
                              </p>
                            )}
                            {Math.abs(performanceComparison.improvement.productivity) > 5 && (
                              <p className={getPerformanceColor(performanceComparison.improvement.productivity)}>
                                Productivity: {performanceComparison.improvement.productivity > 0 ? 'Improves' : 'Reduces'} by {Math.abs(Math.round(performanceComparison.improvement.productivity))} points
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              
              {recs.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{recs.length - 3} more {componentNames[componentType].toLowerCase()} options available
                </p>
              )}
            </div>
            
            {Object.keys(groupedRecommendations).indexOf(componentType) < Object.keys(groupedRecommendations).length - 1 && (
              <Separator className="mt-6" />
            )}
          </div>
        ))}
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Higher priority recommendations resolve critical compatibility issues. 
            Performance improvements are shown relative to your current selection.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}