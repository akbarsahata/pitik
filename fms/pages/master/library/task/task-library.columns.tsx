import { formatDate } from "@services/utils/date";
import { convertStringToHtml } from "@services/utils/string";
import { TInstructionResponse, TTriggerResponse } from "@type/response.type";

export const columns = [
  {
    title: "Task Code",
    dataIndex: "taskCode",
    key: "taskCode",
    render: (record: string) => (record ? record.toUpperCase() : "-"),
  },
  {
    title: "Task Name",
    dataIndex: "taskName",
    key: "taskName",
    render: (record: string) => record || "-",
  },
  {
    title: "Only for Harvest",
    dataIndex: "harvestOnly",
    key: "harvestOnly",
    render: (record: boolean) => (record ? "Yes" : "No"),
  },
  {
    title: "Manual Trigger",
    dataIndex: "manualTrigger",
    key: "manualTrigger",
    render: (record: boolean) => (record ? "Yes" : "No"),
  },
  {
    title: "Manual Deadline",
    dataIndex: "manualDeadline",
    key: "manualDeadline",
    render: (record: string) => record || "-",
  },
  {
    title: "Instruction",
    dataIndex: "instruction",
    key: "instruction",
    width: 350,
    render: (record: string) => (record ? convertStringToHtml(record) : "-"),
  },
  {
    title: "Active",
    width: 86,
    dataIndex: "status",
    key: "status",
    render: (record: boolean) => (record ? "Yes" : "No"),
  },
  {
    title: "Remarks",
    dataIndex: "remarks",
    key: "remarks",
    render: (record: string) => record || "-",
  },
  {
    title: "Trigger Day",
    dataIndex: "triggers",
    key: ["triggers", "id"],
    render: (record: TTriggerResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((trigger) => (
            <li key={trigger.id}>{trigger.day || "-"}</li>
          ))}
        </ul>
      ),
  },
  {
    title: "Trigger Time",
    dataIndex: "triggers",
    key: ["triggers", "id"],
    render: (record: TTriggerResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((trigger) => (
            <li key={trigger.id}>{trigger.triggerTime || "-"}</li>
          ))}
        </ul>
      ),
  },
  {
    title: "Deadline (Hours)",
    dataIndex: "triggers",
    key: ["triggers", "id"],
    render: (record: TTriggerResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((trigger) => (
            <li key={trigger.id}>{trigger.deadline || "-"}</li>
          ))}
        </ul>
      ),
  },
  {
    title: "Additional Data Required",
    width: 200,
    dataIndex: "instructions",
    key: ["instructions", "id"],
    render: (record: TInstructionResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((instruction) => (
            <li key={instruction.id}>
              {instruction.needAdditionalDetail ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      ),
  },
  {
    title: "Data Instruction",
    dataIndex: "instructions",
    key: ["instructions", "id"],
    render: (record: TInstructionResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((instruction) => (
            <li key={instruction.id}>{instruction.dataInstruction || "-"}</li>
          ))}
        </ul>
      ),
  },
  {
    title: "Data Type",
    dataIndex: "instructions",
    key: ["instructions", "id"],
    render: (record: TInstructionResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((instruction) => (
            <li key={instruction.id}>{instruction.dataType || "-"}</li>
          ))}
        </ul>
      ),
  },
  {
    title: "Data Option",
    dataIndex: "instructions",
    key: ["instructions", "id"],
    render: (record: TInstructionResponse[]) =>
      record &&
      record.map((instruction) => (
        <ul key={instruction.id} className="list-disc ml-1">
          <li>
            {(instruction.dataOption &&
              JSON.parse(instruction.dataOption).map(
                (option: { id: string; name: string }) => (
                  <span key={option.id}>{option.name + "; "}</span>
                )
              )) ||
              "-"}
          </li>
        </ul>
      )),
  },
  {
    title: "Variable Name",
    dataIndex: "instructions",
    key: ["instructions", "id"],
    render: (record: TInstructionResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((instruction) => (
            <li key={instruction.id}>
              {(instruction.variable && instruction.variable.variableName) ||
                "-"}
            </li>
          ))}
        </ul>
      ),
  },
  {
    title: "Data Operator",
    dataIndex: "instructions",
    key: ["instructions", "id"],
    render: (record: TInstructionResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((instruction) => (
            <li key={instruction.id}>
              {instruction.dataOperator == "" ? "-" : instruction.dataOperator}
            </li>
          ))}
        </ul>
      ),
  },
  {
    title: "Feed Brand",
    dataIndex: "instructions",
    key: ["instructions", "id"],
    render: (record: TInstructionResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((instruction) => (
            <li key={instruction.id}>
              {instruction.feedbrand?.feedbrandName || "-"}
            </li>
          ))}
        </ul>
      ),
  },
  {
    title: "Photo Required",
    dataIndex: "instructions",
    key: ["instructions", "id"],
    render: (record: TInstructionResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((instruction) => (
            <li key={instruction.id}>
              {instruction.photoRequired === 0
                ? "No"
                : instruction.photoRequired === 1
                ? "Yes"
                : "Optional"}
            </li>
          ))}
        </ul>
      ),
  },
  {
    title: "Photo Instruction",
    dataIndex: "instructions",
    key: ["instructions", "id"],
    render: (record: TInstructionResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((instruction) => (
            <li key={instruction.id}>{instruction.photoInstruction || "-"}</li>
          ))}
        </ul>
      ),
  },
  {
    title: "Video Required",
    dataIndex: "instructions",
    key: ["instructions", "id"],
    render: (record: TInstructionResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((instruction) => (
            <li key={instruction.id}>
              {instruction.videoRequired === 0
                ? "No"
                : instruction.videoRequired === 1
                ? "Yes"
                : "Optional" || "-"}
            </li>
          ))}
        </ul>
      ),
  },
  {
    title: "Video Instruction",
    dataIndex: "instructions",
    key: ["instructions", "id"],
    render: (record: TInstructionResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((instruction) => (
            <li key={instruction.id}>{instruction.videoInstruction || "-"}</li>
          ))}
        </ul>
      ),
  },
  {
    title: "Additional Data Available",
    width: 200,
    dataIndex: "instructions",
    key: ["instructions", "id"],
    render: (record: TInstructionResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((instruction) => (
            <li key={instruction.id}>
              {instruction.needAdditionalDetail ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      ),
  },
  {
    title: "Check For Data Correctness",
    width: 220,
    dataIndex: "instructions",
    key: ["instructions", "id"],
    render: (record: TInstructionResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((instruction) => (
            <li key={instruction.id}>
              {instruction.checkDataCorrectness ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      ),
  },
  {
    title: "Details",
    dataIndex: "instructions",
    key: ["instructions", "id"],
    width: 350,
    render: (record: TInstructionResponse[]) =>
      record && (
        <ul className="list-disc ml-1">
          {record.map((instruction) => (
            <li key={instruction.id}>
              {convertStringToHtml(instruction.additionalDetail || "-")}
            </li>
          ))}
        </ul>
      ),
  },
  {
    title: "Last Modified By",
    dataIndex: "modifiedBy",
    key: "modifiedBy",
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "Last Modified Date",
    dataIndex: "modifiedDate",
    key: "modifiedDate",
    render: (record: string) => (record ? formatDate(record) : "-"),
  },
];
