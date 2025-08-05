import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-5314a707`;

interface Build {
  id: string;
  user_id: string;
  name: string;
  description: string;
  components: any;
  performance: any;
  total_price: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  likes: number;
  views: number;
}

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

async function getAuthToken(): Promise<string | null> {
  // Check for demo token first
  const demoToken = localStorage.getItem('demo_token');
  if (demoToken) {
    return demoToken;
  }
  
  // Get regular Supabase token
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export const buildService = {
  async saveBuild(buildData: {
    name: string;
    description?: string;
    components: any;
    performance: any;
    total_price: number;
    is_public?: boolean;
  }): Promise<Build> {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required to save builds');
    }

    const response = await fetch(`${serverUrl}/builds`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(buildData)
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || 'Failed to save build');
    }

    const { build } = await response.json();
    return build;
  },

  async getUserBuilds(): Promise<Build[]> {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required to view builds');
    }

    const response = await fetch(`${serverUrl}/builds/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || 'Failed to get builds');
    }

    const { builds } = await response.json();
    return builds;
  },

  async getBuild(buildId: string): Promise<Build> {
    const response = await fetch(`${serverUrl}/builds/${buildId}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || 'Failed to get build');
    }

    const { build } = await response.json();
    return build;
  },

  async updateBuild(buildId: string, updateData: Partial<Build>): Promise<Build> {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required to update builds');
    }

    const response = await fetch(`${serverUrl}/builds/${buildId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || 'Failed to update build');
    }

    const { build } = await response.json();
    return build;
  },

  async deleteBuild(buildId: string): Promise<void> {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required to delete builds');
    }

    const response = await fetch(`${serverUrl}/builds/${buildId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || 'Failed to delete build');
    }
  },

  async getLeaderboard(category: 'overall' | 'gaming' | 'productivity' = 'overall', limit: number = 50): Promise<{
    leaderboard: LeaderboardEntry[];
    category: string;
    total_builds: number;
  }> {
    const response = await fetch(`${serverUrl}/leaderboard/performance?category=${category}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || 'Failed to get leaderboard');
    }

    return await response.json();
  },

  async getPopularBuilds(limit: number = 20): Promise<PopularBuild[]> {
    const response = await fetch(`${serverUrl}/leaderboard/popular?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || 'Failed to get popular builds');
    }

    const { popular_builds } = await response.json();
    return popular_builds;
  },

  async likeBuild(buildId: string): Promise<number> {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required to like builds');
    }

    const response = await fetch(`${serverUrl}/builds/${buildId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || 'Failed to like build');
    }

    const { likes } = await response.json();
    return likes;
  },

  async unlikeBuild(buildId: string): Promise<number> {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required to unlike builds');
    }

    const response = await fetch(`${serverUrl}/builds/${buildId}/like`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || 'Failed to unlike build');
    }

    const { likes } = await response.json();
    return likes;
  }
};