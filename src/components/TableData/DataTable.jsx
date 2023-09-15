import { useState, useEffect } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";
// eslint-disable-next-line no-unused-vars
import React from "react";

library.add(faEdit, faTrash, faCheck);

const DataTable = () => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({
    name: "",
    username: "",
    email: "",
    address: { street: "" },
  });
  const [editableRow, setEditableRow] = useState(null);
  const [tempRow, setTempRow] = useState({
    name: "",
    username: "",
    email: "",
    address: "",
  });

  const loadDataFromLocalStorage = () => {
    const storedData = localStorage.getItem("tableData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
    }
  };

  const fetchDataFromBackend = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const jsonData = await response.json();
      // Обновляем состояние данными из API
      setData(jsonData);
      localStorage.setItem("tableData", JSON.stringify(jsonData));
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  useEffect(() => {
    // Загружаем данные из локального хранилища при монтировании компонента
    loadDataFromLocalStorage();
    // Затем загружаем данные из API и обновляем состояние
    fetchDataFromBackend();
  }, []);

  const addRow = () => {
    if (newRow.name && newRow.username && newRow.email && newRow.address) {
      const updatedData = [...data, newRow];
      setData(updatedData);
      // Обновляем данные в локальном хранилище при добавлении новой записи
      localStorage.setItem("tableData", JSON.stringify(updatedData));
      setNewRow({ name: "", username: "", email: "", address: { street: "" } });
    }
  };

  const deleteRow = (index) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
    localStorage.setItem("tableData", JSON.stringify(updatedData));
  };

  const startEditing = (index) => {
    setTempRow({ ...data[index] });
    setEditableRow(index);
  };

  const saveEdit = (index) => {
    const updatedData = [...data];
    updatedData[index] = tempRow;
    setData(updatedData);
    localStorage.setItem("tableData", JSON.stringify(updatedData));
    setEditableRow(null);
  };

  return (
    <div className="container">
      <div className="tablecont">
        <table className="table">
          <thead className="thead">
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Street</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={index}>
                <td className="td">
                  {editableRow === index ? (
                    <input
                      type="text"
                      value={tempRow.name}
                      onChange={(e) =>
                        setTempRow({ ...tempRow, name: e.target.value })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="td">
                  {editableRow === index ? (
                    <input
                      type="text"
                      value={tempRow.username}
                      onChange={(e) =>
                        setTempRow({ ...tempRow, username: e.target.value })
                      }
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td className="td">
                  {editableRow === index ? (
                    <input
                      type="text"
                      value={tempRow.email}
                      onChange={(e) =>
                        setTempRow({ ...tempRow, email: e.target.value })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="td">
                  {editableRow === index ? (
                    <input
                      type="text"
                      value={tempRow.address.street}
                      onChange={(e) =>
                        setTempRow({
                          ...tempRow,
                          address: {
                            ...tempRow.address,
                            street: e.target.value,
                          },
                        })
                      }
                    />
                  ) : (
                    user.address.street
                  )}
                </td>
                <td className="action">
                  {editableRow === index ? (
                    <button onClick={() => saveEdit(index)}>
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  ) : (
                    <>
                      <button onClick={() => startEditing(index)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => deleteRow(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="createDate">
        <h1>Create Data</h1>
        <input
          type="text"
          placeholder="Name"
          value={newRow.name}
          onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Username"
          value={newRow.username}
          onChange={(e) => setNewRow({ ...newRow, username: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          value={newRow.email}
          onChange={(e) => setNewRow({ ...newRow, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Street"
          value={newRow.address.street}
          onChange={(e) =>
            setNewRow({
              ...newRow,
              address: { ...newRow.address, street: e.target.value },
            })
          }
        />
        <button onClick={addRow}>Добавить запись</button>
      </div>
    </div>
  );
};

export default DataTable;
