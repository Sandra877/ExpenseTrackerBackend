CREATE TABLE Users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  email NVARCHAR(255) UNIQUE NOT NULL,
  passwordHash NVARCHAR(255) NOT NULL,
  isVerified BIT DEFAULT 0,
  verificationToken NVARCHAR(255),
  createdAt DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE Expenses (
  id INT IDENTITY(1,1) PRIMARY KEY,
  userId INT NOT NULL,
  title NVARCHAR(255) NOT NULL,
  amount DECIMAL(18,2) NOT NULL,
  category NVARCHAR(100),
  date DATE,
  createdAt DATETIME DEFAULT GETDATE(),

  FOREIGN KEY (userId) REFERENCES Users(id)
);
GO

CREATE PROCEDURE RegisterUser
  @Email NVARCHAR(255),
  @PasswordHash NVARCHAR(255),
  @VerificationToken NVARCHAR(255)
AS
BEGIN
  INSERT INTO Users (email, passwordHash, verificationToken)
  VALUES (@Email, @PasswordHash, @VerificationToken);

  SELECT * FROM Users WHERE email = @Email;
END
GO


CREATE PROCEDURE VerifyUserEmail
  @Token NVARCHAR(255)
AS
BEGIN
  UPDATE Users
  SET isVerified = 1, verificationToken = NULL
  WHERE verificationToken = @Token;

  SELECT * FROM Users WHERE verificationToken IS NULL AND isVerified = 1;
END
GO


CREATE PROCEDURE GetUserByEmail
  @Email NVARCHAR(255)
AS
BEGIN
  SELECT * FROM Users WHERE email = @Email;
END
GO


CREATE PROCEDURE AddExpense
  @UserId INT,
  @Title NVARCHAR(255),
  @Amount DECIMAL(18,2),
  @Category NVARCHAR(100),
  @Date DATE
AS
BEGIN
  INSERT INTO Expenses (userId, title, amount, category, date)
  VALUES (@UserId, @Title, @Amount, @Category, @Date);

  SELECT * FROM Expenses WHERE id = SCOPE_IDENTITY();
END
GO

CREATE PROCEDURE UpdateExpense
  @Id INT,
  @Title NVARCHAR(255),
  @Amount DECIMAL(18,2),
  @Category NVARCHAR(100),
  @Date DATE
AS
BEGIN
  UPDATE Expenses
  SET title = @Title,
      amount = @Amount,
      category = @Category,
      date = @Date
  WHERE id = @Id;

  SELECT * FROM Expenses WHERE id = @Id;
END
GO

CREATE PROCEDURE DeleteExpense
  @Id INT
AS
BEGIN
  DELETE FROM Expenses WHERE id = @Id;
END
GO


CREATE PROCEDURE GetExpensesByUser
  @UserId INT
AS
BEGIN
  SELECT * FROM Expenses WHERE userId = @UserId;
END
GO





