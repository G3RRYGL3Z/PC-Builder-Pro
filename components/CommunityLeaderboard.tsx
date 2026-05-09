import { useState, useEffect } from 'react';
import {
  Trophy, Medal, Crown, Eye, Heart, Calendar,
  Gamepad2, Video, Monitor, Loader2, User,
  TrendingUp, Wrench, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { buildService } from '../services/buildService';
import { useAuth } from '../contexts/AuthContext';

// ── Interfaces ─────────────────────────────────────────────────────────────

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

// FIX: Distinguish between "backend not ready" and a real user-facing error.
// Previously both states showed the same red error alert.
type LoadState = 'loading' | 'coming-soon' | 'error' | 'ready';

// ── Helpers ────────────────────────────────────────────────────────────────

function getRankIcon(rank: number) {
  switch (rank) {
    case 1: return <Crown  className="w-5 h-5 text-yellow-500" />;
    case 2: return <Trophy className="w-5 h-5 text-gray-400"   />;
    case 3: return <Medal  className="w-5 h-5 text-amber-600"  />;
    default:
      return (
        <span className="w-5 h-5 flex items-center justify-center text-sm font-medium text-muted-foreground">
          #{rank}
        </span>
      );
  }
}

function getRankBadgeColor(rank: number): string {
  if (rank === 1)  return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
  if (rank === 2)  return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
  if (rank === 3)  return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
  if (rank <= 10)  return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
  return 'bg-muted text-muted-foreground';
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 60) return 'text-orange-600';
  return 'text-red-600';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

function getMainComponent(components: any): string {
  const gpu = components?.gpu;
  const cpu = components?.processor;
  if (gpu) return `${gpu.brand} ${gpu.name}`;
  if (cpu) return `${cpu.brand} ${cpu.name}`;
  return 'Custom Build';
}

// FIX: Detects whether a caught error is a network/fetch failure
// (backend not deployed) vs a real server error the user should see.
function isBackendUnavailable(error: any): boolean {
  const msg = (error?.message || '').toLowerCase();
  return (
    msg.includes('failed to fetch') ||
    msg.includes('network') ||
    msg.includes('connection refused') ||
    msg.includes('load failed') ||
    msg.includes('networkerror') ||
    error?.name === 'TypeError' // fetch throws TypeError on network failure
  );
}

// ── Shared LeaderboardList sub-component (eliminates repeated JSX) ─────────

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  totalBuilds: number;
  emptyIcon: React.ElementType;
  emptyMessage: string;
  scoreLabel: string;
  currentUserId?: string;
}

