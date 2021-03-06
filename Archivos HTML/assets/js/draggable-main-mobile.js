var dragging = false
var currentSimulation
import('./postulacion.js').then((module) => {
  currentSimulation = new module.default()
  drawHorario()
})
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
  $(".section-simulator-" + idramo + "-" + idseccion + " > li").addClass("section-selected")
}
// Desfocusear itemes de la lista de ramos arrastrables
function deFocus (idramo) {
  $(".section-simulator" + " > li").each(function(index) {
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
    ramo.horarios.forEach((horario) => {
      aux = $("#" + horario[1].toString() + " > ." + horario[0].toString())
      aux.html(
        '<span class="td-data-hour--content ' + 'ramo-' + ramo.idRamo + '">\n' +
        '    <a href="#" class="td-data-hour--subject td-data-hour--subject-postulate">\n' +
        '      <span class="td-popover td-popover--postulate">\n' +
        '        <span class="title-td-subject"> ' + ramo.title + '</span>\n' +
        '      </span>\n' +
        '    </a>\n' +
        '</span>\n'
      )
    })
  })
}
// Dibujar la lista de ramos en base a select de la simulación
function drawList (newRamo) {
  var list = $("#simulatorList")
  list.html('')
  var data = ramos.filter(function(item){
    return parseInt(item.idramo) === parseInt(newRamo)
  })
  data[0].seccion.forEach(function (item) {
    let availability = currentSimulation.checkAvailability(detokenize(item.token))
    let html =
      '<div style="margin: 5px 5px 5px 5px" class="col-xs-6 section-simulator section-simulator-' + newRamo + '-' + item.idseccion + '" draggable="true" onmouseup="handleClick(this)" data-name="' + data[0].titulo + '" data-idramo="' + newRamo + '" data-idseccion="' + item.idseccion + '" data-token="' + item.token + '">\n' +
      '  <li class="td-data-hour--subject ' + (availability.isPosible ? 'td-data-hour--subject-postulate' : 'td-data-hour--subject-required') +' no-bullets">\n' +
      '    <span class="td-popover td-popover--postulate">\n' +
      '      <span class="title-td-subject">' + data[0].titulo + '</span>\n' +
      '      <span class="title-td-section">Sección ' + item.idseccion + '</span>\n' +
      '      <span class="td-data-hour--campus">\n';

    detokenize(item.token).forEach(function (item) {
      html += '        <span class="td-data-hour--campus-title">' + item[0] + ' - ' + item[1] + '</span>\n'
    })

    html += '</span>\n' +
      '    </span>\n' +
      '  </li>\n' +
      '</div>\n';
    list.append(html)
  })
  var idSeccionFocus = currentSimulation.checkFocus(newRamo)
  if(idSeccionFocus > 0){
    setFocus(newRamo, idSeccionFocus)
  }
}

function handleClick (ev) {
  if (!dragging) {
    var data = $(ev).data('token');
    var title = $(ev).data('name');
    var idseccion = $(ev).data('idseccion');
    var idramo = $(ev).data('idramo');

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
