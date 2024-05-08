import Button from "@components/atoms/Button/Button";
import Table from "@components/molecules/Table/Table";
import TableBar from "@components/molecules/TableBar/TableBar";
import Error from "@components/wrappers/Error/Error";
import Loading from "@components/wrappers/Loading/Loading";
import DeleteIcon from "@icons/DeleteIcon.svg";
import {
  deleteDeleteFirmware,
  getDeviceTypes,
  getFirmware,
  postCreateFirmware,
  postUploadFile,
} from "@services/api";
import { isEmptyString } from "@services/utils/string";
import {
  TDeviceTypeResponse,
  TFirmwareSensorResponse,
  TGetManyResponse,
} from "@type/response.type";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useReducer } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import { columns } from "./firmware.columns";
import { ACTION_TYPE, ERROR_TYPE, search, store } from "./firmware.constants";
import DeleteModal from "./firmware.delete";
import { setErrorText } from "./firmware.functions";
import AddFirmware from "./firmware.modal";
import { reducer } from "./firmware.reducer";
import AdvanceSearch from "./firmware.search";

export default function Firmware() {
  //TODO: implement pagination only if API GET firmware have page and $limit as it's params
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(reducer, store);
  const router = useRouter();
  const tableData: UseQueryResult<
    { data: TGetManyResponse<TFirmwareSensorResponse[]> },
    AxiosError
  > = useQuery(
    ["getTableData", state.search, state.tablePage],
    async () =>
      await getFirmware({
        page: state.tablePage,
        limit: 10,
        version: isEmptyString(state.search.version || "")
          ? undefined
          : state.search.version,
        deviceType:
          state.search.deviceType === null ||
          isEmptyString(state.search.deviceType.value.value)
            ? undefined
            : state.search.deviceType.value.value,
        description: isEmptyString(state.search.description || "")
          ? undefined
          : state.search.description,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const onPage = Math.ceil(data.count / 10);
        if (onPage === state.tablePage) {
          dispatch({
            type: ACTION_TYPE.SET_IS_LAST_PAGE,
            payload: true,
          });
        } else {
          dispatch({
            type: ACTION_TYPE.SET_IS_LAST_PAGE,
            payload: false,
          });
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: state.tablePage,
          });
        }
      },
    }
  );

  const createFirmware = useMutation(
    ["createFirmware"],
    async () =>
      await postCreateFirmware({
        version: state.version || "",
        description: state.description || "",
        fileSize: state.file[0].size.toString(),
        fileName: "firmware-" + state.version + ".bin",
        deviceType: state.deviceType ? state.deviceType.value.value : "",
      }),
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
        dispatch({
          type: ACTION_TYPE.SET_ERROR_TYPE,
          payload: ERROR_TYPE.GENERAL,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getTableData"] });
        dispatch({
          type: ACTION_TYPE.SET_IS_ADD_FIRMWARE_MODAL_VISIBLE,
          payload: false,
        });
        dispatch({
          type: ACTION_TYPE.SET_VERSION,
          payload: "",
        });
        dispatch({
          type: ACTION_TYPE.SET_DESCRIPTION,
          payload: "",
        });
        dispatch({
          type: ACTION_TYPE.SET_FILE,
          payload: null,
        });
        dispatch({
          type: ACTION_TYPE.SET_DEVICE_TYPE,
          payload: null,
        });
      },
    }
  );

  const uploadFirmware = useMutation(
    ["uploadFirmware"],
    async (): Promise<void> => {
      const formData = new FormData();
      formData.append("file", state.file[0]);
      formData.append("filename", "firmware-" + state.version + ".bin");
      await postUploadFile(formData, "firmware-sensor");
    },
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
        dispatch({
          type: ACTION_TYPE.SET_ERROR_TYPE,
          payload: ERROR_TYPE.GENERAL,
        });
      },
      onSuccess: () => {
        createFirmware.mutate();
      },
    }
  );

  const deleteFirmware = useMutation(
    ["deleteFirmware"],
    async (id: string) => {
      await deleteDeleteFirmware(id);
    },
    {
      onError: (error) => {
        console.log(error);
        setErrorText({ dispatch, error });
      },
      onSuccess: () => {
        dispatch({
          type: ACTION_TYPE.SET_IS_DELETE_MODAL_VISIBLE,
          payload: false,
        });
        dispatch({
          type: ACTION_TYPE.SET_VERSION,
          payload: "",
        });
        dispatch({
          type: ACTION_TYPE.SET_DESCRIPTION,
          payload: "",
        });
        dispatch({
          type: ACTION_TYPE.SET_FILE,
          payload: null,
        });
        dispatch({
          type: ACTION_TYPE.SET_DEVICE_TYPE,
          payload: null,
        });
        queryClient.invalidateQueries({ queryKey: ["getTableData"] });
      },
    }
  );

  const deviceTypeData: UseQueryResult<
    { data: TGetManyResponse<TDeviceTypeResponse[]> },
    AxiosError
  > = useQuery(
    ["deviceTypeData"],
    async () =>
      await getDeviceTypes({
        page: 1,
        limit: 0,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error.response?.data);
      },
      onSuccess: ({ data }) => {
        const deviceTypeList = data.data || [];
        dispatch({
          type: ACTION_TYPE.SET_DEVICE_TYPE_DATA,
          payload: deviceTypeList,
        });
      },
    }
  );

  if (tableData.isLoading || tableData.isFetching || deleteFirmware.isLoading)
    return <Loading />;
  if (tableData.isError || deleteFirmware.isError || deviceTypeData.isError)
    return <Error router={router} />;

  return (
    <div>
      <AddFirmware
        state={state}
        dispatch={dispatch}
        createFirmware={createFirmware}
        uploadFirmware={uploadFirmware}
      />
      <DeleteModal
        deleteFirmware={deleteFirmware}
        state={state}
        dispatch={dispatch}
        onClickOk={() => {
          deleteFirmware.mutate(state.deletedFirmwareId);
        }}
      />
      <TableBar
        isResetAllButtonVisible={state.search === search ? false : true}
        onClickResetSearch={() => {
          dispatch({ type: ACTION_TYPE.RESET_SEARCH, payload: null });
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: false,
          });
        }}
        onAdvanceSearch={() =>
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: true,
          })
        }
        addNewButtonTitle="Add Firmware"
        onClickAddNew={() =>
          dispatch({
            type: ACTION_TYPE.SET_IS_ADD_FIRMWARE_MODAL_VISIBLE,
            payload: true,
          })
        }
      />
      <Table
        scrollX={800}
        tableData={tableData.data?.data.data}
        columns={[
          {
            title: "Action",
            fixed: "left",
            width: 80,
            key: "action",
            render: (record: { id: string }) => (
              <div className="w-12 pl-1 flex items-center justify-start">
                <Button
                  type="icon-outline"
                  title="Delete"
                  size="sm"
                  icon={
                    <DeleteIcon className="text-red-500 group-hover:text-white" />
                  }
                  className="!border-red-500 hover:!bg-red-500 group"
                  onClick={() => {
                    dispatch({
                      type: ACTION_TYPE.SET_DELETED_FIRMWARE_ID,
                      payload: record.id,
                    });
                    dispatch({
                      type: ACTION_TYPE.SET_IS_DELETE_MODAL_VISIBLE,
                      payload: true,
                    });
                  }}
                />
              </div>
            ),
          },
          ...columns,
        ]}
        tablePage={state.tablePage}
        isLastPage={state.isLastPage}
        onClickNext={() =>
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: state.tablePage + 1,
          })
        }
        onClickPrevious={() =>
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: state.tablePage - 1,
          })
        }
      />

      <AdvanceSearch
        dispatch={dispatch}
        state={state}
        onClickOk={() => {
          dispatch({
            type: ACTION_TYPE.SET_TABLE_PAGE,
            payload: 1,
          });
          dispatch({
            type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE,
            payload: false,
          });
          dispatch({
            type: ACTION_TYPE.SET_SEARCH,
            payload: state.inputSearch,
          });
        }}
      />
    </div>
  );
}
