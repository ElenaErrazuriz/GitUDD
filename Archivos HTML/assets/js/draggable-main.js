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
  currentSimulation.getSimulationList().forEach(function(item) {
    simulator.append('<option value="' + item.codramo + '">' + item.nombre +'</option>')
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
  var newRamo = $('#simulatorSelect').val()
  drawList(newRamo)
}
// Focusear itemes de la lista de ramos arrastrables
function setFocus (idramo, idseccion) {
  $(".section-simulator-" + idramo + "-" + idseccion).addClass("section-selected")
}
function convertBloque (bloque) {
  let conversorList = [{real: 'Lunes', abv: 'lun'},{real: 'Martes', abv: 'mar'},{real: 'Miércoles', abv: 'mie'},{real: 'Jueves', abv: 'jue'},{real: 'Viernes', abv: 'vie'},{real: 'Sábado', abv: 'sab'},{real: 'Domingo', abv: 'dom'},]
  let abv = conversorList.filter(item => item.real === bloque.dia)[0].abv
  let ini = bloque.inicio.split(':')
  let fin = bloque.fin.split(':')
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
// función que lleva un token 'dia1@@horario1&&dia2@@horario2 (...)' a una lista para el correcto manejo de las funciones
function detokenize (token,separators = ['&&','@@']) {
  let aux = token.split(separators[0])
  aux = aux.map((item) => {
    return item.split(separators[1])
  })
  return aux
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
    ramo.bloques.forEach((bloque) => {
      bloque = convertBloque(bloque)
      aux = $("#" + bloque.inicio.split(':')[0] + " > ." + bloque.abv)
      aux.html(
        '<span class="td-data-hour--content ' + 'ramo-' + ramo.codramo + '">\n' +
        '    <a href="#" class="td-data-hour--subject td-data-hour--subject-postulate">\n' +
        '      <span class="td-popover td-popover--postulate">\n' +
        '        <span class="title-td-delete" onclick="delSection(' + ramo.codramo + ')"> x </span>\n' +
        '        <span class="title-td-subject"> ' + ramo.nombre + '</span>\n' +
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
  list.html('')
  var data = currentSimulation.getSimulationList().filter(function(item){
    return item.codramo === newRamo
  })
  data[0].secciones.forEach(function (item) {
    let availability = currentSimulation.checkAvailability(item.bloques)
    let html =
      '<div class="horario2 section-simulator section-simulator-' + newRamo + '-' + item.idSeccion + '" draggable="true" onmouseup="handleClick(this)" ondragstart="startdrag(event)" ondragend="undrag()" data-idramo="' + newRamo + '" data-idseccion="' + item.idSeccion + '">\n' +
      '  <li class="td-data-hour--subject ' + (availability.isPosible ? 'td-data-hour--subject-postulate' : 'td-data-hour--subject-required') +' no-bullets">\n' +
      '    <span class="td-popover td-popover--postulate">\n' +
      '      <span class="title-td-subject">' + item.codramo +  ' - ' + item.nombre + '</span>\n' +
      '      <span class="title-td-section">Sección ' + (item.idSeccion) + '</span>\n' +
      '      <span class="td-data-hour--campus">\n';

     item.bloques.map(bloque => convertBloque(bloque)).forEach(function (item) {
      html += '        <span class="td-data-hour--campus-title">' + item.dia + ' - ' + item.inicio + ' - ' + item.duration + '</span>\n'
    })
    html += '</span>\n' +
      '    </span>\n' +
      '  </li>\n' +
      '</div>\n';
    list.append(html)
  })
  var idSeccionFocus = currentSimulation.checkFocus(newRamo)
  debugger
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
      var availability = currentSimulation.checkAvailability(data.bloques)
      if (availability.isPosible) {
        delSection(idramo)
        setFocus(idramo, idseccion)
        currentSimulation.addRamo(data)
      } else {
        if(confirm("Se eliminarán " + availability.ocurrences.length + " ramos con tope, ¿Seguro que desea continuar?")){
          delSection(idramo)
          availability.ocurrences.forEach((ramo) => {
            delSection(ramo.idRamo)
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
}
// Funcion que maneja el drop de los elementos en la tabla
function drop(ev) {
  ev.preventDefault();
  //conseguir los datos cargados al iniciar el drag
  var data = ev.dataTransfer.getData("text");
  var title = ev.dataTransfer.getData("title");
  var idseccion = ev.dataTransfer.getData("idseccion");
  var idramo = ev.dataTransfer.getData("idramo");
  dragging = false
  // detokenizar y borrar cualquier otra seccion del mismo ramo arrastrado
  data = detokenize(data);
  // revisar si tiene choque de horarios
  var availability = currentSimulation.checkAvailability(data)
  if (availability.isPosible) {
    delSection(idramo)
    setFocus(idramo, idseccion)
    currentSimulation.addRamo({
      idRamo: idramo,
      idSeccion: idseccion,
      horarios: data,
      title: title,
    })
  } else {
    if(confirm("Se eliminarán " + availability.ocurrences.length + " ramos con tope, ¿Seguro que desea continuar?")){
      delSection(idramo)
      availability.ocurrences.forEach((ramo) => {
        console.log(ramo)
        delSection(ramo.idRamo)
      })
      setFocus(idramo, idseccion)
      currentSimulation.addRamo({
        idRamo: idramo,
        idSeccion: idseccion,
        horarios: data,
        title: title,
      })
    }
  }
  var newRamo = $('#simulatorSelect').val()
  drawList(newRamo)
  drawHorario()
}
