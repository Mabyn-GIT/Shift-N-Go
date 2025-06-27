#!/bin/bash
# Apply Supabase Migrations
# This script applies all migrations to the Supabase database

# Set Supabase URL and Key from environment variables
SUPABASE_URL=$VITE_SUPABASE_URL
SUPABASE_KEY=$VITE_SUPABASE_ANON_KEY

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo "Error: Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    exit 1
fi

echo "Applying database migrations to Supabase..."

# Check if Supabase CLI is installed
if command -v supabase &> /dev/null; then
    echo "Using Supabase CLI to apply migrations..."
    supabase db push
else
    echo "Supabase CLI not found. Trying alternative method..."
    
    # Alternative method: Use direct HTTP requests to apply migrations
    for migration in $(find supabase/migrations -name "*.sql" | sort); do
        echo "Applying migration: $(basename "$migration")"
        sql_content=$(cat "$migration")
        
        # Use curl to apply the migration
        # This is a simplified example and may need adjustments based on your Supabase setup
        response=$(curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
            -H "apikey: $SUPABASE_KEY" \
            -H "Authorization: Bearer $SUPABASE_KEY" \
            -H "Content-Type: application/json" \
            -d "{\"query\": \"$sql_content\"}")
        
        if [ $? -eq 0 ]; then
            echo "Migration applied successfully: $(basename "$migration")"
        else
            echo "Error applying migration: $(basename "$migration")"
            echo "$response"
            exit 1
        fi
    done
fi

echo "All migrations applied successfully!"
