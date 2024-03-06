export function useGameId() {
  const { params } = useRoute();

  return Number.parseInt(params.gameId.toString(), 10);
}
