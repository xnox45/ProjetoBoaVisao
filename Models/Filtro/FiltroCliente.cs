using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjetoOticaBoaVisao.Models
{
    public class FiltroCliente
    {
        public int? Id { get; set; }
        public string? Horario { get; set; }
        public string? Nome { get; set; }
        public string? Email { get; set; }
        public string? Telefone { get; set; }
        public int? Idade { get; set; }
        public int? Localidade { get; set; }
        public int? Necessidade { get; set; }
        public DateTime? DataCadastro { get; set; }
    }
}