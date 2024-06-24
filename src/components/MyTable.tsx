import React, { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Input, Row, Table, Space } from "antd";
import { useTranslation } from "react-i18next";

const MyTable = forwardRef((props: Readonly<{
  data: any[],
  columns: any[],
  size?: "small" | "middle" | "large",
  expandable?: boolean,
  selectable?: boolean,
  searchable?: boolean,
  loading?: boolean,
  keyExtractor?: (item: any) => string,
  renderTitle?: (data: any) => React.ReactNode,
  style?: React.CSSProperties
}>, ref) => {

  const {
    data = [],
    columns = [],
    size = "middle",
    expandable = false,
    selectable = false,
    searchable = false,
    loading = false,
    keyExtractor = (item) => item.key,
    renderTitle,
    style
  } = props

  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [dataSelected, setDataSelected] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  useImperativeHandle(ref, () => ({
    setDataSelected,
    setShowSelectedOnly,
    setSearch,
    clearFilter: () => {
      setSearch("")
      setDataSelected([])
      setShowSelectedOnly(false)
    }
  }));

  const dataSearched = useMemo(
    () => {
      const searchData = data
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
        }))

      if (showSelectedOnly && dataSelected?.length) {
        const selectedKeys = new Set(dataSelected.map(keyExtractor))
        return searchData.filter((_) => selectedKeys.has(keyExtractor(_)))
      }

      return searchData
    },
    [data, search, showSelectedOnly, dataSelected]
  );

  useEffect(() => {
    if (!dataSelected?.length) return
    let allKeys = new Set(data.map(keyExtractor))
    let newDataSelected = dataSelected.filter((_) => allKeys.has(keyExtractor(_)))
    if (newDataSelected?.length === dataSelected?.length) return
    setDataSelected(newDataSelected)
  }, [data, dataSelected])

  const currentDataSource = useRef(dataSearched);
  useEffect(() => {
    currentDataSource.current = dataSearched;
  }, [dataSearched]);

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setDataSelected(selectedRows);
  };

  const rowSelection = useMemo(() => {
    const res = {
      selectedRowKeys: dataSelected.map(keyExtractor),
      onChange: onSelectChange,
      selections: [
        // Table.SELECTION_ALL,
        // Table.SELECTION_INVERT,
        // Table.SELECTION_NONE,
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
    }
    if (dataSelected?.length > 0) {
      res.selections.push({
        key: "show_selected_only",
        text: showSelectedOnly ? t("Show all") : t("Show selected only"),
        onSelect: () => setShowSelectedOnly(!showSelectedOnly),
      })
    }
    return res;
  }, [dataSelected, showSelectedOnly]);

  const _renderTitle = () => (
    <Row justify="space-between" style={{ margin: "5px" }}>
      <Row align="middle">
        <Space wrap>
          {typeof renderTitle === "function" && renderTitle(dataSelected)}
        </Space>
      </Row>

      {searchable && (
        <Input.Search
          placeholder={t("Search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: 16, marginLeft: 16, maxWidth: 300 }}
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
      title={_renderTitle}
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
})

export default MyTable;
