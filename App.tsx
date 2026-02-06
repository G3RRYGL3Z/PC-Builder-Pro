import { useState, useMemo } from 'react';
import { Menu, Cpu, Fan, CircuitBoard, MonitorSpeaker, HardDrive, Zap, PcCase, MemoryStick, X, AlertTriangle, CheckCircle, XCircle, TrendingUp, User, LogIn, Save, Trophy } from 'lucide-react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { ComponentSelectionDialog } from './components/ComponentSelectionDialog';
import { CompatibilityPanel } from './components/CompatibilityPanel';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { CommunityLeaderboard } from './components/CommunityLeaderboard';
import { AuthDialog } from './components/AuthDialog';
import { SaveBuildDialog } from './components/SaveBuildDialog';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { componentDatabase } from './data/components';
import { checkCompatibility, getCompatibilityStatus } from './utils/compatibilityChecker';
import { generateRecommendations } from './utils/recommendationEngine';
import { calculatePerformanceMetrics, analyzePerformanceBottlenecks } from './utils/performanceBenchmarking';
import { calculateGamePerformance, calculateApplicationPerformance } from './utils/gameBenchmarking';

interface SelectedComponent {
  id: string;
  name: string;
  brand: string;
  price: number;
  specifications: Record<string, string>;
}

interface SelectedComponents {
  [key: string]: SelectedComponent | null;
}

const components = [
  {
    id: 'processor',
    name: 'Processor',
    icon: Cpu,
    description: 'CPU - Central Processing Unit'
  },
  {
    id: 'cpu-cooler',
    name: 'CPU Cooler',
    icon: Fan,
    description: 'Cooling system for CPU'
  },
  {
    id: 'motherboard',
    name: 'Motherboard',
    icon: CircuitBoard,
    description: 'Main circuit board'
  },
  {
    id: 'gpu',
    name: 'GPU',
    icon: MonitorSpeaker,
    description: 'Graphics Processing Unit'
  },
  {
    id: 'memory',
    name: 'Memory',
    icon: MemoryStick,
    description: 'RAM - System Memory'
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: HardDrive,
    description: 'SSD/HDD Storage'
  },
  {
    id: 'power-supply',
    name: 'Power Supply',
    icon: Zap,
    description: 'PSU - Power Supply Unit'
  },
  {
    id: 'case',
    name: 'Cases',
    icon: PcCase,
    description: 'PC Case & Chassis'
  }
];

