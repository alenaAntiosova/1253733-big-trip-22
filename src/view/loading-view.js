import AbstractView from '../framework/view/abstract-view.js';
import { LoadingMessage } from '../utils/const.js';

function createLoadingTemplate(isError) {
  return (`<p class="trip-events__msg">${isError ? LoadingMessage.ERROR : LoadingMessage.READY}</p>`);
}

export default class Loading extends AbstractView {
  #isError;

  constructor({ isError }) {
    super();
    this.#isError = isError;
  }

  get template() {
    return createLoadingTemplate(this.#isError);
  }
}
