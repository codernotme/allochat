import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	turbopack: {
		root: workspaceRoot,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'i.pravatar.cc',
			},
		],
	},
	// Explicitly map routes if they feel "unreachable" in some environments
	async rewrites() {
		return [
			{ source: '/lobby', destination: '/lobby' },
			{ source: '/admin/:path*', destination: '/admin/:path*' },
			{ source: '/onboarding', destination: '/onboarding' },
		];
	},
}

export default nextConfig
