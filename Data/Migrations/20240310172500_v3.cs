using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoOticaBoaVisao.Data.Migrations
{
    public partial class v3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Localidade",
                table: "Clientes",
                newName: "IdLocalidade");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IdLocalidade",
                table: "Clientes",
                newName: "Localidade");
        }
    }
}
