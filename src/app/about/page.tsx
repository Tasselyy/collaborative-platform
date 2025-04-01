import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
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
      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <section className="mb-8">
          <h1 className="text-4xl font-extrabold mb-4 text-center">About Collaborative Platform</h1>
          <p className="text-lg leading-relaxed text-center">
            Collaborative Platform is built to empower data scientists, analysts, and teams to work together seamlessly. Our platform offers real-time collaboration, robust data visualization, and efficient dataset management—all in one place.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            Our mission is to simplify data collaboration by providing a platform that integrates user authentication, team workspace management, dataset uploads, interactive visualizations, and real-time collaboration features.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">What We Do</h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>User authentication and team workspace management</li>
            <li>Dataset upload and management (CSV, JSON, Excel)</li>
            <li>Interactive data visualizations with Chart.js</li>
            <li>Data table views with sorting and filtering</li>
            <li>Metadata management and robust sharing permissions</li>
            <li>Collaborative comments and annotations on visualizations</li>
            <li>Export visualizations as images</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg leading-relaxed">
            We envision a future where data-driven insights are accessible to everyone. By combining cutting-edge technology with a user-friendly interface, Collaborative Platform helps teams unlock the true potential of their data.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center text-sm">
        © {new Date().getFullYear()} Collaborative Platform. All rights reserved.
      </footer>
    </div>
  );
}
