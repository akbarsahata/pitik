import { TProductItemResponse } from "@type/response.type";

export const columns = [
  {
    title: "Name",
    dataIndex: "vendorName",
    key: "vendorName",
    width: 150,
    render: (record: string) => (record ? record.toUpperCase() : "-"),
  },
  {
    title: "City/Regency (Kota/Kabupaten)",
    dataIndex: ["city", "name"],
    key: ["city", "name"],
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "District (Kecamatan)",
    dataIndex: ["district", "name"],
    key: ["district", "name"],
    render: (record: string) => (record ? record : "-"),
  },
  {
    title: "SKU",
    dataIndex: "purchasableProducts",
    key: "purchasableProducts",
    render: (record: TProductItemResponse[]) =>
      record && record.length > 0 ? (
        <ul className="list-disc ml-4">
          {record.map((sku: TProductItemResponse) => (
            <li key={sku.id}>{sku.name}</li>
          ))}
        </ul>
      ) : (
        "-"
      ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 200,
    render: (record: string) =>
      record ? (
        <p className="bg-green-200 text-green-900 rounded py-0.5 text-center">
          Active
        </p>
      ) : (
        <p className="bg-red-200 text-red-900 rounded py-0.5 text-center">
          Inactive
        </p>
      ),
  },
];
