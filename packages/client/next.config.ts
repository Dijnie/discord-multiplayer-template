import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "path";

// Load env vars from monorepo root .env
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
  },
  // All traffic (HTTP /api/* and WebSocket /colyseus/*) is routed through
  // Discord Activity proxy via URL Mappings configured in Developer Portal.
  // No Next.js rewrites needed.
};

export default nextConfig;
