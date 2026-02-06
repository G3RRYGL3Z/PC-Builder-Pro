#!/usr/bin/env node
// Simple utility to detect common CI/CD environment variables and print the deployed URL.
// Supports Vercel, Netlify, Cloudflare Pages, GitHub Pages, and a fallback env URL.

const env = process.env;

function getVercelUrl() {
  // Vercel sets VERCEL_URL for preview/prod (without protocol)
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  if (env.NOW_URL) return `https://${env.NOW_URL}`;
  return null;
}

function getNetlifyUrl() {
  // Netlify sets URL for the deployed site
  if (env.URL) return env.URL;
  if (env.SITE_URL) return env.SITE_URL;
  return null;
}

function getCloudflarePagesUrl() {
  // Cloudflare Pages provides CF_PAGES_URL
  if (env.CF_PAGES_URL) return env.CF_PAGES_URL;
  return null;
}

function getGithubPagesUrl() {
  // Some actions or workflows may expose a pages URL variable
  if (env.GH_PAGES_URL) return env.GH_PAGES_URL;
  if (env.GITHUB_PAGES_URL) return env.GITHUB_PAGES_URL;
  if (env.ACTIONS_DEPLOY_URL) return env.ACTIONS_DEPLOY_URL;

  // Fallback: construct from GITHUB_REPOSITORY
  if (env.GITHUB_REPOSITORY) {
    const [owner, repo] = env.GITHUB_REPOSITORY.split('/');
    // For user/organization pages the repo name is <owner>.github.io
    if (repo.toLowerCase().endsWith('.github.io')) {
      return `https://${repo}`; // repo is the domain
    }
    return `https://${owner}.github.io/${repo}`;
  }
  return null;
}

function getManualUrl() {
  if (env.DEPLOY_URL) return env.DEPLOY_URL;
  if (env.SITE_URL_MANUAL) return env.SITE_URL_MANUAL;
  return null;
}

const url = getVercelUrl() || getNetlifyUrl() || getCloudflarePagesUrl() || getGithubPagesUrl() || getManualUrl();

if (url) {
  console.log(url);
  process.exit(0);
}

console.error('No deploy URL detected. Set DEPLOY_URL or run this in your CI environment.');
process.exit(1);
