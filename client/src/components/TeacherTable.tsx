import { useState, useEffect } from "react";
import Card from "./Card";
import { IoIosAdd } from "react-icons/io";

import {
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { useDisclosure } from "@chakra-ui/hooks";
import { FaEdit } from "react-icons/fa";
import { useAppDispatch } from "../app/store";

import TeacherModal from "./TeacherModal";
import { FaTrash } from "react-icons/fa6";
import { deleteUser } from "../app/features/UsersSlice";
import TeacherUpdateModal from "./TeacherUpdateModal";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

type RowObj = {
  id: string;
  name: string;
  role: string;
  password: string;
  actions: string | undefined;
};

function TeacherTable(props: { tableData: any; title: string }) {
  const columnHelper = createColumnHelper<RowObj>();

  const { tableData } = props;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState(() => [...tableData]);
  const [selectedRow, setSelectedRow] = useState<RowObj | null>(null);
  const dispatch = useAppDispatch();

  const {
    isOpen: isTeacherModalOpen,
    onOpen: onTeacherModalOpen,
    onClose: onTeacherModalClose,
  } = useDisclosure();

  const {
    isOpen: isTeacherUpdateModalOpen,
    onOpen: onTeacherUpdateModalOpen,
    onClose: onTeacherUpdateModalClose,
  } = useDisclosure();

  const handleDelete = (rowObj: RowObj) => {
    dispatch(deleteUser(rowObj.id));
    setData(data.filter((item) => item.id !== rowObj.id));
  };

  const handleUpdate = (rowObj: RowObj) => {
    setSelectedRow(rowObj);
    onTeacherUpdateModalOpen();
  };

  const handleCreate = () => {
    onTeacherModalClose();
    onTeacherModalOpen();
  };

  const updateData = (id: string, name: string, password: string) => {
    setData(
      data.map((item) => {
        if (item.id === id) {
          return { ...item, name, password };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      header: () => <p className="text-sm font-bold text-gray-600">ID</p>,
      cell: (info: any) => (
        <p className="text-sm font-bold text-navy-70">{info.getValue()}</p>
      ),
    }),
    columnHelper.accessor("name", {
      id: "name",
      header: () => <p className="text-sm font-bold text-gray-600 ">NAME</p>,
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 ">{info.getValue()}</p>
      ),
    }),
    columnHelper.accessor("role", {
      id: "role",
      header: () => <p className="text-sm font-bold text-gray-600 ">ROLE</p>,
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 ">{info.getValue()}</p>
      ),
    }),
    columnHelper.accessor("password", {
      id: "password",
      header: () => (
        <p className="text-sm font-bold text-gray-600 ">PASSWORD</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 ">{info.getValue()}</p>
      ),
    }),
    columnHelper.accessor("actions", {
      id: "actions",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 ">ACTIONS</p>
      ),
      cell: (info: any) => (
        <div className="flex items-center ml-1 space-x-2">
          <button
            onClick={() => handleUpdate(info.row.original)}
            className={` flex items-center justify-center rounded-lg bg-lightPrimary p-[0.4rem]  font-medium text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 `}
          >
            <FaEdit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(info.row.original)}
            className={` flex items-center justify-center rounded-lg bg-lightPrimary p-[0.4rem]  font-medium text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-300 `}
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ]; // eslint-disable-next-line

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
  });
  return (
    <>
      <Card
        extra={"mx-auto w-4/5 h-full sm:overflow-auto px-6 col-span-3 pb-2"}
        style={{ backgroundColor: "white" }}
      >
        <header className="relative flex items-center justify-between pt-4">
          <div className="text-2xl font-bold text-blue-900">{props.title}</div>
          <button
            onClick={() => handleCreate()}
            className={`linear flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-xl font-bold text-slate-600  transition duration-200
           hover:cursor-pointer hover:bg-gray-300 `}
          >
            <IoIosAdd className="h-7 w-7" />
          </button>
        </header>

        <div className="mt-2 overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full" style={{ color: "#4a5568" }}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="!border-px !border-gray-400"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start"
                      >
                        <div className="items-center justify-between text-xs text-gray-200">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: "",
                            desc: "",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, 6)
                .map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td
                            key={cell.id}
                            className="border-white/0 py-3 text-slate-700"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>
      {selectedRow && (
        <TeacherUpdateModal
          onTeacherUpdateModalClose={onTeacherUpdateModalClose}
          isTeacherUpdateModalOpen={isTeacherUpdateModalOpen}
          user={selectedRow}
          updateData={updateData}
        />
      )}
      <TeacherModal
        onTeacherModalClose={onTeacherModalClose}
        isTeacherModalOpen={isTeacherModalOpen}
        setTeacherData={setData}
        teacherData={data}
      />
    </>
  );
}

export default TeacherTable;
