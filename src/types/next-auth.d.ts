import 'next-auth';
import 'next-auth/jwt';

// Extra fields we carry through the NextAuth session/JWT so the frontend can
// bridge the backend-issued token into the existing auth flow.
declare module 'next-auth' {
  interface Session {
    /** The app's own JWT, minted by the backend `socialLogin` mutation. */
    backendToken?: string;
    /** True for brand-new social users who haven't picked a role yet. */
    needsOnboarding?: boolean;
    /** Set if the backend exchange failed during sign-in. */
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendToken?: string;
    needsOnboarding?: boolean;
    error?: string;
  }
}
