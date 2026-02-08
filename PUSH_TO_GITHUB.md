# Push to GitHub (rp84hub/superbowl)

Run these commands in a terminal **inside** the project folder.  
Use **PowerShell**, **Command Prompt**, or **Git Bash** (after installing [Git for Windows](https://git-scm.com/download/win) if needed).

```bash
cd C:\Users\ronak\superbowl-prediction-app

git init
git add .
git commit -m "Super Bowl LX prediction app"
git branch -M main
git remote add origin https://github.com/rp84hub/superbowl.git
git push -u origin main
```

If the repo already has a remote or you get an error:

- **"remote origin already exists"** → run: `git remote set-url origin https://github.com/rp84hub/superbowl.git` then `git push -u origin main`
- **"failed to push" / auth** → Sign in: run `git config --global user.name "Your Name"` and `git config --global user.email "your@email.com"`. For push, use a [Personal Access Token](https://github.com/settings/tokens) as the password when prompted, or use GitHub Desktop / GitHub CLI to log in.

After a successful push, your code will be at: **https://github.com/rp84hub/superbowl**
