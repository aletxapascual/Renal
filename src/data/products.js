export const products = {
  hemprot: {
    id: 'hemprot',
    name: 'HemProt',
    price: '$670.00',
    shortDescription: {
      es: 'Suplemento alto en proteína a base de albúmina de huevo, ideal para pacientes en hemodiálisis. Bajo en sodio, fósforo y potasio.',
      en: 'High-protein supplement based on egg albumin, ideal for hemodialysis patients. Low in sodium, phosphorus and potassium.'
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
      es: 'Suplemento nutricional con L-carnitina, bajo en proteína. Diseñado para pacientes renales sin hemodiálisis que requieren calorías sin sobrecargar al riñón.',
      en: 'Nutritional supplement with L-carnitine, low in protein. Designed for renal patients without hemodialysis who require calories without overloading the kidney.'
    },
    description: {
      es: 'Rennut es un polvo nutricional formulado a base de L-carnitina y fructanos de agave, diseñado para pacientes con enfermedad renal crónica sin tratamiento de sustitución (sin hemodiálisis). Su contenido proteico es reducido (5 g por cada 70 g), por lo que permite mejorar la calidad nutricional del paciente sin aportar un exceso de proteína. También es bajo en sodio, fósforo y potasio, lo que lo hace seguro para el riñón.',
      en: 'Rennut is a nutritional powder formulated with L-carnitine and agave fructans, designed for patients with chronic kidney disease without replacement therapy (without hemodialysis). Its protein content is reduced (5g per 70g), allowing it to improve the patient\'s nutritional quality without providing excess protein. It is also low in sodium, phosphorus and potassium, making it safe for the kidney.'
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
          '/images/productos/renNutFresa2.png',
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
    name: 'Maloobtal HCO3',
    price: '$350.00',
    shortDescription: {
      es: 'Bicarbonato de sodio en dosis práctica para corregir acidosis metabólica en pacientes con enfermedad renal crónica.',
      en: 'Sodium bicarbonate in practical doses to correct metabolic acidosis in patients with chronic kidney disease.'
    },
    description: {
      es: '<strong>Bicarbonato de sodio 1 gramo</strong><br><br><strong> Indicaciones:</strong><br>Recomendado en pacientes renales, especialmente en casos de:<br><br><strong>Acidosis metabólica:</strong><br>Es una complicación común en pacientes con enfermedad renal crónica (ERC), donde el pH de la sangre disminuye debido a la acumulación de ácidos o a la pérdida de bicarbonato.<br><br><strong>¿Por qué ocurre en pacientes renales?</strong><br>En condiciones normales, los riñones mantienen el equilibrio ácido-base mediante:<br><br>• La excreción de hidrogeniones (H⁺)<br>• La reabsorción de bicarbonato (HCO₃⁻), que actúa como amortiguador<br><br><strong>Sin embargo, en la ERC (estadios 3 a 5):</strong><br><br>• Disminuye la tasa de filtración glomerular (TFG)<br>• Se reduce la excreción de ácidos metabólicos<br>• Se pierde bicarbonato en la orina<br><br>Todo esto provoca retención de ácidos y desarrollo de acidosis metabólica.<br><br><strong>Beneficios:</strong><br>• Mejorar los niveles de pH<br>• Reducir el riesgo cardiovascular',
      en: '<strong>Sodium bicarbonate 1 gram</strong><br><br><strong> Indications:</strong><br>Recommended in renal patients, especially in cases of:<br><br><strong>Metabolic acidosis:</strong><br>It is a common complication in patients with chronic kidney disease (CKD), where blood pH decreases due to acid accumulation or bicarbonate loss.<br><br><strong>Why does it occur in renal patients?</strong><br>Under normal conditions, the kidneys maintain acid-base balance through:<br><br>• The excretion of hydrogen ions (H⁺)<br>• The reabsorption of bicarbonate (HCO₃⁻), which acts as a buffer<br><br><strong>However, in CKD (stages 3 to 5):</strong><br><br>• Glomerular filtration rate (GFR) decreases<br>• The excretion of metabolic acids is reduced<br>• Bicarbonate is lost in the urine<br><br>All this causes acid retention and development of metabolic acidosis.<br><br><strong>Benefits:</strong><br>• Improve pH levels<br>• Reduce cardiovascular risk'
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
      es: 'Simbiótico con Rhamnosus y Lognum. Diseñado para pacientes con enfermedad renal crónica que disminuye los niveles de urea y creatinina',
      en: 'Symbiotic with Rhamnosus and Lognum. Designed for patients with chronic kidney disease that decreases urea and creatinine levels'
    },
    description: {
      es: 'Simbiótico que combina inulina de agave y bacterias vivas (Lactobacillus rhamnosus y Bifidobacterium longum), formulado con tecnología de microencapsulado, lo que permite su estabilidad sin necesidad de refrigeración.<br><br><strong>Indicaciones:</strong><br>Útil en el tratamiento de síntomas asociados a la sintomatología urémica en pacientes en hemodiálisis, como:<br><br>• Náusea<br>• Vómito<br>• Diarrea<br>• Estreñimiento<br>• Prurito (comezón)',
      en: 'Symbiotic that combines agave inulin and live bacteria (Lactobacillus rhamnosus and Bifidobacterium longum), formulated with microencapsulation technology, which allows its stability without refrigeration.<br><br><strong>Indications:</strong><br>Useful in the treatment of symptoms associated with uremic symptomatology in hemodialysis patients, such as:<br><br>• Nausea<br>• Vomiting<br>• Diarrea<br>• Constipation<br>• Pruritus (itching)'
    },
    images: [
      '/images/productos/maloobtalPro.png',
      '/images/productos/maloobtal2Fondo.png'
    ],
    fichaTecnica: '/fichasTecnicas/maloobtalPro.pdf'
  }
}; 