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
    return {
        title: `${name} | Keysprint`,
        description: `Take the ${name} typing challenge on Keysprint to test your speed and accuracy.`,
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
