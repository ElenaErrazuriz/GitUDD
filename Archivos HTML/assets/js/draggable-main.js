var dragging = false
var currentSimulation
import('./postulacion.js').then((module) => {
  currentSimulation = new module.default()
  currentSimulation.loadSimulationData()
  drawHorario()
  setSelect()
  let since = currentSimulation.loadList("0")
  if(since === 0) {
    $("#lastModPriority").html('Nunca')
    $("#lastModPriority2").html('Nunca')
  } else {
    $("#lastModPriority").html(milisToString(since))
    $("#lastModPriority2").html(milisToString(since))
  }
})
function setSelect(){
  let simulator = $('#simulatorSelect')
  let simulator2 = $('#simulatorSelect2')
  currentSimulation.getSimulationList().forEach(function(item) {
    simulator.append('<option value="' + item.CodRamo + '">' + item.NombreRamo +'</option>')
    simulator2.append('<option value="' + item.CodRamo + '">' + item.NombreRamo +'</option>')
  })
}
// función para permitir 'drop' en el horario
function onDragOver (e) {
  e.preventDefault()
}

function scrollTo(id) {
  $([document.documentElement, document.body]).animate({
    scrollTop: $(id).offset().top
  }, 500);
}
// funcion que borra un Ramo de la simulación
function delSection(idramo) {
  deFocus(idramo)
  currentSimulation.delRamo(idramo)
  drawHorario()
  let newRamo = $('#simulatorSelect').val()
  drawList(newRamo)
}
// Focusear itemes de la lista de ramos arrastrables
function setFocus (idramo, idseccion) {
  $(".section-simulator-" + idramo + "-" + idseccion + ' > li').addClass("section-selected")
  console.log(idramo)
  $(".ramo-" + idramo + ' > a').addClass("section-selected")
}
function convertBloque (bloque) {
  let conversorList = [{real: 'Lunes', abv: 'lun'},{real: 'Martes', abv: 'mar'},{real: 'Miércoles', abv: 'mie'},{real: 'Jueves', abv: 'jue'},{real: 'Viernes', abv: 'vie'},{real: 'Sábado', abv: 'sab'},{real: 'Domingo', abv: 'dom'},]
  let abv = conversorList.filter(item => item.real === bloque.Dia)[0].abv
  let ini = bloque.Inicio.split(':')
  let fin = bloque.Fin.split(':')
  let duration = (parseInt(fin[0]) - parseInt(ini[0]))*60 + (parseInt(fin[1]) - parseInt(ini[1]))
  return {
    ...bloque,
    abv: abv,
    duration: duration,
  }
}
// Desfocusear itemes de la lista de ramos arrastrables
function deFocus (idramo) {
  $(".ramo-" + idramo + ' > a').removeClass("section-selected")
  $(".section-simulator > li").each(function(index) {
    $(this).data('idramo') === parseInt(idramo) ? $(this).removeClass('section-selected') : null
  })
}
// Funcion que linkea la info correspondiente al iniciar un drag
function startdrag(ev) {
  dragging = true
  ev.dataTransfer.setData("display", $(ev.target).data('display'));
  ev.dataTransfer.setData("idramo", $(ev.target).data('idramo'));
  ev.dataTransfer.setData("idseccion", $(ev.target).data('idseccion'));
}

