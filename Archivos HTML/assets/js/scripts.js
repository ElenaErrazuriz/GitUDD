;(function($){



})(jQuery);

jQuery(document).ready( function($){

	// -------------------------------------------------------- Móvil

	// Menú top alumno
	$('#user-mobile').bind('click', function(){
		$('#navbar-user-mobile').slideToggle('fast');
		$(this).toggleClass('active');
		return false;
	});

	// Menú resumen de postulación y solicitudes especiales
	$('#mobile-stage-nav').bind('click', function(){
		$('#stage-header-nav-summary').slideToggle('fast');
		$(this).toggleClass('active');
		return false;
	});

	// Botón de Inscripción en móviles
	$('.btn-link-subject-data-place').bind('click', function(){
		$(this).toggleClass('active');
		$(this).parent().find('.subject__data-mobile-content').slideToggle('fast');
		return false;
	});

	// -------------------------------------------------------- Formularios

	// Formulario radio button checked
	$('.form-check-input__subject-input').change(function() {
	    $('.checked').removeClass('checked'); // remove from all
	    if ($(this).is(':checked')) {
	        $(this).parent().addClass('checked'); // add to current
	        $('#select-subjects-radio-buttons').addClass('hidden-xs-up');
	        $('#select-subjects-radio-buttons-selected').removeClass('hidden-xs-up');
	        $('#disenroll-subjects-and-postulate').removeClass('hidden-xs-up');
	        $('#subject-name-selected').html( function() {
	          	return $('.checked .subject__name').html();
	        });
	    }
	});

	// Boton cancelar selección
	$('#cancel-select-subjects-radio-buttons').bind('click', function(){
		$('#select-subjects-radio-buttons').removeClass('hidden-xs-up');
	    $('#select-subjects-radio-buttons-selected').addClass('hidden-xs-up');
	    $('.checked').removeClass('checked');
	    $('.form-check-input__subject-input').removeAttr('checked');
	    /*
	    if ($(this).is(':checked')) {
	        $(this).removeAttr('checked').checkboxradio('refresh');
	    }
	    */
	});

	// Desinscribir ramo inscrito
	$('#disenroll-subject-registered').bind('click', function(){
		$('.checked .subject__status').addClass('hidden-xs-up');
		$('#subject-name-selected-disenroll').html( function() {
          	return $('.checked .subject__name').html();
        });
		$('.checked').removeClass('checked');
		$('#disenroll-subject-registered').addClass('hidden-xs-up');
		$('#select-subjects-radio-buttons').addClass('hidden-xs-up');
	    $('#select-subjects-radio-buttons-selected').removeClass('hidden-xs-up');
	});



	// Boton cancelar selección
	$('#cancel-disenroll-subject-registered').bind('click', function(){
		$('#select-subjects-radio-buttons').removeClass('hidden-xs-up');
	    $('#select-subjects-radio-buttons-selected').addClass('hidden-xs-up');
	    $('.subject--registered').addClass('checked');
	    $('#disenroll-subject-registered').removeClass('hidden-xs-up');
	    $('.checked .subject__status').removeClass('hidden-xs-up');
	    //$('.form-check-input__subject-input').removeAttr('checked');
	});

	// -------------------------------------------------------- Popovers

	// Popover Horarios
	$('.td-data-hour--subject').bind('click', function(){
		$(this).popover({
			trigger: 'click',
			title: "Title",
			html: true,
			placement: 'right',
			template: 	'<div class="popover">'+
							'<div class="popover-content">'+
							'</div>'+
							'<div class="popover-footer">'+
								'<button type="button" class="td-data-hour--details-subject-close" onclick="$(&quot;.td-data-hour--subject&quot;).popover(&quot;hide&quot;);"">'+
									'<i class="udd-tdr-icon-remove"></i>'+
								'</button>'+
							'</div>'+
						'</div>',
			content: function() {
	          	return $(this).html();
	        }
		});
	});

	// -------------------------------------------------------- Alertas

	// Fade Alerta
	$('#changes-save-subjects').delay(1000).fadeOut(1000);

});



