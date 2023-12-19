import React, { useEffect, useRef, useState } from "react";
import "../styles/table.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Table = () => {
  const [products, setProducts] = useState([]);
  const [clicked, setClicked] = useState("");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const url = "https://mern-stack-table.vercel.app";

  const fetchProducts = async () => {
    try {
      const response = await axios(`${url}/api/get-products`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const addOrEditProduct = async (e, type, id) => {
    e.preventDefault();
    const edit = type === "edit";
    try {
      const response = await axios.post(
        `${url}/api/${type}-product${edit ? `/${id}` : ""}`,
        {
          title,
          author,
          year,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        fetchProducts();
        setClicked("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const editProductHandler = (type, item) => {
    setClicked({
      type: "edit",
      item: {
        _id: item._id,
        title: item.title,
        author: item.author,
        year: item.publishYear,
      },
    });
    setTitle(item.title);
    setAuthor(item.author);
    setYear(item.publishYear);
  };

  const deleteProductHanler = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/delete-product/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.status === 200) {
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logOutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const formData = (type, item) => {
    const edit = type === "edit";
    const id = item ? item._id : "";
    return (
      <form
        className="product__form"
        onSubmit={(e) => addOrEditProduct(e, type, id)}
      >
        <div>
          <label htmlFor="title">Title</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            placeholder="Title"
            id="title"
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author</label>
          <input
            onChange={(e) => setAuthor(e.target.value)}
            value={author}
            type="text"
            placeholder="author"
            id="author"
            required
          />
        </div>
        <div>
          <label htmlFor="year">Publish Year</label>
          <input
            onChange={(e) => setYear(e.target.value)}
            value={year}
            type="text"
            placeholder="Publish Year"
            id="year"
            required
          />
        </div>
        <button type="submit">{edit ? "Update Field" : "Add new Field"}</button>
      </form>
    );
  };

  return (
    <div>
      <button
        onClick={() => {
          setClicked({
            type: "add",
            item: {
              _id: null,
              title: null,
              author: null,
              year: null,
            },
          });

          setTitle("");
          setAuthor("");
          setYear("");
        }}
        style={{ width: "32px", height: "32px", fontSize: "25px" }}
      >
        +
      </button>
      <button onClick={logOutHandler}>Log Out</button>

      {clicked.type === "add"
        ? formData("add")
        : clicked.type === "edit"
        ? formData("edit", clicked.item)
        : ""}

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publish Year</th>
            <th>Operations</th>
          </tr>
        </thead>

        <tbody>
          {/* {loading ? (
          <h5 className="pt-5 fw-bold">Loading.....</h5>
        ) : ( */}
          {/* data?.map((item, index) => { */}
          {products ? (
            products?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    {/* <img src={item.pho} /> */}
                    {index + 1}
                  </td>
                  <td>{item.title}</td>
                  <td>{item.author} </td>
                  <td>{item.publishYear}</td>
                  <td>
                    <button onClick={() => editProductHandler("edit", item)}>
                      Edit
                    </button>
                    <button onClick={() => deleteProductHanler(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <div>araferi</div>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
