using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoOticaBoaVisao.Data.Migrations
{
    public partial class clientev2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DiaSemana",
                table: "Clientes",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiaSemana",
                table: "Clientes");
        }
    }
}
