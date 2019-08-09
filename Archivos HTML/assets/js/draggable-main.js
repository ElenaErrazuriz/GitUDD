var tableData = [];

function onDragOver (e) {
  e.preventDefault()
  console.log("over")
}

var token, title;

function delSection(idramo) {
  $(".ramo-" + idramo).each(function(obj) {
    $(this).remove()
  })
}

function setFocus (idramo, idseccion) {
  $(".section-simulator").each(function(item) {
    $(this).removeClass('section-selected')
  })
  $(".section-simulator-" + idramo + "-" + idseccion).addClass("section-selected")
}

function startdrag(ev) {
  ev.dataTransfer.setData("text", $(ev.target).data('token'));
  ev.dataTransfer.setData("title", $(ev.target).data('name'));
  ev.dataTransfer.setData("idramo", $(ev.target).data('idramo'));
  ev.dataTransfer.setData("idseccion", $(ev.target).data('idseccion'));
}

function detokenize (token,separators = ['&&','@@']) {
  let aux = token.split(separators[0])
  aux = aux.map((item) => {
    return item.split(separators[1])
  })
  return aux
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var title = ev.dataTransfer.getData("title");
  var idseccion = ev.dataTransfer.getData("idseccion");
  var idramo = ev.dataTransfer.getData("idramo");

  data = detokenize(data);
  setFocus(idramo, idseccion)

  delSection(idramo)

  data.forEach(function (item) {
    aux = $("#" + item[1].toString() + " > ." + item[0].toString())
    aux.html(
      '                    <span class="td-data-hour--content ' + 'ramo-' + idramo + '">\n' +
      '                        <a href="#" class="td-data-hour--subject td-data-hour--subject-postulate">\n' +
      '                            <span class="td-popover td-popover--postulate">\n' +
      '                              <span class="title-td-subject"> ' + title + '</span>\n' +
      '                              <span class="title-td-section">Sección  ' + idseccion + '</span>\n' +
      '                            </span>\n' +
      '                          </a>\n' +
      '                    </span>\n'
    )
  })
}
/*
function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop) + 'px'
    elmnt.style.left = (elmnt.offsetLeft) + 'px'
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault()
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (parseInt(elmnt.style.top) - pos2) + 'px';
    elmnt.style.left = (parseInt(elmnt.style.left) - pos1 ) + 'px';
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    elmnt.onmousedown = null;
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
 */