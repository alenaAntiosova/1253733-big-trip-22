import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, DEFAULT_TYPE } from '../utils/const.js';
import FormEdit from '../view/waypoints-edit.js';

export default class NewEventPresenter {

  #pointsList;
  #handleDataChange;
  #handleDestroy;
  #destinationModel;
  #offersModel;

  #formComponent = null;

  constructor({ pointsList, onDataChange, onClose, destinationModel, offersModel }) {
    this.#pointsList = pointsList;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onClose;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
  }

  init() {
    if (this.#formComponent !== null) {
      return;
    }

    this.#formComponent = new FormEdit({
      waypoint: { type: DEFAULT_TYPE, basePrice: 0 },
      offers: [],
      destination: { name: '', pictures: [], description: '' },
      offersType: this.#offersModel.getOffersByType(DEFAULT_TYPE),
      destinationAll: this.#destinationModel.destinations,
      offersAll: [...this.#offersModel.offers],
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      isEditMode: false,
    });

    render(this.#formComponent, this.#pointsList.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#formComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#formComponent);
    this.#formComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#formComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#formComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#formComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
