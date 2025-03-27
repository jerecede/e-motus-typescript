import Motus from "../model/motus";

export default class MotusService {

    moti: Motus[];

    constructor() {
        this.moti = [];
    }

    //scarica i moti dalla memoria locale, se non ci sono, li scarica dal json, tutto per
    // -salvarli in this.moti e poi
    // -restituirli al chiamante (motus-list)
    async loadMoti() {
        const localMotiString = localStorage.getItem('moti');
        if(localMotiString){
            const data = JSON.parse(localMotiString);
            this.moti = this.createMotiFromData(data);
        } else {
            const data = await this.getMotiFromJson()
            this.moti = this.createMotiFromData(data);
            this.saveMoti();
        }

        return this.moti;
    }

    //MotusService usa questa funzione quando non trova i moti nella memoria locale, e li scarica dal json
    getMotiFromJson(): Promise<Motus[]>{
        return fetch('/emotions.json')
              .then(resp => resp.json())
    }

    //carica this.moti nella memoria locale, lo fa quando quando vengono aggiunti nuovi moti(addMotus), quando vengono rimossi(removeMotus),
    //o quando this.moti vengono scaricati dal json(getMotiFromJson),
    //sostanzialmente deve aggiornare la memoria locale perche mantenga il passo
    saveMoti(){
        localStorage.setItem('moti', JSON.stringify(this.moti));
        return this.moti;
    }

    //aggiunge un motus a this.moti, lo aggiunge alla memoria locale
    // e poi lo restituisce al chiamante (motus-list cosi aggiorna il suo this.moti)
    addMotus(motus: Motus){
        this.moti.push(motus);
        this.saveMoti();
        return this.moti;
    }

    //rimuove un motus a this.moti, lo aggiunge alla memoria locale
    // e poi lo restituisce al chiamante (motus-list cosi aggiorna il suo this.moti)
    removeMotus(motus: Motus){
        const motiModified = this.moti.filter(m => m.id !== motus.id);
        this.moti = motiModified;
        this.saveMoti();
        return this.moti;
    }

    editMotus(){

    }

    //converte il data preso da local storage in oggetti di tipo Motus(con le sue funzioni), non più oggetti generici
    createMotiFromData(data: Motus[]){
        const moti = [];

        for (let i = 0; i < data.length; i++) {
            const motus = data[i];
            
            const newMotus = new Motus(motus.id, motus.value, motus.note, motus.location);

            moti.push(newMotus);
        }

        return moti;
    }
}