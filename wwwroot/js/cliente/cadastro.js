var telefoneInput = document.getElementById('Telefone');
var telefoneMask = IMask(telefoneInput, {
	mask: '(00) 00000-0000'
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
				1: ["13:30", "14:00", "14:30", "15:00", "15:30"],
				2: ["09:30", "10:00", "10:30", "11:00", "11:30"]
			};

			var horarioSelect = $("#Horario");
			horarioSelect.empty(); // Limpa as opções anteriores

			if (selectedLocalidade !== "") {
				$.each(horarios[selectedLocalidade], function (index, value) {
					horarioSelect.append($("<option></option>").attr("value", value).text(value));
				});
			}
		});

		// Chama a função uma vez para inicializar os horários com base na seleção inicial (se houver)
		$("#Localidade").trigger("change");
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

	$('#enviar-formulario').click(function (e) {
		e.preventDefault();

		var obj = {};

		var naoEnviar = false;

		$('#cadastroForm :input').each(function () {
			var valor = $(this).val();
			var nomeProp = $(this).attr('name');

			if (valor == undefined || valor == null || valor == "") {
				$(this).addClass("invalid");
				naoEnviar = true;
			}

			obj[nomeProp] = valor;
		});

		if (naoEnviar)
			return alert("Preencha os campos");

		var necessidade = $('#necessidade option:selected').html();

		var texto = `Olá me chamo ${obj.Nome}. \n\nQueria saber mais sobre ${necessidade} grátis.`;

		console.log(obj);

		salvarCliente();

		if (obj.Necessidade < 3) {
			var textoCodificado = encodeURIComponent(texto);

			window.open(`https://api.whatsapp.com/send?phone=5513991549286&text=${textoCodificado}`, "_blank");
		}
		else {
			texto += `<br/> email: ${obj.Email}<br/> idade: ${obj.Idade}<br/> horario: ${obj.Horario}`
			Email.send({
				SecureToken: "58cb3203-346d-442a-a4c2-f437972eb834",
				From: 'visaosaudedosolhos@gmail.com',
				To: "visaosaudedosolhos@gmail.com",
				Subject: `Contato: ${obj.Nome}`,
				Body: `${texto}<br/>Numéro Whatsapp: ${obj.Telefone}`
			}).then(
				message => alert(message)
			);
		}
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