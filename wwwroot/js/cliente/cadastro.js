var telefoneInput = document.getElementById('Telefone');
var telefoneMask = IMask(telefoneInput, {
	mask: '(00) 00000-0000'
});

var idadeInput = document.getElementById('Idade');
var idadeMask = IMask(idadeInput, {
	mask: '000'
});

jQuery.noConflict();
(function ($) {
	$(window).on('load', function () {
		$('#status').fadeOut();
		$('#preloader').delay(200).fadeOut('slow');
	});
})(jQuery);

// Scroll to Top
jQuery.noConflict();
(function ($) {
	$(window).scroll(function () {
		if ($(this).scrollTop() >= 50) {
			$('#return-to-top').fadeIn(200);
		} else {
			$('#return-to-top').fadeOut(200);
		}
	});
	$('#return-to-top').click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 500);
	});
})(jQuery);

jQuery.noConflict();
(function ($) {
	$(function () {
		$('a.page-scroll').bind('click', function (event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});
	});
})(jQuery);

jQuery.noConflict();
(function ($) {
	$('.counter').each(function () {
		var $this = $(this),
			countTo = $this.attr('data-count');

		$({
			countNum: $this.text()
		}).animate({
			countNum: countTo
		},

			{
				duration: 3000,
				easing: 'linear',
				step: function () {
					$this.text(Math.floor(this.countNum));
				},
				complete: function () {
					$this.text(this.countNum);
					//alert('finished');
				}
			});
	});
})(jQuery);

(function ($) {
	$(document).ready(function () {
		// Função para atualizar os horários com base na localidade selecionada
		$("#Localidade").change(function () {
			var selectedLocalidade = $(this).val();
			var horarios = {
				1: ["10:00", "10:15", "10:30", "10:45",
					"11:00", "11:15", "11:30", "11:45",
					"13:00", "13:15", "13:30", "13:45",
					"14:00", "14:15", "14:30", "14:45",
					"15:00", "15:15", "15:30", "15:45",
					"16:00"],
				2: ["09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30"],
				3: ["13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:30", "15:45"]
			};

			var horarioSelect = $("#Horario");
			horarioSelect.empty();

			if (selectedLocalidade !== "") {
				horarioSelect.empty();
				if ($("#DiaSemana").val() == "2" && selectedLocalidade == "1") {
					$.each(horarios[3], function (index, value) {
						horarioSelect.append($("<option></option>").attr("value", value).text(value));
					});
				}

				else if ($("#DiaSemana").val() == "3" && selectedLocalidade == "2") {
					horarioSelect.empty();
					$.each(horarios[1], function (index, value) {
						horarioSelect.append($("<option></option>").attr("value", value).text(value));
					});
				}

				else {
					horarioSelect.empty();
					$.each(horarios[selectedLocalidade], function (index, value) {
						horarioSelect.append($("<option></option>").attr("value", value).text(value));
					});
				}
			}
		});

		// Chama a função uma vez para inicializar os horários com base na seleção inicial (se houver)
		$("#Localidade").trigger("change");

		$("#DiaSemana").change(function () {
			var selectedDiaSemana = $(this).val();
			var lojasSemana = {
				1: [{ text: "Santos", value: "1" }],
				2: [{ text: "Santos", value: "1" }, { text: "Praia Grande", value: "2" }],
				3: [{ text: "Praia Grande", value: "2" }],
			};

			var localidadeSelect = $("#Localidade");
			localidadeSelect.empty(); // Limpa as opções anteriores

			if (selectedDiaSemana !== "") {
				$.each(lojasSemana[selectedDiaSemana], function (index, obj) {
					localidadeSelect.append($("<option></option>").attr("value", obj.value).text(obj.text));
				});
			}

			$("#Localidade").trigger("change");
		});

		$("#DiaSemana").trigger("change");
	});

	function salvarCliente() {

		var formData = new FormData($("#cadastroForm")[0]);

		$.ajax({
			url: '/Home/SalvarCliente',
			type: 'POST',
			data: formData,
			contentType: false,
			processData: false,
			success: function (response) {
				console.log("aquiii");
			},
			error: function (xhr, textStatus, errorThrown) {
				console.log('Erro ao salvar cliente:', textStatus);
				// Aqui você pode lidar com o erro de forma adequada, se necessário
			}
		});
	}

	function validarEmail(e) {
		var email = $(e).val();
		var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			$(this).addClass("invalid");
		}
	}

	$('#enviar-formulario').click(function (e) {
		e.preventDefault();

		var obj = {};

		var naoEnviar = false;

		$('#cadastroForm :input').each(function () {
			var valor = $(this).val();
			var nomeProp = $(this).attr('name');

			if (nomeProp == "Email") {
				var email = $(this).val();
				var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(email)) {
					$(this).addClass("invalid");
					naoEnviar = true;
				}
			}

			if (valor == undefined || valor == null || valor == "") {
				$(this).addClass("invalid");
				naoEnviar = true;
			}

			obj[nomeProp] = valor;
		});

		if (naoEnviar)
			return alert("Preencha os campos");

		var necessidade = $('#necessidade option:selected').html();

		var texto = `Nome: ${obj.Nome} \nNecessidade: ${necessidade} \nHorario: ${obj.Horario} \nIdade: ${obj.Idade} \nTelefone: ${obj.Telefone} \nEmail: ${obj.Email} \nLocalidade: ${$("#Localidade").find("option:selected").html()}`;

		salvarCliente();

		if (obj.Necessidade < 3) {
			var textoCodificado = encodeURIComponent(texto);

			window.open(`https://api.whatsapp.com/send?phone=5513991549286&text=${textoCodificado}`, "_blank");
		}

		texto = texto.replace(/\n/g, "<br/>");
		Email.send({
			SecureToken: "58cb3203-346d-442a-a4c2-f437972eb834",
			From: 'visaosaudedosolhos@gmail.com',
			To: "visaosaudedosolhos@gmail.com",
			Subject: `Contato: ${obj.Nome}`,
			Body: texto
		}).then(
			message => alert("Cadastro concluído!")
		);
	});
})(jQuery);

(function ($) {
	$('#cadastroForm :input').change(function () {
		var valor = $(this).val();

		if (valor != undefined || valor != null || valor != "") {
			$(this).removeClass("invalid");
		}
	});
})(jQuery);

(function ($) {
	$('.check').click(function (e) {
		if ($(this).prop('checked')) {
			// Desmarca todos os outros checkboxes
			$('.check').not(this).prop('checked', false);
		}
	});
})(jQuery);


var today = new Date();
var year = today.getFullYear();