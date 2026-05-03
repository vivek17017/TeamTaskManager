<<<<<<< HEAD
# Team Task Manager

A full-stack web application built with **Next.js (App Router)**, **Prisma**, **PostgreSQL/SQLite**, and **Tailwind CSS**.

## Features

- **Authentication:** JWT-based signup and login.
- **Role-Based Access Control:** 
  - **Admin:** Can create projects, create tasks, assign tasks to members, and delete tasks.
  - **Member:** Can view projects, view tasks, and update the status of tasks assigned to them.
- **Project & Task Management:** Create projects and track individual tasks with statuses (Pending, In Progress, Completed).
- **Dashboard:** Overview of total, completed, in-progress, pending, and overdue tasks.
- **Responsive Design:** Beautiful, vibrant, and fully responsive UI using Tailwind CSS and Lucide icons.

## Local Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="supersecret_for_development_only_123!"
   ```

3. **Initialize Database:**
   ```bash
   npx prisma db push
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment to Railway (Mandatory Instructions)

To deploy this application to Railway, follow these exact steps:

### 1. Push Code to GitHub
1. Create a new empty repository on your GitHub account.
2. Run the following commands in your project directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```

### 2. Deploy Database on Railway
1. Log in to [Railway](https://railway.app/).
2. Click **New Project** -> **Provision PostgreSQL**.
3. Once provisioned, click on your PostgreSQL service -> **Connect** tab -> Copy the **Postgres Connection URL**.

### 3. Deploy the Next.js App
1. Go back to your Railway Project Dashboard.
2. Click **New** -> **GitHub Repo**.
3. Select the GitHub repository you just created.
4. Before the deployment finishes (or if it fails), click on your newly added Web Service.
5. Go to the **Variables** tab and add the following Environment Variables:
   - `DATABASE_URL`: *(Paste the Postgres URL you copied earlier)*
   - `JWT_SECRET`: *(Generate a random strong secret or put something like `my_super_secret_jwt_key_123`)*
6. Go to the **Settings** tab. Under **Build Command**, put:
   ```bash
   npx prisma generate && npx prisma db push && npm run build
   ```
   *(Note: For a production app, you would use `prisma migrate deploy` instead of `db push`, but `db push` is perfect for this assignment since we haven't created a migration history).*
7. Under **Start Command**, put:
   ```bash
   npm run start
   ```
8. In the **Settings** tab, scroll down to **Networking** and click **Generate Domain**.
9. The service will rebuild. Once finished, click the generated domain to access your live application!

## Testing the Application

1. **Register as an Admin:** Go to `/register`, fill out the form, and select **Admin** as your role.
2. **Create a Project:** Go to **Projects** and click "New Project".
3. **Register a Member:** Open an incognito window, go to `/register`, and select **Member**.
4. **Assign Tasks:** Go back to your Admin window, open the newly created project, and create tasks. Assign one to the Member you just created.
5. **Update Task Status:** Go to the Member window, view the project, and change the task status to "In Progress".
=======
# TeamTaskManager
>>>>>>> 3f47beec362a8fbc628e2cd3565bd95bd1d2f592
