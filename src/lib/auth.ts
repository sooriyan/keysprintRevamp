import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please provide an email and password');
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email }).select('+password');

                if (!user) {
                    throw new Error('Invalid credentials');
                }

                if (user.authProvider === 'google') {
                    throw new Error('Please sign in with Google');
                }

                const isMatch = await bcrypt.compare(credentials.password, user.password!);

                if (!isMatch) {
                    throw new Error('Invalid credentials');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                await dbConnect();

                const existingUser = await User.findOne({ email: user.email as string });

                if (!existingUser) {
                    await User.create({
                        name: (user.name as string)?.replace(/\s+/g, '') || 'AnonymousSprinter',
                        email: user.email as string,
                        image: (user.image as string) || '',
                        authProvider: 'google',
                        themePreference: 'system'
                    });
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                if (account.provider === 'google') {
                    await dbConnect();
                    const dbUser = await User.findOne({ email: user.email });
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                    } else {
                        token.id = user.id;
                    }
                } else {
                    token.id = user.id;
                }
            } else if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        newUser: '/signup',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
