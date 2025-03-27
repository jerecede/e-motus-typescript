export default class MotusBar extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.styling();
        this.render()
    }

    styling() {
        const style = document.createElement('style');
        style.innerText = `
            .bar span{
                font-size: 30px;
                padding: 0px 8px;
            }

            .bar{
                border-style: solid;
            }
        `
        this.shadowRoot!.appendChild(style);
    }

    render() {
        const mainDiv = document.createElement('div');
        mainDiv.classList.add('bar');
        mainDiv.innerHTML = `
            <span>😎</span>
            <span>E-MOTUS</span>
        `;
        this.shadowRoot!.appendChild(mainDiv);
    }

}

customElements.define('motus-bar', MotusBar)