// Arreglo select


// esta operacion busca obtener el valor previo y lo almacena en un 
//campo hidden llamado valor_seleccionado del mismo formulario
function focusFunction(select_sin_cambio) {
	var sel_sc_id = select_sin_cambio.id;
	var sel_sc_valor = document.getElementById(sel_sc_id).value;
	document.getElementById("valor_seleccionado").value = sel_sc_valor;
}

function change(select_cambiado){
	var j;
	// obtiene ID del select cambiado
	var sel_id = select_cambiado.id;
	// obtiene el valor del select cambiado
	var sel_valor = document.getElementById(sel_id).value;
	//var sel = document.getElementById(sel_id);
	
	// se obtiene el valor previo en el combobox
	var valor_anterior = document.getElementById("valor_seleccionado").value;

	// se valida que no sea cero (ninguno)
	if (valor_anterior != "0") 
	{
		// se valida que el campo del formulario no este en blanco
		if (valor_anterior != "")
		{
			// se itera para cada select del formulario
			$("select").each(function(){
				var sel_formulario = $(this).attr("id"); 
				var val_actual = document.getElementById(sel_formulario).value;
				
				// no se considera lo que se esta cambiando
				if (sel_formulario != sel_id)
				{
					// si el valor actual es igual al valor que se esta seleccionando se hace el cambio
					if (val_actual == sel_valor)
					{
						document.getElementById(sel_formulario).value = valor_anterior;
						// este comando cierra la ejecución del codigo
						return;
					}
				}
				
			});	
			
		}
	}

	//para cada select del formulario ejecuto (solo una de las opciones)
	$("select").each(function(){
		// obtiene el id del select
		var sel_formulario = $(this).attr("id"); 
		// valida que sea distinto del seleccionado
		if (sel_formulario != sel_id)
		{
			// si es distinto del seleccionado entonces obtenemos el valor
			var val_sel_formulario = document.getElementById(sel_formulario).value; 
			// comparo el valor con el seleccionado, si es igual al seleccionado se borra
			if (val_sel_formulario == sel_valor)
			{ 
				document.getElementById(sel_formulario).value = '';
			}
		}

	});

	// borramos todos los seleccionados
	
	$("select").each(function(){
		// obtiene el id del select
		var sel_formulario = $(this).attr("id"); 
		$('#'+sel_formulario+'_li').removeClass('selected');
	});
	
	var ramos = '';
	var i = 0;
	document.getElementById("ramos_postular").innerHTML = '';
	
	// seleccionamos aquellos con algun valor distinto de ""	
	$("select").each(function(){
		// obtiene el id del select
		var sel_formulario = $(this).attr("id"); 
		var val_sel_formulario = document.getElementById(sel_formulario).value; 
		if (val_sel_formulario != '')
		{
			i = i + 1;
			$('#'+sel_formulario+'_li').addClass('selected');
			var sel_val = document.getElementById(sel_formulario+'_val').value; 
			ramos = ramos + sel_val+',';
		}
	});
	
	ramos = ramos.slice(0, -1);
	document.getElementById("ramos_postular").innerHTML = ramos;

	if (i == 0)
	{
		document.getElementById("titulo_vas_a_postular").innerHTML = '';
	}
	else 
	{
		
		$('#select-subjects-combobox-select').addClass('hidden-xs-up');
		$('#select-subjects-combobox-selected').removeClass('hidden-xs-up');
		document.getElementById("titulo_vas_a_postular").innerHTML = 'Vas a postular a ';
	}

	
	if (i == 3)
	{
		document.getElementById("seleccionar_guardar").innerHTML = 'Guardar';
		$('#seleccionar_guardar').removeClass('disabled');
	}
	else
	{
		document.getElementById("seleccionar_guardar").innerHTML = 'Debes postular otro ramo';
		$('#seleccionar_guardar').addClass('disabled');
	}
}


