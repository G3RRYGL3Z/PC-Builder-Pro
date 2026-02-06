import { supabase, isSupabaseConfigured } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface Build {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  components: Record<string, any>;
  performance_score: number;
  gaming_score: number;
  productivity_score: number;
  total_price: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  views: number;
  likes: number;
  user?: {
    name: string;
  };
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  user_name: string;
  performance_score: number;
  gaming_score: number;
  productivity_score: number;
  total_price: number;
  views: number;
  likes: number;
  created_at: string;
}

// Demo data for when Supabase is not configured
const DEMO_BUILDS: Build[] = [
  {
    id: 'demo-build-1',
    user_id: 'demo-user-id',
    name: 'Gaming Beast 4090',
    description: 'High-end gaming build for 4K gaming',
    components: {},
    performance_score: 95,
    gaming_score: 98,
    productivity_score: 92,
    total_price: 4299,
    is_public: true,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    views: 1247,
    likes: 89,
    user: { name: 'Pro Gamer' }
  },
  {
    id: 'demo-build-2',
    user_id: 'demo-user-2',
    name: 'Workstation Pro',
    description: 'Content creation powerhouse',
    components: {},
    performance_score: 88,
    gaming_score: 82,
    productivity_score: 96,
    total_price: 3899,
    is_public: true,
    created_at: '2024-01-14T16:20:00Z',
    updated_at: '2024-01-14T16:20:00Z',
    views: 956,
    likes: 67,
    user: { name: 'Creator Studio' }
  },
  {
    id: 'demo-build-3',
    user_id: 'demo-user-3',
    name: 'Budget Champion',
    description: 'Best value for 1440p gaming',
    components: {},
    performance_score: 78,
    gaming_score: 85,
    productivity_score: 71,
    total_price: 1299,
    is_public: true,
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    views: 2103,
    likes: 156,
    user: { name: 'Budget Builder' }
  }
];

class BuildService {
  private async makeRequest(url: string, options: RequestInit = {}) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured - using demo mode');
    }

    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5314a707${url}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async saveBuild(buildData: Partial<Build>, accessToken: string): Promise<{ success: boolean; build?: Build; error?: string }> {
    if (!isSupabaseConfigured) {
      // Demo mode - simulate save
      const demoSession = localStorage.getItem('demo-session');
      if (demoSession !== 'active') {
        return { success: false, error: 'Demo mode: Please sign in with demo account first' };
      }

      const mockBuild: Build = {
        id: `demo-${Date.now()}`,
        user_id: 'demo-user-id',
        name: buildData.name || 'Demo Build',
        description: buildData.description,
        components: buildData.components || {},
        performance_score: buildData.performance_score || 80,
        gaming_score: buildData.gaming_score || 85,
        productivity_score: buildData.productivity_score || 75,
        total_price: buildData.total_price || 2000,
        is_public: buildData.is_public || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0,
        likes: 0,
        user: { name: 'Demo User' }
      };

      // Store in localStorage for demo persistence
      const demoBuilds = JSON.parse(localStorage.getItem('demo-builds') || '[]');
      demoBuilds.push(mockBuild);
      localStorage.setItem('demo-builds', JSON.stringify(demoBuilds));

      return { success: true, build: mockBuild };
    }

    try {
      const response = await this.makeRequest('/builds', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(buildData)
      });

      return { success: true, build: response.build };
    } catch (error: any) {
      console.error('Save build error:', error);
      return { success: false, error: error.message || 'Failed to save build' };
    }
  }

  async getUserBuilds(accessToken: string): Promise<{ success: boolean; builds?: Build[]; error?: string }> {
    if (!isSupabaseConfigured) {
      // Demo mode - return builds from localStorage
      const demoSession = localStorage.getItem('demo-session');
      if (demoSession !== 'active') {
        return { success: false, error: 'Demo mode: Please sign in first' };
      }

      const demoBuilds = JSON.parse(localStorage.getItem('demo-builds') || '[]');
      return { success: true, builds: demoBuilds };
    }

    try {
      const response = await this.makeRequest('/builds', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return { success: true, builds: response.builds };
    } catch (error: any) {
      console.error('Get user builds error:', error);
      return { success: false, error: error.message || 'Failed to get builds' };
    }
  }

  async getLeaderboard(category: 'overall' | 'gaming' | 'productivity' = 'overall', limit: number = 50): Promise<{ leaderboard: any[]; total_builds: number }> {
    if (!isSupabaseConfigured) {
      // Demo mode - return sorted demo builds
      let sortedBuilds = [...DEMO_BUILDS];

      switch (category) {
        case 'gaming':
          sortedBuilds.sort((a, b) => b.gaming_score - a.gaming_score);
          break;
        case 'productivity':
          sortedBuilds.sort((a, b) => b.productivity_score - a.productivity_score);
          break;
        default:
          sortedBuilds.sort((a, b) => b.performance_score - a.performance_score);
      }

      const leaderboard = sortedBuilds.slice(0, limit).map((build, index) => ({
        rank: index + 1,
        build_id: build.id,
        build_name: build.name,
        user_name: build.user?.name || 'Anonymous',
        user_id: build.user_id,
        score: category === 'gaming' ? build.gaming_score : category === 'productivity' ? build.productivity_score : build.performance_score,
        total_price: build.total_price,
        created_at: build.created_at,
        likes: build.likes,
        views: build.views,
        components: build.components
      }));

      return { leaderboard, total_builds: sortedBuilds.length };
    }

    try {
      const response = await this.makeRequest(`/leaderboard?category=${category}&limit=${limit}`);
      return { leaderboard: response.leaderboard || [], total_builds: response.total_builds || 0 };
    } catch (error: any) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  }

  async getPopularBuilds(limit: number = 50): Promise<any[]> {
    if (!isSupabaseConfigured) {
      // Demo mode - return sorted by popularity
      const sortedBuilds = [...DEMO_BUILDS].sort((a, b) => {
        const popularityA = a.likes * 2 + a.views;
        const popularityB = b.likes * 2 + b.views;
        return popularityB - popularityA;
      });

      return sortedBuilds.slice(0, limit).map(build => ({
        build_id: build.id,
        build_name: build.name,
        user_name: build.user?.name || 'Anonymous',
        user_id: build.user_id,
        performance_score: build.performance_score,
        total_price: build.total_price,
        created_at: build.created_at,
        likes: build.likes,
        views: build.views,
        popularity_score: build.likes * 2 + build.views
      }));
    }

    try {
      const response = await this.makeRequest(`/popular-builds?limit=${limit}`);
      return response.builds || [];
    } catch (error: any) {
      console.error('Get popular builds error:', error);
      throw error;
    }
  }

  async likeBuild(buildId: string, accessToken: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Demo mode: Like feature not available' };
    }

    try {
      await this.makeRequest(`/builds/${buildId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return { success: true };
    } catch (error: any) {
      console.error('Like build error:', error);
      return { success: false, error: error.message || 'Failed to like build' };
    }
  }
}

export const buildService = new BuildService();