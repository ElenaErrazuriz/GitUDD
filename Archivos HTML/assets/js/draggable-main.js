var currentSimulation
import('./postulacion.js').then((module) => {
  currentSimulation = new module.default()
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
}
// Focusear itemes de la lista de ramos arrastrables
function setFocus (idramo, idseccion) {
  $(".section-simulator-" + idramo + "-" + idseccion).addClass("section-selected")
}
// Desfocusear itemes de la lista de ramos arrastrables
function deFocus (idramo) {
  $(".section-simulator").each(function(index) {
    $(this).data('idramo') === parseInt(idramo) ? $(this).removeClass('section-selected') : null
  })
}
// Funcion que linkea la info correspondiente al iniciar un drag
function startdrag(ev) {
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
        '        <span class="title-td-delete" onclick="delSection(' + ramo.idRamo + ')"> x </span>\n' +
        '        <span class="title-td-subject"> ' + ramo.title + '</span>\n' +
        '        <span class="title-td-section">Sección  ' + ramo.idSeccion + '</span>\n' +
        '      </span>\n' +
        '    </a>\n' +
        '</span>\n'
      )
    })
  })
}

// Funcion que maneja el drop de los elementos en la tabla
function drop(ev) {
  ev.preventDefault();
  //conseguir los datos cargados al iniciar el drag
  var data = ev.dataTransfer.getData("text");
  var title = ev.dataTransfer.getData("title");
  var idseccion = ev.dataTransfer.getData("idseccion");
  var idramo = ev.dataTransfer.getData("idramo");
  // detokenizar y borrar cualquier otra seccion del mismo ramo arrastrado
  data = detokenize(data);
  delSection(idramo)
  // revisar si tiene choque de horarios
  var availability = currentSimulation.checkAvailability(data)
  if (availability.isPosible) {
    setFocus(idramo, idseccion)
    currentSimulation.addRamo({
      idRamo: idramo,
      idSeccion: idseccion,
      horarios: data,
      title: title,
    })
  } else {
    if(confirm("Se eliminarán " + availability.ocurrences.length + " ramos con tope, ¿Seguro que desea continuar?")){
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
  drawHorario()
}
