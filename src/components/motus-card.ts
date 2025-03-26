import Motus from "../model/motus";

export default class MotusCard extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }


    get motus(): Motus{
        // const motusStr = this.getAttribute('selected-motus');
        // if (motusStr) {
        //     return JSON.parse(motusStr);
        // }
        // return null;


        //dal motus-card ricava dal suo attributo selected-motus i dati del suo motus,
        //(perchè motus-list ha creato i motus-card aggiungendo quell'attributo dove ci ha messo i dati strigifati)
        //e li ritorna come oggetto.
         
        return JSON.parse(this.getAttribute('selected-motus')!);
    }

    connectedCallback() {
        this.styling();
        this.render()
    }

    styling() {
        const style = document.createElement('style');
        style.innerText = `
            .card{
                border-radius: 8px;
                box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.2);
                display: flex;
            }

            .emoticon{
                font-size: 60px;
                text-align: center;
                padding: 16px 0px;
                width: 84px;
            }

            .info-container{
                justify-content: space-around;
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            .controls-container{
                display: flex;
                justify-content: flex-end;
            }

            .btn{
                background-color: white;
                border: none;
                font-size: 20px;
                padding: 0px 8px;
            }
        `
        this.shadowRoot!.appendChild(style);
    }

    render() {
        const mainDiv = document.createElement('div');
        mainDiv.classList.add('card');
        //con this.motus sta chiamando il getter motus, che ritorna l'oggetto motus
        mainDiv.innerHTML = `
            <span class="emoticon">
                ${this.fromValueToEmoji(this.motus.value)}
            </span>
            <div class="info-container">
                <span>
                    ${this.fromTimeStampToDate(this.motus.creationDate)}
                </span>
                <span>
                    ${this.motus.note}
                </span>
                <div class="controls-container">
                    <button class="btn">❌</button>
                </div>
            </div>
        `;
        this.shadowRoot!.appendChild(mainDiv);
    }

    fromValueToEmoji(value: number) {
        switch (value) {
            case 0:
                return '😭';
            case 1:
                return '😟';
            case 2:
                return '😐';
            case 3:
                return '🙂';
            default:
                return '😃';
        }
    }

    fromTimeStampToDate(timeStamp: number){
        const date = new Date(timeStamp);
        return date.toDateString() + ' - ' + date.toLocaleTimeString();
    }

}

customElements.define('motus-card', MotusCard)