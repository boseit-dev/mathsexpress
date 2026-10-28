import { redirect, type RouteObject } from 'react-router';
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
  createSignedOutPageLoader,
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
              loader: createSignedOutPageLoader(dependencies),
              action: createSignInAction(dependencies),
              element: <SignInPage />,
            },
            {
              path: paths.register,
              loader: createSignedOutPageLoader(dependencies),
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
    {
      // Signing out is a form action; opening the address directly just goes to the start.
      path: paths.signOut,
      loader: () => redirect(paths.root),
      action: createSignOutAction(dependencies),
    },
  ];
}
