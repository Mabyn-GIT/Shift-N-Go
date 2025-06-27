-- Add description column to cars table
ALTER TABLE cars ADD COLUMN IF NOT EXISTS description text;

-- Update existing cars to have a default description
UPDATE cars SET description = 'No description available.' WHERE description IS NULL;
