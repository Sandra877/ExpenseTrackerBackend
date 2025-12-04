-- Fix for UpdateExpense procedure to properly handle user authorization
-- and prevent duplicate records

PRINT 'Checking current UpdateExpense procedure...';
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
PRINT 'Dropping and recreating UpdateExpense procedure with proper user validation...';

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'UpdateExpense')
BEGIN
    DROP PROCEDURE UpdateExpense;
    PRINT 'Dropped existing UpdateExpense procedure';
END
GO

CREATE PROCEDURE UpdateExpense
  @Id INT,
  @UserId INT,
  @Title NVARCHAR(255),
  @Amount DECIMAL(18,2),
  @Category NVARCHAR(100),
  @Date DATE,
  @Note NVARCHAR(500)
AS
BEGIN
    -- Check if the expense exists and belongs to the user
    IF NOT EXISTS (SELECT 1 FROM Expenses WHERE id = @Id AND userId = @UserId)
    BEGIN
        -- Return empty result if expense not found or doesn't belong to user
        SELECT * FROM Expenses WHERE 1 = 0;
        RETURN;
    END

    -- Update the expense with user validation
    UPDATE Expenses
    SET
        title = @Title,
        amount = @Amount,
        category = @Category,
        date = @Date,
        note = @Note
    WHERE id = @Id AND userId = @UserId;

    -- Return the updated expense
    SELECT * FROM Expenses WHERE id = @Id AND userId = @UserId;
END
GO

PRINT 'UpdateExpense procedure has been fixed with proper user validation';
PRINT 'The procedure now:';
PRINT '1. Validates that the expense belongs to the user';
PRINT '2. Updates only if authorization is valid';
PRINT '3. Returns the updated expense record';
PRINT '4. Prevents duplicate records from being created';