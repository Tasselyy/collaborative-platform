# Collaborative Data Analysis Platform Final Report

## Video Demo

[Video Demo Link in UofT OneDrive](https://utoronto-my.sharepoint.com/:v:/g/personal/feiyang_fan_mail_utoronto_ca/EU9P7b9aE8BKlMMA_A7y9pMB0hudLXNrlTOv26L8aMPwHQ?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=alBdCR)

## Team Information

-   **Feiyang Fan**

    -   Student Number: 1005146913
    -   Email: feiyang.fan@mail.utoronto.ca

-   **Yifan Yang**

    -   Student Number: 1011797619
    -   Email: erik.yang@mail.utoronto.ca

-   **Zhengyang Liang**

    -   Student Number: 1010239225
    -   Email: zy.liang@mail.utoronto.ca

-   **Yilin Huai**
    -   Student Number: 1001297036
    -   Email: yilin.huai@mail.utoronto.ca

---

## Motivation

Companies often struggle with data analysis because data scientists typically work in isolation using different tools. This fragmentation makes sharing insights difficult and slows down decision-making. Our project addresses these challenges by offering a unified, web-based platform where data scientists and analysts can upload datasets, visualize data, and collaborate in real time. This integrated approach saves time, improves teamwork, enhances data security, and supports better decision-making.

---

## Objectives

The Collaborative Data Analysis Platform aims to achieve the following objectives:

-   **Streamline Data Collaboration:**  
    Provide a single, unified environment where teams can effortlessly upload, manage, and analyze datasets. By centralizing these processes, the platform eliminates the need for multiple disparate tools, reducing friction and saving time for data scientists and analysts.

-   **Enhance User Experience:**  
    Offer an intuitive, responsive interface that supports real-time collaboration and interactive data exploration. The design prioritizes ease-of-use, enabling both technical and non-technical users to navigate the platform, visualize complex data, and extract actionable insights quickly.

-   **Integrate Key Functionalities:**  
    Combine essential features—user authentication, dataset management, interactive data visualization, and real-time commenting—into one cohesive application. This integration ensures that users have access to all the tools they need without switching contexts, resulting in a smoother workflow from data ingestion to insight generation.

-   **Ensure Data Security and Scalability:**  
    Leverage robust technologies such as PostgreSQL for secure, structured data storage and cloud storage solutions (e.g., AWS S3) for scalable file management. The platform is designed to maintain data integrity and support future growth, ensuring that as datasets and user numbers increase, the system remains reliable and secure.

---

## Technical Stack

-   **Framework:** Next.js Full-Stack (App Router)
-   **Frontend:** React, Tailwind CSS, shadcn/ui (component library)
-   **Backend:** Next.js Server Components & API Routes
-   **Database:** PostgreSQL for metadata and user data
-   **Cloud Storage:** Integrated cloud storage solution for dataset files
-   **Authentication:** Custom authentication using better-auth
-   **Other Libraries:** Chart.js for data visualization, react-hook-form with Zod for form validation

---

## Features

-   **User Authentication:**  
    Secure login functionality, enabling users to create personal profiles.
-   **Team Workspace Management(NOT IMPLEMENT IN THIS VERSION OF THE PROJECT DUE TO TIME CONSTRAINTS):**
    Allow Users to collaborate in team workspaces. Access control ensures that only authorized team members can view or modify shared datasets and visualizations.

-   **Dataset Upload & Management:**  
    Support for uploading datasets in various formats—including CSV, JSON, and Excel—while automatically storing file metadata in PostgreSQL and the actual files in a cloud storage solution. This ensures reliable and scalable data handling.

-   **Data Visualization:**  
    Integration with libraries such as Chart.js enables users to create interactive and dynamic visualizations. Visualizations can be customized, exported as images, and embedded within the platform for easy sharing and presentation.

-   **Data Table View:**  
    An intuitive, sortable, and filterable table interface allows users to explore datasets with ease. Users can quickly search and sort data, facilitating efficient analysis and decision-making.

-   **Dataset Metadata Management:**  
    Comprehensive metadata management ensures that each dataset’s details (such as creation date, file type, and associated tags) are tracked in the PostgreSQL database, making it easy to search, filter, and organize datasets.

-   **Sharing Permissions:(NOT IMPLEMENT IN THIS VERSION OF THE PROJECT DUE TO TIME CONSTRAINTS)**  
    Flexible permission settings allow datasets and visualizations to be shared publicly, privately, or within team workspaces. This robust sharing mechanism supports collaboration while ensuring data security.

-   **Comments & Annotations:**  
    Real-time commenting and annotation capabilities allow team members to discuss and document insights directly on visualizations, enhancing collaborative analysis and feedback.

-   **Export Functionality:**  
    Visualizations can be exported as images (PNG and JPG) to facilitate reporting, presentations, and further analysis outside the platform.

-   **Robust Backend Infrastructure:**  
    Utilizing PostgreSQL for metadata and user data ensures reliable, scalable storage, while cloud storage integration AWS S3 provides secure and efficient file handling.

This comprehensive feature set addresses the key challenges of data collaboration and analysis by combining user-friendly interfaces and robust backend technologies.

---

## User Guide

### Signing Up and Logging In

1. **Sign Up & Log In:**
    - Click on "Get Started" or "Login" – both will redirect you to the sign-in page.
    - Choose to log in using GitHub or Google.
    - Authenticate with your chosen provider.
    - Upon successful authentication, you will be redirected to your dashboard.

Since authentication is handled via OAuth, there is no need to enter an email and password manually.

### Navigating the Dashboard

---

1. Viewing Your Datasets

-   The **Datasets section** lists all:

    -   Public datasets created by others.
    -   Private datasets you personally own.

-   Each dataset displays:
    -   Name & description
    -   Visibility status (Public / Private)
    -   Team (if applicable)
    -   Number of visualizations
    -   Upload date

---

2. Uploading a Dataset
    1. Click on **Upload**
    2. Fill out the form:
        - **Name**
        - **Description**
        - **Upload File** (.csv or .json)
        - **Visibility** (Public or Private or Team)
    3. Submit to upload and save the dataset.

---

3. Visualizing a Dataset

    1. Click on **“Visualization”**.
    2. You’ll be taken to the **Visualization Page**:
        - Select a dataset
        - Select an existing visualization or
        - Create a new one using dropdown options.
    3. Available chart types:
        - Bar chart
        - Line chart
        - Pie chart

    You can customize the chart.

---

4. Commenting on Visualizations

    Each visualization includes a **comment section** at the bottom:

    - Add your thoughts or feedback.
    - See what others have shared.
    - Great for collaboration with team members!

---

5. Visibility & Permissions

-   **Public Datasets:** Available to all users.
-   **Private Datasets:** Only visible to the owner.

---

## Development Guide

### Environment Setup and Configuration

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/Tasselyy/collaborative-platform/tree/feiyangfan-submission
    cd collaborative-platform
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Environment Variables:**

    1. Create a .env file in the root directory and configure the following:

    ```
    DATABASE_URL
    NEXT_PUBLIC_API_BASE_URL

    BETTER_AUTH_SECRET
    BETTER_AUTH_URL

    GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET
    GITHUB_CLIENT_ID
    GITHUB_CLIENT_SECRET

    AWS_REGION
    AWS_ACCESS_KEY
    AWS_SECRET_KEY
    AWS_BUCKET_NAME
    ```

### Database Inilitalization

1. **Prisma Setup:**
   Initialize Prisma and migrate the schema:
   `bash
 npx prisma migrate dev --name init
 npx prisma generate
`

### Cloud Storage Configuration

1. Create an S3 bucket in AWS
    1. In Object Ownership, select "ACLs enabled" and "Bucket owner prefered"
    2. In Block Public Access settings for this bucket, uncheck "Block all public access".
2. Create a IAM user
    1. Select "Attach policies directly"
    2. Add s3:DeleteObject, s3:GetObject, s3:ListBucket, s3:PutObject, s3:PutObjectAcl
3. Save the access key and secret key for the IAM User.
   Select the newly created user (IAM > Users > "your-user") and navigate to "Security Credentials". Under "Access Keys", create a key and save this information.

### Local Development and Testing

1. **Run the Development Server:**
    ```bash
    npm run dev
    ```
2. .env file setup:

    ```.env
     DATABASE_URL
     NEXT_PUBLIC_API_BASE_URL

     BETTER_AUTH_SECRET
     BETTER_AUTH_URL

     GOOGLE_CLIENT_ID
     GOOGLE_CLIENT_SECRET
     GITHUB_CLIENT_ID
     GITHUB_CLIENT_SECRET

     AWS_REGION
     AWS_ACCESS_KEY
     AWS_SECRET_KEY
     AWS_BUCKET_NAME
    ```

3. **Testing:**
   testing database operations
    ```
    npm install ts-node
    npx ts-node prisma/seed.ts
    ```

## Deployment Information

Not Deployed yet due to time constraints.

## Individual Contributions

### Feiyang Fan

-   **Contributions:**
    -   **Project Coordination**
    -   **Landing Page**
    -   **About Page**
    -   **Commenet Section**
    -   **Visualization** (In this version of the project):

### Yifan Yang

-   **Contributions:**
    -   **User Authentication**
    -   **Date Table View**
    -   **File upload**

### Zhengyang Liang

-   **Contributions:**
    -   **Visualization**: Not implemented in this version of the project.

### Yilin Huai

-   **Contributions:**
    -   **Team**: Not implemented in the this version of the code.

## Lessons Learned and Concluding Remarks

1. Lessons Learned:

    - Effective collaboration and clear division of tasks are essential to keep the project on track.

    - Integrating multiple technologies (Next.js, Prisma, Chart.js, cloud storage) requires thorough planning and testing.

    - Real-time collaboration and data visualization demand careful attention to both performance and usability.

2. **Concluding Remarks:**
   This project has provided valuable hands-on experience in full-stack development using modern web technologies. Our Collaborative Data Analysis Platform meets the course requirements by addressing the challenges of isolated data analysis and fostering team collaboration. We are proud of the solution we have built, and we look forward to future iterations that further enhance its capabilities and scalability.
