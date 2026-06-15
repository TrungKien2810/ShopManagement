using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSoftDeleteFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RegistrationIntent",
                table: "AspNetUsers");

            // Add soft-delete columns to Tables (AreaId already exists in the schema)
            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Tables",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Tables",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Products",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Categories",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Categories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            // Add soft-delete columns to TableAreas if the table already exists
            migrationBuilder.Sql(@"
IF OBJECT_ID(N'[dbo].[TableAreas]') IS NOT NULL
BEGIN
    IF COL_LENGTH('TableAreas', 'IsDeleted') IS NULL
        ALTER TABLE [TableAreas] ADD [IsDeleted] bit NOT NULL DEFAULT(0);
    IF COL_LENGTH('TableAreas', 'DeletedAt') IS NULL
        ALTER TABLE [TableAreas] ADD [DeletedAt] datetime2 NULL;
END
ELSE
BEGIN
    -- If TableAreas does not exist, create it with soft-delete columns
    CREATE TABLE [dbo].[TableAreas](
        [Id] uniqueidentifier NOT NULL PRIMARY KEY,
        [ShopId] uniqueidentifier NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        [IsActive] bit NOT NULL,
        [SortOrder] int NOT NULL,
        [IsDeleted] bit NOT NULL DEFAULT(0),
        [DeletedAt] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL
    );
    ALTER TABLE [dbo].[TableAreas] ADD CONSTRAINT [FK_TableAreas_Shops_ShopId] FOREIGN KEY([ShopId]) REFERENCES [Shops]([Id]) ON DELETE NO ACTION;
    CREATE UNIQUE INDEX [IX_TableAreas_ShopId_Name] ON [dbo].[TableAreas]([ShopId],[Name]);
END
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tables_TableAreas_AreaId",
                table: "Tables");

            migrationBuilder.DropTable(
                name: "TableAreas");

            migrationBuilder.DropIndex(
                name: "IX_Tables_AreaId",
                table: "Tables");

            migrationBuilder.DropColumn(
                name: "AreaId",
                table: "Tables");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Tables");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Tables");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Categories");

            migrationBuilder.AddColumn<int>(
                name: "RegistrationIntent",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
