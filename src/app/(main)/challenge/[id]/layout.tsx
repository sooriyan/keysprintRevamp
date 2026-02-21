import type { Metadata } from 'next';

const CHALLENGE_NAMES: Record<string, string> = {
    standard: "Standard A-Z",
    paragraph: "Paragraph Challenge",
    developer: "Developer Snippet",
    daily: "Global Daily Challenge"
};

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const name = CHALLENGE_NAMES[resolvedParams.id] || "Challenge";
    const title = `${name} | Keysprint`;
    const description = `Take the ${name} typing challenge on Keysprint to test your speed and accuracy.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://keysprint.in/challenge/${resolvedParams.id}`,
            images: [
                {
                    url: '/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: `Keysprint ${name}`,
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ['/og-image.png'],
        }
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
