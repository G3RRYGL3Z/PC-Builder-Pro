import { useState, useMemo } from 'react';
import { Menu, Cpu, Fan, CircuitBoard, MonitorSpeaker, HardDrive, Zap, PcCase, MemoryStick, X, AlertTriangle, CheckCircle, XCircle, TrendingUp, User, LogIn, Save, Trophy, Gamepad2 } from 'lucide-react';
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
import { PerformanceDetailsPage } from './components/PerformanceDetailsPage';
import { GameBenchmarksPage } from './components/GameBenchmarksPage';
import { ApplicationBenchmarksPage } from './components/ApplicationBenchmarksPage';
import { CompatibilityDetailsPage } from './components/CompatibilityDetailsPage';
import { ErrorBoundary } from './components/ErrorBoundary';
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

type ViewType = 'builder' | 'leaderboard' | 'performance-details' | 'game-benchmarks' | 'app-benchmarks' | 'compatibility-details';

function PCBuilderApp() {
  const { user, signOut, isSupabaseAvailable } = useAuth();
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({
    // Pre-populate with some default components to make the app more interactive
    processor: {
      id: 'cpu-2',
      name: 'Ryzen 9 7900X',
      brand: 'AMD',
      price: 429,
      specifications: {
        'Cores': '12',
        'Threads': '24',
        'Base Clock': '4.7 GHz',
        'Boost Clock': '5.6 GHz',
        'Socket': 'AM5',
        'TDP': '170W'
      }
    },
    'cpu-cooler': {
      id: 'cooler-2',
      name: 'Kraken X63',
      brand: 'NZXT',
      price: 149,
      specifications: {
        'Type': 'AIO Liquid',
        'Radiator Size': '280mm',
        'Fans': '2x 140mm',
        'Socket Support': 'LGA1700, AM5, AM4',
        'Pump Speed': '2800 RPM'
      }
    },
    motherboard: {
      id: 'mb-2',
      name: 'X670E Aorus Master',
      brand: 'Gigabyte',
      price: 499,
      specifications: {
        'Socket': 'AM5',
        'Chipset': 'X670E',
        'Form Factor': 'ATX',
        'Memory': 'DDR5-6400+ (OC)',
        'PCIe Slots': '4x PCIe 5.0',
        'WiFi': 'WiFi 6E'
      }
    },
    gpu: {
      id: 'gpu-3',
      name: 'Radeon RX 7800 XT',
      brand: 'AMD',
      price: 499,
      specifications: {
        'Memory': '16GB GDDR6',
        'Game Clock': '2124 MHz',
        'Boost Clock': '2430 MHz',
        'Stream Processors': '3840',
        'Memory Bus': '256-bit',
        'TDP': '263W'
      }
    },
    memory: {
      id: 'ram-1',
      name: 'Trident Z5 RGB 32GB',
      brand: 'G.Skill',
      price: 179,
      specifications: {
        'Capacity': '32GB (2x16GB)',
        'Type': 'DDR5',
        'Speed': '6000 MHz',
        'Timings': 'CL30-38-38-96',
        'Voltage': '1.35V',
        'RGB': 'Yes'
      }
    },
    storage: {
      id: 'ssd-1',
      name: '980 PRO 2TB',
      brand: 'Samsung',
      price: 199,
      specifications: {
        'Capacity': '2TB',
        'Type': 'NVMe M.2',
        'Interface': 'PCIe 4.0',
        'Read Speed': '7000 MB/s',
        'Write Speed': '6900 MB/s',
        'Form Factor': '2280'
      }
    },
    'power-supply': {
      id: 'psu-1',
      name: 'RM1000x',
      brand: 'Corsair',
      price: 199,
      specifications: {
        'Wattage': '1000W',
        'Efficiency': '80+ Gold',
        'Modular': 'Fully Modular',
        'Form Factor': 'ATX',
        'Fan Size': '135mm',
        'Warranty': '10 Years'
      }
    },
    case: {
      id: 'case-1',
      name: 'H7 Flow',
      brand: 'NZXT',
      price: 149,
      specifications: {
        'Form Factor': 'Mid-Tower ATX',
        'Dimensions': '435 x 230 x 494mm',
        'Clearances': 'GPU: 381mm, CPU: 185mm',
        'Drive Bays': '2x 3.5", 4x 2.5"',
        'Front I/O': '1x USB-C, 2x USB-A',
        'Fans Included': '3x 120mm'
      }
    }
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentComponentType, setCurrentComponentType] = useState<string>('');
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('builder');

  // Memoized compatibility checking, recommendations, and performance analysis
  const analysisData = useMemo(() => {
    const issues = checkCompatibility(selectedComponents);
    const status = getCompatibilityStatus(issues);
    const recommendations = generateRecommendations(issues, selectedComponents);
    const performance = calculatePerformanceMetrics(selectedComponents);
    const contributions = analyzePerformanceBottlenecks(selectedComponents);
    const gamePerformances = calculateGamePerformance(selectedComponents);
    const applicationPerformances = calculateApplicationPerformance(selectedComponents);
    
    // Transform game performances for detail page
    const transformedGamePerformances = gamePerformances.map(game => ({
      ...game,
      fps1080p: game.fps.resolution1080p.high,
      fps1440p: game.fps.resolution1440p.high,
      fps4k: game.fps.resolution4k.high,
      requirements: game.category === 'aaa' ? 'High' : game.category === 'esports' ? 'Low' : 'Medium'
    }));

    // Transform application performances for detail page
    const transformedAppPerformances = applicationPerformances.map(app => ({
      ...app,
      score: app.overallScore,
      tasks: app.tasks.map(task => ({
        name: task.taskName,
        performance: task.value,
        description: task.description
      })),
      notes: app.tasks[0]?.description || ''
    }));
    
    return { 
      issues, 
      status, 
      recommendations, 
      performance, 
      contributions, 
      gamePerformances, 
      applicationPerformances,
      transformedGamePerformances,
      transformedAppPerformances
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
                onClick={() => setCurrentView(currentView === 'leaderboard' ? 'builder' : 'leaderboard')}
                className="flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Button>
              {!isSupabaseAvailable && (
                <Badge variant="outline" className="text-xs">
                  Demo Mode
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveBuild}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Build
              </Button>
              
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
        {currentView === 'leaderboard' ? (
          // Leaderboard View
          <CommunityLeaderboard />
        ) : currentView === 'performance-details' ? (
          // Performance Details View
          <PerformanceDetailsPage
            performance={analysisData.performance}
            contributions={analysisData.contributions}
            onBack={() => setCurrentView('builder')}
          />
        ) : currentView === 'game-benchmarks' ? (
          // Game Benchmarks View
          <GameBenchmarksPage
            gamePerformances={analysisData.transformedGamePerformances}
            onBack={() => setCurrentView('builder')}
          />
        ) : currentView === 'app-benchmarks' ? (
          // Application Benchmarks View
          <ApplicationBenchmarksPage
            applicationPerformances={analysisData.transformedAppPerformances}
            onBack={() => setCurrentView('builder')}
          />
        ) : currentView === 'compatibility-details' ? (
          // Compatibility Details View
          <CompatibilityDetailsPage
            issues={analysisData.issues}
            status={analysisData.status}
            recommendations={analysisData.recommendations}
            onBack={() => setCurrentView('builder')}
          />
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
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Component Grid - 4x2 Layout */}
            <div className="grid grid-cols-4 gap-4">
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
                    <CardContent className="p-4 text-center">
                      <div className="mb-3 flex justify-center relative">
                        <div className={`p-3 rounded-lg transition-colors ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted group-hover:bg-accent'
                        }`}>
                          <IconComponent className={`w-8 h-8 ${
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
                      
                      <h3 className="mb-2 text-sm font-medium">{component.name}</h3>
                      
                      {isSelected ? (
                        <div className="space-y-2">
                          <div className="flex justify-center gap-1 flex-wrap">
                            <Badge variant="default" className="text-xs px-2 py-1">Selected</Badge>
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
                                className="text-xs px-2 py-1"
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
                              <Badge variant="outline" className="text-xs border-blue-300 text-blue-600 px-2 py-1">
                                Better options
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs font-medium">{selectedComponent.brand} {selectedComponent.name}</p>
                          <p className="text-sm font-semibold">${selectedComponent.price.toLocaleString()}</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-muted-foreground mb-3">
                            {component.description}
                          </p>
                          <Button 
                            variant={hasRecommendationsForComponent ? "default" : "outline"}
                            size="sm" 
                            className="w-full text-xs group-hover:bg-primary group-hover:text-primary-foreground"
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

            {/* Analysis Section - 4 Cards */}
            <div className="mt-6 grid grid-cols-4 gap-4">
              {/* Performance Analysis Card */}
              <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentView('performance-details')}>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">Performance Analysis</p>
                  <p className="text-xs text-muted-foreground">
                    Score: {Math.round(analysisData.performance.overall)}/100
                  </p>
                </CardContent>
              </Card>

              {/* Game Benchmarks Card */}
              <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentView('game-benchmarks')}>
                <CardContent className="p-4 text-center">
                  <Gamepad2 className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">Game Benchmarks</p>
                  <p className="text-xs text-muted-foreground">
                    {analysisData.gamePerformances.length} games tested
                  </p>
                </CardContent>
              </Card>

              {/* Application Benchmarks Card */}
              <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentView('app-benchmarks')}>
                <CardContent className="p-4 text-center">
                  <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">Application Benchmarks</p>
                  <p className="text-xs text-muted-foreground">
                    {analysisData.applicationPerformances.length} apps tested
                  </p>
                </CardContent>
              </Card>

              {/* Compatibility Analysis Card */}
              <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentView('compatibility-details')}>
                <CardContent className="p-4 text-center">
                  {analysisData.status.status === 'compatible' ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  ) : analysisData.status.status === 'error' ? (
                    <XCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  )}
                  <p className="font-medium text-sm">Compatibility Analysis</p>
                  <p className="text-xs text-muted-foreground">
                    {analysisData.issues.length} issue{analysisData.issues.length !== 1 ? 's' : ''} found
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Selected Components List */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Selected Components</h3>
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
              <div className="space-y-2">
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
    <ErrorBoundary>
      <AuthProvider>
        <PCBuilderApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}