import Location from "./location"

export default interface Motus {
    id: string
    value: number
    note: string
    creationDate: number
    location: Location
  }