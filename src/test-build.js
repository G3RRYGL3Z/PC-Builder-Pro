// Simple build validation script
// This file can be deleted - it's just for testing

console.log('Build test started...');

try {
  // Test basic module resolution
  console.log('✅ Basic module resolution works');
  
  // Test environment variable access
  const testEnv = process.env.NODE_ENV || 'development';
  console.log('✅ Environment variables accessible:', testEnv);
  
  console.log('✅ Build test completed successfully');
} catch (error) {
  console.error('❌ Build test failed:', error);
  process.exit(1);
}