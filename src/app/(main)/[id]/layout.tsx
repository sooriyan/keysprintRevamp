import { Metadata } from 'next';

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const username = decodeURIComponent(resolvedParams.id);
    const title = `${username} - Keysprint Profile`;
    const description = `View ${username}'s typing stats, badges, and track record on Keysprint.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://keysprint.in/${encodeURIComponent(username)}`,
            images: [
                {
                    url: '/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: `${username}'s Keysprint Profile`,
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ['/og-image.png'],
        },
        robots: {
            index: false,
            follow: false,
            nocache: true,
        }
    };
}

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
