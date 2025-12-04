-- Verification script to check if the migration was applied successfully
-- Run this against your Azure SQL database to verify the changes

PRINT 'Checking if note column exists in Expenses table...';
IF EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Expenses' AND COLUMN_NAME = 'note'
)
BEGIN
    PRINT '✅ Note column exists in Expenses table';
END
ELSE
BEGIN
    PRINT '❌ Note column is missing from Expenses table - migration not applied';
END
GO

PRINT '';
PRINT 'Checking AddExpense procedure parameters...';
SELECT
    p.name AS ProcedureName,
    pr.name AS ParameterName,
    TYPE_NAME(pr.system_type_id) AS ParameterType
FROM sys.procedures p
JOIN sys.parameters pr ON p.object_id = pr.object_id
WHERE p.name = 'AddExpense' AND pr.parameter_id > 0
ORDER BY pr.parameter_id;
GO

PRINT '';
PRINT 'Checking UpdateExpense procedure parameters...';
SELECT
    p.name AS ProcedureName,
    pr.name AS ParameterName,
    TYPE_NAME(pr.system_type_id) AS ParameterType
FROM sys.procedures p
JOIN sys.parameters pr ON p.object_id = pr.object_id
WHERE p.name = 'UpdateExpense' AND pr.parameter_id > 0
ORDER BY pr.parameter_id;
GO

PRINT '';
PRINT 'Expected parameters for AddExpense: @UserId, @Title, @Amount, @Category, @Date, @Note (6 total)';
PRINT 'Expected parameters for UpdateExpense: @Id, @Title, @Amount, @Category, @Date, @Note (6 total)';