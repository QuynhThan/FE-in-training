import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";

import { useLoginMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
// import { toast } from "react-toastify";
import ToastServive from "react-material-toast";

const LoginScreen = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const toast = ToastServive.new({
    place: "topRight",
    duration: 2,
    maxCount: 8,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ userName, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      console.log("erorr");
    } catch (err) {
      console.log("erorr");
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="userName">
          <Form.Label>UserName</Form.Label>
          <Form.Control
            type=""
            placeholder="Enter Username"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button disabled={isLoading} type="submit" variant="primary">
          Sign In
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          New Customer?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
