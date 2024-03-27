using Microsoft.EntityFrameworkCore;
using ProjetoOticaBoaVisao.Data;
using ProjetoOticaBoaVisao.Models;
using System.Reflection;

namespace ProjetoOticaBoaVisao.DAL
{
    public class ClienteDAL : BaseDAL
    {
        public ClienteDAL(ApplicationDbContext context) : base(context)
        {
        }

        public List<Cliente> PesquisarClientes(FiltroCliente filtro)
        {
            IQueryable<Cliente> queryable = _context.Clientes;

            if (filtro.Idade != null)
                queryable = queryable.Where(x => x.Idade == filtro.Idade);

            if (filtro.Nome != null)
                queryable = queryable.Where(x => x.Nome == filtro.Nome);

            return queryable.ToList();
        }
    }
}
