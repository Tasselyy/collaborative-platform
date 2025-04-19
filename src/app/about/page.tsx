// app/about/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function AboutPage() {
  const {data: session} = authClient.useSession();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">Collaborative Platform</span>
        </div>
        <nav className="flex space-x-4">
          <Link href="/">
            <Button variant="ghost" className="hover:text-blue-600">
              Home
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className="hover:text-blue-600">
              About
            </Button>
          </Link>
          {session ? (
            <Link href="/dashboard">
              <Button variant="outline" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button variant="outline" className="px-4 py-2 bg-green-600 text-white hover:bg-green-700">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold text-center">
              About Collaborative Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-center">
              Collaborative Platform is built to empower data scientists, analysts, and teams to work together seamlessly. Our platform offers real-time collaboration, robust data visualization, and efficient dataset management—all in one place.
            </p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              Our mission is to simplify data collaboration by providing a platform that integrates user authentication, team workspace management, dataset uploads, interactive visualizations, and real-time collaboration features.
            </p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">What We Do</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>User authentication and team workspace management</li>
              <li>Dataset upload and management (CSV, JSON, Excel)</li>
              <li>Interactive data visualizations with Chart.js</li>
              <li>Data table views with sorting and filtering</li>
              <li>Metadata management and robust sharing permissions</li>
              <li>Collaborative comments and annotations on visualizations</li>
              <li>Export visualizations as images</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              We envision a future where data-driven insights are accessible to everyone. By combining cutting-edge technology with a user-friendly interface, Collaborative Platform helps teams unlock the true potential of their data.
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center text-sm">
        © {new Date().getFullYear()} Collaborative Platform. All rights reserved.
      </footer>
    </div>
  );
}