function undrag(){
  dragging = false
}
// Dibujar el horario en base a los ramos en la simulación
function drawHorario () {
  $("tbody > tr > td.td-data-hour").each((index, item) => {
    $(item).html("")
  })
  let ramos = currentSimulation.getList()
  let aux, auxmobile
  ramos.forEach(function (ramo) {
    ramo.Bloques.forEach((bloque, idxblok) => {
      bloque = convertBloque(bloque)
      aux = $("#pc ." + bloque.Inicio.split(':')[0] + " > ." + bloque.abv)
      auxmobile = $("#mobile ." + bloque.Inicio.split(':')[0] + " > ." + bloque.abv)
      let html =
        '<span class="td-data-hour--content ' + 'ramo-' + ramo.CodRamo + '" id="' + ramo.CodRamo + idxblok + '">\n' +
        '    <a href="#infoModal" data-toggle="modal" data-codramo="' + ramo.CodRamo + '" data-idseccion="' + ramo.IdSeccion + '" data-tipo="' + bloque.Tipo + '" data-ini="' + bloque.Inicio + '" data-fin="' + bloque.Fin + '" class="td-data-hour--subject td-data-hour--subject-postulate" style="margin-top: ' + (parseInt(bloque.Inicio.split(':')[1])/60)*(65) + 'px; height: ' + (bloque.duration/60)*65+'px">\n' +
        '      <span class="td-popover td-popover--postulate">\n' +
        '        <span class="title-td-subject"> ' + ramo.NombreRamo + '</span>\n' +
        '        <span class="title-td-section">Sección ' + ramo.IdSeccion.split('_')[2] + '</span>\n' +
        '      </span>\n' +
        '    </a>\n' +
        '</span>\n'
      auxmobile.html(html)
      aux.html(
        '<span class="td-data-hour--content ' + 'ramo-' + ramo.CodRamo + '" id="' + ramo.CodRamo + idxblok + '" >\n' +
        '    <a href="#infoModal" data-toggle="modal" data-codramo="' + ramo.CodRamo + '" data-idseccion="' + ramo.IdSeccion + '" data-tipo="' + bloque.Tipo + '" data-ini="' + bloque.Inicio + '" data-fin="' + bloque.Fin + '" class="td-data-hour--subject td-data-hour--subject-postulate" style="margin-top: ' + (parseInt(bloque.Inicio.split(':')[1])/60)*(65) + 'px; height: ' + (bloque.duration/60)*65+'px">\n' +
        '      <span class="td-popover td-popover--postulate">\n' +
        '        <span class="title-td-hour"> ' + bloque.Inicio + '-' + bloque.Fin + ' Hrs</span>\n' +
        '        <span class="title-td-data-status popover-visible"> ' + ramo.Estado + '</span>\n' +
        '        <span class="title-td-subject"> ' + ramo.NombreRamo + '</span>\n' +
        '        <span class="title-td-section">Sección ' + ramo.IdSeccion.split('_')[2] + '</span>\n' +
        '        <span class="td-data-hour--campus popover-visible"> ' +
        '          <span class="td--data-hour--campus--title"> Profesor: </span>\n' +
        '          <span class="td--data-hour--campus--place"> ' + ramo.Profesor + '</span>\n' +
        '        </span>\n' +
        '      </span>\n' +
        '    </a>\n' +
        '</span>\n'
      )
    })
  })
}
// Dibujar el horario en base a los ramos en la simulación
function drawList (newRamo) {
  var list = $("#simulatorList")
  var list2 = $("#simulatorList2")
  list.html('')
  list2.html('')
  var data = currentSimulation.getSimulationList().filter(function(item){
    deFocus(item.CodRamo)
    return item.CodRamo === newRamo
  })
  if(data.length){
    data[0].Secciones.forEach(function (item) {
      let availability = currentSimulation.checkAvailability(item.Bloques)
      let headermobile = '<div class="horario-mobile section-simulator section-simulator-' + newRamo + '-' + item.IdSeccion + '" draggable="true" onmouseup="handleClick(this)" ondragstart="startdrag(event)" ondragend="undrag()" data-display="#mobile" data-idramo="' + newRamo + '" data-idseccion="' + item.IdSeccion + '">\n'
      let headerpc = '<div class="horario2 section-simulator section-simulator-' + newRamo + '-' + item.IdSeccion + '" draggable="true" onmouseup="handleClick(this)" ondragstart="startdrag(event)" ondragend="undrag()" data-display="#pc" data-idramo="' + newRamo + '" data-idseccion="' + item.IdSeccion + '">\n'
      let name = item.NombreRamo
      if(item.NombreRamo.length >= 60){
        name = name.substring(0, 59) + '</br>' + name.substring(59)
      }
      let html =
        '  <li class="td-data-hour--subject ' + (availability.isPosible ? 'td-data-hour--subject-postulate' : 'td-data-hour--subject-required') +' no-bullets">\n' +
        '    <span class="td-popover td-popover--postulate">\n' +
        '      <span class="title-td-subject">' + item.IdSeccion.split('_')[1] +  '</span>\n' +
        '      <span class="title-td-data-subject">' + name + '</span>\n' +
        '      <span class="title-td-section">Sección ' + (item.IdSeccion.split('_')[2]) + '</span>\n' +
        '      <span class="td-data-hour--campus">\n';

      item.Bloques.map(bloque => convertBloque(bloque)).forEach(function (item) {
        html += '        <span class="td-data-hour--campus-title">' + item.Dia + ' - ' + item.Inicio + ' - ' + item.Fin + '</span>\n'
      })
      html += '</span>\n' +
        '    </span>\n' +
        '  </li>\n' +
        '</div>\n';
      list.append( headerpc + html);
      list2.append(headermobile + html);
    })
    var idSeccionFocus = currentSimulation.checkFocus(newRamo)
    if(idSeccionFocus !== '0'){
      setFocus(newRamo, idSeccionFocus)
    }
  }
}

