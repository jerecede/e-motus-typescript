import Location from "./location-interface"

export default interface MotusInterface {
  id: string
  value: number
  note: string
  creationDate: number
  location?: Location
}

//location? non è obbligatorio