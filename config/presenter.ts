export enum PresenterState {
  Waiting,
  Typing,
}

export function getPresenterStateText(state: PresenterState) {
  switch (state) {
    case PresenterState.Waiting:
      return "waiting";
    case PresenterState.Typing:
      return "typing";
  }
}
