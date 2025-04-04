"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session } = authClient.useSession();
const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
      },
    })
  }
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
          {session ? (
            <Link href="/dashboard">
              <Button >
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button>
                Login
              </Button>
            </Link>
          )}
          {session ? (
              <Button variant="destructive" onClick={handleSignOut} >
                Logout
              </Button>
          ) : <></>
          }
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
        {session ? (
          <Link href="/dashboard">
            <Button className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700">
              Welcome back, {session.user.name}. Go to Your Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/sign-in">
            <Button className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700">
              Get started
            </Button>
          </Link>
        )}
      </section>

      {/* Key Features Section */}
      <section className="p-8 bg-white">
        <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature Cards */}
          {[{
            img: uploadImage.src, title: "Dataset Upload", description: "Upload CSV, JSON, and Excel files seamlessly."
          },{
            img: chartImage.src, title: "Data Visualization", description: "Create interactive charts and export them as images."
          },{
            img: tableImage.src, title: "Data Table", description: "Sort and filter your data with an intuitive table view."
          },{
            img: teamImage.src, title: "Team Workspace", description: "Create and manage teams with ease."
          },{
            img: metaImage.src, title: "Metadata Management", description: "Manage dataset details and control sharing permissions."
          },{
            img: commentImage.src, title: "Comments & Annotations", description: "Collaborate with in-depth comments on visualizations."
          }].map((feature, index) => (
            <Card key={index} className="border rounded-lg shadow hover:shadow-lg transition">
              <CardHeader className="flex items-center space-x-2 mb-2">
                <img src={feature.img} alt={feature.title} className="h-6 w-6" />
                <CardTitle className="font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center text-sm">
        © {new Date().getFullYear()} Collaborative Platform. All rights reserved.
      </footer>
    </div>
  );
}
