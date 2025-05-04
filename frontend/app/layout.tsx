"use client";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <ApolloProvider client={client}>
          <ProtectedRoute>
            <ErrorBoundary>
              {children}
              <ToastContainer />
            </ErrorBoundary>
          </ProtectedRoute>
        </ApolloProvider>
      </body>
    </html>
  );
}
