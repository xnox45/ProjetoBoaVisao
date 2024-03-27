using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoOticaBoaVisao.Models
{
    public class Cliente
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Horario { get; set; }

        [Required]
        public string Nome { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(1)]
        public int Idade { get; set; }
        
        [Required]
        [MinLength(1)]
        public int IdLocalidade { get; set; }

        [Required]
        [MinLength(1)]
        public int IdNecessidade { get; set; }

        [Required]
        [Phone]
        public string Telefone { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime DataCadastro { get; set; }

        [NotMapped]
        public string Necessidade { get; set; } 
        
        [NotMapped]
        public string Localidade { get; set; } 
    }
}
