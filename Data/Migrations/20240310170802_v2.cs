using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoOticaBoaVisao.Data.Migrations
{
    public partial class v2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Necessidade",
                table: "Clientes",
                newName: "IdNecessidade");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IdNecessidade",
                table: "Clientes",
                newName: "Necessidade");
        }
    }
}
