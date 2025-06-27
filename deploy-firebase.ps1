# Firebase deployment script with environment variables
# Make sure the .env file exists and is properly configured

Write-Host "Building project with environment variables..." -ForegroundColor Green

# Check if .env file exists
if (-Not (Test-Path ".env")) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file with your Supabase credentials." -ForegroundColor Yellow
    exit 1
}

# Read environment variables from .env file
Write-Host "Reading environment variables from .env file..." -ForegroundColor Yellow
Get-Content ".env" | ForEach-Object {
    if ($_ -match "^([^#][^=]*?)=(.*)$") {
        $name = $matches[1]
        $value = $matches[2]
        Set-Item -Path "env:$name" -Value $value
        Write-Host "Set $name" -ForegroundColor Green
    }
}

# Verify required environment variables are set
if (-not $env:VITE_SUPABASE_URL -or -not $env:VITE_SUPABASE_ANON_KEY) {
    Write-Host "Error: Missing required environment variables!" -ForegroundColor Red
    Write-Host "Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env" -ForegroundColor Yellow
    exit 1
}

# Build the project
Write-Host "Running npm run build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Deploying to Firebase..." -ForegroundColor Green
    firebase deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deployment successful!" -ForegroundColor Green
    } else {
        Write-Host "Deployment failed!" -ForegroundColor Red
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
}
