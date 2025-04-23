import React from 'react';
import Container1 from '../containers/about/Container1';
import Container2 from '../containers/about/Container2';
import Container3 from '../containers/about/Container3';
import Container4 from '../containers/about/Container4';
import PhotoSlideshow from '../containers/about/PhotoSlideshow';

const Acerca = () => {
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

export default Acerca; 