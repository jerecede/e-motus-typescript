import Location from "../model/location-interface";
import Motus from "../model/motus";
import MotusService from "../services/motus-service";
import MotusCard from "./motus-card";
import MotusDialog from "./motus-dialog";

export default class MotusList extends HTMLElement {

    service: MotusService;
    moti: Motus[];

    constructor() {
        super()
        this.attachShadow({mode: 'open'});
        this.service = new MotusService();
        this.moti = [];
    }

    async connectedCallback(){

        //scarica dalla memoria locale i moti, o se non ci sono, li scarica dal json
        this.moti = await this.service.loadMoti();

        //test sort
        console.log(this.moti);
        console.log(this.moti.sort((m1, m2) => m1.compareByDate(m2)));

        //vede se è stato spedito un evento(l'evento di aggiungere Motus, motus-added) dentro motus-dialog.
        //l'evento contiene i dati del motus da aggiungere, una volta ricevuto, aggiunge il motus allo storage (addMotus())
        const motusDialog: MotusDialog = document.getElementById('motus-dialog') as MotusDialog;
        motusDialog.addEventListener('motus-added', (event) => { //addEventListener non prende Customevent, expects an EventListener or EventListenerObject, non posso fare parametro event: CustomEvent
            const customEvent = event as CustomEvent;
            const newMotus = customEvent.detail;
            this.moti = this.service.addMotus(newMotus);
            this.render();
        });

        //style e render dei moti
        this.styling();
        this.render();
    }

    styling(){
        const style = document.createElement('style');
        style.innerText = `
            .grid-container{
                height: 100%;
            }

            .grid{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 16px;
                height: 100%;
            }

            .add-btn{
                position: absolute;
                bottom: 12px;
                right: 12px;
                height: 64px;
                width: 64px;
                border-radius: 32px;
                border: none;
                font-size: 30px;
                background-color: pink;
            }
        `
        this.shadowRoot!.appendChild(style);
    }

    render(){

        //container div principale
        let container = this.shadowRoot!.getElementById('container');

        //se c'è container, lo svuoto(per non crearne più di uno), altrimenti lo creo (perchè prima volta)
        if(container){
            container.innerHTML = '';
        } else {
            container = document.createElement('div');
            container.classList.add('grid-container');
            container.id = "container"; // container.setAttribute("id", "container")
            this.shadowRoot!.appendChild(container);
        }

        //main div che contiene le motus cards, appeso a container
        const main = document.createElement('div');
        main.classList.add('grid')
    
        for (let i=0; i < this.moti.length; i++) {
            const motus = this.moti[i];
            //creazione delle motus card, appese a main
            const card: MotusCard = document.createElement('motus-card') as MotusCard;
            //per ogni motus-card prende un motus e mette i suoi dati nell'attributo selected-motus, JSON stringifati
            card.setAttribute('selected-motus', JSON.stringify(motus));

            main.appendChild(card)
        }
        container.appendChild(main)

        //creazione button per aggiungere un nuovo motus (motus card), appeso a container
        const addBtn = document.createElement('button');
        addBtn.classList.add('add-btn');
        addBtn.appendChild(document.createTextNode("➕"));
        addBtn.addEventListener('click', () => {
            //apre dialog di motus-dialog
            this.openDialog();
        });
        container.appendChild(addBtn)
        
    }

    //apre dialog di motus-dialog per aggiungere un nuovo motus
    openDialog(){
        //ottiene il dialog di motus-dialog, con la funzione addMotus di motus-dialog lo apre, per poi aggiungere un nuovo motus
        const motusDialog: MotusDialog = document.getElementById('motus-dialog') as MotusDialog;
        motusDialog.addMotus();
    }

    addRandomMotus(){
        //create motus
        const value = Math.floor(Math.random()*5);

        const charArr = [];
        for (let i = 0; i < Math.floor((Math.random()*110)+30); i++) {
            const char = String.fromCharCode(Math.floor(Math.random()*5000));
            charArr.push(char);
        }
        const note = charArr.join('');

        const date = new Date()
        const creationDate = date.getTime();

        const id = 'user1-' + creationDate

        const location: Location = {
            lat: 44.40897174104969,
            lng: 8.929527831366816
        }

        const motus = new Motus(id, value, note, location);

        console.log(motus);

        //add motus to storage
        this.service.addMotus(motus);

        //render
        this.render();
    }

}


customElements.define('motus-list', MotusList);