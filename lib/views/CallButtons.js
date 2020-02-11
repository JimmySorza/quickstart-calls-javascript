import BaseElement from "../components/BaseElement";
import { createDiv, createLabel, createButton, replaceClassName } from "../utils/domUtil";
import { classes } from "../css/styles.js";

export default class CallButtons extends BaseElement {
  constructor({ id, parent, element } = {}) {
    super({ id, parent, element });

    this.acceptDiv = null;
    this.muteDiv = null;
    this.endDiv = null;
    this.btnEnd = null;
    this.endLabel = null;
    this.closeDiv = null;
    this.activeButtons = [];
  }

  build() {
    const element = createDiv({ className: `${classes['row']} ${classes['center']}` });
    this.element = element;

    this.acceptDiv = createDiv({ className: `${classes['column']} ${classes['center']} ${classes['hidden']}` });
    const btnAccept = createDiv({ className: `${classes['btnCircle']} ${classes['btnCall']} ${classes['btnAccept']}` });
    const acceptLabel = createLabel({ className: classes['fontSmall'], innerText: 'Accept' });
    this.acceptDiv.appendChild(btnAccept);
    this.acceptDiv.appendChild(acceptLabel);

    this.muteDiv = createDiv({ className: `${classes['column']} ${classes['center']} ${classes['hidden']}` });
    const btnMute = createDiv({ id: 'btn_mute', className: `${classes['btnCircle']} ${classes['btnCall']} ${classes['btnMute']}` });
    const muteLabel = createLabel({ className: classes['fontSmall'], innerText: 'Mute' });
    this.muteDiv.appendChild(btnMute);
    this.muteDiv.appendChild(muteLabel);

    this.endDiv = createDiv({ className: `${classes['column']} ${classes['center']} ${classes['hidden']}` });
    const btnEnd = createDiv({ className: `${classes['btnCircle']} ${classes['btnCall']} ${classes['btnEnd']}` });
    const endLabel = createLabel({ className: classes['fontSmall'], innerText: 'End' });
    this.endDiv.appendChild(btnEnd);
    this.endDiv.appendChild(endLabel);
    this.btnEnd = btnEnd;
    this.endLabel = endLabel;

    this.closeDiv = createDiv({ className: `${classes['column']} ${classes['center']} ${classes['hidden']}` });
    const btnClose = createButton({ className: `${classes['btnClose']} ${classes['fontNormal']}` });
    const closeLabel = createLabel({ innerText: 'Back to dial page' });
    btnClose.appendChild(closeLabel);
    this.closeDiv.appendChild(btnClose);

    element.appendChild(this.acceptDiv);
    element.appendChild(this.muteDiv);
    element.appendChild(this.endDiv);
    element.appendChild(this.closeDiv);

    btnAccept.onclick = () => {
      this.setAccepting();
      this.sendToParent('click_accept');
    };
    btnMute.onclick = () => {
      this.invertMuteIcon();
      this.sendToParent('click_mute');
    };
    btnEnd.onclick = () => {
      this.sendToParent('click_end');
    };
    btnClose.onclick = () => {
      this.sendToParent('click_close');
    };
  }

  invertMuteIcon() {
    const btnMute = this.muteDiv.querySelector('.' + classes['btnMute']);
    const btnUnmute = this.muteDiv.querySelector('.' + classes['btnUnmute']);
    const btnLabel = this.muteDiv.querySelector('.' + classes['fontSmall']);

    if (btnMute) {
      replaceClassName(btnMute, classes['btnMute'], classes['btnUnmute']);
      btnLabel.innerText = 'Unmute';
    }

    if (btnUnmute) {
      replaceClassName(btnUnmute, classes['btnUnmute'], classes['btnMute']);
      btnLabel.innerText = 'Mute';
    }
  }

  recvMessage(name, value) {
    switch (name) {
      case 'dialing':
        this.setDialing();
        break;
      case 'ringing':
        this.setRinging();
        break;
      case 'connected':
        this.setConnected();
        break;
      case 'ended':
        this.setEnded();
        break;
      default:
        break;
    }
  }

  setAccepting() {
    this.hideActiveButtons();
    this.showButtons(this.endDiv);
    replaceClassName(this.btnEnd, classes['btnDecline'], classes['btnEnd']);
    this.endLabel.innerText = 'End';
  }

  setDialing() {
    this.hideActiveButtons();
    this.showButtons(this.endDiv);
  }

  setRinging() {
    this.hideActiveButtons();
    this.showButtons(this.acceptDiv, this.endDiv);

    replaceClassName(this.btnEnd, classes['btnEnd'], classes['btnDecline']);
    this.endLabel.innerText = 'Decline';
  }

  setConnected() {
    this.hideActiveButtons();
    this.showButtons(this.muteDiv, this.endDiv);
  }

  setEnded() {
    this.hideActiveButtons();
    this.showButtons(this.closeDiv);
  }

  hideActiveButtons() {
    for (const btn of this.activeButtons) {
      btn.classList.add(classes['hidden']);
    }
    this.activeButtons = [];
  }

  showButtons(...btns) {
    for (const btn of btns) {
      btn.classList.remove(classes['hidden']);
    }

    this.activeButtons.push(...btns);
  }
}
