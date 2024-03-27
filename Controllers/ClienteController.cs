using Microsoft.AspNetCore.Mvc;

namespace ProjetoOticaBoaVisao.Controllers
{
    public class ClienteController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Cadastro()
        {
            return View();
        }
    }
}
