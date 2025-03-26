import Location from "../model/location";
import Motus from "../model/motus";
import MotusService from "../services/motus-service";
import MotusCard from "./motus-card";

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

        this.moti = await this.service.loadMoti();

        this.styling();
        this.render();
    }

    styling(){
        const style = document.createElement('style');
        style.innerText = `
            .grid{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 16px;
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

        let container = this.shadowRoot!.getElementById('container');

        if(container){
            container.innerHTML = '';
        } else {
            container = document.createElement('div');
            container.id = "container"; // container.setAttribute("id", "container")
            this.shadowRoot!.appendChild(container);
        }

        const main = document.createElement('div');
        main.classList.add('grid')
    
        for (let i=0; i < this.moti.length; i++) {
            const motus = this.moti[i];
            
            const card: MotusCard = document.createElement('motus-card') as MotusCard;
            card.setAttribute('selected-motus', JSON.stringify(motus));

            main.appendChild(card)
        }

        container.appendChild(main)

        const addBtn = document.createElement('button');
        addBtn.classList.add('add-btn');
        addBtn.appendChild(document.createTextNode("➕"));
        addBtn.addEventListener('click', () => this.addRandomMotus())
        container.appendChild(addBtn)
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

        const id = 'user1' + creationDate

        const location: Location = {
            "lat": 44.40897174104969,
            "lng": 8.929527831366816
        }

        const motus: Motus = {
            id: id,
            value: value,
            note: note,
            creationDate: creationDate,
            location: location
        } 

        console.log(motus);

        //salavrlo nel servizio
        //render
    }

}


customElements.define('motus-list', MotusList);