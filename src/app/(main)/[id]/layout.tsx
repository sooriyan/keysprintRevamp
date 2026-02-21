import { Metadata } from 'next';

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const username = decodeURIComponent(resolvedParams.id);
    return {
        title: `${username} - Keysprint Profile`,
        description: `View ${username}'s typing stats, badges, and track record on Keysprint.`,
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
