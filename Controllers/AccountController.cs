using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using ProjetoOticaBoaVisao.Data;
using ProjetoOticaBoaVisao.Models;

namespace ProjetoOticaBoaVisao.Controllers
{
    public class AccountController : Controller
    {
        private ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Account/Login
        public IActionResult Index(string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        // POST: /Account/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(User user)
        {
            try
            {
                var login = _context.Users.FirstOrDefault(x => x.Email.ToLower() == user.Email.ToLower() && x.Password == user.Password);

                if (login != null)
                {
                    var claims = new[]
                    {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, "Admin"),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                };

                    // Cria um objeto ClaimsIdentity
                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    var authProperties = new AuthenticationProperties
                    {
                        IsPersistent = true, // Defina como verdadeiro se desejar que o cookie persista entre as sessões do navegador
                        ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(20) // Defina o tempo de expiração do cookie
                    };

                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

                    return RedirectToAction("Index", "Home");
                }

                // Se as credenciais estiverem incorretas, retorna para a página de login com uma mensagem de erro
                ModelState.AddModelError(string.Empty, "Credenciais inválidas");
                return RedirectToAction();
            }
            catch (Exception)
            {
                return RedirectToAction("Index", "Account");
            }
           
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index", "Account");
        }
    }
}
