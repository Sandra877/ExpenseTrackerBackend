# Database Migration Instructions

This folder contains SQL migration scripts to update your Azure SQL database schema to support the new `note` field in expenses.

## Problem
The frontend was updated to send a `note` field, but the backend database stored procedures didn't support this parameter, causing the error: "Procedure or function AddExpense has too many arguments specified."

## Solution
You need to execute the migration script against your Azure SQL database.

## How to Apply the Migration

### Option 1: Using Azure Data Studio or SQL Server Management Studio (SSMS)
1. Open Azure Data Studio or SSMS
2. Connect to your Azure SQL database
3. Open the file [`migrations/add_note_column_to_expenses.sql`](migrations/add_note_column_to_expenses.sql)
4. Execute the script against your database

### Option 2: Using SQLCMD Command Line
```bash
sqlcmd -S your-server.database.windows.net -d your-database -U your-username -P your-password -i migrations/add_note_column_to_expenses.sql
```

### Option 3: Using Azure CLI
```bash
az sql query -s your-server -d your-database -u your-username -p your-password --query "EXECUTE sp_executesql @stmt = N'$(cat migrations/add_note_column_to_expenses.sql)'"
```

### Option 4: Using Azure Portal
1. Go to Azure Portal
2. Navigate to your SQL database
3. Open Query Editor
4. Copy and paste the contents of [`migrations/add_note_column_to_expenses.sql`](migrations/add_note_column_to_expenses.sql)
5. Execute the query

## What the Migration Does
1. Adds a `note NVARCHAR(500)` column to the Expenses table
2. Updates the `AddExpense` stored procedure to accept and handle the `@Note` parameter
3. Updates the `UpdateExpense` stored procedure to accept and handle the `@Note` parameter

## After Migration
- The backend API will work correctly with the frontend
- Expenses can now include optional notes
- The "too many arguments" error will be resolved

## Important Notes
- Make sure to backup your database before running migrations
- Test the changes in a staging environment first if possible
- The migration is safe - it adds a nullable column and updates procedures without data loss