import { ACTIONS, TState } from "./create.constants";

export function reducer(
  prevState: TState,
  action: { payload: any; type: string }
) {
  const { data } = action.payload;
  switch (action.type) {
    case ACTIONS.SET_ERROR_TYPE:
      return { ...prevState, errorType: data };
    case ACTIONS.SET_ERROR_TEXT:
      return { ...prevState, errorText: data };
    case ACTIONS.SET_IS_CONFIRMATION_MODAL_VISIBLE:
      return { ...prevState, isConfirmationModalVisible: data };
    case ACTIONS.SET_SAVE_AS_FINAL:
      return { ...prevState, saveAsFinal: data };

    case ACTIONS.SET_DATE:
      return { ...prevState, date: data };
    case ACTIONS.SET_TRUCK_LICENSE_PLATE:
      return { ...prevState, truckLicensePlate: data };
    case ACTIONS.SET_DRIVER:
      return { ...prevState, driver: data };
    case ACTIONS.SET_WEIGHING_NUMBER:
      return { ...prevState, weighingNumber: data };
    case ACTIONS.SET_HARVEST_BASKET_NAME:
      return { ...prevState, harvestBasketName: data };
    case ACTIONS.SET_DELIVERY_ORDER:
      return { ...prevState, deliveryOrder: data };
    case ACTIONS.SET_TOTAL:
      return { ...prevState, total: data };
    case ACTIONS.SET_STATUS:
      return { ...prevState, status: data };

    case ACTIONS.SET_WEIGHING_DATA:
      return { ...prevState, records: data };
    case ACTIONS.SET_DETAIL_HARVEST_DATA:
      return { ...prevState, detailHarvestData: data };
    default:
      throw new Error("Reducer failure!");
  }
}
