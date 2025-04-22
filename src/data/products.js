export const products = {
  maloobtal: {
    id: 'maloobtal',
    name: 'Maloobtal',
    price: '$850.00',
    originalPrice: '$950.00',
    description: {
      es: 'Suplemento con fibra soluble y probióticos que mejora la salud intestinal en pacientes renales. Nuestro producto está especialmente formulado para mantener un equilibrio saludable en la flora intestinal mientras se adapta a las necesidades específicas de pacientes en tratamiento renal.',
      en: 'Supplement with soluble fiber and probiotics that improves intestinal health in renal patients. Our product is specially formulated to maintain a healthy balance in the intestinal flora while adapting to the specific needs of patients undergoing renal treatment.'
    },
    images: [
      '/images/productos/maloobtal.png',
      '/images/productos/maloobtalDos.png',
      '/images/productos/maloobtalFondo.png',
      '/images/productos/maloobtal2Fondo.png'
    ]
  },
  maloobtalPro: {
    id: 'maloobtalPro',
    name: 'Maloobtal Pro',
    price: '$950.00',
    description: {
      es: 'Suplemento con más fibra por porción y el mismo contenido de probióticos, pensada para necesidades específicas de apoyo digestivo. Una fórmula avanzada que proporciona beneficios adicionales para pacientes que requieren un soporte nutricional más intensivo.',
      en: 'Supplement with more fiber per serving and the same probiotic content, designed for specific digestive support needs. An advanced formula that provides additional benefits for patients requiring more intensive nutritional support.'
    },
    images: [
      '/images/productos/maloobtalPro.png',
      '/images/productos/maloobtal2Fondo.png'
    ]
  },
  rennut: {
    id: 'rennut',
    name: 'RenNut',
    price: '$720.00',
    description: {
      es: 'Aporte equilibrado de fibra, carbohidratos y probióticos que apoya la digestión y el metabolismo renal. Una fórmula completa diseñada para optimizar la función renal y mantener un sistema digestivo saludable.',
      en: 'Balanced contribution of fiber, carbohydrates and probiotics that supports digestion and renal metabolism. A complete formula designed to optimize renal function and maintain a healthy digestive system.'
    },
    flavors: [
      {
        id: 'vainilla',
        name: { es: 'Vainilla', en: 'Vanilla' },
        images: [
          '/images/productos/renNutVainilla.png',
          '/images/productos/renNutJuntos.png'
        ]
      },
      {
        id: 'chocolate',
        name: { es: 'Chocolate', en: 'Chocolate' },
        images: [
          '/images/productos/renNutChocolate.png',
          '/images/productos/renNutJuntos.png'
        ]
      }
    ],
    defaultFlavor: 'vainilla'
  },
  hemprot: {
    id: 'hemprot',
    name: 'HemProt',
    price: '$920.00',
    description: {
      es: 'Fórmula rica en proteína y nutrientes esenciales para mantener la masa muscular en pacientes con insuficiencia renal. Especialmente desarrollada para proporcionar un soporte nutricional completo durante el tratamiento de hemodiálisis.',
      en: 'Formula rich in protein and essential nutrients to maintain muscle mass in patients with renal insufficiency. Specially developed to provide complete nutritional support during hemodialysis treatment.'
    },
    flavors: [
      {
        id: 'chocolate',
        name: { es: 'Chocolate', en: 'Chocolate' },
        images: [
          '/images/productos/hemProtChocolate.png',
          '/images/productos/hemProtJuntos.png',
          '/images/productos/hemProtFondo.png'
        ]
      },
      {
        id: 'vainilla',
        name: { es: 'Vainilla', en: 'Vanilla' },
        images: [
          '/images/productos/hemProtVainilla.png',
          '/images/productos/hemProtJuntos.png',
          '/images/productos/hemProtFondo.png'
        ]
      },
      {
        id: 'fresa',
        name: { es: 'Fresa', en: 'Strawberry' },
        images: [
          '/images/productos/hemProtFresa.png',
          '/images/productos/hemProtJuntos.png',
          '/images/productos/hemProtFondo.png'
        ]
      }
    ],
    defaultFlavor: 'chocolate'
  }
}; 