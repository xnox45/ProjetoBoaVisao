using Microsoft.AspNetCore.Mvc;

namespace ProjetoOticaBoaVisao.Controllers
{
    public class ClienteController : Controller
    {
        public IActionResult Cadastro()
        {
            return View();
        }
    }
}
