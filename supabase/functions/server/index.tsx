import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger());

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Initialize demo data
async function initializeDemoData() {
  try {
    // Check if demo user already exists
    const demoProfile = await kv.get('user_profile:demo-user-id');
    
    if (!demoProfile) {
      // Create demo user profile
      const demoUser = {
        id: 'demo-user-id',
        email: 'demo@pcbuilder.com',
        name: 'Demo User',
        created_at: new Date().toISOString(),
        builds_count: 3,
        highest_performance_score: 92
      };
      
      await kv.set('user_profile:demo-user-id', demoUser);
      
      // Create some demo builds
      const demoBuilds = [
        {
          id: 'demo-build-1',
          user_id: 'demo-user-id',
          name: 'Gaming Beast - RTX 4090 + i9-13900K',
          description: 'Ultimate gaming build for 4K gaming at maximum settings',
          components: {
            processor: { brand: 'Intel', name: 'Core i9-13900K', price: 589 },
            gpu: { brand: 'NVIDIA', name: 'RTX 4090', price: 1599 },
            motherboard: { brand: 'ASUS', name: 'ROG STRIX Z790-E', price: 449 },
            memory: { brand: 'G.Skill', name: 'Trident Z5 32GB DDR5-6000', price: 299 },
            storage: { brand: 'Samsung', name: '980 PRO 2TB', price: 199 },
            'power-supply': { brand: 'Corsair', name: 'RM1000x', price: 179 },
            case: { brand: 'Fractal Design', name: 'Meshify 2', price: 149 },
            'cpu-cooler': { brand: 'Noctua', name: 'NH-D15', price: 99 }
          },
          performance: {
            overall: 92,
            gaming: { averageFps: 120 },
            productivity: { overall: 88 }
          },
          total_price: 3562,
          is_public: true,
          created_at: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
          updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
          likes: 15,
          views: 234
        },
        {
          id: 'demo-build-2',
          user_id: 'demo-user-id',
          name: 'Budget Gaming - RTX 4060 + Ryzen 5 7600X',
          description: 'Great 1080p gaming performance on a budget',
          components: {
            processor: { brand: 'AMD', name: 'Ryzen 5 7600X', price: 229 },
            gpu: { brand: 'NVIDIA', name: 'RTX 4060', price: 299 },
            motherboard: { brand: 'MSI', name: 'B650 GAMING PLUS WIFI', price: 199 },
            memory: { brand: 'Corsair', name: 'Vengeance LPX 16GB DDR5-5600', price: 129 },
            storage: { brand: 'Western Digital', name: 'SN770 1TB', price: 79 },
            'power-supply': { brand: 'EVGA', name: 'BR 650W', price: 79 },
            case: { brand: 'Cooler Master', name: 'MasterBox Q300L', price: 44 },
            'cpu-cooler': { brand: 'AMD', name: 'Wraith Stealth (included)', price: 0 }
          },
          performance: {
            overall: 73,
            gaming: { averageFps: 85 },
            productivity: { overall: 71 }
          },
          total_price: 1058,
          is_public: true,
          created_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
          updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          likes: 8,
          views: 156
        },
        {
          id: 'demo-build-3',
          user_id: 'demo-user-id',
          name: 'Workstation Pro - RTX 4080 + Ryzen 9 7950X',
          description: 'High-performance workstation for content creation and productivity',
          components: {
            processor: { brand: 'AMD', name: 'Ryzen 9 7950X', price: 549 },
            gpu: { brand: 'NVIDIA', name: 'RTX 4080', price: 1199 },
            motherboard: { brand: 'ASUS', name: 'ROG STRIX X670E-E', price: 499 },
            memory: { brand: 'G.Skill', name: 'Trident Z5 64GB DDR5-5600', price: 599 },
            storage: { brand: 'Samsung', name: '980 PRO 4TB', price: 399 },
            'power-supply': { brand: 'Seasonic', name: 'Focus GX-850', price: 149 },
            case: { brand: 'be quiet!', name: 'Dark Base Pro 900', price: 249 },
            'cpu-cooler': { brand: 'NZXT', name: 'Kraken X73', price: 199 }
          },
          performance: {
            overall: 89,
            gaming: { averageFps: 110 },
            productivity: { overall: 95 }
          },
          total_price: 3842,
          is_public: true,
          created_at: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
          updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
          likes: 12,
          views: 189
        }
      ];
      
      // Save demo builds
      for (const build of demoBuilds) {
        await kv.set(`build:${build.id}`, build);
        await kv.set(`user_build:demo-user-id:${build.id}`, build.id);
        await kv.set(`public_build:${build.performance.overall}:${build.id}`, build.id);
      }
      
      console.log('Demo data initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize demo data:', error);
  }
}

// Initialize demo data on startup
initializeDemoData();

// Helper function to verify user authentication
async function verifyUser(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  
  // Check for demo user
  if (token === 'demo-token') {
    return {
      id: 'demo-user-id',
      email: 'demo@pcbuilder.com'
    };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

// Demo authentication route
app.post('/make-server-5314a707/auth/demo', async (c) => {
  try {
    const demoUser = await kv.get('user_profile:demo-user-id');
    
    if (!demoUser) {
      return c.json({ error: 'Demo user not found' }, 404);
    }
    
    return c.json({ 
      user: demoUser,
      access_token: 'demo-token'
    });
  } catch (error) {
    console.log('Demo auth error:', error);
    return c.json({ error: 'Failed to authenticate demo user' }, 500);
  }
});

// User Authentication Routes
app.post('/make-server-5314a707/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: 'Failed to create user account: ' + error.message }, 400);
    }
    
    // Store user profile in KV store
    await kv.set(`user_profile:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      created_at: new Date().toISOString(),
      builds_count: 0,
      highest_performance_score: 0
    });
    
    return c.json({ 
      user: {
        id: data.user.id,
        email: data.user.email,
        name
      }
    });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

app.get('/make-server-5314a707/auth/session', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyUser(authHeader);
    
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }
    
    // Get user profile from KV store
    const profile = await kv.get(`user_profile:${user.id}`);
    
    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.name || 'Unknown',
        builds_count: profile?.builds_count || 0,
        highest_performance_score: profile?.highest_performance_score || 0
      }
    });
  } catch (error) {
    console.log('Session error:', error);
    return c.json({ error: 'Failed to verify session' }, 500);
  }
});

// Build Management Routes
app.post('/make-server-5314a707/builds', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyUser(authHeader);
    
    if (!user) {
      return c.json({ error: 'Authentication required to save builds' }, 401);
    }
    
    const buildData = await c.req.json();
    const {
      name,
      description,
      components,
      performance,
      total_price,
      is_public = true
    } = buildData;
    
    if (!name || !components || !performance) {
      return c.json({ error: 'Build name, components, and performance data are required' }, 400);
    }
    
    const buildId = crypto.randomUUID();
    const build = {
      id: buildId,
      user_id: user.id,
      name,
      description: description || '',
      components,
      performance,
      total_price: total_price || 0,
      is_public,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes: 0,
      views: 0
    };
    
    // Save build to KV store
    await kv.set(`build:${buildId}`, build);
    await kv.set(`user_build:${user.id}:${buildId}`, buildId);
    
    // Update user profile
    const profile = await kv.get(`user_profile:${user.id}`) || {};
    const updatedProfile = {
      ...profile,
      builds_count: (profile.builds_count || 0) + 1,
      highest_performance_score: Math.max(
        profile.highest_performance_score || 0,
        performance.overall || 0
      )
    };
    await kv.set(`user_profile:${user.id}`, updatedProfile);
    
    // Add to public builds list if public
    if (is_public) {
      await kv.set(`public_build:${performance.overall}:${buildId}`, buildId);
    }
    
    return c.json({ build });
  } catch (error) {
    console.log('Save build error:', error);
    return c.json({ error: 'Failed to save build' }, 500);
  }
});

app.get('/make-server-5314a707/builds/user', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyUser(authHeader);
    
    if (!user) {
      return c.json({ error: 'Authentication required to view builds' }, 401);
    }
    
    // Get user's builds
    const userBuildKeys = await kv.getByPrefix(`user_build:${user.id}:`);
    const buildIds = userBuildKeys.map(item => item.value);
    
    const builds = await kv.mget(buildIds.map(id => `build:${id}`));
    const validBuilds = builds.filter(build => build !== null);
    
    // Sort by creation date (newest first)
    validBuilds.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return c.json({ builds: validBuilds });
  } catch (error) {
    console.log('Get user builds error:', error);
    return c.json({ error: 'Failed to get user builds' }, 500);
  }
});

app.get('/make-server-5314a707/builds/:id', async (c) => {
  try {
    const buildId = c.req.param('id');
    const build = await kv.get(`build:${buildId}`);
    
    if (!build) {
      return c.json({ error: 'Build not found' }, 404);
    }
    
    // Increment view count
    const updatedBuild = {
      ...build,
      views: (build.views || 0) + 1
    };
    await kv.set(`build:${buildId}`, updatedBuild);
    
    return c.json({ build: updatedBuild });
  } catch (error) {
    console.log('Get build error:', error);
    return c.json({ error: 'Failed to get build' }, 500);
  }
});

app.put('/make-server-5314a707/builds/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyUser(authHeader);
    
    if (!user) {
      return c.json({ error: 'Authentication required to update builds' }, 401);
    }
    
    const buildId = c.req.param('id');
    const existingBuild = await kv.get(`build:${buildId}`);
    
    if (!existingBuild) {
      return c.json({ error: 'Build not found' }, 404);
    }
    
    if (existingBuild.user_id !== user.id) {
      return c.json({ error: 'Not authorized to update this build' }, 403);
    }
    
    const updateData = await c.req.json();
    const updatedBuild = {
      ...existingBuild,
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`build:${buildId}`, updatedBuild);
    
    return c.json({ build: updatedBuild });
  } catch (error) {
    console.log('Update build error:', error);
    return c.json({ error: 'Failed to update build' }, 500);
  }
});

app.delete('/make-server-5314a707/builds/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyUser(authHeader);
    
    if (!user) {
      return c.json({ error: 'Authentication required to delete builds' }, 401);
    }
    
    const buildId = c.req.param('id');
    const build = await kv.get(`build:${buildId}`);
    
    if (!build) {
      return c.json({ error: 'Build not found' }, 404);
    }
    
    if (build.user_id !== user.id) {
      return c.json({ error: 'Not authorized to delete this build' }, 403);
    }
    
    // Delete build and related keys
    await kv.del(`build:${buildId}`);
    await kv.del(`user_build:${user.id}:${buildId}`);
    
    if (build.is_public) {
      await kv.del(`public_build:${build.performance.overall}:${buildId}`);
    }
    
    // Update user profile
    const profile = await kv.get(`user_profile:${user.id}`) || {};
    const updatedProfile = {
      ...profile,
      builds_count: Math.max(0, (profile.builds_count || 1) - 1)
    };
    await kv.set(`user_profile:${user.id}`, updatedProfile);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Delete build error:', error);
    return c.json({ error: 'Failed to delete build' }, 500);
  }
});

// Community Leaderboard Routes
app.get('/make-server-5314a707/leaderboard/performance', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const category = c.req.query('category') || 'overall'; // overall, gaming, productivity
    
    // Get all public builds
    const publicBuildKeys = await kv.getByPrefix('public_build:');
    const buildIds = publicBuildKeys.map(item => item.value);
    
    if (buildIds.length === 0) {
      return c.json({ leaderboard: [], category, total_builds: 0 });
    }
    
    const builds = await kv.mget(buildIds.map(id => `build:${id}`));
    const validBuilds = builds.filter(build => build !== null);
    
    // Get user profiles for each build
    const userIds = [...new Set(validBuilds.map(build => build.user_id))];
    const userProfiles = await kv.mget(userIds.map(id => `user_profile:${id}`));
    const userMap = new Map();
    userIds.forEach((id, index) => {
      if (userProfiles[index]) {
        userMap.set(id, userProfiles[index]);
      }
    });
    
    // Sort builds by performance category
    const sortedBuilds = validBuilds.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      
      switch (category) {
        case 'gaming':
          scoreA = a.performance?.gaming?.averageFps || 0;
          scoreB = b.performance?.gaming?.averageFps || 0;
          break;
        case 'productivity':
          scoreA = a.performance?.productivity?.overall || 0;
          scoreB = b.performance?.productivity?.overall || 0;
          break;
        default: // overall
          scoreA = a.performance?.overall || 0;
          scoreB = b.performance?.overall || 0;
      }
      
      return scoreB - scoreA;
    });
    
    // Create leaderboard entries
    const leaderboard = sortedBuilds.slice(0, limit).map((build, index) => {
      const user = userMap.get(build.user_id) || {};
      let score = 0;
      
      switch (category) {
        case 'gaming':
          score = build.performance?.gaming?.averageFps || 0;
          break;
        case 'productivity':
          score = build.performance?.productivity?.overall || 0;
          break;
        default:
          score = build.performance?.overall || 0;
      }
      
      return {
        rank: index + 1,
        build_id: build.id,
        build_name: build.name,
        user_name: user.name || 'Anonymous',
        user_id: build.user_id,
        score: Math.round(score),
        total_price: build.total_price,
        created_at: build.created_at,
        likes: build.likes || 0,
        views: build.views || 0,
        components: build.components
      };
    });
    
    return c.json({ leaderboard, category, total_builds: validBuilds.length });
  } catch (error) {
    console.log('Leaderboard error:', error);
    return c.json({ error: 'Failed to get leaderboard' }, 500);
  }
});

app.get('/make-server-5314a707/leaderboard/popular', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '20');
    
    // Get all public builds
    const publicBuildKeys = await kv.getByPrefix('public_build:');
    const buildIds = publicBuildKeys.map(item => item.value);
    
    if (buildIds.length === 0) {
      return c.json({ popular_builds: [] });
    }
    
    const builds = await kv.mget(buildIds.map(id => `build:${id}`));
    const validBuilds = builds.filter(build => build !== null);
    
    // Get user profiles
    const userIds = [...new Set(validBuilds.map(build => build.user_id))];
    const userProfiles = await kv.mget(userIds.map(id => `user_profile:${id}`));
    const userMap = new Map();
    userIds.forEach((id, index) => {
      if (userProfiles[index]) {
        userMap.set(id, userProfiles[index]);
      }
    });
    
    // Sort by popularity (views + likes * 3)
    const sortedBuilds = validBuilds.sort((a, b) => {
      const popularityA = (a.views || 0) + (a.likes || 0) * 3;
      const popularityB = (b.views || 0) + (b.likes || 0) * 3;
      return popularityB - popularityA;
    });
    
    const popularBuilds = sortedBuilds.slice(0, limit).map(build => {
      const user = userMap.get(build.user_id) || {};
      return {
        build_id: build.id,
        build_name: build.name,
        user_name: user.name || 'Anonymous',
        user_id: build.user_id,
        performance_score: Math.round(build.performance?.overall || 0),
        total_price: build.total_price,
        created_at: build.created_at,
        likes: build.likes || 0,
        views: build.views || 0,
        popularity_score: (build.views || 0) + (build.likes || 0) * 3
      };
    });
    
    return c.json({ popular_builds: popularBuilds });
  } catch (error) {
    console.log('Popular builds error:', error);
    return c.json({ error: 'Failed to get popular builds' }, 500);
  }
});

// Social Features
app.post('/make-server-5314a707/builds/:id/like', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyUser(authHeader);
    
    if (!user) {
      return c.json({ error: 'Authentication required to like builds' }, 401);
    }
    
    const buildId = c.req.param('id');
    const build = await kv.get(`build:${buildId}`);
    
    if (!build) {
      return c.json({ error: 'Build not found' }, 404);
    }
    
    // Check if user already liked this build
    const likeKey = `like:${user.id}:${buildId}`;
    const existingLike = await kv.get(likeKey);
    
    if (existingLike) {
      return c.json({ error: 'Already liked this build' }, 400);
    }
    
    // Add like
    await kv.set(likeKey, true);
    
    // Update build likes count
    const updatedBuild = {
      ...build,
      likes: (build.likes || 0) + 1
    };
    await kv.set(`build:${buildId}`, updatedBuild);
    
    return c.json({ likes: updatedBuild.likes });
  } catch (error) {
    console.log('Like build error:', error);
    return c.json({ error: 'Failed to like build' }, 500);
  }
});

app.delete('/make-server-5314a707/builds/:id/like', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyUser(authHeader);
    
    if (!user) {
      return c.json({ error: 'Authentication required to unlike builds' }, 401);
    }
    
    const buildId = c.req.param('id');
    const build = await kv.get(`build:${buildId}`);
    
    if (!build) {
      return c.json({ error: 'Build not found' }, 404);
    }
    
    // Check if user liked this build
    const likeKey = `like:${user.id}:${buildId}`;
    const existingLike = await kv.get(likeKey);
    
    if (!existingLike) {
      return c.json({ error: 'Build not liked yet' }, 400);
    }
    
    // Remove like
    await kv.del(likeKey);
    
    // Update build likes count
    const updatedBuild = {
      ...build,
      likes: Math.max(0, (build.likes || 1) - 1)
    };
    await kv.set(`build:${buildId}`, updatedBuild);
    
    return c.json({ likes: updatedBuild.likes });
  } catch (error) {
    console.log('Unlike build error:', error);
    return c.json({ error: 'Failed to unlike build' }, 500);
  }
});

// Health check
app.get('/make-server-5314a707/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);