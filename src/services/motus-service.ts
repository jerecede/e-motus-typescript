import Motus from "../model/motus";

export default class MotusService {

    moti: Motus[];

    constructor() {
        this.moti = [];
    }

    async loadMoti() {
        const localMotiString = localStorage.getItem('moti');
        if(localMotiString){
            this.moti = JSON.parse(localMotiString);
        } else {
            this.moti = await this.getMotiFromJson()
            this.saveMoti();
        }

        return this.moti;
    }


    getMotiFromJson(): Promise<Motus[]>{
        return fetch('/emotions.json')
              .then(resp => resp.json())
    }

    saveMoti(){
        localStorage.setItem('moti', JSON.stringify(this.moti));
        return this.moti;
    }

    addMotus(motus: Motus){
        this.moti.push(motus);
        this.saveMoti();
        return this.moti;
    }
}