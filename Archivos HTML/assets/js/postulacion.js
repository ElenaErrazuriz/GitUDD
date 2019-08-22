class Postulacion {
  constructor(){
    this.ramosList = []
  }
  getList () {
    return this.ramosList
  }
  addRamo (seccionObj) {
    this.ramosList = this.ramosList.concat([seccionObj])
  }
  delRamo (idRamo) {
    this.ramosList = this.ramosList.filter((item) => parseInt(item.idRamo) !== parseInt(idRamo))
  }
  checkFocus (idRamo) {
    let array = this.ramosList.filter((ramo) => parseInt(ramo.idRamo) === parseInt(idRamo))
    if (array.length) return(parseInt(array[0].idSeccion))
    else return(0)
  }
  checkAvailability (horarioList) {
    let ocurrencesList = []
    let filtered, aux
    horarioList.forEach((posibleHorario) => {
      filtered = this.ramosList.filter((item) => {
        aux = item.horarios.filter((horario) => horario.includes(posibleHorario[1]) && horario.includes(posibleHorario[0]))
        return aux.length > 0
      })
      filtered.length ? ocurrencesList.push(filtered[0]) : null
    })
    if (ocurrencesList.length){
      return {isPosible: false, ocurrences: ocurrencesList}
    } else {
      return {isPosible: true, ocurrences: []}
    }
  }
}

export default Postulacion