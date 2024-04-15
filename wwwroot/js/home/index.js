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
            Horario: "Por favor, informe o horário",
            Nome: "Por favor, informe o nome",
            Email: {
                required: "Por favor, informe o e-mail",
                email: "Por favor, informe um e-mail válido"
            },
            Idade: {
                required: "Por favor, informe a idade",
                number: "Por favor, informe um número válido"
            },
            Telefone: {
                required: "Por favor, informe o telefone",
                minlength: "Por favor, informe um telefone válido (ex: (99) 99999-9999)"
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

    $("#downloadButton").click(function () {
        var formData = new FormData($("#filterForm")[0]);

        $.ajax({
            url: "/Home/ExportarParaExcel",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {
            },
            error: function (xhr, status, error) {
                // Trata erros
                console.error(xhr.responseText);
                console.error(error);
            }
        });

        location.href = '/Home/DownloadCSV';

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
        var selectedLocalidade = $(this).val();
        var horarios = {
            1: ["09:00", "09:15", "09:30", "09:45",
                "10:00", "10:15", "10:30", "10:45",
                "11:00", "11:15", "11:30", "11:45"],
            2: ["09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30"],
            3: ["14:00", "14:15", "14:30", "14:45",
                "15:00", "15:15", "15:30", "15:45",
                "16:00", "16:15", "16:30", "16:45", "17:00"],
            4: ["13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:30"],
        };

        var horarioSelect = $("#HorarioModal");
        horarioSelect.empty();

        if (selectedLocalidade !== "") {
            horarioSelect.empty();
            if ($("#DiaSemanaModal").val() == "1" && selectedLocalidade == "1") {
                $.each(horarios[1], function (index, value) {
                    horarioSelect.append($("<option></option>").attr("value", value).text(value));
                });
            }

            else if ($("#DiaSemanaModal").val() == "1" && selectedLocalidade == "2") {
                $.each(horarios[3], function (index, value) {
                    horarioSelect.append($("<option></option>").attr("value", value).text(value));
                });
            }

            else if ($("#DiaSemanaModal").val() == "2" && selectedLocalidade == "1") {
                $.each(horarios[4], function (index, value) {
                    horarioSelect.append($("<option></option>").attr("value", value).text(value));
                });
            }

            else {
                $.each(horarios[2], function (index, value) {
                    horarioSelect.append($("<option></option>").attr("value", value).text(value));
                });
            }

            //if ($("#DiaSemanaModal").val() == "2" && selectedLocalidade == "1") {
            //    $.each(horarios[3], function (index, value) {
            //        horarioSelect.append($("<option></option>").attr("value", value).text(value));
            //    });
            //}

            //else if ($("#DiaSemanaModal").val() == "3" && selectedLocalidade == "2") {
            //    horarioSelect.empty();
            //    $.each(horarios[1], function (index, value) {
            //        horarioSelect.append($("<option></option>").attr("value", value).text(value));
            //    });
            //}

            //else {
            //    horarioSelect.empty();
            //    $.each(horarios[4], function (index, value) {
            //        horarioSelect.append($("<option></option>").attr("value", value).text(value));
            //    });
            //}
        }
    });

    // Chama a função uma vez para inicializar os horários com base na seleção inicial (se houver)
    $("#LocalidadeModal").trigger("change");

    $("#DiaSemanaModal").change(function () {
        var selectedDiaSemana = $(this).val();
        var lojasSemana = {
            1: [{ text: "Santos", value: "1" }, { text: "Praia Grande", value: "2" }],
            2: [{ text: "Santos", value: "1" }, { text: "Praia Grande", value: "2" }]
        };

        var localidadeSelect = $("#LocalidadeModal");
        localidadeSelect.empty(); // Limpa as opções anteriores

        if (selectedDiaSemana !== "") {
            $.each(lojasSemana[selectedDiaSemana], function (index, obj) {
                localidadeSelect.append($("<option></option>").attr("value", obj.value).text(obj.text));
            });
        }

        $("#LocalidadeModal").trigger("change");
    });

    $("#DiaSemanaModal").trigger("change");

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
                console.log('Erro na requisição:', textStatus);
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
                $("#DiaSemanaModal").trigger("change");
                $("#formCliente select[name='Localidade']").val(data.idLocalidade);
                $("#formCliente input[name='Nome']").val(data.nome);
                $("#formCliente input[name='Email']").val(data.email);
                $("#formCliente input[name='Idade']").val(data.idade);
                $("#formCliente input[name='Telefone']").val(data.telefone);
                $("#formCliente select[name='Necessidade']").val(data.idNecessidade);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Erro na requisição:', textStatus);
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
                // Aqui você pode lidar com o erro de forma adequada, se necessário
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
                // Aqui você pode lidar com o erro de forma adequada, se necessário
            }
        });
    }
});
