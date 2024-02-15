export enum PresenterState {
  Waiting,
  Typing,
  ImageSelection,
  Error,
}

export enum PresenterLayout {
  Normal,
  LargeContent,
}

export function getPresenterLayout(state: PresenterState): PresenterLayout {
  switch (state) {
    case PresenterState.Waiting:
      return PresenterLayout.Normal;
    case PresenterState.Typing:
      return PresenterLayout.LargeContent;
    case PresenterState.ImageSelection:
      return PresenterLayout.LargeContent;
    case PresenterState.Error:
      return PresenterLayout.LargeContent;
  }
}

export function getPresenterLayoutText(layout: PresenterLayout): string {
  switch (layout) {
    case PresenterLayout.Normal:
      return "normal";
    case PresenterLayout.LargeContent:
      return "large-content";
  }
}
