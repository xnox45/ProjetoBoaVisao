using Microsoft.EntityFrameworkCore;
using ProjetoOticaBoaVisao.Data;


namespace ProjetoOticaBoaVisao.DAL
{
    public class BaseDAL
    {
        protected readonly ApplicationDbContext _context;

        public BaseDAL(ApplicationDbContext context)
        {
            _context = context;
        }
    }
}
