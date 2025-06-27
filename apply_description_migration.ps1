# Apply description column migration to Supabase
# This script adds the description column to the cars table

# Set Supabase URL and Key from environment variables
$SUPABASE_URL = $env:VITE_SUPABASE_URL
$SUPABASE_KEY = $env:VITE_SUPABASE_ANON_KEY

if (-not $SUPABASE_URL -or -not $SUPABASE_KEY) {
    Write-Error "Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    exit 1
}

Write-Host "Applying description column migration to Supabase..." -ForegroundColor Green

# Read the SQL file
$sqlContent = Get-Content -Path "add_description_column.sql" -Raw

# Apply the migration using a direct HTTP request
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
    Write-Host "Migration applied successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error applying migration" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}
