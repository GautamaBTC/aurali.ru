import { useSyncExternalStore } from "react";

type MenuState = {
  isOpen: boolean;
  isAnimating: boolean;
};

type Listener = () => void;

const state: MenuState = {
  isOpen: false,
  isAnimating: false,
};

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function setState(patch: Partial<MenuState>) {
  Object.assign(state, patch);
  emit();
}

function open() {
  if (state.isAnimating || state.isOpen) return;
  setState({ isOpen: true, isAnimating: true });
}

function close() {
  if (state.isAnimating || !state.isOpen) return;
  setState({ isOpen: false, isAnimating: true });
}

function toggle() {
  if (state.isOpen) close();
  else open();
}

function setAnimating(v: boolean) {
  setState({ isAnimating: v });
}

type Store = MenuState & {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setAnimating: (v: boolean) => void;
};

const api: Store = {
  get isOpen() {
    return state.isOpen;
  },
  get isAnimating() {
    return state.isAnimating;
  },
  open,
  close,
  toggle,
  setAnimating,
};

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Store {
  return {
    isOpen: state.isOpen,
    isAnimating: state.isAnimating,
    open: api.open,
    close: api.close,
    toggle: api.toggle,
    setAnimating: api.setAnimating,
  };
}

export function useMenuStore<T>(selector: (store: Store) => T): T {
  return useSyncExternalStore(subscribe, () => selector(getSnapshot()), () => selector(getSnapshot()));
}
