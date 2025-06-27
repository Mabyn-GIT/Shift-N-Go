# Simple SQL script runner for Supabase
# This will apply the description column migration

Write-Host "Applying description column migration..." -ForegroundColor Green

# The SQL to execute
$sql = @"
-- Add description column to cars table
ALTER TABLE cars ADD COLUMN IF NOT EXISTS description text;

-- Update existing cars to have a default description
UPDATE cars SET description = 'No description available.' WHERE description IS NULL;
"@

# Save SQL to a temporary file
$tempFile = [System.IO.Path]::GetTempFileName() + ".sql"
$sql | Out-File -FilePath $tempFile -Encoding utf8

Write-Host "SQL file created at: $tempFile" -ForegroundColor Cyan
Write-Host "Please follow these steps to apply the migration:" -ForegroundColor Yellow
Write-Host "1. Log in to your Supabase dashboard" -ForegroundColor Yellow
Write-Host "2. Select your project" -ForegroundColor Yellow
Write-Host "3. Go to the SQL Editor" -ForegroundColor Yellow
Write-Host "4. Open the SQL file from: $tempFile" -ForegroundColor Yellow
Write-Host "5. Execute the SQL" -ForegroundColor Yellow

# Ask if user wants to open the file
$openFile = Read-Host "Do you want to open the SQL file now? (y/n)"
if ($openFile -eq "y") {
    Start-Process $tempFile
}

Write-Host "Once you've applied the migration manually, you can continue with your development." -ForegroundColor Green
