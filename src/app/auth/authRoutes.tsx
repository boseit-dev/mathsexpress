import type { RouteObject } from 'react-router';
import { paths } from '@/config/paths';
import type { AppDependencies } from '@/data/repositories';
import { AuthLinkPage } from '@/features/auth/AuthLinkPage';
import {
  createConfirmEmailLoader,
  createForgotPasswordAction,
  createGoogleCallbackLoader,
  createRegisterAction,
  createResetPasswordAction,
  createResetPasswordLoader,
  createSignInAction,
  createSignOutAction,
  createWelcomeAction,
  createWelcomeLoader,
} from '@/features/auth/authHandlers';
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage';
import { SignInPage } from '@/features/auth/SignInPage';
import { WelcomePage } from '@/features/auth/WelcomePage';
import { AuthLayout } from '@/layouts/AuthLayout';
import { RouteErrorPage } from '../pages/RouteErrorPage';
import { redirectIfSignedIn } from './guards';

/** Signing in, registering, recovering a password, email links and finishing account setup. */
export function createAuthRoutes(dependencies: AppDependencies): RouteObject[] {
  return [
    {
      element: <AuthLayout />,
      children: [
        {
          errorElement: <RouteErrorPage />,
          children: [
            {
              path: paths.signIn,
              loader: () => redirectIfSignedIn(dependencies),
              action: createSignInAction(dependencies),
              element: <SignInPage />,
            },
            {
              path: paths.register,
              loader: () => redirectIfSignedIn(dependencies),
              action: createRegisterAction(dependencies),
              element: <RegisterPage />,
            },
            {
              path: paths.forgotPassword,
              action: createForgotPasswordAction(dependencies),
              element: <ForgotPasswordPage />,
            },
            {
              path: paths.resetPassword,
              loader: createResetPasswordLoader(dependencies),
              action: createResetPasswordAction(dependencies),
              element: <ResetPasswordPage />,
            },
            {
              path: paths.authConfirm,
              loader: createConfirmEmailLoader(dependencies),
              element: <AuthLinkPage />,
            },
            {
              path: paths.authCallback,
              loader: createGoogleCallbackLoader(dependencies),
              element: <AuthLinkPage />,
            },
            {
              path: paths.welcome,
              loader: createWelcomeLoader(dependencies),
              action: createWelcomeAction(dependencies),
              element: <WelcomePage />,
            },
          ],
        },
      ],
    },
    { path: paths.signOut, action: createSignOutAction(dependencies) },
  ];
}
