import type { PresenterState } from "../config/presenter";

export interface Player {
  name: string
  prompt: string
  state: PresenterState
  images: string[]
  selectedImage: number | undefined
}
