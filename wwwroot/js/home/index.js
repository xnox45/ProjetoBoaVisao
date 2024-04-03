$(document).ready(function () {
    carregarDados();

    let formCliente = $("#formCliente");

    $('.telefone').inputmask('(99) 99999-9999');

    var validator = formCliente.validate({
        rules: {
            Horario: {
                required: true
            },
            Nome: {
                required: true
            },
            Email: {
                required: true,
                email: true
            },
            Idade: {
                required: true,
                number: true
            },
            Telefone: {
                required: true,
                minlength: 14
            },
            Localidade: {
                required: true
            },
            Necessidade: {
                required: true
            }
        },
        messages: {
            Horario: "Por favor, informe o hor�rio",
            Nome: "Por favor, informe o nome",
            Email: {
                required: "Por favor, informe o e-mail",
                email: "Por favor, informe um e-mail v�lido"
            },
            Idade: {
                required: "Por favor, informe a idade",
                number: "Por favor, informe um n�mero v�lido"
            },
            Telefone: {
                required: "Por favor, informe o telefone",
                minlength: "Por favor, informe um telefone v�lido (ex: (99) 99999-9999)"
            },
            Localidade: "Por favor, selecione a localidade",
            Necessidade: "Por favor, selecione a necessidade"
        },
        submitHandler: function (form) {
            form.submit();
        }
    });

    $(document).on("click", ".open-modal", function () {
        var id = $(this).data("id-cliente");

        if (id != undefined && id != null) {
            $("#Id").val(id);
            $("#btnExcluirCliente").show();
            $("#informarClienteLabel").html("Editar Cliente");
            montarDadosCliente(id);
        }
        else {
            $("#informarClienteLabel").html("Salvar Cliente");
        }

        $("#modalEdicao").show();
    });

    $(document).on("click", "#btnCancelar", function () {
        $("#modalEdicao").hide();
        $("#btnExcluirCliente").hide();
        formCliente[0].reset();
    });

    function baixarArquivo(filePath) {
        // Faz uma solicita��o AJAX para o endpoint de download
        $.ajax({
            url: '/Home/DownloadFile',
            type: 'POST',
            data: { nome: filePath },
            contentType: false,
            processData: false,
            success: function (data, status, xhr) {
                // Verifica o tipo de resposta
                var contentType = xhr.getResponseHeader('Content-Type');

                // Cria um objeto Blob a partir dos dados da resposta
                var blob = new Blob([data], { type: contentType });

                // Cria um URL tempor�rio para o Blob
                var url = window.URL.createObjectURL(blob);

                // Cria um link <a> tempor�rio
                var link = document.createElement('a');
                link.href = url;
                link.download = 'arquivo.xlsx'; // Nome do arquivo de download

                // Simula o clique no link para iniciar o download
                document.body.appendChild(link);
                link.click();

                // Libera o URL tempor�rio
                window.URL.revokeObjectURL(url);

                // Remove o link do corpo do documento
                document.body.removeChild(link);
            },
            error: function (xhr, status, error) {
                console.error('Erro ao baixar o arquivo:', error);
            }
        });
    }


    $("#downloadButton").click(function () {
        var formData = new FormData($("#filterForm")[0]);

        $.ajax({
            url: "/Home/ExportarParaExcel",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                var blob = new Blob([data.fileContents], { type: 'application/octet-stream' });

                // Usa o FileSaver.js para baixar o arquivo
                saveAs(blob, data.fileDownloadName);
            },
            error: function (xhr, status, error) {
                // Trata erros
                console.error(xhr.responseText);
                console.error(error);
            }
        });

    });

    $("#btnSalvarCliente").click(function () {
        if (validator.form())
            salvarCliente();
    });

    $("#btnExcluirCliente").click(function () {
        excluirCliente();
    });

    $("#filterForm").submit(function (event) {
        event.preventDefault();

        carregarDados();
    });

    $("#LocalidadeModal").change(function () {
        atualizarHorario();
    });

    function atualizarHorario() {
        var selectedLocalidade = $("#LocalidadeModal").val();
        var horarios = {
            1: ["13:30", "14:00", "14:30", "15:00", "15:30"],
            2: ["09:30", "10:00", "10:30", "11:00", "11:30"]
        };

        var horarioSelect = $("#HorarioModal");

        if (selectedLocalidade !== "") {
            horarioSelect.empty();
            $.each(horarios[selectedLocalidade], function (index, value) {
                horarioSelect.append($("<option></option>").attr("value", value).text(value));
            });
        }
    }

    // Chama a fun��o uma vez para inicializar os hor�rios com base na sele��o inicial (se houver)
    $("#LocalidadeModal").trigger("change");

    function carregarDados() {

        var formData = new FormData($("#filterForm")[0]);

        $.ajax({
            url: '/Home/PesquisarClientes',
            type: 'POST',
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {

                $("#Total").empty().html(`Total: ${data.total}`)

                var tabela = $('#tabelaCliente tbody');
                tabela.empty();

                data.clientes.forEach(function (item) {
                    var row = '<tr>' +
                        '<td>' + `<a href="javascript:void(0)" class="open-modal" title="editar" data-id-cliente="${item.id}"><i class="fa fa-eye"></i></a>` + '</td>' +
                        '<td>' + item.diaSemana + '</td>' +
                        '<td>' + item.horario + '</td>' +
                        '<td>' + item.nome + '</td>' +
                        '<td>' + item.email + '</td>' +
                        '<td>' + item.idade + '</td>' +
                        '<td>' + item.localidade + '</td>' +
                        '<td>' + item.necessidade + '</td>' +
                        '<td>' + item.telefone + '</td>' +
                        '<td>' + new Date(item.dataCadastro).toLocaleDateString() + '</td>' +
                        '</tr>';
                    tabela.append(row);
                });
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Erro na requisi��o:', textStatus);
            }
        });
    }

    function montarDadosCliente(id) {
        $.ajax({
            url: `/Home/BuscarCliente?id=${id}`,
            type: 'GET',
            contentType: false,
            processData: false,
            success: function (data) {
                $("#formCliente select[name='Localidade']").val(data.idLocalidade);
                atualizarHorario();
                $("#formCliente input[name='Nome']").val(data.nome);
                $("#formCliente input[name='Email']").val(data.email);
                $("#formCliente input[name='Idade']").val(data.idade);
                $("#formCliente input[name='Telefone']").val(data.telefone);
                $("#formCliente select[name='Necessidade']").val(data.idNecessidade);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Erro na requisi��o:', textStatus);
            }
        });
    }

    function salvarCliente() {

        var formData = new FormData(formCliente[0]);

        $.ajax({
            url: '/Home/SalvarCliente',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                location.reload();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Erro ao salvar cliente:', textStatus);
                // Aqui voc� pode lidar com o erro de forma adequada, se necess�rio
            }
        });
    }

    function excluirCliente() {

        $.ajax({
            url: `/Home/ExcluirCliente?id=${$("#Id").val()}`,
            type: 'DELETE',
            contentType: false,
            processData: false,
            success: function (response) {
                location.reload();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Erro ao salvar cliente:', textStatus);
                // Aqui voc� pode lidar com o erro de forma adequada, se necess�rio
            }
        });
    }
});
