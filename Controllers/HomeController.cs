﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using ProjetoOticaBoaVisao.Data;
using ProjetoOticaBoaVisao.Models;
using System.Diagnostics;
using System.Security.Claims;

namespace ProjetoOticaBoaVisao.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    private ApplicationDbContext _context;

    public HomeController(ILogger<HomeController> logger, ApplicationDbContext applicationDbContext)
    {
        _context = applicationDbContext;
        _logger = logger;
    }

    public IActionResult Index()
    {
        string? login = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name)?.Value;

        if (login == null)
           return RedirectToPage("/Account/Login", new { area = "Identity" });

        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [HttpPost]
    public async Task<JsonResult> SalvarCliente(FiltroCliente filtro)
    {
        Cliente cliente = new();

        if (filtro.Id != null)
        {
            cliente = _context.Clientes.FirstOrDefault(x => x.Id == filtro.Id);

            cliente.Idade = filtro.Idade.Value;
            cliente.Email = filtro.Email;
            cliente.Horario = filtro.Horario;
            cliente.IdLocalidade = filtro.Localidade.Value;
            cliente.IdNecessidade = filtro.Necessidade.Value;
            cliente.Nome = filtro.Nome;
            cliente.Telefone = filtro.Telefone;
        }
        else
        {
            cliente = new Cliente
            {
                DataCadastro = DateTime.Today,
                Idade = filtro.Idade.Value,
                Email = filtro.Email,
                Horario = filtro.Horario,
                IdLocalidade = filtro.Localidade.Value,
                IdNecessidade = filtro.Necessidade.Value,
                Nome = filtro.Nome,
                Telefone = filtro.Telefone
            };

            _context.Clientes.Add(cliente);
        }

        _context.SaveChanges();

        return Json(true);
    }

    [HttpPost]
    public async Task<JsonResult> PesquisarClientes(FiltroCliente filtro)
    {
        var retorno = await PesquisarClientesPrivate(filtro);

        return Json(new {clientes = retorno, total = retorno.Count()});
    }

    public async Task<ActionResult> ExportarParaExcel(FiltroCliente filtro)
    {
        // Obtém a lista de clientes
        var clientes = await PesquisarClientesPrivate(filtro);

        // Cria um novo pacote Excel
        ExcelPackage.LicenseContext = LicenseContext.Commercial;
        using (var excelPackage = new ExcelPackage())
        {
            // Adiciona uma planilha ao pacote Excel
            var worksheet = excelPackage.Workbook.Worksheets.Add("Clientes");

            // Adiciona cabeçalhos de coluna
            worksheet.Cells[1, 1].Value = "Nome";
            worksheet.Cells[1, 2].Value = "Email";
            worksheet.Cells[1, 3].Value = "Idade";
            worksheet.Cells[1, 4].Value = "Localidade";
            worksheet.Cells[1, 5].Value = "Necessidade";
            worksheet.Cells[1, 6].Value = "Telefone";
            worksheet.Cells[1, 7].Value = "Horario";
            worksheet.Cells[1, 8].Value = "DataCadastro";

            // Preenche os dados dos clientes
            int row = 2;
            foreach (var cliente in clientes)
            {
                worksheet.Cells[row, 1].Value = cliente.Nome;
                worksheet.Cells[row, 2].Value = cliente.Email;
                worksheet.Cells[row, 3].Value = cliente.Idade;
                worksheet.Cells[row, 4].Value = cliente.Localidade;
                worksheet.Cells[row, 5].Value = cliente.Necessidade;
                worksheet.Cells[row, 6].Value = cliente.Telefone;
                worksheet.Cells[row, 7].Value = cliente.Horario;
                worksheet.Cells[row, 8].Value = cliente.DataCadastro;
                row++;
            }

            // Converte o pacote Excel em um array de bytes
            byte[] fileContents = excelPackage.GetAsByteArray();

            // Retorna o arquivo Excel como um FileResult para fazer o download
            return Json(fileContents);
        }
    }

    [HttpGet]
    public async Task<JsonResult> BuscarCliente(int id)
    {
        var retorno = _context.Clientes.FirstOrDefault(x => x.Id == id);

        return Json(retorno);
    }

    [HttpDelete]
    public async Task<JsonResult> ExcluirCliente(int id)
    {
        var retorno = _context.Clientes.FirstOrDefault(x => x.Id == id);

        _context.Clientes.Remove(retorno);

        _context.SaveChanges();

        return Json(true);
    }

    private async Task<List<Cliente>> PesquisarClientesPrivate(FiltroCliente filtro)
    {
        IQueryable<Cliente> queryable = _context.Clientes;

        if (filtro.Idade != null)
            queryable = queryable.Where(x => x.Idade == filtro.Idade);

        if (filtro.Localidade != null)
            queryable = queryable.Where(x => x.IdLocalidade == filtro.Localidade);

        if (filtro.Nome != null)
            queryable = queryable.Where(x => x.Nome.ToLower().Contains(filtro.Nome.ToLower()));

        if (filtro.Horario != null)
            queryable = queryable.Where(x => x.Horario.ToLower().Contains(filtro.Horario.ToLower()));

        if (filtro.Necessidade != null)
            queryable = queryable.Where(x => x.IdNecessidade == filtro.Necessidade);

        if (filtro.Email != null)
            queryable = queryable.Where(x => x.Email.ToLower().Contains(filtro.Email.ToLower()));

        if (filtro.Telefone != null)
        {
            filtro.Telefone = filtro.Telefone.Replace("_", "").ToLower();
            queryable = queryable.Where(x => x.Telefone.ToLower().Contains(filtro.Telefone));
        }

        if (filtro.DataCadastro != null)
            queryable = queryable.Where(x => x.DataCadastro == filtro.DataCadastro);

        await queryable.ForEachAsync(x =>
        {
            x.Necessidade = x.IdNecessidade == 1 ? "Exame de Rotina" : x.IdNecessidade == 2 ? "Revisão do Grau" : x.IdNecessidade == 3 ? "Tratamento de Catarata" : x.IdNecessidade == 4 ? "Tratamento de Glaucoma" : x.IdNecessidade == 5 ? "Tratamento de Ceratocone" : x.IdNecessidade == 6 ? "Tratamento de Pterígio" : "";
            x.Localidade = x.IdLocalidade == 1 ? "Santos" : x.IdLocalidade == 2 ? "Praia Grande" : "";
        });

        var retorno = queryable.ToList();

        return retorno;
    }


    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}