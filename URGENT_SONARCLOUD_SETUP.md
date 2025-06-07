# 🚀 URGENT: SonarCloud Setup Instructions

## ⚠️ IMPORTANT: Your Pipeline Will Fail Until This Is Complete

Your CircleCI pipeline now includes SonarCloud analysis, but it requires setup to function properly.

## 🔧 IMMEDIATE ACTIONS REQUIRED (5 minutes)

### Step 1: Create SonarCloud Context in CircleCI
1. Go to [CircleCI Dashboard](https://circleci.com/dashboard)
2. Click on your organization (eli-iie)  
3. Go to **Organization Settings** (left sidebar)
4. Click **Contexts**
5. Click **Create Context**
6. Name it: `SonarCloud`
7. Click **Create Context**

### Step 2: Get SonarCloud Token
1. Go to [SonarCloud.io](https://sonarcloud.io) 
2. Login with GitHub
3. Click profile → **My Account** → **Security** tab
4. Generate Token:
   - Name: `APDS7311-CustomerPortal-CI`
   - Type: `Global Analysis Token`
   - Click **Generate** and **COPY THE TOKEN**

### Step 3: Add Token to CircleCI Context
1. In CircleCI, click your **SonarCloud** context
2. Click **Add Environment Variable**
3. Set:
   - **Variable Name**: `SONAR_TOKEN`
   - **Value**: [Paste your token from Step 2]
4. Click **Add Variable**

### Step 4: Enable CircleCI Organization Orbs
1. In CircleCI Organization Settings
2. Go to **Security** 
3. Under **Orb Security Settings**:
   - Enable **Allow Uncertified Orbs**
   - This allows the SonarCloud orb to run

## 🔍 Expected Results After Setup:
- ✅ Pipeline will have 2 jobs: `build-and-test` + `sonarcloud-analysis`
- ✅ SonarCloud will scan your server + client code
- ✅ Code quality metrics will appear on SonarCloud dashboard
- ✅ Quality gate status will be reported back to GitHub

## 🆘 If Pipeline Fails:
- **Context not found**: You need to create the `SonarCloud` context
- **SONAR_TOKEN missing**: Add the token to the context (not project env vars)
- **Orb not authorized**: Enable uncertified orbs in org settings

## ⏱️ Timeline:
- **Without setup**: Pipeline fails at sonarcloud-analysis job
- **With setup**: Pipeline completes ~2-3 minutes, SonarCloud shows analysis

---
**Next**: Once setup is complete, push any small change to trigger the pipeline and verify SonarCloud analysis works!
