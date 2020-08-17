using Microsoft.EntityFrameworkCore.Migrations;

namespace MemeApp.API.Migrations
{
    public partial class notificationGroupName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GroupName",
                table: "Notifications",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GroupName",
                table: "Notifications");
        }
    }
}
