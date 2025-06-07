# 🔧 IMMEDIATE FIX: Enable SonarCloud Orb in CircleCI

## ⚠️ **ISSUE IDENTIFIED**
Your pipeline is failing because the SonarCloud orb is not authorized in your organization.

**Error**: `Orb sonarsource/sonarcloud@2.0.0 not loaded`

## 🚀 **FIX STEPS (2 minutes)**

### Step 1: Enable Uncertified Orbs
1. Go to [CircleCI Dashboard](https://circleci.com/dashboard)
2. Click your **profile/organization** in the top-left
3. Select **Organization Settings**
4. Go to **Security** (left sidebar)
5. Under **Orb Security Settings**:
   - ✅ **Check** "Allow Uncertified Orbs"
   - Click **Save**

### Step 2: Create SonarCloud Context (if not done)
1. Still in Organization Settings
2. Go to **Contexts** (left sidebar)
3. Click **Create Context**
4. Name: `SonarCloud`
5. Click **Create Context**
6. Click into the context
7. Add Environment Variable:
   - **Name**: `SONAR_TOKEN`
   - **Value**: [Get from SonarCloud.io → My Account → Security → Generate Token]

## ✅ **Expected Result**
After enabling uncertified orbs:
- Pipeline will no longer fail with "orb not loaded" error
- Both jobs will run: `build-and-test` + `sonarcloud-analysis`
- SonarCloud analysis will execute (if token is configured)

## 🔄 **Test the Fix**
After enabling the setting, trigger a new build by pushing a small change:
```bash
git commit --allow-empty -m "Test SonarCloud orb authorization fix"
git push
```

---
**Status**: Pipeline failing due to orb authorization - fix takes 2 minutes!
