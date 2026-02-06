import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, Eye, Heart, Calendar, DollarSign, Gamepad2, Video, Monitor, Loader2, User, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { buildService } from '../services/buildService';
import { useAuth } from '../contexts/AuthContext';

interface LeaderboardEntry {
  rank: number;
  build_id: string;
  build_name: string;
  user_name: string;
  user_id: string;
  score: number;
  total_price: number;
  created_at: string;
  likes: number;
  views: number;
  components: any;
}

interface PopularBuild {
  build_id: string;
  build_name: string;
  user_name: string;
  user_id: string;
  performance_score: number;
  total_price: number;
  created_at: string;
  likes: number;
  views: number;
  popularity_score: number;
}

export function CommunityLeaderboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overall' | 'gaming' | 'productivity' | 'popular'>('overall');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [popularBuilds, setPopularBuilds] = useState<PopularBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalBuilds, setTotalBuilds] = useState(0);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (activeTab === 'popular') {
        const builds = await buildService.getPopularBuilds(50);
        setPopularBuilds(builds);
      } else {
        const data = await buildService.getLeaderboard(activeTab, 50);
        setLeaderboard(data.leaderboard);
        setTotalBuilds(data.total_builds);
      }
    } catch (error: any) {
      console.error('Failed to load leaderboard:', error);
      setError(error.message || 'Unable to connect to community server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-medium text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
    if (rank <= 10) return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    return 'bg-muted text-muted-foreground';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getMainComponent = (components: any) => {
    const cpu = components?.processor;
    const gpu = components?.gpu;
    
    if (gpu) {
      return `${gpu.brand} ${gpu.name}`;
    } else if (cpu) {
      return `${cpu.brand} ${cpu.name}`;
    }
    return 'Custom Build';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Community Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading leaderboard...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Community Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              The community features require an active connection to our servers. 
              Make sure you're connected to the internet and try again.
            </p>
            <Button onClick={loadData} variant="outline">
              Try Again
            </Button>
          </div>
          
          {/* Fallback content */}
          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Community Features Coming Soon</h3>
            <p className="text-sm text-muted-foreground mb-4">
              While we work on getting the community servers online, you can still:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Build and test PC configurations locally</li>
              <li>• Get real-time compatibility checking</li>
              <li>• View performance benchmarks for games</li>
              <li>• See detailed component recommendations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isEmpty = activeTab === 'popular' ? popularBuilds.length === 0 : leaderboard.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Community Leaderboard
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Discover the highest performing PC builds from our community
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overall" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Overall
            </TabsTrigger>
            <TabsTrigger value="gaming" className="flex items-center gap-1">
              <Gamepad2 className="w-3 h-3" />
              Gaming
            </TabsTrigger>
            <TabsTrigger value="productivity" className="flex items-center gap-1">
              <Video className="w-3 h-3" />
              Work
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              Popular
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Top Overall Performance</h3>
              <Badge variant="secondary">{totalBuilds} total builds</Badge>
            </div>
            
            {isEmpty ? (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No builds in the leaderboard yet.</p>
                <p className="text-sm">Be the first to submit a build!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.build_id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors hover:shadow-md ${
                      entry.user_id === user?.id ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={`${getRankBadgeColor(entry.rank)} border-0`}>
                        {getRankIcon(entry.rank)}
                        <span className="ml-1">#{entry.rank}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{entry.build_name}</h4>
                        {entry.user_id === user?.id && (
                          <Badge variant="outline" className="text-xs">Your Build</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {entry.user_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Monitor className="w-3 h-3" />
                          {getMainComponent(entry.components)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(entry.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-xl font-semibold ${getScoreColor(entry.score)}`}>
                        {entry.score}
                      </div>
                      <p className="text-xs text-muted-foreground">Performance Score</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">${entry.total_price.toLocaleString()}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {entry.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {entry.views}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="gaming" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Top Gaming Performance</h3>
              <Badge variant="secondary">{totalBuilds} total builds</Badge>
            </div>
            
            {isEmpty ? (
              <div className="text-center py-8 text-muted-foreground">
                <Gamepad2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No gaming builds in the leaderboard yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.build_id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors hover:shadow-md ${
                      entry.user_id === user?.id ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={`${getRankBadgeColor(entry.rank)} border-0`}>
                        {getRankIcon(entry.rank)}
                        <span className="ml-1">#{entry.rank}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{entry.build_name}</h4>
                        {entry.user_id === user?.id && (
                          <Badge variant="outline" className="text-xs">Your Build</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {entry.user_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Monitor className="w-3 h-3" />
                          {getMainComponent(entry.components)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-xl font-semibold ${getScoreColor(entry.score)}`}>
                        {entry.score}
                      </div>
                      <p className="text-xs text-muted-foreground">Gaming FPS</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">${entry.total_price.toLocaleString()}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {entry.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {entry.views}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="productivity" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Top Productivity Performance</h3>
              <Badge variant="secondary">{totalBuilds} total builds</Badge>
            </div>
            
            {isEmpty ? (
              <div className="text-center py-8 text-muted-foreground">
                <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No productivity builds in the leaderboard yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.build_id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors hover:shadow-md ${
                      entry.user_id === user?.id ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={`${getRankBadgeColor(entry.rank)} border-0`}>
                        {getRankIcon(entry.rank)}
                        <span className="ml-1">#{entry.rank}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{entry.build_name}</h4>
                        {entry.user_id === user?.id && (
                          <Badge variant="outline" className="text-xs">Your Build</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {entry.user_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Monitor className="w-3 h-3" />
                          {getMainComponent(entry.components)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-xl font-semibold ${getScoreColor(entry.score)}`}>
                        {entry.score}
                      </div>
                      <p className="text-xs text-muted-foreground">Work Score</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">${entry.total_price.toLocaleString()}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {entry.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {entry.views}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="popular" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Most Popular Builds</h3>
              <Badge variant="secondary">{popularBuilds.length} builds</Badge>
            </div>
            
            {isEmpty ? (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No popular builds yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {popularBuilds.map((build, index) => (
                  <div 
                    key={build.build_id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors hover:shadow-md ${
                      build.user_id === user?.id ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={`${getRankBadgeColor(index + 1)} border-0`}>
                        {getRankIcon(index + 1)}
                        <span className="ml-1">#{index + 1}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{build.build_name}</h4>
                        {build.user_id === user?.id && (
                          <Badge variant="outline" className="text-xs">Your Build</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {build.user_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {build.performance_score} performance
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(build.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">${build.total_price.toLocaleString()}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-end">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          {build.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {build.views}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}