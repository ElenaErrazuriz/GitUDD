import {ramos} from './../resources/ramosList_UDD.js'

function check(bloque, bloque2){
  let ini = bloque.Inicio.split(':')
  let fin = bloque.Fin.split(':')
  ini = parseInt(ini[0])*60 + parseInt(ini[1])
  fin = parseInt(fin[0])*60 + parseInt(fin[1])

  let ini2 = bloque2.Inicio.split(':')
  let fin2 = bloque2.Fin.split(':')
  ini2 = parseInt(ini2[0])*60 + parseInt(ini2[1])
  fin2 = parseInt(fin2[0])*60 + parseInt(fin2[1])
  if(((ini >= ini2 && ini <= fin2) || (fin >= ini2 && fin <= fin2) || (ini < ini2 && fin > fin2)) && bloque.Dia === bloque2.Dia) {
    return true
  } else return false
}
class Postulacion {
  constructor(){
    let array = localStorage.getItem('savedSimulations')
    if (array !== null) array = JSON.parse(array)
    else{
      array = [[], [], []]
      localStorage.setItem('savedSimulations', JSON.stringify(array))
    }
    this.priorities = array
    this.ramosList = array[0]

    this.simulationRamos = []
  }
  getList () {
    return this.ramosList
  }
  saveList (index) {
    this.priorities[parseInt(index)] = this.ramosList
    localStorage.setItem('savedSimulations', JSON.stringify(this.priorities))
  }
  loadList (index) {
    this.ramosList = this.priorities[parseInt(index)]
  }
  loadSimulationData (){
    this.simulationRamos = []
    ramos.forEach((ramo) => {
      let auxRamo = ramo
      auxRamo.Secciones = auxRamo.Secciones.map(seccion => {
        return {
          ...seccion,
          IdSeccion: ramo.CodRamo + '_' + seccion.CodRamo + '_' + seccion.IdSeccion,
          CodRamo: ramo.CodRamo,
        }
      })
      let takensections = ramo.Secciones.filter(seccion => seccion.Estado === 'INSCRITO')
      if(takensections.length){
        let section = takensections[0]
        this.ramosList = this.ramosList.concat([section]);
      } else {
        this.simulationRamos = this.simulationRamos.concat([auxRamo])
      }
    })

    /* conseguir asyncornicamente la lista*/
  }
  addRamo (seccionObj) {
    this.ramosList = this.ramosList.concat([seccionObj])
  }
  delRamo (idRamo) {
    this.ramosList = this.ramosList.filter((item) => item.CodRamo !== idRamo)
  }
  checkFocus (idRamo) {
    let array = this.ramosList.filter((ramo) => ramo.CodRamo === idRamo)
    if (array.length) return(array[0].IdSeccion)
    else return('0')
  }
  getSeccionInfo (idRamo, idSeccion) {
    let filtrado = this.simulationRamos.filter(item => item.CodRamo === idRamo)
    if(filtrado.length) {
      let ramo = filtrado[0]
      let section = ramo.Secciones.filter(item => item.IdSeccion === idSeccion)
      if (section.length) {
        return section[0]
      } else return false
    } else return false
  }
  getSimulationList(){
    return this.simulationRamos
  }
  checkAvailability (bloquesList) {
    let ocurrencesList = []
    let filtered, aux
    bloquesList.forEach((posibleBloque) => {
      filtered = this.ramosList.filter((item) => {
        aux = item.Bloques.filter((bloque) => {
          return check(posibleBloque, bloque)
        })
        return aux.length > 0
      })
      if(filtered.length) { ocurrencesList = ocurrencesList.concat(filtered)}
    })
    ocurrencesList = ocurrencesList.reduce((list, item) => {
      if(list.filter(ocurrence => ocurrence.CodRamo === item.CodRamo).length) {
        return list
      } else {
        return list.concat([item])
      }
    } , [])
    if (ocurrencesList.length){
      debugger;
      return {isPosible: false, ocurrences: ocurrencesList}
    } else {
      return {isPosible: true, ocurrences: []}
    }
  }
}

export default Postulacion