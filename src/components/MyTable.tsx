import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Dropdown, Input, Row, Table, Tag, Space } from "antd";
import { useTranslation } from "react-i18next";

export default function MyTable({
  data = [],
  columns = [],
  size = "middle",
  expandable = false,
  selectable = false,
  searchable = false,
  loading = false,
  loadingOnReloadButton = false,
  onClickReload,
  onClickExport,
  onClickDelete,
  keyExtractor = (item) => item.key,
  style
}: Readonly<{
  data: any[],
  columns: any[],
  size?: "small" | "middle" | "large",
  expandable?: boolean,
  selectable?: boolean,
  searchable?: boolean,
  loading?: boolean,
  loadingOnReloadButton?: boolean,
  onClickReload?: () => void,
  onClickExport?: (data: any[], type: string) => void,
  onClickDelete?: (data: any[]) => void,
  keyExtractor?: (item: any) => string,
  style?: React.CSSProperties
}>) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [dataSelected, setDataSelected] = useState([]);

  const dataSearched = useMemo(
    () =>
      data
        .filter((row) =>
          Object.values(row).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(search.toLowerCase())
          )
        )
        .map((_) => ({
          ..._,
          key: keyExtractor(_), // inject key for antd table
        })),
    [data, search]
  );

  const currentDataSource = useRef(dataSearched);
  useEffect(() => {
    currentDataSource.current = dataSearched;
  }, [dataSearched]);

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setDataSelected(selectedRows);
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys: dataSelected.map(keyExtractor),
    onChange: onSelectChange,
    selections: [
      {
        key: "select_all",
        text: t("Select all"),
        onSelect: () => setDataSelected(currentDataSource.current),
      },
      {
        key: "invert_selection",
        text: t("Invert selection"),
        onSelect: () =>
          setDataSelected(
            currentDataSource.current.filter(
              (_) =>
                !dataSelected.find((a) => keyExtractor(a) === keyExtractor(_))
            )
          ),
      },
      {
        key: "unselect_all",
        text: t("Unselect all"),
        onSelect: () =>
          setDataSelected(
            dataSelected.filter(
              (_) =>
                !currentDataSource.current.find(
                  (a) => keyExtractor(a) === keyExtractor(_)
                )
            )
          ),
      },
    ],
  };

  const renderTitle = () => (
    <Row justify="space-between" style={{ margin: "5px" }}>
      <Row align="middle">
        <Space wrap>
          {typeof onClickReload === "function" && (
            <Button
              type="primary"
              icon={loadingOnReloadButton
                ? <i className="fa-solid fa-rotate-right fa-spin"></i>
                : <i className="fa-solid fa-rotate-right"></i>}
              onClick={onClickReload}
            >
              {t("Reload")}
            </Button>
          )}

          {typeof onClickExport === "function" && (
            <Dropdown
              menu={{
                items: [
                  { key: "json", label: ".json" },
                  { key: "csv", label: ".csv" },
                ],
                onClick: (e) => onClickExport(dataSelected, e.key),
              }}
            >
              <Button type="primary" icon={<i className="fa-solid fa-download"></i>}>
                {dataSelected?.length ? t("Export selected") : t("Export")}
              </Button>
            </Dropdown>
          )}

          {typeof onClickDelete === "function" && (
            <Button
              danger
              type="primary"
              icon={<i className="fa-solid fa-trash-can"></i>}
              onClick={() => onClickDelete(dataSelected)}
            >
              {t("Delete")}
            </Button>
          )}

          {dataSelected.length ? (
            <Tag
              closable
              onClose={() => setDataSelected([])}
              color="processing"
              style={{ marginLeft: "10px", fontWeight: "bold" }}
            >
              {t("Selected {{count}} messages", { count: dataSelected.length })}
            </Tag>
          ) : null}
        </Space>
      </Row>

      {searchable && (
        <Input.Search
          placeholder={t("Search")}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginVertical: 16, maxWidth: 300 }}
        />
      )}
    </Row>
  );

  return (
    <Table
      sticky
      fixedHeader
      size={size}
      loading={loading}
      // https://github.com/ant-design/ant-design/issues/8392#issuecomment-1201244845
      scroll={{ x: "max-content" }}
      tableLayout='auto'
      dataSource={dataSearched}
      columns={columns}
      showSorterTooltip={false}
      onChange={(pagination, filters, sorter, extra) => {
        currentDataSource.current = extra.currentDataSource ?? [];
      }}
      rowSelection={selectable ? rowSelection : false}
      expandable={expandable}
      title={renderTitle}
      pagination={{
        position: ["bottomCenter"],
        showSizeChanger: true,
        showTotal: (total, range) => t("Total {{total}} items", { total }),
        size: "default",
        // simple: true,
        style: { alignItems: "center" },
      }}
      style={style}
    />
  );
}
