/*
  Warnings:

  - You are about to drop the `Entry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Entry] DROP CONSTRAINT [Entry_userId_fkey];

-- DropTable
DROP TABLE [dbo].[Entry];

-- DropTable
DROP TABLE [dbo].[User];

-- CreateTable
CREATE TABLE [dbo].[UsersTable] (
    [UserId] NVARCHAR(1000) NOT NULL,
    [FirstName] NVARCHAR(1000) NOT NULL,
    [LastName] NVARCHAR(1000) NOT NULL,
    [UserName] NVARCHAR(1000) NOT NULL,
    [EmailAddress] NVARCHAR(1000) NOT NULL,
    [Password] NVARCHAR(1000) NOT NULL,
    [Avatarurl] NVARCHAR(1000) CONSTRAINT [UsersTable_Avatarurl_df] DEFAULT '',
    [DateJoined] DATETIME2 NOT NULL CONSTRAINT [UsersTable_DateJoined_df] DEFAULT CURRENT_TIMESTAMP,
    [LastProfileUpdate] DATETIME2 NOT NULL,
    [IsDeleted] BIT NOT NULL CONSTRAINT [UsersTable_IsDeleted_df] DEFAULT 0,
    CONSTRAINT [UsersTable_pkey] PRIMARY KEY CLUSTERED ([UserId]),
    CONSTRAINT [UsersTable_UserName_key] UNIQUE NONCLUSTERED ([UserName]),
    CONSTRAINT [UsersTable_EmailAddress_key] UNIQUE NONCLUSTERED ([EmailAddress])
);

-- CreateTable
CREATE TABLE [dbo].[Entries] (
    [EntryId] NVARCHAR(1000) NOT NULL,
    [EntryTitle] NVARCHAR(1000) NOT NULL,
    [EntrySynopsis] NVARCHAR(1000) NOT NULL,
    [EntryContent] TEXT NOT NULL,
    [IsDeleted] BIT NOT NULL CONSTRAINT [Entries_IsDeleted_df] DEFAULT 0,
    [DateCreated] DATETIME2 NOT NULL CONSTRAINT [Entries_DateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    [LastUpdated] DATETIME2 NOT NULL,
    [UserId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Entries_pkey] PRIMARY KEY CLUSTERED ([EntryId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Entries] ADD CONSTRAINT [Entries_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[UsersTable]([UserId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
