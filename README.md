# Collaborative Data Analysis Platform Final Report

## Team Information

- **Feiyang Fan**  
  - Student Number: 1005146913
  - Email: feiyang.fan@mail.utoronto.ca

- **Yifan Yang**  
  - Student Number: 1011797619  
  - Email: erik.yang@mail.utoronto.ca

- **Zhengyang Liang**  
  - Student Number: 1010239225  
  - Email: zy.liang@mail.utoronto.ca

- **Yilin Huai**  
  - Student Number: 1001297036  
  - Email: yilin.huai@mail.utoronto.ca

---

## Motivation

Companies often struggle with data analysis because data scientists typically work in isolation using different tools. This fragmentation makes sharing insights difficult and slows down decision-making. Our project addresses these challenges by offering a unified, web-based platform where data scientists and analysts can upload datasets, visualize data, and collaborate in real time. This integrated approach saves time, improves teamwork, enhances data security, and supports better decision-making.

---

## Objectives

The Collaborative Data Analysis Platform aims to achieve the following objectives:

- **Streamline Data Collaboration:**  
  Provide a single, unified environment where teams can effortlessly upload, manage, and analyze datasets. By centralizing these processes, the platform eliminates the need for multiple disparate tools, reducing friction and saving time for data scientists and analysts.

- **Enhance User Experience:**  
  Offer an intuitive, responsive interface that supports real-time collaboration and interactive data exploration. The design prioritizes ease-of-use, enabling both technical and non-technical users to navigate the platform, visualize complex data, and extract actionable insights quickly.

- **Integrate Key Functionalities:**  
  Combine essential features—user authentication, dataset management, interactive data visualization, and real-time commenting—into one cohesive application. This integration ensures that users have access to all the tools they need without switching contexts, resulting in a smoother workflow from data ingestion to insight generation.

- **Ensure Data Security and Scalability:**  
  Leverage robust technologies such as PostgreSQL for secure, structured data storage and cloud storage solutions (e.g., AWS S3) for scalable file management. The platform is designed to maintain data integrity and support future growth, ensuring that as datasets and user numbers increase, the system remains reliable and secure.


---

## Technical Stack

- **Framework:** Next.js Full-Stack (App Router)
- **Frontend:** React, Tailwind CSS, shadcn/ui (component library)
- **Backend:** Next.js Server Components & API Routes
- **Database:** PostgreSQL for metadata and user data
- **Cloud Storage:** Integrated cloud storage solution for dataset files
- **Authentication:** Custom authentication using better-auth
- **Other Libraries:** Chart.js for data visualization, react-hook-form with Zod for form validation

---

## Features

- **User Authentication & Team Workspace Management:**  
  Secure user sign-up and login with session management. Teams can be created and managed for collaborative projects.

- **Dataset Upload & Management:**  
  Support for uploading CSV, JSON, and Excel files with associated metadata management. Files are stored on the cloud.

- **Data Visualization:**  
  Integration of Chart.js to create interactive charts that can be exported as images.

- **Data Table View:**  
  Sortable and filterable table view for datasets.

- **Sharing Permissions:**  
  Flexible options for setting datasets and visualizations as public, private, or team-accessible.

- **Comments & Annotations:**  
  Real-time commenting and annotation capabilities on visualizations.

- **Export Functionality:**  
  Ability to export visualizations as images for external use.

---

## User Guide

### Signing Up and Logging In

1. **Sign Up:**  
   - Navigate to the "Sign Up" page.
   - Enter your name, email, and password.
   - Click the "Sign Up" button.
   - A confirmation message is displayed, and you are redirected to the dashboard.

2. **Log In:**  
   - Go to the "Login" page.
   - Enter your registered email and password.
   - Click "Login" to access your dashboard.

### Navigating the Dashboard

TODO

---

## Development Guide

### Environment Setup and Configuration

