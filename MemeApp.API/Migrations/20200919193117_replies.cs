using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MemeApp.API.Migrations
{
    public partial class replies : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReplyId",
                table: "Notifications",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Replies",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Text = table.Column<string>(nullable: true),
                    Likes = table.Column<int>(nullable: false),
                    CommenterId = table.Column<int>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false),
                    PostId = table.Column<int>(nullable: false),
                    CommentId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Replies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Replies_Comments_CommentId",
                        column: x => x.CommentId,
                        principalTable: "Comments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Replies_Users_CommenterId",
                        column: x => x.CommenterId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Replies_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReplyLikes",
                columns: table => new
                {
                    PostId = table.Column<int>(nullable: false),
                    LikerId = table.Column<int>(nullable: false),
                    ReplyId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReplyLikes", x => new { x.LikerId, x.ReplyId });
                    table.ForeignKey(
                        name: "FK_ReplyLikes_Users_LikerId",
                        column: x => x.LikerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReplyLikes_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReplyLikes_Replies_ReplyId",
                        column: x => x.ReplyId,
                        principalTable: "Replies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ReplyId",
                table: "Notifications",
                column: "ReplyId");

            migrationBuilder.CreateIndex(
                name: "IX_Replies_CommentId",
                table: "Replies",
                column: "CommentId");

            migrationBuilder.CreateIndex(
                name: "IX_Replies_CommenterId",
                table: "Replies",
                column: "CommenterId");

            migrationBuilder.CreateIndex(
                name: "IX_Replies_PostId",
                table: "Replies",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_ReplyLikes_PostId",
                table: "ReplyLikes",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_ReplyLikes_ReplyId",
                table: "ReplyLikes",
                column: "ReplyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Replies_ReplyId",
                table: "Notifications",
                column: "ReplyId",
                principalTable: "Replies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Replies_ReplyId",
                table: "Notifications");

            migrationBuilder.DropTable(
                name: "ReplyLikes");

            migrationBuilder.DropTable(
                name: "Replies");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_ReplyId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "ReplyId",
                table: "Notifications");
        }
    }
}
