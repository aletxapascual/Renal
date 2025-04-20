import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Container1 from '../containers/about/Container1';
import Container2 from '../containers/about/Container2';
import Container3 from '../containers/about/Container3';
import Container4 from '../containers/about/Container4';
import PhotoSlideshow from '../containers/about/PhotoSlideshow';

const About = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#inicio') {
      const element = document.getElementById('inicio');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div>
      <Container1 />
      <PhotoSlideshow />
      <Container2 />
      <Container3 />
      <Container4 />
    </div>
  );
};

export default About; 