1. **Clone the Repository:**
   ```bash
   git clone TODO
   cd collaborative-platform
   ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Environment Variables:**
   1. Create a .env file in the root directory and configure the following:
      1. DATABASE_URL: PostgreSQL connection string
      2. NEXT_PUBLIC_API_BASE_URL: Base url of the application
      3. Secret for authentication tokens
      4. Cloud storage credentials 

### Database Inilitalization
1. **Prisma Setup:**
Initialize Prisma and migrate the schema:
    ``` bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

### Cloud Storage Configuration
TODO

### Local Development and Testing
1. **Run the Development Server:**
    ```bash
    npm run dev
    ```
2. **Testing:**
   TODO

## Deployment Information
TODO

## Individual Contributions

## Individual Contributions

### Feiyang Fan
- **Role:** Project Manager & Backend Lead  
- **Contributions:**
  - **Project Coordination:**  
    - Organized team meetings, maintained the project timeline, and ensured milestones were met.
    - Facilitated communication between team members and handled clarifications with course instructors.
  - **Backend Architecture & Development:**  
    - Designed the overall system architecture and the PostgreSQL database schema.
    - Led the development of core backend APIs for user authentication, team management, and dataset metadata.
    - Integrated cloud storage (AWS S3) for file uploads and managed environment configurations.
  - **Documentation & Quality Assurance:**  
    - Authored key sections of the technical documentation and README.
    - Conducted code reviews and helped establish coding standards for the team.

### Yifan Yang
- **Role:** Backend Developer & API Specialist  
- **Contributions:**
  - **API Development:**  
    - Developed robust API endpoints for handling dataset uploads, metadata management, and user authentication.
    - Worked on optimizing database queries and ensuring data consistency through comprehensive error handling.
  - **Database Management:**  
    - Assisted in designing and implementing the PostgreSQL schema.
    - Collaborated on writing migration scripts and setting up Prisma for database interactions.
  - **Cloud Integration:**  
    - Played a key role in integrating cloud storage for file handling.
    - Configured environment variables and ensured secure storage access during development and deployment.

### Zhengyang Liang
- **Role:** Frontend Developer & UI/UX Specialist  
- **Contributions:**
  - **User Interface Implementation:**  
    - Led the development of the user interface using Next.js and Tailwind CSS.
    - Created reusable UI components with shadcn/ui to maintain consistency and accessibility across pages.
  - **Data Visualization:**  
    - Integrated Chart.js to build interactive visualizations and implemented features to export these as images.
    - Developed dynamic data table views with sorting and filtering capabilities.
  - **UX Enhancements:**  
    - Focused on responsive design to ensure the application worked seamlessly on both desktop and mobile devices.
    - Collected user feedback during development iterations and refined UI elements accordingly.

### Yilin Huai
- **Role:** Full Stack Developer & DevOps Specialist  
- **Contributions:**
  - **Integration & Full-Stack Development:**  
    - Bridged frontend and backend components by ensuring smooth API integration and real-time data synchronization.
    - Implemented additional collaboration features such as commenting and annotation tools.
  - **DevOps & Deployment:**  
    - Set up the CI/CD pipeline, managed the deployment process, and configured the production environment on Vercel.
    - Oversaw cloud storage integration and monitored application performance using AWS CloudWatch.
  - **Testing & Debugging:**  
    - Developed integration tests for key user flows, including authentication, dataset upload, and visualization creation.
    - Troubleshot and resolved various technical challenges, ensuring a stable and secure platform.



## Lessons Learned and Concluding Remarks
1. Lessons Learned:

   * Effective collaboration and clear division of tasks are essential to keep the project on track.

    * Integrating multiple technologies (Next.js, Prisma, Chart.js, cloud storage) requires thorough planning and testing.

    * Real-time collaboration and data visualization demand careful attention to both performance and usability.

2. **Concluding Remarks:**
This project has provided valuable hands-on experience in full-stack development using modern web technologies. Our Collaborative Data Analysis Platform meets the course requirements by addressing the challenges of isolated data analysis and fostering team collaboration. We are proud of the solution we have built, and we look forward to future iterations that further enhance its capabilities and scalability.


run seed
tsx prisma/seed.ts

add component using CLI
pnpm dlx shadcn@latest add [component]

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
