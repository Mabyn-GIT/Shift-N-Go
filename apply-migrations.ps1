# Apply Supabase Migrations
# This script applies all migrations to the Supabase database

# Set Supabase URL and Key from environment variables
$SUPABASE_URL = $env:VITE_SUPABASE_URL
$SUPABASE_KEY = $env:VITE_SUPABASE_ANON_KEY

if (-not $SUPABASE_URL -or -not $SUPABASE_KEY) {
    Write-Error "Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    exit 1
}

Write-Host "Applying database migrations to Supabase..." -ForegroundColor Green

# Run migrations from the supabase/migrations directory
# Each migration is applied in order by filename

# Check if npx is available
try {
    npx --version | Out-Null
} catch {
    Write-Error "npx is not available. Please install Node.js and npm."
    exit 1
}

# Use Supabase CLI to apply migrations if installed
try {
    # Check if Supabase CLI is installed
    supabase --version | Out-Null
    
    Write-Host "Using Supabase CLI to apply migrations..." -ForegroundColor Green
    supabase db push
} catch {
    Write-Host "Supabase CLI not found. Trying alternative method..." -ForegroundColor Yellow
    
    # Alternative method: Use direct HTTP requests to apply migrations
    $migrations = Get-ChildItem -Path "supabase/migrations" -Filter "*.sql" | Sort-Object Name
    
    foreach ($migration in $migrations) {
        Write-Host "Applying migration: $($migration.Name)" -ForegroundColor Cyan
        $sqlContent = Get-Content -Path $migration.FullName -Raw
        
        # Use curl or Invoke-RestMethod to apply the migration
        # This is a simplified example and may need adjustments based on your Supabase setup
        $headers = @{
            "apikey" = $SUPABASE_KEY
            "Authorization" = "Bearer $SUPABASE_KEY"
            "Content-Type" = "application/json"
        }
        
        $body = @{
            "query" = $sqlContent
        } | ConvertTo-Json
        
        try {
            Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" -Method POST -Headers $headers -Body $body
            Write-Host "Migration applied successfully: $($migration.Name)" -ForegroundColor Green
        } catch {
            Write-Host "Error applying migration: $($migration.Name)" -ForegroundColor Red
            Write-Host $_.Exception.Message
            exit 1
        }
    }
}

Write-Host "All migrations applied successfully!" -ForegroundColor Green
