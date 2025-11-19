# Educational Honeypot - Logon Security Test

> **⚠️ IMPORTANT ETHICAL DISCLAIMER**
>
> This application is designed **exclusively for educational purposes** to teach:
> - Cloud deployment with Google Cloud Platform (GCP)
> - CI/CD pipeline implementation with Cloud Build
> - Database version control with Sequelize ORM migrations
> - Defensive security concepts through honeypot analysis
> - Responsible security research practices
>
> **This is NOT intended for:**
> - Capturing real credentials from unsuspecting users
> - Unauthorized network monitoring or intrusion
> - Any malicious or unethical purpose
>
> **By deploying this application, you agree to:**
> - Use it only in controlled educational environments
> - Clearly label it as a honeypot/research project
> - Comply with all applicable laws and regulations
> - Never deploy it to impersonate legitimate services
> - Handle any captured data responsibly and ethically

---

## 📚 Table of Contents

- [Overview](#overview)
- [Learning Objectives](#learning-objectives)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Docker Setup (Recommended)](#docker-setup-recommended)
- [Local Development Setup](#local-development-setup)
- [Google Cloud Platform Deployment](#google-cloud-platform-deployment)
- [CI/CD Pipeline Deep Dive](#cicd-pipeline-deep-dive)
- [Database Migrations with Sequelize](#database-migrations-with-sequelize)
- [Understanding the Honeypot](#understanding-the-honeypot)
- [Data Analysis](#data-analysis)
- [Security Considerations](#security-considerations)
- [Cost Management](#cost-management)
- [Troubleshooting](#troubleshooting)
- [Advanced Topics](#advanced-topics)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This project is an **educational honeypot** - a fake login page designed to:

1. **Demonstrate CI/CD pipelines** on Google Cloud Platform
2. **Teach database version control** using Sequelize ORM migrations
3. **Illustrate defensive security concepts** through attacker behavior analysis
4. **Practice cloud deployment** with App Engine and Cloud SQL

The honeypot presents a convincing corporate login page that **always fails authentication** while secretly logging all login attempts. An admin dashboard provides real-time visualization of captured data using Apache ECharts.

---

## 🎓 Learning Objectives

By completing this project, students will learn:

### Cloud & DevOps (60% focus)
- ✅ **CI/CD Pipeline Implementation** - Automated testing, migration, and deployment
- ✅ **Google App Engine** - Serverless Node.js application hosting
- ✅ **Google Cloud SQL** - Managed PostgreSQL database
- ✅ **Cloud Build** - Automated build and deployment workflows
- ✅ **Secret Management** - Secure credential storage with Secret Manager
- ✅ **Infrastructure as Code** - YAML configuration files (app.yaml, cloudbuild.yaml)

### Database & ORM (30% focus)
- ✅ **Sequelize ORM** - Object-Relational Mapping for PostgreSQL
- ✅ **Database Migrations** - Version-controlled schema changes
- ✅ **Seeders** - Initial data population
- ✅ **Model Associations** - Relationships and queries
- ✅ **Zero-Downtime Deployments** - Schema changes before code deployment

### Security Concepts (10% focus)
- ✅ **Honeypot Architecture** - Deceptive security systems
- ✅ **Rate Limiting** - Brute force attack prevention
- ✅ **Session Management** - Secure authentication patterns
- ✅ **Timing Attack Prevention** - Constant-time comparisons
- ✅ **Data Sanitization** - XSS and injection prevention

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Repository                      │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Models   │  │Migrations│  │  Routes  │  │  Views   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ git push to main
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     Cloud Build (CI/CD)                     │
│                                                             │
│  1. npm ci           (Install dependencies)                 │
│  2. npm test         (Run tests - FAIL FAST)               │
│  3. Run Migrations   (Update database schema)              │
│  4. gcloud deploy    (Deploy to App Engine)                │
│  5. Health Check     (Verify deployment)                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
┌──────────────────┐      ┌──────────────────┐
│   App Engine     │◄────►│   Cloud SQL      │
│  (Node.js 18)    │      │  (PostgreSQL)    │
│                  │      │                  │
│  • Express.js    │      │  • 4 Tables      │
│  • EJS Views     │      │  • Migrations    │
│  • Rate Limiting │      │  • Seeders       │
└─────────┬────────┘      └──────────────────┘
          │
          ▼
┌─────────────────────────────────────────────┐
│            End Users                        │
│                                             │
│  Public:  https://your-app.appspot.com/    │
│  Admin:   https://your-app.appspot.com/admin2430.html │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 18+ | JavaScript runtime environment |
| **Framework** | Express.js | 4.18+ | Web application framework |
| **ORM** | Sequelize | 6.35+ | PostgreSQL ORM and migrations |
| **Database** | PostgreSQL | 14+ | Relational database (Cloud SQL) |
| **View Engine** | EJS | 3.1+ | Server-side templating |
| **CSS Framework** | Bootstrap | 5.3+ | Responsive UI components |
| **Visualization** | Apache ECharts | 5.4+ | Interactive data charts |
| **Session Store** | express-session | 1.17+ | Session management |
| **Rate Limiting** | express-rate-limit | 7.1+ | Brute force prevention |
| **Cloud Platform** | Google App Engine | Standard | Serverless hosting |
| **Cloud Database** | Google Cloud SQL | PostgreSQL 14 | Managed database |
| **CI/CD** | Google Cloud Build | - | Automated deployment pipeline |

---

## 📁 Project Structure

```
Logon-Security-Test/
├── config/
│   ├── config.json              # Sequelize database configuration
│   └── database.js              # Database connection initialization
├── migrations/                  # Sequelize migration files
│   ├── 20250101000001-create-general-logs.js
│   ├── 20250101000002-create-credential-capture.js
│   ├── 20250101000003-create-admin-access-logs.js
│   └── 20250101000004-create-app-config.js
├── models/                      # Sequelize models
│   ├── index.js                 # Model aggregator
│   ├── GeneralLog.js           # All HTTP requests
│   ├── CredentialCapture.js    # Login attempts (honeypot data)
│   ├── AdminAccessLog.js       # Admin panel access audit
│   └── AppConfig.js            # Key-value configuration
├── seeders/                     # Initial data
│   └── 20250101000001-default-admin-pin.js
├── middleware/
│   ├── requestLogger.js        # Global request logging
│   └── rateLimiter.js          # Rate limiting rules
├── routes/
│   ├── public.js               # Public login page & capture
│   └── admin.js                # Admin dashboard & API
├── services/
│   └── statsService.js         # Dashboard statistics
├── views/
│   ├── partials/
│   │   ├── header.ejs          # HTML head & Bootstrap
│   │   └── footer.ejs          # Scripts & ECharts
│   ├── login.ejs               # Fake login page (THE TRAP)
│   ├── admin-login.ejs         # PIN entry page
│   └── admin-dashboard.ejs     # Analytics dashboard
├── public/
│   ├── css/
│   │   └── styles.css          # Custom styles
│   └── js/
│       ├── echarts-config.js   # Chart configurations
│       └── dashboard.js        # Dashboard interactivity
├── test/
│   └── basic.test.js           # CI/CD test suite
├── app.js                       # Main Express application
├── .sequelizerc                 # Sequelize CLI config
├── package.json                 # Dependencies & scripts
├── app.yaml                     # App Engine configuration
├── cloudbuild.yaml              # CI/CD pipeline definition
├── .env.template                # Environment variable template
├── .gitignore                   # Git ignore rules
├── .gcloudignore                # GCP deployment ignore rules
├── Dockerfile                   # Multistage Docker build
├── docker-compose.yml           # Local development orchestration
├── .dockerignore                # Docker build optimization
└── README.md                    # This file
```

---

## ✅ Prerequisites

### Required Accounts & Tools
- **Google Cloud Platform Account** (with billing enabled)
  - Free tier available: $300 credit for 90 days
  - Sign up: https://cloud.google.com/free

- **GitHub Account** (for repository hosting)
  - Sign up: https://github.com/signup

- **Local Development Tools**
  - **Option 1: Docker (Recommended)** - Easiest setup
    - Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))
    - Includes Docker Engine and Docker Compose
  - **Option 2: Native Installation** - Direct on your machine
    - Node.js 18+ ([Download](https://nodejs.org/))
    - PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
  - **Required for both options:**
    - Git ([Download](https://git-scm.com/downloads))
    - Google Cloud SDK ([Install Guide](https://cloud.google.com/sdk/docs/install)) - Only for GCP deployment

### Knowledge Prerequisites
- Basic JavaScript/Node.js
- SQL fundamentals
- Command line navigation
- Git basics

---

## 🐳 Docker Setup (Recommended)

**Why Docker?** Docker provides the easiest and most consistent development experience:
- ✅ No manual PostgreSQL installation
- ✅ No Node.js version conflicts
- ✅ Identical environment for all developers
- ✅ One-command setup and teardown
- ✅ Data persists in `db_volume/` directory

### Quick Start (Docker)

```bash
# Clone repository
git clone https://github.com/YOUR-USERNAME/Logon-Security-Test.git
cd Logon-Security-Test

# Create db_volume directory for PostgreSQL data
mkdir db_volume

# Start everything with Docker Compose
docker-compose up --build

# Application is now running!
# - Public Login: http://localhost:8080/
# - Admin Panel: http://localhost:8080/admin2430.html
# - Admin PIN: 3591
```

That's it! Docker Compose automatically:
1. ✅ Builds the Node.js application image (multistage build)
2. ✅ Starts PostgreSQL 14 database
3. ✅ Runs database migrations
4. ✅ Seeds default admin PIN
5. ✅ Starts the web server

### Docker Commands

```bash
# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f app    # Application logs
docker-compose logs -f db     # Database logs

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up --build

# Reset database (DELETES ALL DATA!)
docker-compose down -v
rm -rf db_volume
mkdir db_volume
docker-compose up --build

# Connect to database
docker-compose exec db psql -U postgres honeypot_db

# Run migrations manually
docker-compose exec app npx sequelize-cli db:migrate

# Shell into app container
docker-compose exec app sh

# View running containers
docker-compose ps

# Check service health
docker-compose ps
```

### Docker Architecture

**Multistage Build (Dockerfile):**
```
Stage 1: Builder
- Base: node:18-slim
- Install ALL dependencies
- ~1.2GB intermediate image

Stage 2: Production
- Base: node:18-slim
- Copy only production dependencies
- Final image: ~250MB (79% reduction!)
- Non-root user for security
- Health check included
```

**Services (docker-compose.yml):**
```yaml
db:
  - PostgreSQL 14 Alpine (~80MB)
  - Data stored in ./db_volume
  - Port: 5432
  - Health check: pg_isready

app:
  - Node.js application
  - Waits for DB to be healthy
  - Auto-runs migrations on startup
  - Port: 8080
  - Hot reload with volume mount
```

### Docker Troubleshooting

#### Issue: "Error: ECONNREFUSED connecting to database"

**Cause:** Database not ready yet

**Solution:**
```bash
# Check database health
docker-compose ps

# View database logs
docker-compose logs db

# Restart services
docker-compose restart
```

#### Issue: "Port 5432 already in use"

**Cause:** PostgreSQL already running on host

**Solution:**
```bash
# Option 1: Stop local PostgreSQL
brew services stop postgresql@14  # macOS
sudo service postgresql stop      # Linux

# Option 2: Change port in docker-compose.yml
# ports:
#   - "5433:5432"  # Map to different host port
```

#### Issue: "Permission denied: db_volume"

**Cause:** Volume directory permissions issue

**Solution:**
```bash
# Fix permissions
sudo chown -R $(whoami) db_volume

# Or recreate
rm -rf db_volume
mkdir db_volume
docker-compose up --build
```

#### Issue: "No space left on device"

**Cause:** Docker images/volumes using too much disk space

**Solution:**
```bash
# Clean up unused Docker resources
docker system prune -a --volumes

# Check disk usage
docker system df
```

### Apple Silicon (M1/M2) Note

The Dockerfile is configured to work on both Intel and Apple Silicon Macs. To build specifically for cloud deployment (linux/amd64):

```bash
# Build for cloud platforms (x86_64)
docker build --platform linux/amd64 -t honeypot-app:latest .

# Or uncomment in docker-compose.yml:
# build:
#   platform: linux/amd64
```

### Environment Variables (Docker)

Docker Compose uses `.env` file automatically. Create one:

```bash
cp .env.template .env
```

**Example .env:**
```env
DB_USER=postgres
DB_PASS=postgres
DB_NAME=honeypot_db
NODE_ENV=development
SESSION_SECRET=your-random-32-char-secret-here
```

### Database Access (Docker)

**Via psql in container:**
```bash
docker-compose exec db psql -U postgres honeypot_db

# Run SQL query
SELECT * FROM credential_capture;
\q
```

**Via pgAdmin (GUI):**
- Host: `localhost`
- Port: `5432`
- Username: `postgres`
- Password: (from .env DB_PASS)
- Database: `honeypot_db`

**Via TablePlus/DBeaver:**
Same connection details as above.

### Stopping Docker Services

```bash
# Stop containers (data persists)
docker-compose down

# Stop and remove volumes (DELETES DATA!)
docker-compose down -v
rm -rf db_volume
```

---

## 🚀 Local Development Setup (Without Docker)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/Logon-Security-Test.git
cd Logon-Security-Test
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- Express.js and middleware
- Sequelize ORM and PostgreSQL drivers
- EJS templating engine
- Development tools (nodemon, sequelize-cli)

### Step 3: Set Up Local PostgreSQL Database

**Option A: PostgreSQL Installed Locally**

```bash
# Create database
createdb honeypot_db

# Or using psql:
psql -U postgres
CREATE DATABASE honeypot_db;
\q
```

**Option B: Docker PostgreSQL (Alternative)**

```bash
docker run --name honeypot-postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=honeypot_db \
  -p 5432:5432 \
  -d postgres:14
```

### Step 4: Configure Environment Variables

```bash
# Copy template
cp .env.template .env

# Edit .env file
nano .env
```

**Required .env configuration:**

```env
# Database Configuration (Local Development)
DB_USER=postgres
DB_PASS=your_local_password_here
DB_NAME=honeypot_db
DB_HOST=localhost
DB_PORT=5432

# Application Configuration
NODE_ENV=development
PORT=8080

# Session Secret (generate with command below)
SESSION_SECRET=your-random-session-secret-min-32-chars-CHANGE-THIS
```

**Generate secure session secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Run Database Migrations

**CRITICAL CONCEPT:** Migrations create the database schema in a version-controlled way.

```bash
# Run all migrations (creates tables)
npm run migrate

# If you need to rollback (undo last migration)
npm run migrate:undo
```

What this does:
1. Creates `general_logs` table (HTTP request logging)
2. Creates `credential_capture` table (login attempts)
3. Creates `admin_access_logs` table (admin access audit trail)
4. Creates `app_config` table (key-value configuration)
5. Creates `SequelizeMeta` table (tracks which migrations ran)

### Step 6: Seed the Database

```bash
# Insert default admin PIN (3591)
npm run seed

# To undo seeders (remove seeded data)
npm run seed:undo
```

### Step 7: Start the Development Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Or production mode
npm start
```

**Expected output:**

```
╔════════════════════════════════════════════════════════════╗
║  Educational Honeypot - Logon Security Test                ║
║  ⚠️  FOR EDUCATIONAL USE ONLY                              ║
╚════════════════════════════════════════════════════════════╝

🚀 Server running on port 8080
🌍 Environment: development

📋 Available endpoints:
   Public Login:  http://localhost:8080/
   Admin Panel:   http://localhost:8080/admin2430.html
   Health Check:  http://localhost:8080/health

🔐 Default Admin PIN: 3591

Press Ctrl+C to stop the server
```

### Step 8: Test the Application

1. **Public Login (Honeypot):** http://localhost:8080/
   - Try any username/password
   - All attempts will fail (by design)
   - Check database: `SELECT * FROM credential_capture;`

2. **Admin Panel:** http://localhost:8080/admin2430.html
   - Enter PIN: `3591`
   - View dashboard with captured data

3. **Health Check:** http://localhost:8080/health
   - Verify database connectivity
   - Check application status

---

## ☁️ Google Cloud Platform Deployment

### Phase 1: GCP Project Setup

#### 1.1 Create GCP Project

```bash
# Set project ID (must be globally unique)
export PROJECT_ID="honeypot-learning-$(date +%s)"

# Create project
gcloud projects create $PROJECT_ID --name="Honeypot Learning Project"

# Set as current project
gcloud config set project $PROJECT_ID

# Enable billing (required for App Engine and Cloud SQL)
# Visit: https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID
```

#### 1.2 Enable Required APIs

```bash
# Enable App Engine, Cloud SQL, Cloud Build, Secret Manager
gcloud services enable \
  appengine.googleapis.com \
  sqladmin.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com
```

#### 1.3 Initialize App Engine

```bash
# Initialize App Engine (choose region - us-central recommended)
gcloud app create --region=us-central
```

### Phase 2: Cloud SQL Database Setup

#### 2.1 Create Cloud SQL Instance

```bash
# Create PostgreSQL 14 instance (db-f1-micro = smallest/cheapest)
gcloud sql instances create honeypot-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password="CHANGE-THIS-STRONG-PASSWORD"

# Wait for instance creation (takes 5-10 minutes)
```

#### 2.2 Create Database

```bash
# Create database
gcloud sql databases create honeypot_db --instance=honeypot-db
```

#### 2.3 Create Database User

```bash
# Create user
gcloud sql users create honeypot_user \
  --instance=honeypot-db \
  --password="CHANGE-THIS-USER-PASSWORD"
```

#### 2.4 Get Connection Name

```bash
# Get instance connection name (needed for app.yaml)
gcloud sql instances describe honeypot-db --format="value(connectionName)"

# Example output: your-project-id:us-central1:honeypot-db
# SAVE THIS - you'll need it in app.yaml
```

### Phase 3: Secret Management

#### 3.1 Create Database Password Secret

```bash
# Create secret
echo -n "YOUR-DB-PASSWORD-HERE" | \
  gcloud secrets create db-password --data-file=-

# Grant Cloud Build access to secret
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding db-password \
  --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

#### 3.2 Create Session Secret

```bash
# Generate random session secret
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Create secret
echo -n "$SESSION_SECRET" | \
  gcloud secrets create session-secret --data-file=-

# Grant App Engine access
gcloud secrets add-iam-policy-binding session-secret \
  --member=serviceAccount:$PROJECT_ID@appspot.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

### Phase 4: Update Configuration Files

#### 4.1 Edit app.yaml

```yaml
# Find this line in app.yaml:
INSTANCE_CONNECTION_NAME: 'your-project-id:us-central1:honeypot-db'

# Replace with YOUR actual connection name from Step 2.4
INSTANCE_CONNECTION_NAME: 'honeypot-learning-1234567890:us-central1:honeypot-db'
```

#### 4.2 Edit cloudbuild.yaml

```yaml
# Find these lines in cloudbuild.yaml (line ~65):
./cloud_sql_proxy -instances=your-project-id:us-central1:honeypot-db=tcp:5432 &

# Replace with YOUR actual connection name
./cloud_sql_proxy -instances=honeypot-learning-1234567890:us-central1:honeypot-db=tcp:5432 &
```

### Phase 5: Initial Deployment (Manual)

#### 5.1 Run Migrations on Cloud SQL

```bash
# Download Cloud SQL Proxy
wget https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.amd64 -O cloud_sql_proxy
chmod +x cloud_sql_proxy

# Start proxy (replace with your connection name)
./cloud_sql_proxy -instances=YOUR-CONNECTION-NAME=tcp:5432 &

# Set environment variables for migration
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=honeypot_user
export DB_PASS=YOUR-DB-PASSWORD
export DB_NAME=honeypot_db

# Run migrations
npx sequelize-cli db:migrate

# Run seeders
npx sequelize-cli db:seed:all

# Stop proxy
pkill cloud_sql_proxy
```

#### 5.2 Deploy to App Engine

```bash
# Deploy application
gcloud app deploy app.yaml --quiet

# Expected output:
# ...
# Deployed service [default] to [https://your-project-id.appspot.com]
```

#### 5.3 Verify Deployment

```bash
# Check health endpoint
gcloud app browse --service=default

# Or use curl
curl https://YOUR-PROJECT-ID.appspot.com/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-01-19T12:00:00.000Z",
  "environment": "production"
}
```

---

## 🔄 CI/CD Pipeline Deep Dive

### Overview

The CI/CD pipeline automates the entire deployment process:

```
git push → Cloud Build → Tests → Migrations → Deploy → Verify
```

### Setting Up Cloud Build Trigger

#### 1. Connect GitHub Repository

```bash
# Option A: Via Cloud Console (Recommended)
# 1. Go to: https://console.cloud.google.com/cloud-build/triggers
# 2. Click "Connect Repository"
# 3. Select "GitHub (Cloud Build GitHub App)"
# 4. Authenticate and select your repository
# 5. Click "Connect"

# Option B: Via gcloud CLI
gcloud beta builds triggers create github \
  --repo-name=Logon-Security-Test \
  --repo-owner=YOUR-GITHUB-USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

#### 2. Configure Substitution Variables

In Cloud Console → Cloud Build → Triggers → Edit Trigger:

Add substitution variables:
- `_DB_USER`: `honeypot_user`
- `_DB_NAME`: `honeypot_db`
- `_DB_PASS`: Reference the secret: `$(gcloud secrets versions access latest --secret=db-password)`

### Pipeline Stages Explained

#### Stage 1: Install Dependencies (npm ci)

```yaml
- name: 'node:18'
  entrypoint: 'npm'
  args: ['ci']
```

**What it does:**
- Installs exact versions from `package-lock.json`
- Faster and more reliable than `npm install`
- Fails if `package.json` and `package-lock.json` are out of sync

**Educational Note:** `npm ci` is preferred in CI/CD because it ensures reproducible builds.

#### Stage 2: Run Tests (npm test)

```yaml
- name: 'node:18'
  entrypoint: 'npm'
  args: ['test']
  waitFor: ['install-dependencies']
```

**What it does:**
- Runs the test suite (`test/basic.test.js`)
- Verifies code quality and functionality
- **FAILS FAST** - stops pipeline if tests fail

**Educational Note:** This implements the "shift-left" testing philosophy - catch errors early.

#### Stage 3: Run Database Migrations ⭐ CRITICAL

```yaml
- name: 'gcr.io/cloud-builders/gcloud'
  entrypoint: 'bash'
  args: ['-c', '
    # Download Cloud SQL Proxy
    wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
    chmod +x cloud_sql_proxy

    # Start proxy
    ./cloud_sql_proxy -instances=${_INSTANCE_CONNECTION_NAME}=tcp:5432 &
    sleep 5

    # Install Node.js and Sequelize CLI
    apt-get update && apt-get install -y nodejs npm
    npm install --no-save sequelize-cli pg pg-hstore

    # Run migrations
    export DATABASE_URL="postgresql://${_DB_USER}:${_DB_PASS}@localhost:5432/${_DB_NAME}"
    npx sequelize-cli db:migrate

    # Cleanup
    pkill cloud_sql_proxy
  ']
```

**Why This Stage is Critical:**

1. **Zero-Downtime Deployments**
   - Migrations run **BEFORE** code deployment
   - Old code can run with new schema (backward compatibility)
   - New code requires new schema (forward compatibility)

2. **Version Control**
   - Schema changes are tracked in git
   - Rollback capability with `db:migrate:undo`
   - Audit trail of all schema changes

3. **Idempotent**
   - Safe to run multiple times
   - Only applies new migrations
   - Tracked in `SequelizeMeta` table

**Educational Comparison:**

| Approach | Schema Updates | Rollback | Version Control | Zero-Downtime |
|----------|---------------|----------|-----------------|---------------|
| **Raw SQL** | Manual scripts | Manual | ❌ | ❌ |
| **Sequelize Migrations** | Automated | `db:migrate:undo` | ✅ | ✅ |

#### Stage 4: Deploy to App Engine

```yaml
- name: 'gcr.io/cloud-builders/gcloud'
  args: ['app', 'deploy', 'app.yaml', '--quiet', '--promote', '--stop-previous-version']
```

**What it does:**
- Builds new container image
- Starts new instances
- Gradually shifts traffic (0% → 100%)
- Stops old instances after new ones are healthy

#### Stage 5: Verify Deployment (Health Check)

```yaml
- name: 'gcr.io/cloud-builders/gcloud'
  entrypoint: 'bash'
  args: ['-c', '
    APP_URL=$(gcloud app describe --format="value(defaultHostname)")
    for i in {1..5}; do
      RESPONSE=$(curl -f -s "https://$APP_URL/health" || echo "FAILED")
      if [[ $RESPONSE == *"status\":\"ok"* ]]; then
        echo "✅ Health check passed!"
        exit 0
      fi
      sleep 10
    done
    exit 1
  ']
```

**What it does:**
- Verifies app is responding
- Checks database connectivity
- Fails deployment if health check fails (automatic rollback)

### Triggering the Pipeline

#### Option 1: Git Push (Automatic)

```bash
# Make a code change
echo "// Updated $(date)" >> app.js

# Commit and push
git add .
git commit -m "Trigger CI/CD pipeline"
git push origin main

# Watch build progress
gcloud builds list --limit=1
gcloud builds log $(gcloud builds list --limit=1 --format="value(ID)") --stream
```

#### Option 2: Manual Trigger

```bash
# Via gcloud CLI
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_DB_USER=honeypot_user,_DB_NAME=honeypot_db,_DB_PASS=yourpass

# Via Cloud Console
# Go to: Cloud Build → Triggers → Run Trigger
```

### Monitoring Builds

```bash
# List recent builds
gcloud builds list --limit=10

# View specific build logs
gcloud builds log BUILD_ID --stream

# View in Cloud Console
# https://console.cloud.google.com/cloud-build/builds
```

---

## 💾 Database Migrations with Sequelize

### What Are Migrations?

Migrations are **version-controlled database schema changes** - like "git for your database."

**Without migrations:**
```sql
-- init.sql (monolithic, run once)
CREATE TABLE users (...);
CREATE TABLE posts (...);
-- How do you add a column later? Manual ALTER TABLE? 🤔
```

**With migrations:**
```javascript
// Migration 1: Create users table
// Migration 2: Create posts table
// Migration 3: Add email column to users (NEW!)
// Each migration is tracked, reversible, and version-controlled
```

### Creating a New Migration

#### Scenario: Add "country" column to credential_capture

```bash
# Generate migration file
npx sequelize-cli migration:generate --name add-country-to-credential-capture

# This creates: migrations/TIMESTAMP-add-country-to-credential-capture.js
```

**Edit the migration file:**

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Educational: This runs when migrating forward
    await queryInterface.addColumn('credential_capture', 'country', {
      type: Sequelize.STRING(2),  // ISO 3166-1 alpha-2 country codes
      allowNull: true,
      comment: 'Detected country from IP address'
    });

    // Optional: Add index for faster country-based queries
    await queryInterface.addIndex('credential_capture', ['country'], {
      name: 'idx_credential_capture_country'
    });
  },

  async down(queryInterface, Sequelize) {
    // Educational: This runs when rolling back
    await queryInterface.removeIndex('credential_capture', 'idx_credential_capture_country');
    await queryInterface.removeColumn('credential_capture', 'country');
  }
};
```

**Run the migration:**

```bash
# Local development
npm run migrate

# In production (via CI/CD)
# Automatically runs during Cloud Build pipeline!
```

**Update the model** (models/CredentialCapture.js):

```javascript
country: {
  type: DataTypes.STRING(2),
  allowNull: true,
  validate: {
    len: [2, 2],  // Must be exactly 2 characters
    isAlpha: true  // Only letters
  },
  comment: 'Detected country from IP address'
}
```

### Migration Best Practices

#### 1. **Backward Compatibility**

✅ **GOOD** (additive changes):
```javascript
// Add new column (old code still works)
await queryInterface.addColumn('users', 'phone', { type: Sequelize.STRING });

// Add new table (old code ignores it)
await queryInterface.createTable('notifications', {...});

// Add index (improves performance, doesn't break anything)
await queryInterface.addIndex('users', ['email']);
```

❌ **BAD** (breaking changes):
```javascript
// Drop column (old code will crash!)
await queryInterface.removeColumn('users', 'username');

// Rename column (old code expects old name!)
await queryInterface.renameColumn('users', 'name', 'full_name');

// Change column type (data loss risk!)
await queryInterface.changeColumn('users', 'age', { type: Sequelize.STRING });
```

**Solution:** Use **two-phase migration** for breaking changes:

**Phase 1 (Deploy 1):**
```javascript
// Add new column, keep old column
await queryInterface.addColumn('users', 'full_name', { type: Sequelize.STRING });
// Code: Read from 'name', write to both 'name' and 'full_name'
```

**Phase 2 (Deploy 2, after all instances updated):**
```javascript
// Remove old column
await queryInterface.removeColumn('users', 'name');
// Code: Now only uses 'full_name'
```

#### 2. **Always Provide `down()` Method**

```javascript
async up(queryInterface, Sequelize) {
  await queryInterface.createTable('posts', {...});
}

async down(queryInterface, Sequelize) {
  // Educational: ALWAYS implement down() for rollback capability
  await queryInterface.dropTable('posts');
}
```

#### 3. **Test Migrations Before Production**

```bash
# Run migration
npm run migrate

# Test app with new schema
npm start

# Rollback migration
npm run migrate:undo

# Test app with old schema (should still work!)
npm start

# Re-run migration
npm run migrate
```

#### 4. **Use Transactions for Multi-Step Migrations**

```javascript
async up(queryInterface, Sequelize) {
  // Educational: Wrap multiple operations in transaction
  // If ANY operation fails, ALL rollback (atomic)
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.addColumn('users', 'status', {...}, { transaction });
    await queryInterface.addIndex('users', ['status'], { transaction });
    await queryInterface.bulkUpdate('users', { status: 'active' }, {}, { transaction });
  });
}
```

### Common Migration Scenarios

#### Add Column with Default Value

```javascript
await queryInterface.addColumn('users', 'verified', {
  type: Sequelize.BOOLEAN,
  allowNull: false,
  defaultValue: false
});
```

#### Create Table with Associations

```javascript
await queryInterface.createTable('comments', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'posts',  // Foreign key to posts table
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  content: Sequelize.TEXT,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});
```

#### Add Unique Constraint

```javascript
await queryInterface.addConstraint('users', {
  fields: ['email'],
  type: 'unique',
  name: 'unique_email_constraint'
});
```

---

## 🕸️ Understanding the Honeypot

### What is a Honeypot?

A **honeypot** is a security system that:
1. **Deceives** attackers into interacting with it
2. **Monitors** their behavior and techniques
3. **Learns** attack patterns for defensive purposes

**Think of it as:** A fake target that looks real but exists only to study attackers.

### This Honeypot's Architecture

#### Public Login Page (The Trap)

**URL:** `https://your-app.appspot.com/`

**Appearance:**
- Professional corporate login design
- Bootstrap 5 styling (looks legitimate)
- "Secure Connection (SSL/TLS)" badge
- Loading spinners and error messages

**Behavior:**
```javascript
// routes/public.js
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  // 1. Capture credentials (honeypot behavior)
  await CredentialCapture.create({
    ipAddress: req.ip,
    usernameAttempted: sanitizedUsername,
    passwordAttempted: sanitizedPassword,  // ⚠️ PLAINTEXT (educational anti-pattern)
    passwordLength: sanitizedPassword.length
  });

  // 2. Add realistic delay (500-1500ms)
  await new Promise(resolve => setTimeout(resolve, delay));

  // 3. ALWAYS return error (honeypot always fails)
  return res.status(401).json({ error: 'Invalid username or password' });
});
```

**Key Features:**
- ✅ Rate limited (5 attempts/minute per IP)
- ✅ All requests logged (requestLogger middleware)
- ✅ Generic error messages (don't reveal if username exists)
- ✅ Realistic delays (appears to check database)
- ✅ **ALWAYS FAILS** (core honeypot behavior)

#### Admin Dashboard (The Observatory)

**URL:** `https://your-app.appspot.com/admin2430.html`

**Authentication:**
- 4-digit PIN (default: 3591)
- Constant-time comparison (prevents timing attacks)
- Rate limited (3 attempts/hour per IP)
- Session-based (15-minute timeout)

**Visualizations:**
1. **Timeline Chart** - Login attempts over 7 days
2. **Top IPs Chart** - Most active attacking IP addresses
3. **Top Usernames Chart** - Most common username attempts
4. **Request Distribution** - Pie chart of HTTP paths
5. **Recent Attempts Table** - Paginated, exportable to CSV

**Auto-refresh:** Every 30 seconds

### What Data is Captured?

#### 1. General Logs (ALL Requests)

```sql
SELECT * FROM general_logs ORDER BY timestamp DESC LIMIT 5;
```

| Column | Example | Purpose |
|--------|---------|---------|
| ip_address | `203.0.113.42` | Attacker location |
| user_agent | `Mozilla/5.0 ...` | Attacker's browser/tool |
| request_method | `POST` | HTTP verb |
| request_path | `/login` | URL path |
| referer | `https://google.com` | Where they came from |
| timestamp | `2025-01-19 12:34:56` | When |

**Analysis Questions:**
- Are attackers using automated tools (user agents)?
- What paths are they probing (SQL injection attempts on `/api`)?
- Are they coming from search engines or direct links?

#### 2. Credential Captures (Login Attempts)

```sql
SELECT * FROM credential_capture ORDER BY timestamp DESC LIMIT 5;
```

| Column | Example | Purpose |
|--------|---------|---------|
| username_attempted | `admin` | Common usernames |
| password_attempted | `password123` | Password patterns |
| password_length | `11` | Password complexity |
| ip_address | `203.0.113.42` | Attribution |
| timestamp | `2025-01-19 12:34:56` | Attack timeline |

**Analysis Questions:**
- What are the most common usernames tried?
- What password patterns are popular? (length, complexity)
- Are attacks targeted or spray-and-pray?
- Are there credential stuffing attempts (username:password pairs from breaches)?

#### 3. Admin Access Logs (Admin Panel)

```sql
SELECT * FROM admin_access_logs ORDER BY timestamp DESC LIMIT 5;
```

| Column | Example | Purpose |
|--------|---------|---------|
| pin_entered | `1234` | Failed PIN attempts |
| access_granted | `true` | Success/failure |
| session_id | `abc123...` | Session tracking |
| ip_address | `192.0.2.100` | Legitimate admin IPs |

**Analysis Questions:**
- Are attackers finding the admin panel?
- What PINs are they trying?
- Are there brute force attempts on admin panel?

### Data Analysis Techniques

#### Most Common Usernames

```javascript
// services/statsService.js
const topUsernames = await CredentialCapture.findAll({
  attributes: [
    'usernameAttempted',
    [fn('COUNT', col('id')), 'count']
  ],
  group: ['usernameAttempted'],
  order: [[fn('COUNT', col('id')), 'DESC']],
  limit: 10,
  raw: true
});

// Typical results:
// admin: 1,234 attempts
// root: 891 attempts
// administrator: 567 attempts
// user: 234 attempts
```

**Insights:** Attackers try default admin accounts first.

#### Password Complexity Analysis

```sql
-- Average password length by day
SELECT
  DATE(timestamp) as date,
  AVG(password_length) as avg_length,
  MIN(password_length) as min_length,
  MAX(password_length) as max_length
FROM credential_capture
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

**Insights:** Are attackers using weak passwords or sophisticated guesses?

#### Geographic Distribution (Optional Enhancement)

```javascript
// Requires IP geolocation library (e.g., geoip-lite)
const geoip = require('geoip-lite');

// In requestLogger.js
const geo = geoip.lookup(req.ip);
await GeneralLog.create({
  ipAddress: req.ip,
  country: geo?.country || 'Unknown',
  // ...
});
```

**Visualization:** Map of attack origins (choropleth map in ECharts).

---

## 🔒 Security Considerations

### What This Honeypot Does Well

✅ **Rate Limiting**
- 5 login attempts/minute (public)
- 3 admin PIN attempts/hour
- Prevents brute force attacks

✅ **Session Security**
- httpOnly cookies (prevent XSS access)
- Secure flag in production (HTTPS only)
- 15-minute timeout
- Random session ID (not sequential)

✅ **Timing Attack Prevention**
```javascript
// routes/admin.js - constant-time PIN comparison
function safeCompare(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(Buffer.alloc(bufA.length), bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}
```

**Why?** Prevents attackers from guessing PIN by measuring response time.

✅ **Input Sanitization**
```javascript
// routes/public.js
const sanitizedUsername = validator.escape(username.trim());
const sanitizedPassword = validator.escape(password.trim());
```

**Prevents:** XSS attacks in admin dashboard.

✅ **Trust Proxy**
```javascript
// app.js
app.set('trust proxy', true);
```

**Why?** App Engine uses proxies. Without this, all IPs show as `127.0.0.1`.

### ⚠️ Educational Anti-Patterns (DO NOT USE IN PRODUCTION)

❌ **Plaintext Passwords in Database**
```javascript
// models/CredentialCapture.js
passwordAttempted: {
  type: DataTypes.STRING(255),
  allowNull: false,
  // ⚠️ EDUCATIONAL ANTI-PATTERN: Plaintext passwords
  // In real applications: ALWAYS hash with bcrypt/argon2
}
```

**Why we do it here:** Educational honeypot - we WANT to see actual passwords to study attack patterns.

**Why you should NEVER do this:** Storing plaintext passwords is a critical security vulnerability.

❌ **Simple PIN Authentication**
```javascript
// routes/admin.js
const correctPIN = appConfig.configValue;  // 4-digit PIN
```

**Why we do it here:** Simplicity for educational purposes.

**Better in production:**
- Multi-factor authentication (2FA)
- OAuth 2.0 (Google/GitHub login)
- Strong password + rate limiting

❌ **Security Through Obscurity**
```javascript
// Obscure admin URL: /admin2430.html
```

**Why we do it here:** Reduces noise from automated scanners.

**Why it's not enough:** Obscurity is NOT security. Always use real authentication.

### Hardening for Production Use

If you wanted to deploy this for real (NOT recommended without proper authorization):

1. **Change Admin PIN Immediately**
```sql
UPDATE app_config SET config_value = '9876' WHERE config_key = 'admin_pin';
```

2. **Use HTTPS Everywhere**
- App Engine provides free SSL (automatically enabled)
- Force HTTPS redirects in production

3. **Implement IP Allowlisting for Admin Panel**
```javascript
// middleware/ipWhitelist.js
const ALLOWED_IPS = ['203.0.113.100', '203.0.113.101'];

function requireWhitelistedIP(req, res, next) {
  if (!ALLOWED_IPS.includes(req.ip)) {
    return res.status(403).send('Access Denied');
  }
  next();
}

// routes/admin.js
router.use('/admin2430.html', requireWhitelistedIP);
```

4. **Monitor for Data Breaches**
```javascript
// Alert if sensitive data exposed
if (process.env.NODE_ENV === 'production') {
  // Send alert if admin panel accessed from unknown IP
  // Use Cloud Logging + Cloud Monitoring
}
```

5. **Comply with Data Privacy Laws**
- GDPR (EU): Right to erasure, data minimization
- CCPA (California): Data disclosure requirements
- Add privacy policy and data retention policy

---

## 💰 Cost Management

### GCP Free Tier (Always Free)

- **App Engine:** 28 instance-hours/day (F1 instance)
- **Cloud SQL:** NO free tier (PostgreSQL charged from day 1)
- **Cloud Build:** 120 build-minutes/day
- **Secret Manager:** 6 active secret versions

### Estimated Monthly Costs

**Minimal Usage (Educational):**

| Service | Configuration | Cost |
|---------|--------------|------|
| App Engine | F1 instance, min_instances: 0 | $0-5 |
| Cloud SQL | db-f1-micro, 10GB storage | $7-10 |
| Cloud Build | 10 builds/month @ 3 min each | $0 (within free tier) |
| Networking | <1GB egress | $0 |
| **Total** | | **$7-15/month** |

**Tips to Minimize Costs:**

1. **Scale to Zero**
```yaml
# app.yaml
automatic_scaling:
  min_instances: 0  # Shuts down when no traffic
```

2. **Delete When Not In Use**
```bash
# Stop Cloud SQL instance (saves ~90% of cost)
gcloud sql instances patch honeypot-db --activation-policy=NEVER

# Restart when needed
gcloud sql instances patch honeypot-db --activation-policy=ALWAYS
```

3. **Set Budget Alerts**
```bash
# Create budget alert ($20/month threshold)
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="Honeypot Budget" \
  --budget-amount=20 \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90 \
  --threshold-rule=percent=100
```

4. **Monitor Costs**
```bash
# View current month costs
gcloud billing projects describe $PROJECT_ID \
  --format="value(billingAccountName)"

# Cloud Console: https://console.cloud.google.com/billing
```

### Cleanup Instructions

**When done learning, delete everything:**

```bash
# 1. Delete Cloud SQL instance (biggest cost)
gcloud sql instances delete honeypot-db --quiet

# 2. Delete App Engine versions (keeps project, deletes app)
gcloud app versions list
gcloud app versions delete VERSION_ID --service=default

# 3. Delete secrets
gcloud secrets delete db-password --quiet
gcloud secrets delete session-secret --quiet

# 4. (Optional) Delete entire project
gcloud projects delete $PROJECT_ID --quiet
```

---

## 🐛 Troubleshooting

### Local Development Issues

#### Error: "ECONNREFUSED" when starting server

**Cause:** PostgreSQL not running

**Solution:**
```bash
# Start PostgreSQL
brew services start postgresql@14  # macOS
sudo service postgresql start      # Linux
# Or start Docker container if using Docker
```

#### Error: "SequelizeConnectionError: database 'honeypot_db' does not exist"

**Cause:** Database not created

**Solution:**
```bash
createdb honeypot_db
# Or: psql -U postgres -c "CREATE DATABASE honeypot_db;"
```

#### Error: "relation 'credential_capture' does not exist"

**Cause:** Migrations not run

**Solution:**
```bash
npm run migrate
npm run seed
```

#### Error: "Cannot find module 'sequelize'"

**Cause:** Dependencies not installed

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### GCP Deployment Issues

#### Error: "Permission denied" during gcloud commands

**Cause:** Not authenticated or wrong project

**Solution:**
```bash
# Re-authenticate
gcloud auth login

# Set correct project
gcloud config set project $PROJECT_ID

# Verify
gcloud config list
```

#### Error: "Cloud SQL instance not reachable"

**Cause:** Incorrect connection name in app.yaml

**Solution:**
```bash
# Get correct connection name
gcloud sql instances describe honeypot-db --format="value(connectionName)"

# Update app.yaml with exact connection name
INSTANCE_CONNECTION_NAME: 'actual-project-id:us-central1:honeypot-db'
```

#### Error: "Migrations fail in Cloud Build"

**Cause:** Database password not configured in Cloud Build

**Solution:**
```bash
# Ensure secret exists
gcloud secrets versions access latest --secret=db-password

# Check Cloud Build trigger has substitution variable
# _DB_PASS should reference: $(gcloud secrets versions access latest --secret=db-password)
```

#### Error: "Health check failed" after deployment

**Cause:** Database not connected or migrations failed

**Solution:**
```bash
# Check App Engine logs
gcloud app logs tail -s default

# Look for database connection errors
# Common issues:
# - Wrong connection name
# - Wrong database credentials
# - Migrations didn't run
```

#### Error: "Build timeout" in Cloud Build

**Cause:** Migration taking too long or hanging

**Solution:**
```yaml
# Increase timeout in cloudbuild.yaml
timeout: '1800s'  # 30 minutes

# Or check migration logs for issues
gcloud builds log BUILD_ID
```

### Database Issues

#### Migration stuck or failed halfway

**Solution:**
```bash
# Check migration status
psql -U honeypot_user -d honeypot_db -c "SELECT * FROM \"SequelizeMeta\";"

# Manually rollback if needed
npm run migrate:undo

# Re-run migration
npm run migrate
```

#### Need to reset database completely

**Solution:**
```bash
# Local:
dropdb honeypot_db
createdb honeypot_db
npm run migrate
npm run seed

# Cloud SQL:
gcloud sql databases delete honeypot_db --instance=honeypot-db
gcloud sql databases create honeypot_db --instance=honeypot-db
# Then run migrations via Cloud Build or Cloud SQL Proxy
```

---

## 🎓 Advanced Topics

### Adding IP Geolocation

Install geoip-lite:
```bash
npm install geoip-lite
```

Update requestLogger.js:
```javascript
const geoip = require('geoip-lite');

const geo = geoip.lookup(req.ip);

await GeneralLog.create({
  ipAddress: req.ip,
  country: geo?.country || 'Unknown',
  city: geo?.city || 'Unknown',
  // ...
});
```

Create migration to add columns:
```bash
npx sequelize-cli migration:generate --name add-geo-to-general-logs
```

### Implementing Email Alerts

Install nodemailer:
```bash
npm install nodemailer @sendgrid/mail
```

Create alerting service:
```javascript
// services/alertService.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendAdminAlert(ipAddress, username) {
  await sgMail.send({
    to: 'admin@example.com',
    from: 'honeypot@example.com',
    subject: 'Honeypot Alert: New Attack',
    text: `Login attempt from ${ipAddress} with username: ${username}`
  });
}
```

### Integrating with SIEM Tools

Export logs to Cloud Logging:
```javascript
const { Logging } = require('@google-cloud/logging');
const logging = new Logging();
const log = logging.log('honeypot-events');

await log.write(log.entry({
  resource: { type: 'global' },
  severity: 'WARNING',
  jsonPayload: {
    event: 'login_attempt',
    ip: req.ip,
    username: username
  }
}));
```

### Machine Learning on Attack Patterns

Export data to BigQuery for analysis:
```bash
# Create BigQuery dataset
bq mk honeypot_analysis

# Export from Cloud SQL to BigQuery
gcloud sql export csv honeypot-db \
  gs://your-bucket/exports/credentials.csv \
  --database=honeypot_db \
  --query="SELECT * FROM credential_capture"

# Load into BigQuery
bq load --source_format=CSV \
  honeypot_analysis.credential_capture \
  gs://your-bucket/exports/credentials.csv
```

---

## 📄 License

MIT License - See LICENSE file for details.

This project is for **educational purposes only**. The authors are not responsible for any misuse of this software.

---

## 🙏 Acknowledgments

- **Bootstrap Team** - UI framework
- **Apache ECharts** - Data visualization
- **Sequelize Team** - ORM and migrations
- **Google Cloud Platform** - Infrastructure
- **Security researchers** - Honeypot concepts

---

## 📞 Support

- **Issues:** https://github.com/YOUR-USERNAME/Logon-Security-Test/issues
- **Discussions:** https://github.com/YOUR-USERNAME/Logon-Security-Test/discussions
- **Educational questions:** Use GitHub Discussions

---

**Remember:** With great power comes great responsibility. Use this knowledge ethically and legally. Always get proper authorization before deploying honeypots on networks you don't own.

Happy learning! 🚀
