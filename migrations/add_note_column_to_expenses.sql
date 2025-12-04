-- Migration script to add note column to Expenses table and update stored procedures
-- This script should be executed against your Azure SQL database

-- Step 1: Add the note column to the Expenses table
PRINT 'Adding note column to Expenses table...';
ALTER TABLE Expenses
ADD note NVARCHAR(500) NULL;
GO

-- Step 2: Drop and recreate the AddExpense stored procedure
PRINT 'Updating AddExpense stored procedure...';
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'AddExpense')
BEGIN
    DROP PROCEDURE AddExpense;
END
GO

CREATE PROCEDURE AddExpense
  @UserId INT,
  @Title NVARCHAR(255),
  @Amount DECIMAL(18,2),
  @Category NVARCHAR(100),
  @Date DATE,
  @Note NVARCHAR(500)
AS
BEGIN
  INSERT INTO Expenses (userId, title, amount, category, date, note)
  VALUES (@UserId, @Title, @Amount, @Category, @Date, @Note);

  SELECT * FROM Expenses WHERE id = SCOPE_IDENTITY();
END
GO

-- Step 3: Drop and recreate the UpdateExpense stored procedure
PRINT 'Updating UpdateExpense stored procedure...';
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'UpdateExpense')
BEGIN
    DROP PROCEDURE UpdateExpense;
END
GO

CREATE PROCEDURE UpdateExpense
  @Id INT,
  @Title NVARCHAR(255),
  @Amount DECIMAL(18,2),
  @Category NVARCHAR(100),
  @Date DATE,
  @Note NVARCHAR(500)
AS
BEGIN
  UPDATE Expenses
  SET title = @Title,
      amount = @Amount,
      category = @Category,
      date = @Date,
      note = @Note
  WHERE id = @Id;

  SELECT * FROM Expenses WHERE id = @Id;
END
GO

PRINT 'Migration completed successfully!';