// app/page.tsx
"use client";

import Link from "next/link";
import {
  Button,
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import chartImage from "@/icons/chart.svg";
import uploadImage from "@/icons/upload.svg";
import tableImage from "@/icons/table.svg";
import teamImage from "@/icons/team.svg";
import metaImage from "@/icons/metadata.svg";
import commentImage from "@/icons/comment.svg";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
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
          <Link href="/sign-in">
            <Button variant="outline" className="px-4 py-2 bg-green-600 text-white hover:bg-green-700">
              Login
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 bg-gradient-to-r from-blue-50 to-blue-100 p-8">
        <h1 className="text-4xl font-extrabold mb-4 text-center">
          Collaborative Data Analysis, Simplified
        </h1>
        <p className="text-lg mb-6 text-center">
          Upload datasets, visualize data, and collaborate in real-time with your team.
        </p>
        <Link href="/sign-in">
          <Button className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700">
            Get started
          </Button>
        </Link>
      </section>

      {/* Key Features Section */}
      <section className="p-8 bg-white">
        <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <Card className="border rounded-lg shadow hover:shadow-lg transition">
            <CardHeader className="flex items-center space-x-2 mb-2">
              <img src={uploadImage.src} alt="Dataset Upload" className="h-6 w-6" />
              <CardTitle className="font-bold">Dataset Upload</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              Upload CSV, JSON, and Excel files seamlessly.
            </CardContent>
          </Card>

          {/* Feature Card 2 */}
          <Card className="border rounded-lg shadow hover:shadow-lg transition">
            <CardHeader className="flex items-center space-x-2 mb-2">
              <img src={chartImage.src} alt="Data Visualization" className="h-6 w-6" />
              <CardTitle className="font-bold">Data Visualization</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              Create interactive charts and export them as images.
            </CardContent>
          </Card>

          {/* Feature Card 3 */}
          <Card className="border rounded-lg shadow hover:shadow-lg transition">
            <CardHeader className="flex items-center space-x-2 mb-2">
              <img src={tableImage.src} alt="Data Table" className="h-6 w-6" />
              <CardTitle className="font-bold">Data Table</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              Sort and filter your data with an intuitive table view.
            </CardContent>
          </Card>

          {/* Feature Card 4 */}
          <Card className="border rounded-lg shadow hover:shadow-lg transition">
            <CardHeader className="flex items-center space-x-2 mb-2">
              <img src={teamImage.src} alt="Team Workspace" className="h-6 w-6" />
              <CardTitle className="font-bold">Team Workspace</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              Create and manage teams with ease.
            </CardContent>
          </Card>

          {/* Feature Card 5 */}
          <Card className="border rounded-lg shadow hover:shadow-lg transition">
            <CardHeader className="flex items-center space-x-2 mb-2">
              <img src={metaImage.src} alt="Metadata Management" className="h-6 w-6" />
              <CardTitle className="font-bold">Metadata Management</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              Manage dataset details and control sharing permissions.
            </CardContent>
          </Card>

          {/* Feature Card 6 */}
          <Card className="border rounded-lg shadow hover:shadow-lg transition">
            <CardHeader className="flex items-center space-x-2 mb-2">
              <img src={commentImage.src} alt="Comments & Annotations" className="h-6 w-6" />
              <CardTitle className="font-bold">Comments & Annotations</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              Collaborate with in-depth comments on visualizations.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center text-sm">
        © {new Date().getFullYear()} Collaborative Platform. All rights reserved.
      </footer>
    </div>
  );
}
