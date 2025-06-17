export const products = {
  hemprot: {
    id: 'hemprot',
    name: 'HemProt',
    price: '$670.00',
    shortDescription: {
      es: 'Suplemento alto en proteína a base de albúmina de huevo, ideal para pacientes en diálisis. Bajo en sodio, fósforo y potasio.',
      en: 'High-protein supplement based on egg albumin, ideal for dialysis patients. Low in sodium, phosphorus and potassium.'
    },
    description: {
      es: 'Hemprot es un suplemento nutricional en polvo elaborado con albúmina de huevo y fructanos de agave, diseñado especialmente para pacientes en diálisis peritoneal o hemodiálisis que presentan desnutrición. Su fórmula aporta 20 gramos de proteína por cada 70 gramos de producto, lo que lo hace ideal para aumentar el aporte calórico y proteico sin comprometer el riñón, ya que es bajo en sodio, fósforo y potasio.',
      en: 'Hemprot is a powdered nutritional supplement made with egg albumin and agave fructans, specially designed for patients in peritoneal dialysis or hemodialysis who are malnourished. Its formula provides 20 grams of protein per 70 grams of product, making it ideal for increasing caloric and protein intake without compromising the kidney, as it is low in sodium, phosphorus and potassium.'
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
    defaultFlavor: 'chocolate',
    fichaTecnica: '/fichasTecnicas/hemprot.pdf',
    preparation: {
      es: 'Disolver 3 scoops en 200 ml de agua.',
      en: 'Dissolve 3 scoops in 200 ml of water.'
    }
  },
  rennut: {
    id: 'rennut',
    name: 'RenNut',
    price: '$670.00',
    shortDescription: {
      es: 'Suplemento nutricional con L-carnitina, bajo en proteína. Diseñado para pacientes renales sin diálisis que requieren calorías sin sobrecargar al riñón.',
      en: 'Nutritional supplement with L-carnitine, low in protein. Designed for renal patients without dialysis who require calories without overloading the kidney.'
    },
    description: {
      es: 'Rennut es un polvo nutricional formulado a base de L-carnitina y fructanos de agave, diseñado para pacientes con enfermedad renal crónica sin tratamiento de sustitución (sin diálisis). Su contenido proteico es reducido (5 g por cada 70 g), por lo que permite mejorar la calidad nutricional del paciente sin aportar un exceso de proteína. También es bajo en sodio, fósforo y potasio, lo que lo hace seguro para el riñón.',
      en: 'Rennut is a nutritional powder formulated with L-carnitine and agave fructans, designed for patients with chronic kidney disease without replacement therapy (without dialysis). Its protein content is reduced (5g per 70g), allowing it to improve the patient\'s nutritional quality without providing excess protein. It is also low in sodium, phosphorus and potassium, making it safe for the kidney.'
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
      },
      {
        id: 'fresa',
        name: { es: 'Fresa', en: 'Strawberry' },
        images: [
          '/images/productos/renNutJuntos.png'
        ]
      }
    ],
    defaultFlavor: 'vainilla',
    fichaTecnica: '/fichasTecnicas/rennut.pdf',
    preparation: {
      es: 'Disolver 3 scoops en 200 ml de agua.',
      en: 'Dissolve 3 scoops in 200 ml of water.'
    }
  },
  maloobtal: {
    id: 'maloobtal',
    name: 'Maloobtal',
    price: '$350.00',
    shortDescription: {
      es: 'Bicarbonato de sodio en dosis práctica para corregir acidosis metabólica en pacientes con enfermedad renal crónica.',
      en: 'Sodium bicarbonate in practical doses to correct metabolic acidosis in patients with chronic kidney disease.'
    },
    description: {
      es: 'Maloobtal contiene 1 gramo de bicarbonato de sodio por dosis y está indicado para el tratamiento de la acidosis metabólica en pacientes con enfermedad renal crónica. Esta condición ocurre cuando el riñón pierde la capacidad de eliminar ácidos o reabsorber bicarbonato, afectando el equilibrio del pH en sangre. Maloobtal ayuda a neutralizar el exceso de acidez, mejorando el pH, reduciendo el riesgo cardiovascular y contribuyendo al bienestar metabólico del paciente renal.',
      en: 'Maloobtal contains 1 gram of sodium bicarbonate per dose and is indicated for the treatment of metabolic acidosis in patients with chronic kidney disease. This condition occurs when the kidney loses its ability to eliminate acids or reabsorb bicarbonate, affecting blood pH balance. Maloobtal helps neutralize excess acidity, improving pH, reducing cardiovascular risk and contributing to the metabolic well-being of the renal patient.'
    },
    images: [
      '/images/productos/maloobtal.png',
      '/images/productos/maloobtalDos.png',
      '/images/productos/maloobtalFondo.png',
      '/images/productos/maloobtal2Fondo.png'
    ],
    fichaTecnica: '/fichasTecnicas/maloobtal.pdf'
  },
  maloobtalPro: {
    id: 'maloobtalPro',
    name: 'Maloobtal Pro',
    price: '$700.00',
    shortDescription: {
      es: 'Simbiótico con probióticos encapsulados y fibra de agave. Ayuda a reducir síntomas digestivos y urémicos en hemodiálisis.',
      en: 'Symbiotic with encapsulated probiotics and agave fiber. Helps reduce digestive and uremic symptoms in hemodialysis.'
    },
    description: {
      es: 'Maloobtal Pro es un simbiótico avanzado que combina inulina de agave (fibra prebiótica) con bacterias vivas Lactobacillus rhamnosus y Bifidobacterium longum, formuladas con tecnología de microencapsulado, lo que permite mantener su viabilidad sin necesidad de refrigeración. Este producto es útil para mejorar síntomas frecuentes en pacientes con uremia en hemodiálisis, como náusea, vómito, estreñimiento, diarrea o prurito, ayudando a mantener el equilibrio intestinal y mejorar la calidad de vida.',
      en: 'Maloobtal Pro is an advanced symbiotic that combines agave inulin (prebiotic fiber) with live bacteria Lactobacillus rhamnosus and Bifidobacterium longum, formulated with microencapsulation technology, which allows maintaining their viability without refrigeration. This product is useful for improving frequent symptoms in patients with uremia in hemodialysis, such as nausea, vomiting, constipation, diarrhea or pruritus, helping to maintain intestinal balance and improve quality of life.'
    },
    images: [
      '/images/productos/maloobtalPro.png',
      '/images/productos/maloobtal2Fondo.png'
    ],
    fichaTecnica: '/fichasTecnicas/maloobtalPro.pdf'
  }
}; 