var dragging = false
var currentSimulation
import('./postulacion.js').then((module) => {
  currentSimulation = new module.default()
  currentSimulation.loadSimulationData()
  drawHorario()
  setSelect()
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
// funcion que borra un Ramo de la simulación
function delSection(idramo) {
  deFocus(idramo)
  currentSimulation.delRamo(idramo)
  drawHorario()
  let newRamo = $('#simulatorSelect').val
  drawList(newRamo)
}
// Focusear itemes de la lista de ramos arrastrables
function setFocus (idramo, idseccion) {
  $(".section-simulator-" + idramo + "-" + idseccion).addClass("section-selected")
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
  $(".section-simulator").each(function(index) {
    $(this).data('idramo') === parseInt(idramo) ? $(this).removeClass('section-selected') : null
  })
}
// Funcion que linkea la info correspondiente al iniciar un drag
function startdrag(ev) {
  dragging = true
  ev.dataTransfer.setData("text", $(ev.target).data('token'));
  ev.dataTransfer.setData("title", $(ev.target).data('name'));
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
  let aux
  ramos.forEach(function (ramo) {
    ramo.Bloques.forEach((bloque) => {
      bloque = convertBloque(bloque)
      aux = $("." + bloque.Inicio.split(':')[0] + " > ." + bloque.abv)
      aux.html(
        '<span class="td-data-hour--content ' + 'ramo-' + ramo.CodRamo + '" >\n' +
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
    return item.CodRamo === newRamo
  })
  data[0].Secciones.forEach(function (item) {
    let availability = currentSimulation.checkAvailability(item.Bloques)
    let html =
      '<div class="horario2 section-simulator section-simulator-' + newRamo + '-' + item.IdSeccion + '" draggable="true" onmouseup="handleClick(this)" ondragstart="startdrag(event)" ondragend="undrag()" data-idramo="' + newRamo + '" data-idseccion="' + item.IdSeccion + '">\n' +
      '  <li class="td-data-hour--subject ' + (availability.isPosible ? 'td-data-hour--subject-postulate' : 'td-data-hour--subject-required') +' no-bullets">\n' +
      '    <span class="td-popover td-popover--postulate">\n' +
      '      <span class="title-td-subject">' + item.IdSeccion.split('_')[1] +  '</span>\n' +
      '      <span class="title-td-data-subject">' + item.NombreRamo + '</span>\n' +
      '      <span class="title-td-section">Sección ' + (item.IdSeccion.split('_')[2]) + '</span>\n' +
      '      <span class="td-data-hour--campus">\n';

     item.Bloques.map(bloque => convertBloque(bloque)).forEach(function (item) {
      html += '        <span class="td-data-hour--campus-title">' + item.Dia + ' - ' + item.Inicio + ' - ' + item.Fin + '</span>\n'
    })
    html += '</span>\n' +
      '    </span>\n' +
      '  </li>\n' +
      '</div>\n';
    list.append(html);
    list2.append(html);
  })
  var idSeccionFocus = currentSimulation.checkFocus(newRamo)
  if(idSeccionFocus !== '0'){
    setFocus(newRamo, idSeccionFocus)
  }
}

function handleClick (ev) {
  if (!dragging) {
    var idseccion = $(ev).data('idseccion');
    var idramo = $(ev).data('idramo');

    let data = currentSimulation.getSeccionInfo(idramo, idseccion)
    if(data !== false){
      // revisar si tiene choque de horarios
      var availability = currentSimulation.checkAvailability(data.Bloques)
      if (availability.isPosible) {
        delSection(idramo)
        setFocus(idramo, idseccion)
        currentSimulation.addRamo(data)
      } else {
        if(confirm("Se eliminarán " + availability.ocurrences.length + " ramos con tope, ¿Seguro que desea continuar?")){
          delSection(idramo)
          availability.ocurrences.forEach((ramo) => {
            delSection(ramo.CodRamo)
          })
          setFocus(idramo, idseccion)
          currentSimulation.addRamo(data)
        }
      }
      drawList(idramo)
      drawHorario()
    }
  }
}
// Funcion que maneja el drop de los elementos en la tabla
function drop(ev) {
  ev.preventDefault();
  //conseguir los datos cargados al iniciar el drag
  var idseccion = ev.dataTransfer.getData("idseccion");
  var idramo = ev.dataTransfer.getData("idramo");
  dragging = false
  // detokenizar y borrar cualquier otra seccion del mismo ramo arrastrado
  let data = currentSimulation.getSeccionInfo(idramo, idseccion)
  if(data !== false){
    // revisar si tiene choque de horarios
    var availability = currentSimulation.checkAvailability(data.Bloques)
    if (availability.isPosible) {
      delSection(idramo)
      setFocus(idramo, idseccion)
      currentSimulation.addRamo(data)
    } else {
      if(confirm("Se eliminarán " + availability.ocurrences.length + " ramos con tope, ¿Seguro que desea continuar?")){
        delSection(idramo)
        availability.ocurrences.forEach((ramo) => {
          delSection(ramo.CodRamo)
        })
        setFocus(idramo, idseccion)
        currentSimulation.addRamo(data)
      }
    }
    var newRamo = $('#simulatorSelect').val()
    drawList(newRamo)
    drawHorario()
  }
}