function handleClick (ev) {
  if (!dragging) {
    let idseccion = $(ev).data('idseccion');
    let idramo = $(ev).data('idramo');
    let disp = $(ev).data('display');

    let data = currentSimulation.getSeccionInfo(idramo, idseccion)
    if(data !== false){
      // revisar si tiene choque de horarios
      let availability = currentSimulation.checkAvailability(data.Bloques)
      if (availability.isPosible || (availability.ocurrences.length === 1 && availability.ocurrences[0].CodRamo === idramo)) {
        delSection(idramo)
        currentSimulation.addRamo(data)
        drawHorario()
        setFocus(idramo, idseccion)
        scrollTo(disp + ' #' + idramo + '0')
      } else {
        let msg =
          "Se eliminarán " + availability.ocurrences.filter(ramo => ramo.CodRamo !== idramo).length + " ramo(s) con tope :\n\n";
        availability.ocurrences.forEach(ramo => {
          if(ramo.CodRamo !== idramo){
            msg += ' • ' + ramo.NombreRamo +'\n'
          }
        })
        msg += '\n¿Seguro que desea continuar?'

        if(confirm(msg)){
          delSection(idramo)
          availability.ocurrences.forEach((ramo) => {
            delSection(ramo.CodRamo)
          })
          currentSimulation.addRamo(data)
          drawHorario()
          setFocus(idramo, idseccion)
          scrollTo(disp + ' #' + idramo + '0')

        }
      }
      drawList(idramo)
    }
  }
}
// Funcion que maneja el drop de los elementos en la tabla
function drop(ev) {
  ev.preventDefault();
  //conseguir los datos cargados al iniciar el drag
  let idseccion = ev.dataTransfer.getData("idseccion");
  let idramo = ev.dataTransfer.getData("idramo");
  let disp = ev.dataTransfer.getData("display");
  dragging = false
  // detokenizar y borrar cualquier otra seccion del mismo ramo arrastrado
  let data = currentSimulation.getSeccionInfo(idramo, idseccion)
  if(data !== false){
    // revisar si tiene choque de horarios
    let availability = currentSimulation.checkAvailability(data.Bloques)
    if (availability.isPosible || (availability.ocurrences.length === 1 && availability.ocurrences[0].CodRamo === idramo)) {
      delSection(idramo)
      currentSimulation.addRamo(data)
      drawHorario()
      setFocus(idramo, idseccion)
      scrollTo(disp + ' #' + idramo + '0')
    } else {
      let msg =
        "Se eliminarán " + availability.ocurrences.filter(ramo => ramo.CodRamo !== idramo).length + " ramo(s) con tope :\n\n";
      availability.ocurrences.forEach(ramo => {
        if(ramo.CodRamo !== idramo){
          msg += ' • ' + ramo.NombreRamo +'\n'
        }
      })
      msg += '\n¿Seguro que desea continuar?'

      if(confirm(msg)){
        delSection(idramo)
        availability.ocurrences.forEach((ramo) => {
          delSection(ramo.CodRamo)
        })
        currentSimulation.addRamo(data)
        drawHorario()
        setFocus(idramo, idseccion)
        scrollTo(disp + ' #' + idramo + '0')

      }
    }
    drawList(idramo)

  }
}

function milisToString(milis){
  let time = new Date().getTime() - milis
  console.log(milis)
  if(time <= 60000) {
    return "Hace unos segundos"
  } else if(time <= 3600*1000) {
    return "Hace " + ((time - time%60000)/60000) + " minuto(s)"
  } else if(time <= 24*3600*1000) {
    return "Hace " + (time - time%3600000)/(3600*1000) + " hora(s)"
  } else {
    return "Hace " + (time - time%(24*3600*1000))/(24*3600*1000) + " dia(s)"
  }
}

function saveButtonAnimation(str){
  let selector = $("#savesimulation" + str)
  selector.attr('class', 'btn btn-success')
  selector.html(
    '¡Guardado!'
  )
  setTimeout(function(){
    selector.attr('class', 'btn btn-primary')
    selector.html(
      'Guardar simulación'
    )
  }, 2000)
}

function cleanHorario(){
  if(confirm("¿Borrar todo en el horario?")){
    currentSimulation.cleanList()
    drawHorario()
    drawList($('#simulatorSelect').val())
    scrollTo('#header')
  }
}
