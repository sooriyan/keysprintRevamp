import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up | Keysprint",
    description: "Create a new Keysprint account and start mastering your keyboard.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
