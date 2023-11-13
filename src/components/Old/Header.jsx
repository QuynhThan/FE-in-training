import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useLogoutMutation } from '../../slices/usersApiSlice';
import { logout } from '../../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo1.png';
import { resetCart } from '../../slices/cartSlice';
import { useGetFilterQuery } from '../../slices/productsApiSlice';
import Loader from './Loader';
import Message from './Message';
import { useEffect, useState } from 'react';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [fields, setFields] = useState([]);
  const { keyword: urlKeyword, field: urlField } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');
  const [field, setField] = useState(urlField || '')
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: filters,
    isLoading,
    refetch,
    error,
  } = useGetFilterQuery();
  useEffect(() => {
    console.log(fields);
    setFields(filters);
  }, [filters]);
  const [logoutApiCall] = useLogoutMutation();
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      // NOTE: here we need to reset cart state for when a user logs out so the next
      // user doesn't inherit the previous users cart and shipping
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <img src={logo} alt='Q-Shop' style={{marginRight: '20px'}} />
              Q-Shop
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <SearchBox />
              {isLoading ? (
                <Loader />
              ) : error ? (
                <Message variant='danger'>{error.data.message}</Message>
              ) : (
              <>
                  <NavDropdown title='Filter' id='filter'>
                    {console.log(fields)}
                    {fields && fields.map((element) => (
                      <LinkContainer to={`/search/search/${element}`}>
                        <NavDropdown.Item >{element}</NavDropdown.Item>
                        </LinkContainer>
                    ))}
                    
                  </NavDropdown>
                </>
              )}
              {!userInfo || (userInfo && !userInfo.isAdmin) && (
                <LinkContainer to='/cart'>
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              )}
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.actor.name} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  {/* <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer> */}
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
