-- Comprehensive fix for UpdateExpense procedure
-- Ensures correct parameter order and proper functionality

PRINT 'Dropping existing UpdateExpense procedure...';
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'UpdateExpense')
BEGIN
    DROP PROCEDURE UpdateExpense;
END
GO

PRINT 'Creating new UpdateExpense procedure with correct parameter order...';
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
    SET NOCOUNT ON;

    -- Debug: Print the parameters being received
    -- PRINT 'UpdateExpense called with: Id=' + CAST(@Id AS NVARCHAR(10)) +
    --       ', UserId=' + CAST(@UserId AS NVARCHAR(10)) +
    --       ', Title=' + @Title + ', Amount=' + CAST(@Amount AS NVARCHAR(20));

    -- Check if expense exists and belongs to user
    DECLARE @ExpenseExists BIT = 0;
    SELECT @ExpenseExists = 1
    FROM Expenses
    WHERE id = @Id AND userId = @UserId;

    IF @ExpenseExists = 0
    BEGIN
        -- Expense not found or doesn't belong to user
        -- Return empty result set
        SELECT * FROM Expenses WHERE 1 = 0;
        RETURN;
    END

    -- Perform the update with proper user validation
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

PRINT 'UpdateExpense procedure has been fixed!';
PRINT 'Key improvements:';
PRINT '1. Correct parameter order matching backend service calls';
PRINT '2. Proper user authorization validation';
PRINT '3. Explicit existence check before update';
PRINT '4. Atomic update operation';
PRINT '5. Proper result return';