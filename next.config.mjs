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
	async redirects() {
		return [
			{ source: '/sign-in', destination: '/auth/sign-in', permanent: true },
			{ source: '/sign-in/:path*', destination: '/auth/sign-in/:path*', permanent: true },
			{ source: '/sign-up', destination: '/auth/sign-up', permanent: true },
			{ source: '/sign-up/:path*', destination: '/auth/sign-up/:path*', permanent: true },
			{ source: '/forgot-password', destination: '/auth/forgot-password', permanent: true },
			{ source: '/reset-password', destination: '/auth/reset-password', permanent: true },
			{ source: '/verify-email', destination: '/auth/verify-email', permanent: true },
			{ source: '/onboarding', destination: '/auth/onboarding', permanent: true },
			{ source: '/lobby', destination: '/chat/lobby', permanent: true },
			{ source: '/messages', destination: '/chat/messages', permanent: true },
			{ source: '/messages/:path*', destination: '/chat/messages/:path*', permanent: true },
			{ source: '/friends', destination: '/chat/friends', permanent: true },
			{ source: '/notifications', destination: '/chat/notifications', permanent: true },
			{ source: '/leaderboard', destination: '/chat/leaderboard', permanent: true },
			{ source: '/random', destination: '/chat/random', permanent: true },
			{ source: '/random/call/:userId', destination: '/chat/random/call/:userId', permanent: true },
			{ source: '/rooms/create', destination: '/chat/rooms/create', permanent: true },
			{ source: '/room/:path*', destination: '/chat/room/:path*', permanent: true },
			{ source: '/settings/profile', destination: '/account/settings/profile', permanent: true },
			{ source: '/settings/appearance', destination: '/account/settings/appearance', permanent: true },
			{ source: '/profile/:userId', destination: '/social/profile/:userId', permanent: true },
			{ source: '/admin', destination: '/platform/admin', permanent: true },
			{ source: '/admin/:path*', destination: '/platform/admin/:path*', permanent: true },
		];
	},
	async rewrites() {
		return [
			{ source: '/auth/sign-in', destination: '/sign-in' },
			{ source: '/auth/sign-in/:path*', destination: '/sign-in/:path*' },
			{ source: '/auth/sign-up', destination: '/sign-up' },
			{ source: '/auth/sign-up/:path*', destination: '/sign-up/:path*' },
			{ source: '/auth/forgot-password', destination: '/forgot-password' },
			{ source: '/auth/reset-password', destination: '/reset-password' },
			{ source: '/auth/verify-email', destination: '/verify-email' },
			{ source: '/auth/onboarding', destination: '/onboarding' },
			{ source: '/chat/lobby', destination: '/lobby' },
			{ source: '/chat/messages', destination: '/messages' },
			{ source: '/chat/messages/:path*', destination: '/messages/:path*' },
			{ source: '/chat/friends', destination: '/friends' },
			{ source: '/chat/notifications', destination: '/notifications' },
			{ source: '/chat/leaderboard', destination: '/leaderboard' },
			{ source: '/chat/random', destination: '/random' },
			{ source: '/chat/random/call/:userId', destination: '/random/call/:userId' },
			{ source: '/chat/rooms/create', destination: '/rooms/create' },
			{ source: '/chat/room/:path*', destination: '/room/:path*' },
			{ source: '/account/settings/profile', destination: '/settings/profile' },
			{ source: '/account/settings/appearance', destination: '/settings/appearance' },
			{ source: '/social/profile/:userId', destination: '/profile/:userId' },
			{ source: '/platform/admin', destination: '/admin' },
			{ source: '/platform/admin/:path*', destination: '/admin/:path*' },
		];
	},
}

export default nextConfig
