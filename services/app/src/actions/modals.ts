import { createAction } from ".";

// ------------------------------------------------------------------

export type ModalPrereqT<T extends string, P> = {
  type: T;
  props: P;
};

export type ModalPrereq =
  | ModalPrereqT<"ConnectUser", null>
  | ModalPrereqT<"CreateRoom", null>
  | ModalPrereqT<"CreateUser", null>
  | ModalPrereqT<"Search", null>
  | ModalPrereqT<"UnlockRoom", null>;

// ------------------------------------------------------------------

export type ModalsAction =
  | ReturnType<typeof closeModal>
  | ReturnType<typeof openModal>
  | ReturnType<typeof popModal>
  | ReturnType<typeof pushModal>;

// ------------------------------------------------------------------

export const openModal = (prereq: ModalPrereq) =>
  createAction("modals/OPEN", prereq);

export const closeModal = () => createAction("modals/CLOSE");

// ------------------------------------------------------------------

export const pushModal = (prereq: ModalPrereq) =>
  createAction("modals/PUSH", prereq);

export const popModal = () => createAction("modals/POP");
