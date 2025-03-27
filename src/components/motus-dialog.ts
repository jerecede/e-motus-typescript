import Location from "../model/location";
import Motus from "../model/motus";

export default class MotusDialog extends HTMLElement{

    dialog: HTMLDialogElement;

    constructor(){
        super();
        this.attachShadow({mode: 'open'})
        this.dialog = document.createElement('dialog');
    }

    connectedCallback(){
        //style e render della motus-dialog
        this.styling();
        this.render()
    }

    styling(){
        // const style = document.createElement('style');
        // style.innerText =
    }

    render(){

        //crezione dialog da aggiungere dentro il shadowRoot, motus-dialog
        this.dialog = document.createElement('dialog');
        this.dialog.id = 'dialog';

        //creazione della form dentro la dialog
        this.dialog.innerHTML = `
        <form id="form">
            <label for="motus">How are you feeling today?</label>

            <input type="radio" id="motus0" name="motus" value="0" required>
            <label for="motus0">😭</label>

            <input type="radio" id="motus1" name="motus" value="1">
            <label for="motus1">😟</label>

            <input type="radio" id="motus2" name="motus" value="2">
            <label for="motus2">😐</label>

            <input type="radio" id="motus3" name="motus" value="3">
            <label for="motus3">🙂</label>

            <input type="radio" id="motus4" name="motus" value="4">
            <label for="motus4">😃</label>

            <label for="note">Explain why:</label>
            <textarea name="note" id="note"></textarea>

            <input type="checkbox" name="location" id="location">
            <label for="location">share location</label>
        </form>
        `;
        
        //creazione dei bottoni appesi poi dentro la dialog(con dentro il form)

        //bottone che chiude la dialog
        const cancelBtn = document.createElement('button');
        cancelBtn.appendChild(document.createTextNode('cancel'))
        cancelBtn.addEventListener('click', () => this.dialog.close());
        this.dialog.appendChild(cancelBtn);

        //bottone che chiama la funzione dispatchMotus(),
        // funzione (1) che prende i dati inseriti nella form e li spedisce come evento e dopo (2) chiude la dialog
        const confirmBtn = document.createElement('button');
        confirmBtn.appendChild(document.createTextNode('confirm'))
        confirmBtn.addEventListener('click', () => {
            // let radioButtons = document.querySelectorAll('motus-dialog input[type="radio"]');
            // console.log(radioButtons);
            // let checked = Array.from(radioButtons).some(radio => (radio as HTMLInputElement).checked);
            // console.log(checked);

            // if(checked){
                this.dispatchMotus();
        });
        this.dialog.appendChild(confirmBtn);

        //dialog appesa a shadowRoot, motus-dialog
        this.shadowRoot!.appendChild(this.dialog);
    }

    //prende i dati inseriti nella form, aggiunge tra i dati il TimeStamp, e li spedisce come evento, che lo leggerà motus-list, e infine chiude la dialog
    dispatchMotus(){

        //come ricava i dati dal form compilato
        const form: HTMLFormElement = this.shadowRoot!.getElementById('form') as HTMLFormElement;
        const data = new FormData(form);

        //creazione del TimeStamp
        const date = new Date()
        const creationDate = date.getTime();

        //creazione della istanza Motus from data
        const location: Location = {
            lat: 44.40897174104969,
            lng: 8.929527831366816
        }

        const motus: Motus = {
            id: 'user1' + creationDate,
            value: Number(data.get('motus')),
            note: data.get('note') as string,
            creationDate: creationDate,
            location: location
        }
        
        //creazione dell'evento(con dentro Motus) e dispatch dell'evento
        const event = new CustomEvent('motus-added', { detail: motus })
        this.dispatchEvent(event);

        //chiusura della dialog
        this.dialog.close();
    }
    

    // dispatchStudent(){
    //     const form = this.shadow.getElementById('form');
    //     const data = new FormData(form);
    //     const student = {
    //         name: data.get('name'),
    //         yob: Number(data.get('yob'))
    //     }

    //     if(this.isEdit){
    //         const event = new CustomEvent('student-edited', {detail: {index: this.index, student: student}})
    //         this.dispatchEvent(event);
    //     } else {
    //         const event = new CustomEvent('student-added', {detail: student})
    //         this.dispatchEvent(event);
    //     }

    //     this.dialog.close();
    // }

    // setupForm(student){
    //     const form = this.shadow.getElementById('form');
    //     form.reset();
    //     if(student){
    //         const nameInput = this.shadow.getElementById('name');
    //         nameInput.value = student.name;
    //         const yobInput = this.shadow.getElementById('yob');
    //         yobInput.value = student.yob;
    //     }
    // }

    // editStudent(student, index){
    //     this.isEdit = true;
    //     this.index = index;
    //     this.setupForm(student);
    //     this.dialog.showModal();
    // }

    // addStudent(){
    //     this.isEdit = false;
    //     this.setupForm();
    //     this.dialog.showModal();
    // }

    // funzione chiamata quando viene premuto il pulsante ➕, funzione che apre la dialog che si trova dentro la motus-dialog,
    // e la dialog si occuperà di aggiungere un motus tramite un form
    addMotus(){
        //resetta il form (serve per quando aggiungo editMotus)
        const form: HTMLFormElement = this.shadowRoot!.getElementById('form') as HTMLFormElement;
        if(form){
            form.reset();
        }

        //apre la dialog
        this.dialog.showModal();
    }
}

customElements.define('motus-dialog', MotusDialog);