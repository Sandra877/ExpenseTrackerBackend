-- Final fix for UpdateExpense procedure with proper batch separation

PRINT 'Step 1: Dropping existing UpdateExpense procedure...';
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'UpdateExpense')
BEGIN
    DROP PROCEDURE UpdateExpense;
    PRINT 'Existing UpdateExpense procedure dropped successfully';
END
GO

PRINT 'Step 2: Creating new UpdateExpense procedure...';
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
    SET NOCOUNT ON;

    -- Check if expense exists and belongs to user
    DECLARE @ExpenseExists BIT = 0;
    SELECT @ExpenseExists = 1
    FROM Expenses
    WHERE id = @Id AND userId = @UserId;

    IF @ExpenseExists = 0
    BEGIN
        -- Expense not found or doesn't belong to user
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

PRINT 'UpdateExpense procedure has been successfully fixed!';
PRINT 'The procedure now has:';
PRINT '1. Correct parameter order (Id, UserId, Title, Amount, Category, Date, Note)';
PRINT '2. Proper user authorization validation';
PRINT '3. Existence check before update';
PRINT '4. Atomic update operation with user validation';
PRINT '5. Correct result return';