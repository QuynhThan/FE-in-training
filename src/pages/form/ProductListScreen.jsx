import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, Form } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Old/Message";
import Loader from "../../components/Old/Loader";
import Paginate from "../../components/Old/Paginate";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useGetProductDetailsQuery,
} from "../../slices/productsApiSlice";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import React, { useMemo } from "react";
import FormContainer from "../../components/Old/FormContainer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MaterialReactTable from "material-react-table";
import {
  Box,
  FormControl,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductListScreen = () => {
  //
  const [productCode, setProductCode] = useState("");
  const product = null;
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("Active");
  const [type, setType] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [size, setSize] = useState("S");

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();
  const formData = new FormData();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        const response = await createProduct({
          productCode,
          name,
          price,
          image,
          status,
          type,
          description,
          countInStock,
          size,
        }).unwrap();
        toast.success("Product Created");

        if (file) {
          formData.append("files", file);
          formData.append("productCode", response.productCode);
          const res = await uploadProductImage(formData).unwrap();
          setImage(res.imageData);
        }
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
      // try {
      //   const res = await uploadProductImage(formData).unwrap();
      //   toast.success();
      //   setImage(res.imageData);
      // } catch (err) {
      //   toast.error(err?.data?.message || err.error);
      // }
      refetch();
      navigate("/admin/productlist");
    }
  };

  useEffect(() => {
    if (product) {
      setProductCode(product.productCode);
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setStatus(product.status);
      setType(product.type);
      setSize(product.size);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = (e) => {
    var files = e.target.files;
    setFile(files[0]);
    // for(let i = 0; i < files.length; i++){
    //   formData.append('files', files[i]);
    // }
    console.log(formData.getAll("files"));
  };
  //
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  // const createProductHandler = async () => {
  //   if (window.confirm('Are you sure you want to create a new product?')) {
  //     try {
  //       await createProduct();
  //       refetch();
  //     } catch (err) {
  //       toast.error(err?.data?.message || err.error);
  //     }
  //   }
  // };
  const columns = useMemo(() => [
    {
      accessorKey: "productCode",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "NAME",
    },
    {
      accessorKey: "price", //normal accessorKey
      header: "PRICE",
    },
    {
      accessorKey: "type",
      header: "CATEGORY",
    },
    {
      accessorKey: "status",
      header: "STATUS",
    },
    //   {

    //     header: "ACTION",
    // },
  ]);
  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: "dark",
      },
    })
  );

  return (
    <>
      <div className="table-container">
        <Row className="align-items-center">
          <Col>
            <h1>Products</h1>
          </Col>
          {/* <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col> */}
        </Row>

        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message}</Message>
        ) : (
          <>
            <ThemeProvider theme={theme}>
              <MaterialReactTable
                columns={columns}
                data={data.products}
                enableRowActions
                renderRowActionMenuItems={({ row }) => (
                  <Box sx={{ display: "flex", gap: "1rem" }}>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => console.log(row)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        variant="danger"
                        color="error"
                        onClick={() => deleteHandler(row.productCode)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              />
            </ThemeProvider>
            {/* <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>STATUS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product.productCode}>
                  <td>{product.productCode}</td>
                  <td>{product.name}</td>
                  <td>{product.price} đ</td>
                  <td>{product.type}</td>
                  <td>{product.status}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product.productCode}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product.productCode)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} /> */}

            <FormControl>
              <h1>Create Product</h1>
              {loadingCreate && <Loader />}
              {isLoading ? (
                <Loader />
              ) : error ? (
                <Message variant="danger">{error.data.message}</Message>
              ) : (
                <FormControl onSubmit={submitHandler}>
                  <TextField
                    id="productCode"
                    label="Outlined secondary"
                    color="info"
                    focused
                  >
                    <Form.Label>Product Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter product code"
                      required
                      value={productCode}
                      onChange={(e) => setProductCode(e.target.value)}
                    ></Form.Control>
                  </TextField>

                  <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="name"
                      required
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  {/* <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                multiple
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                label='Choose File'
                onChange={uploadFileHandler}
                type='file'
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group controlId='Status'>
              <Form.Label>Status</Form.Label>
              <Form.Control
                type='text'
                required
                placeholder='Enter status'
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                // disabled
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='Size'>
              <Form.Label>Size</Form.Label>
              <Form.Control
                as='select'
                value={size}
                onChange={(e) =>
                  setSize(e.target.value)
                }
              >
              <option key={1} value={'S'}>
                {'S'}
              </option>
              <option key={2} value={'M'}>
                {'M'}
              </option>
              <option key={3} value={'L'}>
                {'L'}
              </option>
              <option key={4}value={'XL'}>
                {'XL'}
              </option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId='type'>
              <Form.Label>Type</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter type'
                value={type}
                onChange={(e) => setType(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group> */}

                  <Button
                    type="submit"
                    variant="primary"
                    style={{ marginTop: "1rem" }}
                  >
                    Create
                  </Button>
                </FormControl>
              )}
            </FormControl>
          </>
        )}
      </div>
    </>
  );
};

export default ProductListScreen;