function LeaderboardList({
  entries,
  totalBuilds,
  emptyIcon: EmptyIcon,
  emptyMessage,
  scoreLabel,
  currentUserId
}: LeaderboardListProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary">{totalBuilds} total builds</Badge>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <EmptyIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>{emptyMessage}</p>
          <p className="text-sm mt-1">Be the first to submit a build!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.build_id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-colors hover:shadow-md ${
                entry.user_id === currentUserId
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-muted/50'
              }`}
            >
              <Badge className={`${getRankBadgeColor(entry.rank)} border-0 shrink-0`}>
                {getRankIcon(entry.rank)}
                <span className="ml-1">#{entry.rank}</span>
              </Badge>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-medium truncate">{entry.build_name}</h4>
                  {entry.user_id === currentUserId && (
                    <Badge variant="outline" className="text-xs shrink-0">Your Build</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <User    className="w-3 h-3" />
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

              <div className="text-right shrink-0">
                <div className={`text-xl font-semibold ${getScoreColor(entry.score)}`}>
                  {entry.score}
                </div>
                <p className="text-xs text-muted-foreground">{scoreLabel}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="font-medium">${entry.total_price.toLocaleString()}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-end">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {entry.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {entry.views}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Coming Soon placeholder ────────────────────────────────────────────────

// FIX: This is now the PRIMARY state shown when the backend is unavailable.
// Previously it was buried below a red error alert. Now it's the only thing
// the user sees — clean, informative, no scary error messages.
function ComingSoonState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="space-y-6">
      {/* Hero message */}
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Community Hub Coming Soon</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          The leaderboard and community features are under construction.
          Check back soon to share your build and compete with others.
        </p>
      </div>

      {/* What's available now */}
      <div className="p-5 bg-muted/50 rounded-lg border">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-primary" />
          What you can do right now
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Gamepad2,   text: 'Build and test PC configurations' },
            { icon: TrendingUp, text: 'Real-time compatibility checking'  },
            { icon: Star,       text: 'View performance benchmarks'       },
            { icon: Monitor,    text: 'See detailed component analysis'   },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="w-4 h-4 text-primary shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* What's coming */}
      <div className="p-5 bg-muted/50 rounded-lg border">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          Coming to the community hub
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Trophy, text: 'Performance leaderboards'         },
            { icon: Heart,  text: 'Upvote and save community builds' },
            { icon: User,   text: 'Builder profiles and stats'       },
            { icon: Video,  text: 'Share builds with a unique link'  },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="opacity-70">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle retry — doesn't draw attention but is available */}
      <div className="text-center">
        <Button variant="ghost" size="sm" onClick={onRetry} className="text-xs text-muted-foreground">
          Check again
        </Button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export function CommunityLeaderboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab]         = useState<'overall' | 'gaming' | 'productivity' | 'popular'>('overall');
  const [leaderboard, setLeaderboard]     = useState<LeaderboardEntry[]>([]);
  const [popularBuilds, setPopularBuilds] = useState<PopularBuild[]>([]);
  const [loadState, setLoadState]         = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage]   = useState('');
  const [totalBuilds, setTotalBuilds]     = useState(0);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoadState('loading');
      setErrorMessage('');

      if (activeTab === 'popular') {
        const builds = await buildService.getPopularBuilds(50);
        setPopularBuilds(builds);
      } else {
        const data = await buildService.getLeaderboard(activeTab, 50);
        setLeaderboard(data.leaderboard);
        setTotalBuilds(data.total_builds);
      }

      setLoadState('ready');
    } catch (error: any) {
      console.error('Failed to load leaderboard:', error);

      // FIX: Separate "backend not deployed yet" from real errors.
      // Network failures → show Coming Soon state (no red alert).
      // Actual server errors (4xx/5xx) → show error message.
      if (isBackendUnavailable(error)) {
        setLoadState('coming-soon');
      } else {
        setErrorMessage(error.message || 'Something went wrong. Please try again.');
        setLoadState('error');
      }
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loadState === 'loading') {
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

  // FIX: Coming Soon replaces the old error+fallback pattern.
  // Users see a clean, friendly placeholder instead of a red crash message.
  if (loadState === 'coming-soon') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Community Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ComingSoonState onRetry={loadData} />
        </CardContent>
      </Card>
    );
  }

  // FIX: Real server errors (not network failures) show a minimal message
  // without the jarring red alert that used to appear for all error types.
  if (loadState === 'error') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Community Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <Button onClick={loadData} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Ready state ──────────────────────────────────────────────────────────
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
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overall"      className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Overall
            </TabsTrigger>
            <TabsTrigger value="gaming"       className="flex items-center gap-1">
              <Gamepad2   className="w-3 h-3" /> Gaming
            </TabsTrigger>
            <TabsTrigger value="productivity" className="flex items-center gap-1">
              <Video      className="w-3 h-3" /> Work
            </TabsTrigger>
            <TabsTrigger value="popular"      className="flex items-center gap-1">
              <Heart      className="w-3 h-3" /> Popular
            </TabsTrigger>
          </TabsList>

          {/* FIX: Replaced three near-identical tab bodies with a shared
              LeaderboardList component. Any future UI change (e.g. adding a
              "View Build" button) only needs to be made in one place. */}
          <TabsContent value="overall" className="mt-4">
            <LeaderboardList
              entries={leaderboard}
              totalBuilds={totalBuilds}
              emptyIcon={Trophy}
              emptyMessage="No builds in the leaderboard yet."
              scoreLabel="Performance Score"
              currentUserId={user?.id}
            />
          </TabsContent>

          <TabsContent value="gaming" className="mt-4">
            <LeaderboardList
              entries={leaderboard}
              totalBuilds={totalBuilds}
              emptyIcon={Gamepad2}
              emptyMessage="No gaming builds in the leaderboard yet."
              scoreLabel="Gaming FPS"
              currentUserId={user?.id}
            />
          </TabsContent>

          <TabsContent value="productivity" className="mt-4">
            <LeaderboardList
              entries={leaderboard}
              totalBuilds={totalBuilds}
              emptyIcon={Video}
              emptyMessage="No productivity builds in the leaderboard yet."
              scoreLabel="Work Score"
              currentUserId={user?.id}
            />
          </TabsContent>

          <TabsContent value="popular" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary">{popularBuilds.length} builds</Badge>
            </div>

            {popularBuilds.length === 0 ? (
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
                    <Badge className={`${getRankBadgeColor(index + 1)} border-0 shrink-0`}>
                      {getRankIcon(index + 1)}
                      <span className="ml-1">#{index + 1}</span>
                    </Badge>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-medium truncate">{build.build_name}</h4>
                        {build.user_id === user?.id && (
                          <Badge variant="outline" className="text-xs shrink-0">Your Build</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <User       className="w-3 h-3" /> {build.user_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> {build.performance_score} score
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar   className="w-3 h-3" /> {formatDate(build.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-medium">${build.total_price.toLocaleString()}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-end">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500" /> {build.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {build.views}
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