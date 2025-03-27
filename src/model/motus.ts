import Location from "./location-interface"

export default class Motus{
    
    id
    value
    note
    location
    creationDate

    constructor(id: string, value: number, note: string, location? : Location) {
        this.id = id;
        this.value = value;
        this.note = note;
        this.location = location;
        this.creationDate = new Date().getDate();
    }

    compareByDate(secondMotus: Motus) {
        const firstDate = this.creationDate;
        const secondDate = secondMotus.creationDate;
        return secondDate - firstDate;
    }

    // compareByValue(scndStudent) {
    //     const myYob = this.yob;
    //     const yourYob = scndStudent.yob;
    //     return myYob - yourYob;
    // }
}