import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import { CustomChallenge } from '@/models/CustomChallenge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.keysprint.in';

    // Core static routes
    const routes: MetadataRoute.Sitemap = [
        '',
        '/challenge',
        '/challenge/standard',
        '/challenge/paragraph',
        '/challenge/developer',
        '/challenge/daily',
        '/custom-challenges',
        '/leaderboard',
        '/login',
        '/signup',
        '/help',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        await dbConnect();
        // Fetch up to 1000 recent custom challenges for indexing
        const customChallenges = await CustomChallenge.find({})
            .sort({ createdAt: -1 })
            .limit(1000)
            .select('_id updatedAt createdAt');

        const challengeRoutes = customChallenges.map((challenge) => ({
            url: `${baseUrl}/custom-challenges/${challenge._id}`,
            lastModified: new Date(challenge.updatedAt || challenge.createdAt).toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

        return [...routes, ...challengeRoutes];
    } catch (err) {
        console.error("Failed to fetch custom challenges for sitemap:", err);
        return routes;
    }
}
