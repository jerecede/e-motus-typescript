import Location from "../model/location";
import Motus from "../model/motus";

export default class MotusDialog extends HTMLElement{

    dialog: HTMLDialogElement;

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        //crezione dialog da aggiungere dentro il shadowRoot, motus-dialog
        this.dialog = document.createElement('dialog');
    }

    connectedCallback(){
        //style e render della motus-dialog
        this.styling();
        this.render()
    }

    styling(){
        const style = document.createElement('style');
        style.innerText = `
            .dialog-form{
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
        `
        this.shadowRoot!.appendChild(style);
    }

    render(){
        this.dialog.id = 'dialog';

        //creazione della form dentro la dialog
        this.dialog.innerHTML = `
        <form id="form" class="dialog-form">
            <label for="motus">How are you feeling today?</label>

            <div>
            <input type="radio" id="motus0" name="motusValue" value="0">
            <label for="motus0">😭</label>

            <input type="radio" id="motus1" name="motusValue" value="1">
            <label for="motus1">😟</label>

            <input type="radio" id="motus2" name="motusValue" value="2">
            <label for="motus2">😐</label>

            <input type="radio" id="motus3" name="motusValue" value="3">
            <label for="motus3">🙂</label>

            <input type="radio" id="motus4" name="motusValue" value="4">
            <label for="motus4">😃</label>
            </div>

            <div>
            <label for="note">Explain why:</label>
            <textarea name="note" id="note"></textarea>
            </div>

            <div>
            <input type="checkbox" name="location" id="location">
            <label for="location">share location</label>
            </div>
        </form>
        `;
        
        //creazione dei bottoni appesi poi dentro la dialog(con dentro il form)

        //bottone che chiude la dialog
        const cancelBtn = document.createElement('button');
        cancelBtn.appendChild(document.createTextNode('cancel'))
        cancelBtn.addEventListener('click', () => {
            this.clearForm();
            this.dialog.close();
        });
        this.dialog.appendChild(cancelBtn);

        //bottone che chiama la funzione dispatchMotus(),
        // (1) con la funzione prende i dati inseriti nella form e li spedisce come eventoc
        // (2) prima di chiudere la dialog pulisce il form cosi non lo si trova gia compilato
        // (3) dopo chiude la dialog
        const confirmBtn = document.createElement('button');
        confirmBtn.appendChild(document.createTextNode('confirm'))
        confirmBtn.addEventListener('click', () => {
                this.dispatchMotus();
                this.clearForm();
                this.dialog.close();
        });
        this.dialog.appendChild(confirmBtn);

        //creazione container dei buttons, e ci appendo i button
        const btnsContainer = document.createElement('div');
        btnsContainer.appendChild(cancelBtn);
        btnsContainer.appendChild(confirmBtn);

        //container dei buttons appeso alla dialog
        this.dialog.appendChild(btnsContainer);

        //dialog appesa a shadowRoot, motus-dialog
        this.shadowRoot!.appendChild(this.dialog);
    }

    //prende i dati inseriti nella form, aggiunge tra i dati il TimeStamp, e li spedisce come evento, che lo leggerà motus-list, e infine chiude la dialog
    dispatchMotus(){

        //come ricava i dati dal form compilato
        const form: HTMLFormElement = this.shadowRoot!.getElementById('form') as HTMLFormElement;
        const data = new FormData(form);

        //creazione del TimeStamp
        const date = new Date();
        const creationDate = date.getTime();

        //creazione della istanza Motus from data

        const motus: Motus = {
            id: 'user1-' + creationDate,
            value: Number(data.get('motusValue') as string), //data.get non restituisce una string, ma cmq Number accetta any
            note: data.get('note') as string,
            creationDate: creationDate
            //location non è obbligatorio
        }
        
        //creazione dell'evento(con dentro Motus) e dispatch dell'evento
        const event = new CustomEvent('motus-added', {detail: motus})
        this.dispatchEvent(event);
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
        //apre la dialog
        this.dialog.showModal();
    }

    //pulisce la form, la puliamo ogni volta che chiudiamo la dialog (es: con confirm button o cancel button)
    clearForm(){
        const form: HTMLFormElement = this.shadowRoot!.getElementById('form') as HTMLFormElement;
        if(form){
            form.reset();
        }
    }
}

customElements.define('motus-dialog', MotusDialog);