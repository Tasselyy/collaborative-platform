// app/page.tsx
"use client";

import Link from "next/link";
import chartImage from '@/icons/chart.svg';
import uploadImage from '@/icons/upload.svg'
import tableImage from "@/icons/table.svg"
import teamImage from '@/icons/team.svg'
import metaImage from '@/icons/metadata.svg'
import commentImage from '@/icons/comment.svg'



export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="flex justify-between items-center p-6 bg-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">Collaborative Platform</span>
        </div>
        <nav className="space-x-4">
          <Link href="/">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
          </Link>
          <Link href="/about">
            <span className="hover:text-blue-600 cursor-pointer">About</span>
          </Link>
          <Link href="/sign-up">
            <span className="hover:text-blue-600 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Sign Up
            </span>
          </Link>
          <Link href="/sign-in">
            <span className="hover:text-blue-600 cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Login
            </span>
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
        <Link href="/sign-up">
          <span className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700 cursor-pointer">
            Sign Up
          </span>
        </Link>
      </section>

      {/* Key Features Section */}
      <section className="p-8 bg-white">
        <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <div className="flex items-center space-x-2 mb-2">
            <img src={uploadImage.src} alt="Dataset Upload" className="h-6 w-6" />
              <h3 className="font-bold">Dataset Upload</h3>
            </div>
            <p>Upload CSV, JSON, and Excel files seamlessly.</p>
          </div>
          {/* Feature Card 2 */}
          <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <div className="flex items-center space-x-2 mb-2">
            <img src={chartImage.src} alt="Dataset Visualization" className="h-6 w-6" />
              <h3 className="font-bold">Data Visualization</h3>
            </div>
            <p>Create interactive charts and export them as images.</p>
          </div>
          {/* Feature Card 3 */}
          <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <div className="flex items-center space-x-2 mb-2">
            <img src={tableImage.src} alt="Data Table" className="h-6 w-6" />
              <h3 className="font-bold">Data Table</h3>
            </div>
            <p>Sort and filter your data with an intuitive table view.</p>
          </div>

          <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <div className="flex items-center space-x-2 mb-2">
              <img src={teamImage.src}alt="Team" className="h-6 w-6" />
              <h3 className="font-bold">Team Workspace</h3>
            </div>
            <p>Create and manage teams with ease.</p>
          </div>
          <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <div className="flex items-center space-x-2 mb-2">
              <img src={metaImage.src} alt="Metadata" className="h-6 w-6" />
              <h3 className="font-bold">Metadata Management</h3>
            </div>
            <p>Manage dataset details and control sharing permissions.</p>
          </div>
          <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <div className="flex items-center space-x-2 mb-2">
              <img src={commentImage.src} alt="Comments" className="h-6 w-6" />
              <h3 className="font-bold">Comments & Annotations</h3>
            </div>
            <p>Collaborate with in-depth comments on visualizations.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center text-sm">
        © {new Date().getFullYear()} Collaborative Platform. All rights reserved.
      </footer>
    </div>
  );
}