function PCBuilderApp() {
  const { user, signOut } = useAuth();
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentComponentType, setCurrentComponentType] = useState<string>('');
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Memoized compatibility checking, recommendations, and performance analysis
  const analysisData = useMemo(() => {
    const issues = checkCompatibility(selectedComponents);
    const status = getCompatibilityStatus(issues);
    const recommendations = generateRecommendations(issues, selectedComponents);
    const performance = calculatePerformanceMetrics(selectedComponents);
    const contributions = analyzePerformanceBottlenecks(selectedComponents);
    const gamePerformances = calculateGamePerformance(selectedComponents);
    const applicationPerformances = calculateApplicationPerformance(selectedComponents);
    
    return { 
      issues, 
      status, 
      recommendations, 
      performance, 
      contributions, 
      gamePerformances, 
      applicationPerformances 
    };
  }, [selectedComponents]);

  const handleOpenDialog = (componentId: string) => {
    setCurrentComponentType(componentId);
    setDialogOpen(true);
  };

  const handleSelectComponent = (component: any) => {
    setSelectedComponents(prev => ({
      ...prev,
      [currentComponentType]: component
    }));
  };

  const handleSelectRecommendation = (componentType: string, component: any) => {
    setSelectedComponents(prev => ({
      ...prev,
      [componentType]: component
    }));
  };

  const handleRemoveComponent = (componentType: string) => {
    setSelectedComponents(prev => ({
      ...prev,
      [componentType]: null
    }));
  };

  const handleSaveBuild = () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    setSaveDialogOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const totalPrice = Object.values(selectedComponents).reduce((sum, component) => {
    return sum + (component?.price || 0);
  }, 0);

  const selectedCount = Object.values(selectedComponents).filter(Boolean).length;
  const progressPercentage = (selectedCount / components.length) * 100;

  const currentComponent = components.find(c => c.id === currentComponentType);
  const componentOptions = componentDatabase[currentComponentType as keyof typeof componentDatabase] || [];

  // Get compatibility indicator for a specific component
  const getComponentCompatibilityIndicator = (componentId: string) => {
    const affectedIssues = analysisData.issues.filter(issue => 
      issue.affectedComponents.includes(componentId)
    );
    
    if (affectedIssues.some(issue => issue.type === 'error')) {
      return <XCircle className="w-4 h-4 text-destructive" />;
    } else if (affectedIssues.some(issue => issue.type === 'warning')) {
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    } else if (selectedComponents[componentId] && selectedCount >= 2) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return null;
  };

  const hasCompatibilityErrors = analysisData.issues.some(issue => issue.type === 'error');
  const hasRecommendations = analysisData.recommendations.length > 0;

  // Performance score color helper
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold border-2 border-foreground px-3 py-1 rounded">
                PC Builder
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                {showLeaderboard ? 'Builder' : 'Leaderboard'}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedCount >= 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveBuild}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Build
                </Button>
              )}
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {user.builds_count} builds
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setAuthDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              )}
              
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showLeaderboard ? (
          // Leaderboard View
          <CommunityLeaderboard />
        ) : (
          // PC Builder View
          <>
            {/* Compatibility Status Banner */}
            {selectedCount >= 2 && analysisData.status.status !== 'compatible' && (
              <div className="mb-6">
                <div className={`p-4 rounded-lg border ${
                  analysisData.status.status === 'error' 
                    ? 'bg-destructive/10 border-destructive/20' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {analysisData.status.status === 'error' ? (
                        <XCircle className="w-5 h-5 text-destructive" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      )}
                      <p className={`font-medium ${
                        analysisData.status.status === 'error' ? 'text-destructive' : 'text-yellow-800'
                      }`}>
                        {analysisData.status.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasRecommendations && (
                        <Badge variant="secondary">
                          {analysisData.recommendations.length} solution{analysisData.recommendations.length > 1 ? 's' : ''} available
                        </Badge>
                      )}
                      {selectedCount >= 2 && (
                        <Badge variant="outline" className="gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Performance: {Math.round(analysisData.performance.overall)}/100
                        </Badge>
                      )}
                      {analysisData.gamePerformances.length > 0 && (
                        <Badge variant="outline" className="gap-1">
                          🎮 {analysisData.gamePerformances.length} games benchmarked
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Component Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {components.map((component) => {
                const IconComponent = component.icon;
                const selectedComponent = selectedComponents[component.id];
                const isSelected = !!selectedComponent;
                const compatibilityIndicator = getComponentCompatibilityIndicator(component.id);
                const hasRecommendationsForComponent = analysisData.recommendations.some(
                  rec => rec.componentType === component.id
                );
                
                return (
                  <Card 
                    key={component.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group ${
                      isSelected ? 'ring-2 ring-primary border-primary' : ''
                    } ${hasRecommendationsForComponent ? 'ring-1 ring-blue-300 border-blue-200' : ''}`}
                    onClick={() => handleOpenDialog(component.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center relative">
                        <div className={`p-4 rounded-lg transition-colors ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted group-hover:bg-accent'
                        }`}>
                          <IconComponent className={`w-12 h-12 ${
                            isSelected 
                              ? 'text-primary-foreground' 
                              : 'text-muted-foreground group-hover:text-accent-foreground'
                          }`} />
                        </div>
                        {compatibilityIndicator && (
                          <div className="absolute -top-1 -right-1 bg-card rounded-full p-1">
                            {compatibilityIndicator}
                          </div>
                        )}
                        {hasRecommendationsForComponent && !isSelected && (
                          <div className="absolute -top-1 -left-1 bg-blue-500 text-white rounded-full p-1">
                            <CheckCircle className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      
                      <h3 className="mb-2">{component.name}</h3>
                      
                      {isSelected ? (
                        <div className="space-y-2">
                          <div className="flex justify-center gap-2 flex-wrap">
                            <Badge variant="default">Selected</Badge>
                            {compatibilityIndicator && (
                              <Badge 
                                variant={
                                  analysisData.issues.some(issue => 
                                    issue.affectedComponents.includes(component.id) && issue.type === 'error'
                                  ) ? 'destructive' : 
                                  analysisData.issues.some(issue => 
                                    issue.affectedComponents.includes(component.id) && issue.type === 'warning'
                                  ) ? 'secondary' : 'default'
                                }
                                className="text-xs"
                              >
                                {analysisData.issues.some(issue => 
                                  issue.affectedComponents.includes(component.id) && issue.type === 'error'
                                ) ? 'Issue' : 
                                analysisData.issues.some(issue => 
                                  issue.affectedComponents.includes(component.id) && issue.type === 'warning'
                                ) ? 'Warning' : 'Compatible'}
                              </Badge>
                            )}
                            {hasRecommendationsForComponent && (
                              <Badge variant="outline" className="text-xs border-blue-300 text-blue-600">
                                Better options
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium">{selectedComponent.brand} {selectedComponent.name}</p>
                          <p className="text-lg font-semibold">${selectedComponent.price.toLocaleString()}</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground mb-4">
                            {component.description}
                          </p>
                          <Button 
                            variant={hasRecommendationsForComponent ? "default" : "outline"}
                            size="sm" 
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                          >
                            {hasRecommendationsForComponent ? 'View Recommended' : 'Select Component'}
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Performance Metrics with Game Benchmarks */}
            {selectedCount >= 2 && (
              <div className="mt-8">
                <PerformanceMetrics 
                  performance={analysisData.performance}
                  contributions={analysisData.contributions}
                  gamePerformances={analysisData.gamePerformances}
                  applicationPerformances={analysisData.applicationPerformances}
                  selectedCount={selectedCount}
                />
              </div>
            )}

            {/* Compatibility Panel with Recommendations */}
            {selectedCount >= 2 && (
              <div className="mt-8">
                <CompatibilityPanel 
                  issues={analysisData.issues}
                  status={analysisData.status}
                  selectedCount={selectedCount}
                  recommendations={analysisData.recommendations}
                  selectedComponents={selectedComponents}
                  onSelectRecommendation={handleSelectRecommendation}
                />
              </div>
            )}

            {/* Selected Components Summary */}
            {selectedCount > 0 && (
              <div className="mt-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3>Selected Components</h3>
                      <div className="flex items-center gap-2">
                        {selectedCount >= 2 && (
                          <Badge variant="outline" className="gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span className={getPerformanceColor(analysisData.performance.overall)}>
                              Performance: {Math.round(analysisData.performance.overall)}/100
                            </span>
                          </Badge>
                        )}
                        {analysisData.gamePerformances.length > 0 && (
                          <Badge variant="outline" className="gap-1">
                            🎮 {analysisData.gamePerformances.length} games
                          </Badge>
                        )}
                        {selectedCount >= 2 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSaveBuild}
                            className="flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            Save
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(selectedComponents).map(([type, component]) => {
                        if (!component) return null;
                        const componentInfo = components.find(c => c.id === type);
                        const hasIssues = analysisData.issues.some(issue => 
                          issue.affectedComponents.includes(type)
                        );
                        const hasRecommendationsForComponent = analysisData.recommendations.some(
                          rec => rec.componentType === type
                        );
                        
                        return (
                          <div key={type} className={`flex items-center justify-between p-3 rounded-lg ${
                            hasIssues ? 'bg-destructive/5 border border-destructive/20' : 'bg-muted'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                                {componentInfo && <componentInfo.icon className="w-4 h-4 text-primary-foreground" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{component.brand} {component.name}</p>
                                  {hasRecommendationsForComponent && (
                                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-600">
                                      Upgrade available
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{componentInfo?.name}</p>
                              </div>
                              {hasIssues && (
                                <AlertTriangle className="w-4 h-4 text-destructive" />
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">${component.price.toLocaleString()}</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveComponent(type)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Build Summary */}
            <div className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl mb-2">Your Build</h2>
                      <p className="text-muted-foreground">
                        {selectedCount === 0 
                          ? 'Select components above to start building your PC'
                          : `${selectedCount} of ${components.length} components selected`
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Estimated Total</p>
                      <p className="text-2xl font-semibold">${totalPrice.toLocaleString()}</p>
                      {selectedCount >= 2 && (
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <TrendingUp className="w-3 h-3 text-primary" />
                          <span className={`text-sm ${getPerformanceColor(analysisData.performance.overall)}`}>
                            {Math.round(analysisData.performance.overall)}/100 Performance
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Build Progress:</span>
                      <span>{selectedCount} / {components.length} components</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    {selectedCount === components.length && (
                      <div className="mt-4">
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1" 
                            size="lg"
                            disabled={hasCompatibilityErrors}
                            onClick={handleSaveBuild}
                          >
                            {hasCompatibilityErrors 
                              ? 'Resolve Compatibility Issues First' 
                              : `Save & Share Build - $${totalPrice.toLocaleString()}`
                            }
                          </Button>
                        </div>
                        {hasCompatibilityErrors && (
                          <p className="text-sm text-destructive mt-2 text-center">
                            Fix compatibility errors before saving your build
                          </p>
                        )}
                        {!hasCompatibilityErrors && selectedCount === components.length && (
                          <div className="mt-3 text-center">
                            <p className="text-sm text-muted-foreground">
                              Estimated Performance: 
                              <span className={`font-medium ${getPerformanceColor(analysisData.performance.overall)} ml-1`}>
                                {Math.round(analysisData.performance.gaming.averageFps)}/100 Gaming
                              </span>
                              <span className="mx-1">•</span>
                              <span className={`font-medium ${getPerformanceColor(analysisData.performance.productivity.overall)} mr-1`}>
                                {Math.round(analysisData.performance.productivity.overall)}/100 Productivity
                              </span>
                              {analysisData.gamePerformances.length > 0 && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span className="font-medium text-primary">
                                    🎮 {analysisData.gamePerformances.length} games benchmarked
                                  </span>
                                </>
                              )}
                            </p>
                            {!user && (
                              <p className="text-xs text-muted-foreground mt-1">
                                <Button variant="link" size="sm" onClick={() => setAuthDialogOpen(true)} className="p-0 h-auto">
                                  Sign in
                                </Button> to save your build and compete on leaderboards
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>

      {/* Dialogs */}
      <ComponentSelectionDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        componentType={currentComponentType}
        componentName={currentComponent?.name || ''}
        options={componentOptions}
        selectedComponent={selectedComponents[currentComponentType] || null}
        onSelectComponent={handleSelectComponent}
      />

      <AuthDialog
        isOpen={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
      />

      <SaveBuildDialog
        isOpen={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        selectedComponents={selectedComponents}
        performance={analysisData.performance}
        totalPrice={totalPrice}
        onBuildSaved={(build) => {
          console.log('Build saved:', build);
          // Could add toast notification here
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PCBuilderApp />
    </AuthProvider>
  );
}