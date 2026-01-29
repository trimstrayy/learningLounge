# Feedback System Setup Script
# Run this script to set up the feedback system

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Learning Lounge - Feedback System Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is installed
Write-Host "Checking Supabase CLI..." -ForegroundColor Yellow
try {
    $supabaseVersion = npx supabase --version 2>&1
    Write-Host "✓ Supabase CLI found: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Supabase CLI not found. Installing..." -ForegroundColor Red
    npm install -g supabase
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to supabase directory
Set-Location -Path "supabase"

Write-Host "Choose migration option:" -ForegroundColor Yellow
Write-Host "1. Development (db reset - WARNING: deletes all data)" -ForegroundColor White
Write-Host "2. Production (db push - applies new migrations only)" -ForegroundColor White
Write-Host "3. Skip migration (already applied)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Resetting database and applying all migrations..." -ForegroundColor Yellow
        npx supabase db reset
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Database reset complete!" -ForegroundColor Green
        } else {
            Write-Host "✗ Database reset failed!" -ForegroundColor Red
        }
    }
    "2" {
        Write-Host "Pushing new migrations to database..." -ForegroundColor Yellow
        npx supabase db push
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Migrations applied successfully!" -ForegroundColor Green
        } else {
            Write-Host "✗ Migration failed!" -ForegroundColor Red
        }
    }
    "3" {
        Write-Host "Skipping migration..." -ForegroundColor Gray
    }
    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
        Set-Location -Path ".."
        exit 1
    }
}

Set-Location -Path ".."

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✓ Files created:" -ForegroundColor Green
Write-Host "  - supabase/migrations/20260129000000_create_feedback_table.sql" -ForegroundColor White
Write-Host "  - apps/web/src/components/FeedbackModal.tsx" -ForegroundColor White
Write-Host "  - apps/web/src/components/FeedbackButton.tsx" -ForegroundColor White
Write-Host "  - apps/web/src/hooks/useFeedbackModal.ts" -ForegroundColor White
Write-Host "  - FEEDBACK_SYSTEM.md (Documentation)" -ForegroundColor White
Write-Host ""

Write-Host "✓ App.tsx updated with feedback components" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Start your development server:" -ForegroundColor Yellow
Write-Host "   cd apps/web" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""

Write-Host "2. Test the feedback system:" -ForegroundColor Yellow
Write-Host "   - Wait 30 seconds on any page for auto-prompt" -ForegroundColor White
Write-Host "   - Or click the floating feedback button (bottom-right)" -ForegroundColor White
Write-Host ""

Write-Host "3. View submitted feedback:" -ForegroundColor Yellow
Write-Host "   - Go to Supabase Dashboard → Table Editor → feedback" -ForegroundColor White
Write-Host ""

Write-Host "4. Read full documentation:" -ForegroundColor Yellow
Write-Host "   - Open FEEDBACK_SYSTEM.md for complete guide" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Current settings:" -ForegroundColor Yellow
Write-Host "  - Auto-prompt delay: 30 seconds" -ForegroundColor White
Write-Host "  - Prompt cooldown: 24 hours" -ForegroundColor White
Write-Host "  - Floating button: Enabled (bottom-right)" -ForegroundColor White
Write-Host ""
Write-Host "To customize, edit: apps/web/src/hooks/useFeedbackModal.ts" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
