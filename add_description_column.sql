-- Add description column to cars table if it doesn't exist
ALTER TABLE cars ADD COLUMN IF NOT EXISTS description text;

-- Update existing records to have a default description
UPDATE cars 
SET description = 'No description provided' 
WHERE description IS NULL;
