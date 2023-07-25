export type ReducerStateHotSpot = {
  personsIdsOnSpot: Set<string>;
  spotIdsAndAvailability: Map<number, boolean>;
};

export type ReducerActionHotSpot =
  | {
      type: 'ADD';
      payload: {
        uuid: string;
        isDragging: boolean;
        onHotSpotDrop: () => void;
        spotId: number;
      };
    }
  | { type: 'REMOVE'; payload: string }; // TODO

export function hopSpotReducer(
  state: ReducerStateHotSpot,
  action: ReducerActionHotSpot,
): ReducerStateHotSpot {
  let personsIdsOnSpot = new Set<string>();
  let currentSpotIds = new Map();

  switch (action.type) {
    case 'ADD':
      if (!action.payload.isDragging) {
        return state;
      }
      personsIdsOnSpot = new Set(
        ...state.personsIdsOnSpot,
        action.payload.uuid,
      );

      currentSpotIds = new Map(state.spotIdsAndAvailability);
      currentSpotIds.set(action.payload.spotId, false);

      action.payload.onHotSpotDrop();
      return {
        personsIdsOnSpot,
        spotIdsAndAvailability: currentSpotIds,
      };

    case 'REMOVE':
      // TODO
      return state;

    default:
      return state;
  }
}
