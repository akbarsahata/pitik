import { TIotTicketDataResponse } from "@type/response.type";
import {
  ACTIONS,
  TGetManyIotTicketResponse,
  TICKET_STATUS,
  TState,
} from "./task-ticketing.constants";

export const manageTablePages = ({
  data,
  tab: status,
  state,
  dispatch,
}: {
  data: TGetManyIotTicketResponse<TIotTicketDataResponse[]>;
  tab: TICKET_STATUS;
  state: TState;
  dispatch: ({ type, payload }: { type: string; payload: any }) => void;
}) => {
  const onPage = Math.ceil(data.count / 10);
  if (status === TICKET_STATUS.ALL) {
    if (onPage === state.tablePageAll.tablePage) {
      dispatch({
        type: ACTIONS.SET_TABLE_PAGE_ALL,
        payload: {
          data: {
            ...state.tablePageAll,
            isLastPage: true,
          },
        },
      });
    } else {
      dispatch({
        type: ACTIONS.SET_TABLE_PAGE_ALL,
        payload: {
          data: {
            tablePage: state.tablePageAll.tablePage,
            isLastPage: false,
          },
        },
      });
    }
  } else if (status === TICKET_STATUS.OPEN) {
    if (onPage === state.tablePageOpen.tablePage) {
      dispatch({
        type: ACTIONS.SET_TABLE_PAGE_OPEN,
        payload: {
          data: {
            ...state.tablePageOpen,
            isLastPage: true,
          },
        },
      });
    } else {
      dispatch({
        type: ACTIONS.SET_TABLE_PAGE_OPEN,
        payload: {
          data: {
            tablePage: state.tablePageOpen.tablePage,
            isLastPage: false,
          },
        },
      });
    }
  } else if (status === TICKET_STATUS.ON_MAINTENANCE) {
    if (onPage === state.tablePageOnMaintenance.tablePage) {
      dispatch({
        type: ACTIONS.SET_TABLE_PAGE_ON_MAINTENANCE,
        payload: {
          data: {
            ...state.tablePageOnMaintenance,
            isLastPage: true,
          },
        },
      });
    } else {
      dispatch({
        type: ACTIONS.SET_TABLE_PAGE_ON_MAINTENANCE,
        payload: {
          data: {
            tablePage: state.tablePageOnMaintenance.tablePage,
            isLastPage: false,
          },
        },
      });
    }
  } else if (status === TICKET_STATUS.RESOLVED) {
    if (onPage === state.tablePageResolved.tablePage) {
      dispatch({
        type: ACTIONS.SET_TABLE_PAGE_RESOLVED,
        payload: {
          data: {
            ...state.tablePageResolved,
            isLastPage: true,
          },
        },
      });
    } else {
      dispatch({
        type: ACTIONS.SET_TABLE_PAGE_RESOLVED,
        payload: {
          data: {
            tablePage: state.tablePageResolved.tablePage,
            isLastPage: false,
          },
        },
      });
    }
  } else if (status === TICKET_STATUS.OTHERS) {
    if (onPage === state.tablePageOthers.tablePage) {
      dispatch({
        type: ACTIONS.SET_TABLE_PAGE_OTHERS,
        payload: {
          data: {
            ...state.tablePageOthers,
            isLastPage: true,
          },
        },
      });
    } else {
      dispatch({
        type: ACTIONS.SET_TABLE_PAGE_OTHERS,
        payload: {
          data: {
            tablePage: state.tablePageOthers.tablePage,
            isLastPage: false,
          },
        },
      });
    }
  }
};

export const handlePagination = ({
  type,
  state,
  dispatch,
}: {
  type: "add" | "substract";
  state: TState;
  dispatch: any;
}) => {
  if (state.activeTab === TICKET_STATUS.ALL) {
    dispatch({
      type: ACTIONS.SET_TABLE_PAGE_ALL,
      payload: {
        data: {
          ...state.tablePageAll,
          tablePage:
            type === "add"
              ? state.tablePageAll.tablePage + 1
              : state.tablePageAll.tablePage - 1,
        },
      },
    });
  } else if (state.activeTab === TICKET_STATUS.OPEN) {
    dispatch({
      type: ACTIONS.SET_TABLE_PAGE_OPEN,
      payload: {
        data: {
          ...state.tablePageOpen,
          tablePage:
            type === "add"
              ? state.tablePageOpen.tablePage + 1
              : state.tablePageOpen.tablePage - 1,
        },
      },
    });
  } else if (state.activeTab === TICKET_STATUS.ON_MAINTENANCE) {
    dispatch({
      type: ACTIONS.SET_TABLE_PAGE_ON_MAINTENANCE,
      payload: {
        data: {
          ...state.tablePageOnMaintenance,
          tablePage:
            type === "add"
              ? state.tablePageOnMaintenance.tablePage + 1
              : state.tablePageOnMaintenance.tablePage - 1,
        },
      },
    });
  } else if (state.activeTab === TICKET_STATUS.RESOLVED) {
    dispatch({
      type: ACTIONS.SET_TABLE_PAGE_RESOLVED,
      payload: {
        data: {
          ...state.tablePageResolved,
          tablePage:
            type === "add"
              ? state.tablePageResolved.tablePage + 1
              : state.tablePageResolved.tablePage - 1,
        },
      },
    });
  } else if (state.activeTab === TICKET_STATUS.OTHERS) {
    dispatch({
      type: ACTIONS.SET_TABLE_PAGE_OTHERS,
      payload: {
        data: {
          ...state.tablePageOthers,
          tablePage:
            type === "add"
              ? state.tablePageOthers.tablePage + 1
              : state.tablePageOthers.tablePage - 1,
        },
      },
    });
  }
};
