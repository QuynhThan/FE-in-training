import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import Slider from 'react-slick';
import { Component } from 'react';
import toigian from '../assets/toi-gian.jpg';
import thuongngay from '../assets/rosie2.jpg';
import dulich from '../assets/travel.png';
import dutiec from '../assets/dutiec.png';
const ProductCarousel = () => { 
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2
  };
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause='hover' className='bg-primary mb-4'>
      {/* <Slider {...settings}> */}
      {/* {products.map((product) => (
        <Carousel.Item key={product.productCode}>
        <Link to={`/product/${product.productCode}`}>
                    <Image src={product.image} alt={product.name} fluid />
                    <Carousel.Caption className='carousel-caption'>
                      <h2 className='text-white text-right'>
                        {product.name}   ({product.price} đ)
                      </h2>
                    </Carousel.Caption>
                  </Link>
        </Carousel.Item>
      ))} */}
        <Carousel.Item key={1}>
              <Link to={`search/search/Tối%20Giản`}>
                    <Image src={toigian} alt={'Tối giản'} fluid />
                    <Carousel.Caption className='carousel-caption'>
                      <h2 className='text-white text-right'>
                        Tối giản
                      </h2>
                    </Carousel.Caption>
                  </Link>
        </Carousel.Item>
        <Carousel.Item key={1}>
              <Link to={`search/search/Du%20Lịch`}>
                    <Image src={dulich} alt={'Du lịch'} fluid />
                    <Carousel.Caption className='carousel-caption'>
                      <h2 className='text-white text-right'>
                        Du lịch
                      </h2>
                    </Carousel.Caption>
                  </Link>
        </Carousel.Item>
        {/* <Carousel.Item key={1}>
              <Link to={`search/search/Thường%20Ngày`}>
                    <Image src={thuongngay} alt={'Thường Ngày'} fluid />
                    <Carousel.Caption className='carousel-caption'>
                      <h2 className='text-white text-right'>
                        Thường ngày
                      </h2>
                    </Carousel.Caption>
                  </Link>
        </Carousel.Item> */}
        <Carousel.Item key={1}>
              <Link to={`search/search/Dự%20Tiệc`}>
                    <Image src={dutiec} alt={'Dự Tiệc'} fluid />
                    <Carousel.Caption className='carousel-caption'>
                      <h2 className='text-white text-right'>
                        Dự Tiệc
                      </h2>
                    </Carousel.Caption>
                  </Link>
        </Carousel.Item>
        
      {/* </Slider> */}
      
    </Carousel>
  );
};

export default ProductCarousel ;
