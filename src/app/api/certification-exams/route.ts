import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ─── Types ───────────────────────────────────────────────────
interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

// ─── Question Bank ───────────────────────────────────────────
const questionBank: Record<string, Question[]> = {
  'Introducción a la Astronomía': [
    { id: 'ia-1', question: '¿Cuál es la unidad astronómica (UA)?', options: ['La distancia de la Tierra al Sol', 'La distancia de la Tierra a la Luna', 'La distancia de la Tierra a Marte', 'El diámetro del Sol'], correctAnswer: 0 },
    { id: 'ia-2', question: '¿Quién propuso el modelo heliocéntrico del sistema solar?', options: ['Ptolomeo', 'Aristóteles', 'Nicolás Copérnico', 'Galileo Galilei'], correctAnswer: 2 },
    { id: 'ia-3', question: '¿Qué es un parsec?', options: ['El tiempo que tarda la luz en recorrer 1 parsec', 'Una unidad de distancia equivalente a 3.26 años luz', 'Un tipo de estrella variable', 'Un instrumento de medición astronómica'], correctAnswer: 1 },
    { id: 'ia-4', question: '¿Cuál es la estrella más cercana a la Tierra después del Sol?', options: ['Sirio', 'Próxima Centauri', 'Alfa Centauri A', 'Barnard'], correctAnswer: 1 },
    { id: 'ia-5', question: '¿Qué tipo de espectro produce una estrella?', options: ['Solo emisión', 'Solo absorción', 'Continuo con líneas de absorción', 'Solo continuo'], correctAnswer: 2 },
    { id: 'ia-6', question: '¿Cuál es la constelación más grande del cielo?', options: ['Orión', 'Hidra', 'Virgo', 'La Osa Mayor'], correctAnswer: 1 },
    { id: 'ia-7', question: '¿Qué es el cenit?', options: ['El punto más bajo del cielo', 'El punto directamente sobre la cabeza del observador', 'El punto cardinal norte', 'El horizonte astronómico'], correctAnswer: 1 },
    { id: 'ia-8', question: '¿Qué.instrumento usó Galileo para observar el cielo?', options: ['Un telescopio reflector', 'Un telescopio refractor', 'Un radiotelescopio', 'Un espectrógrafo'], correctAnswer: 1 },
    { id: 'ia-9', question: '¿Cuántas constelaciones oficiales reconoce la UAI?', options: ['76', '88', '100', '64'], correctAnswer: 1 },
    { id: 'ia-10', question: '¿Qué es la declinación en coordenadas celestes?', options: ['El ángulo respecto al ecuador celeste', 'La distancia al polo norte', 'El ángulo respecto al meridiano', 'La latitud terrestre'], correctAnswer: 0 },
    { id: 'ia-11', question: '¿Quién clasificó las estrellas por su brillo apparente en magnitudes?', options: ['Newton', 'Kepler', 'Hiparco', 'Brahe'], correctAnswer: 2 },
    { id: 'ia-12', question: '¿Qué es un año luz?', options: ['El tiempo que tarda la Tierra en dar una vuelta al Sol', 'La distancia que recorre la luz en un año', 'La velocidad de la luz multiplicada por un año', 'Una medida de tiempo astronómico'], correctAnswer: 1 },
    { id: 'ia-13', question: '¿Cuál es el efecto que desplaza el espectro hacia el rojo en galaxias lejanas?', options: ['Efecto Doppler', 'Efecto fotoeléctrico', 'Efecto Compton', 'Efecto Zeeman'], correctAnswer: 0 },
    { id: 'ia-14', question: '¿Qué es la eclíptica?', options: ['El ecuador celeste', 'La trayectoria apparente del Sol en el cielo', 'La órbita de la Luna', 'El plano galáctico'], correctAnswer: 1 },
    { id: 'ia-15', question: '¿En qué siglo se inició la revolución científica en astronomía?', options: ['Siglo XIV', 'Siglo XVI', 'Siglo XVIII', 'Siglo XX'], correctAnswer: 1 },
  ],
  'El Sistema Solar': [
    { id: 'ss-1', question: '¿Cuál es el planeta más grande del sistema solar?', options: ['Saturno', 'Neptuno', 'Júpiter', 'Urano'], correctAnswer: 2 },
    { id: 'ss-2', question: '¿Qué planeta tiene el día más largo del sistema solar?', options: ['Júpiter', 'Saturno', 'Venus', 'Mercurio'], correctAnswer: 2 },
    { id: 'ss-3', question: '¿Cuántas lunas tiene Marte?', options: ['0', '1', '2', '4'], correctAnswer: 2 },
    { id: 'ss-4', question: '¿Cuál es la composición principal del Sol?', options: ['Hierro y níquel', 'Hidrógeno y helio', 'Oxígeno y carbono', 'Neón y argón'], correctAnswer: 1 },
    { id: 'ss-5', question: '¿Qué planeta tiene los anillos más visibles del sistema solar?', options: ['Júpiter', 'Urano', 'Neptuno', 'Saturno'], correctAnswer: 3 },
    { id: 'ss-6', question: '¿Cuál es el planeta más pequeño del sistema solar?', options: ['Marte', 'Venus', 'Mercurio', 'Plutón'], correctAnswer: 2 },
    { id: 'ss-7', question: '¿Qué es el cinturón de Kuiper?', options: ['Una región de asteroides entre Marte y Júpiter', 'Una región de cuerpos helados más allá de Neptuno', 'El disco de acreción del Sol', 'Los anillos de Saturno'], correctAnswer: 1 },
    { id: 'ss-8', question: '¿Cuál es la temperatura superficial media de la Tierra?', options: ['10°C', '15°C', '20°C', '25°C'], correctAnswer: 1 },
    { id: 'ss-9', question: '¿Qué planeta se conoce como el "gemelo de la Tierra" por su tamaño?', options: ['Marte', 'Mercurio', 'Venus', 'Neptuno'], correctAnswer: 2 },
    { id: 'ss-10', question: '¿Cuál es la luna más grande del sistema solar?', options: ['Europa', 'Titán', 'Ganimedes', 'Calisto'], correctAnswer: 2 },
    { id: 'ss-11', question: '¿Qué tipo de planeta es Neptuno?', options: ['Rocoso', 'Gigante gaseoso', 'Gigante helado', 'Enano'], correctAnswer: 2 },
    { id: 'ss-12', question: '¿Cuántos años tarda Neptuno en orbitar el Sol?', options: ['84 años', '165 años', '248 años', '12 años'], correctAnswer: 1 },
    { id: 'ss-13', question: '¿Cuál es el Planeta Enano más grande conocido?', options: ['Ceres', 'Eris', 'Plutón', 'Haumea'], correctAnswer: 2 },
    { id: 'ss-14', question: '¿Qué planeta tiene la Gran Mancha Roja?', options: ['Marte', 'Saturno', 'Júpiter', 'Neptuno'], correctAnswer: 2 },
    { id: 'ss-15', question: '¿Qué es la magnetosfera?', options: ['La atmósfera de un planeta', 'Una región de campo magnético que protege al planeta del viento solar', 'La corteza de un planeta rocoso', 'Una capa de nubes'], correctAnswer: 1 },
  ],
  'Estrellas y Galaxias': [
    { id: 'eg-1', question: '¿En qué fase de su vida se encuentra nuestro Sol?', options: ['Secuencia principal', 'Gigante roja', 'Enana blanca', 'Protostrella'], correctAnswer: 0 },
    { id: 'eg-2', question: '¿Cuál es el destino final de una estrella masiva?', options: ['Enana blanca', 'Enana negra', 'Agujero negro', 'Nebulosa planetaria'], correctAnswer: 2 },
    { id: 'eg-3', question: '¿Qué tipo de galaxia es la Vía Láctea?', options: ['Elíptica', 'Irregular', 'Espiral barrada', 'Lenticular'], correctAnswer: 2 },
    { id: 'eg-4', question: '¿Cuál es la estrella más brillante del cielo nocturno?', options: ['Vega', 'Sirio', 'Canopo', 'Arcturo'], correctAnswer: 1 },
    { id: 'eg-5', question: '¿Qué es una enana blanca?', options: ['Una estrella en formación', 'El remanente de una estrella como el Sol', 'Una estrella de neutrones', 'Un agujero negro pequeño'], correctAnswer: 1 },
    { id: 'eg-6', question: '¿Cuál es la clasificación espectral del Sol?', options: ['O', 'G', 'K', 'M'], correctAnswer: 1 },
    { id: 'eg-7', question: '¿Qué es una supernova?', options: ['El nacimiento de una estrella', 'La explosión de una estrella al final de su vida', 'La colisión de dos galaxias', 'La formación de un planeta'], correctAnswer: 1 },
    { id: 'eg-8', question: '¿Cuál es la galaxia más cercana a la Vía Láctea?', options: ['Andrómeda', 'Nubes de Magallanes', 'Galaxia del Triángulo', 'Galaxia Enana del Sagitario'], correctAnswer: 1 },
    { id: 'eg-9', question: '¿Qué es un cúmulo globular?', options: ['Una agrupación abierta de estrellas jóvenes', 'Una concentración esférica de estrellas antiguas', 'Un tipo de galaxia', 'Una nebulosa'], correctAnswer: 1 },
    { id: 'eg-10', question: '¿Cuánto tiempo tarda la luz de Andrómeda en llegar a la Tierra?', options: ['100,000 años', '1 millón de años', '2.5 millones de años', '10 millones de años'], correctAnswer: 2 },
    { id: 'eg-11', question: '¿Qué es una estrella de neutrones?', options: ['Una estrella sin neutrones', 'El remanente ultra denso tras una supernova', 'Un tipo de estrella variable', 'Una estrella compuesta solo de hidrógeno'], correctAnswer: 1 },
    { id: 'eg-12', question: '¿Qué galaxia colisionará con la Vía Láctea en el futuro?', options: ['Galaxia del Triángulo', 'Galaxia de Sombrero', 'Andrómeda', 'Gran Nube de Magallanes'], correctAnswer: 2 },
    { id: 'eg-13', question: '¿Cuál es el elemento más abundante en el universo?', options: ['Helio', 'Oxígeno', 'Hidrógeno', 'Carbono'], correctAnswer: 2 },
    { id: 'eg-14', question: '¿Qué es la ley de Hubble?', options: ['Las galaxias más lejanas se alejan más rápido', 'Las estrellas más masivas son más brillantes', 'La velocidad de la luz es constante', 'El universo se está contrayendo'], correctAnswer: 0 },
    { id: 'eg-15', question: '¿Qué produce la energía en el interior de una estrella?', options: ['Fisión nuclear', 'Combustión química', 'Fusión nuclear', 'Decaimiento radiactivo'], correctAnswer: 2 },
  ],
  'Exploración Espacial': [
    { id: 'ee-1', question: '¿Cuál fue el primer satélite artificial puesto en órbita?', options: ['Explorer 1', 'Sputnik 1', 'Vanguard 1', 'Luna 1'], correctAnswer: 1 },
    { id: 'ee-2', question: '¿En qué año llegó el primer humano a la Luna?', options: ['1965', '1967', '1969', '1971'], correctAnswer: 2 },
    { id: 'ee-3', question: '¿Quién fue el primer ser humano en el espacio?', options: ['Neil Armstrong', 'Yuri Gagarin', 'Alan Shepard', 'John Glenn'], correctAnswer: 1 },
    { id: 'ee-4', question: '¿Qué nave espacial viajó más allá del sistema solar por primera vez?', options: ['Pioneer 10', 'Voyager 1', 'Voyager 2', 'New Horizons'], correctAnswer: 1 },
    { id: 'ee-5', question: '¿Cuál es la estación espacial actualmente en operación?', options: ['Skylab', 'MIR', 'ISS', 'Tiangong'], correctAnswer: 2 },
    { id: 'ee-6', question: '¿Qué rover de la NASA aterrizó en Marte en 2021?', options: ['Curiosity', 'Spirit', 'Perseverance', 'Opportunity'], correctAnswer: 2 },
    { id: 'ee-7', question: '¿Cuál es el programa de la NASA para volver a la Luna?', options: ['Gemini', 'Artemis', 'Apollo', 'Constellation'], correctAnswer: 1 },
    { id: 'ee-8', question: '¿Qué empresa desarrolló el cohete Falcon 9?', options: ['Blue Origin', 'Rocket Lab', 'SpaceX', 'ULA'], correctAnswer: 2 },
    { id: 'ee-9', question: '¿Cuál fue la primera sonda en aterrizar en Venus?', options: ['Venera 7', 'Magallanes', 'Pioneer Venus', 'Vega 1'], correctAnswer: 0 },
    { id: 'ee-10', question: '¿Qué misión de la New Horizons exploró Plutón?', options: ['2012', '2015', '2018', '2020'], correctAnswer: 1 },
    { id: 'ee-11', question: '¿Cuántas personas han caminado sobre la Luna?', options: ['6', '8', '12', '24'], correctAnswer: 2 },
    { id: 'ee-12', question: '¿Qué sonda europeas studyó el cometa 67P/Churyumov?', options: ['Rosetta', 'Giotto', 'Deep Impact', 'Stardust'], correctAnswer: 0 },
    { id: 'ee-13', question: '¿Cuál es el cohete más potente jamás construido?', options: ['Falcon Heavy', 'Saturn V', 'SLS', 'Starship'], correctAnswer: 1 },
    { id: 'ee-14', question: '¿Qué telescopio espacial fue lanzado en 2021 como sucesor de Hubble?', options: ['Spitzer', 'Chandra', 'James Webb', 'Euclid'], correctAnswer: 2 },
    { id: 'ee-15', question: '¿Qué país lanzó la primera estación espacial (Salyut 1)?', options: ['Estados Unidos', 'Unión Soviética', 'China', 'Japón'], correctAnswer: 1 },
  ],
  'Telescopios y Observación': [
    { id: 'to-1', question: '¿Quién construyó el primer telescopio astronómico?', options: ['Galileo Galilei', 'Isaac Newton', 'Hans Lippershey', 'William Herschel'], correctAnswer: 2 },
    { id: 'to-2', question: '¿Cuál es la diferencia principal entre un telescopio refractor y uno reflector?', options: ['El tamaño', 'El tipo de montura', 'Usa lentes vs espejos', 'El costo'], correctAnswer: 2 },
    { id: 'to-3', question: '¿Cuál es el diámetro del espejo principal del telescopio espacial Hubble?', options: ['1.2 m', '2.4 m', '4.2 m', '6.5 m'], correctAnswer: 1 },
    { id: 'to-4', question: '¿Qué ventaja tiene el telescopio James Webb sobre Hubble?', options: ['Está más cerca de la Tierra', 'Opera en infrarrojo y tiene espejo más grande', 'Puede observarse a ojo desnudo', 'Tiene mayor aumento'], correctAnswer: 1 },
    { id: 'to-5', question: '¿Qué es una cámara CCD en astronomía?', options: ['Un tipo de ocular', 'Un sensor electrónico que captura luz', 'Un filtro de colores', 'Un tipo de telescopio'], correctAnswer: 1 },
    { id: 'to-6', question: '¿Dónde se ubica el Observatorio Paranal?', options: ['México', 'Chile', 'Perú', 'Argentina'], correctAnswer: 1 },
    { id: 'to-7', question: '¿Qué es el seeing en observación astronómica?', options: ['La magnitud visual', 'La turbulencia atmosférica que distorsiona las imágenes', 'El campo de visión del telescopio', 'El filtro solar'], correctAnswer: 1 },
    { id: 'to-8', question: '¿Cuál es el radiotelescopio más grande del mundo (superficie)?', options: ['ALMA', 'VLA', 'FAST (China)', 'Arecibo'], correctAnswer: 2 },
    { id: 'to-9', question: '¿Qué significa la sigla VLT?', options: ['Very Light Telescope', 'Very Large Telescope', 'Variable Long Telescope', 'Visible Light Telescope'], correctAnswer: 1 },
    { id: 'to-10', question: '¿Qué tipo de montura es mejor para astrofotografía?', options: ['Altazimutal', 'Ecuatorial', 'Dobsoniana', 'Fork'], correctAnswer: 1 },
    { id: 'to-11', question: '¿Qué es la óptica adaptativa?', options: ['Lentes de contacto para astrónomos', 'Tecnología para corregir la distorsión atmosférica en tiempo real', 'Un tipo de filtro solar', 'Un programa de computador'], correctAnswer: 1 },
    { id: 'to-12', question: '¿En qué rango del espectro opera principalmente el telescopio Chandra?', options: ['Ultravioleta', 'Infrarrojo', 'Rayos X', 'Radio'], correctAnswer: 2 },
    { id: 'to-13', question: '¿Cuál es la abertura de la óptica del Gran Telescopio Canarias (GTC)?', options: ['8.2 m', '10.4 m', '11.8 m', '6.5 m'], correctAnswer: 1 },
    { id: 'to-14', question: '¿Qué es un espectrógrafo?', options: ['Un tipo de telescopio', 'Un instrumento que descompone la luz en sus longitudes de onda', 'Una lente especial', 'Un satélite'], correctAnswer: 1 },
    { id: 'to-15', question: '¿Dónde está ubicado el telescopio espacial James Webb?', options: ['Órbita terrestre baja', 'Órbita de la Luna', 'Punto de Lagrange L2', 'Superficie de la Luna'], correctAnswer: 2 },
  ],
  'Astrofísica Básica': [
    { id: 'ab-1', question: '¿Cuál es la constante gravitacional de Newton (G)?', options: ['9.8 m/s²', '6.674 × 10⁻¹¹ N·m²/kg²', '3 × 10⁸ m/s', '1.38 × 10⁻²³ J/K'], correctAnswer: 1 },
    { id: 'ab-2', question: '¿Qué postuló la teoría de la relatividad general?', options: ['La gravedad es una fuerza', 'La gravedad es la curvatura del espacio-tiempo', 'El tiempo es absoluto', 'La masa y la energía no se relacionan'], correctAnswer: 1 },
    { id: 'ab-3', question: '¿Cuál es la ecuación más famosa de Einstein?', options: ['F = ma', 'E = mc²', 'PV = nRT', 'E = hν'], correctAnswer: 1 },
    { id: 'ab-4', question: '¿Qué es la materia oscura?', options: ['Materia que no emite luz y que detectamos por sus efectos gravitacionales', 'Agujeros negros', 'Estrellas apagadas', 'Polvo interestelar'], correctAnswer: 0 },
    { id: 'ab-5', question: '¿Cuál es la velocidad de la luz en el vacío?', options: ['300,000 km/s', '150,000 km/s', '3,000,000 km/s', '30,000 km/s'], correctAnswer: 0 },
    { id: 'ab-6', question: '¿Qué es el efecto fotoeléctrico?', options: ['Emisión de luz por electrones', 'Emisión de electrones cuando la luz incide en un material', 'Reflexión total de la luz', 'Difracción de electrones'], correctAnswer: 1 },
    { id: 'ab-7', question: '¿Qué ley establece que la presión de un gas es proporcional a su temperatura?', options: ['Ley de Boyle', 'Ley de Charles', 'Ley de Gay-Lussac', 'Ley de Kepler'], correctAnswer: 2 },
    { id: 'ab-8', question: '¿Cuál es la temperatura del fondo cósmico de microondas (CMB)?', options: ['0 K', '2.725 K', '27 K', '273 K'], correctAnswer: 1 },
    { id: 'ab-9', question: '¿Qué es la energía oscura?', options: ['Energía de los agujeros negros', 'Una fuerza desconocida que acelera la expansión del universo', 'La radiación de las estrellas', 'La luz ultravioleta'], correctAnswer: 1 },
    { id: 'ab-10', question: '¿Qué son las ondas gravitacionales?', options: ['Ondas de sonido en el espacio', 'Perturbaciones del espacio-tiempo producidas por masas aceleradas', 'Ondas electromagnéticas', 'Ondas de choque de supernovas'], correctAnswer: 1 },
    { id: 'ab-11', question: '¿Cuál es la constante de Planck (h)?', options: ['6.626 × 10⁻³⁴ J·s', '1.602 × 10⁻¹⁹ C', '9.109 × 10⁻³¹ kg', '1.38 × 10⁻²³ J/K'], correctAnswer: 0 },
    { id: 'ab-12', question: '¿Qué es la nucleosíntesis estelar?', options: ['La creación de átomos en laboratorios', 'La formación de elementos pesados en el interior de las estrellas', 'La fusión de núcleos en reactores', 'La desintegración radiactiva'], correctAnswer: 1 },
    { id: 'ab-13', question: '¿Cuál es la densidad de una estrella de neutrones típica?', options: ['10⁶ kg/m³', '10¹² kg/m³', '10¹⁷ kg/m³', '10³ kg/m³'], correctAnswer: 2 },
    { id: 'ab-14', question: '¿Qué fenómeno predice que la luz se curva cerca de masas grandes?', options: ['Efecto Doppler', 'Lente gravitacional', 'Dispersión de Rayleigh', 'Efecto Compton'], correctAnswer: 1 },
    { id: 'ab-15', question: '¿Cuál es el límite de Chandrasekhar?', options: ['1.4 masas solares', '3 masas solares', '0.5 masas solares', '10 masas solares'], correctAnswer: 0 },
  ],
  'Exoplanetas y Vida Extraterrestre': [
    { id: 'ev-1', question: '¿Cuántos exoplanetas confirmados se conocen aproximadamente (2024)?', options: ['Menos de 500', 'Alrededor de 1,000', 'Más de 5,000', 'Más de 10,000'], correctAnswer: 2 },
    { id: 'ev-2', question: '¿Cuál fue el primer exoplaneta descubierto alrededor de una estrella similar al Sol?', options: ['Kepler-22b', '51 Pegasi b', 'Proxima Centauri b', 'HD 209458 b'], correctAnswer: 1 },
    { id: 'ev-3', question: '¿Qué satélite de la NASA descubrió la mayor cantidad de exoplanetas?', options: ['Hubble', 'Spitzer', 'Kepler', 'TESS'], correctAnswer: 2 },
    { id: 'ev-4', question: '¿Qué es la zona habitable de una estrella?', options: ['La región donde hay oxígeno', 'El rango de distancias donde puede existir agua líquida', 'El lugar donde hay vida', 'La atmósfera de un planeta'], correctAnswer: 1 },
    { id: 'ev-5', question: '¿Qué método ha descubierto más exoplanetas?', options: ['Imagen directa', 'Tránsito', 'Velocidad radial', 'Lente gravitacional'], correctAnswer: 1 },
    { id: 'ev-6', question: '¿Qué es una enana roja?', options: ['Una estrella moribunda', 'La estrella más común y fría de la secuencia principal', 'Un planeta rojizo', 'Una estrella variable'], correctAnswer: 1 },
    { id: 'ev-7', question: '¿Cuál es el exoplaneta más cercano conocido al sistema solar?', options: ['Kepler-186f', 'Proxima Centauri b', 'TRAPPIST-1e', 'Ross 128 b'], correctAnswer: 1 },
    { id: 'ev-8', question: '¿Qué son las biosignaturas?', options: ['Formas de vida extraterrestre', 'Indicadores de vida como oxígeno o metano en atmósferas', 'Rastros de civilizaciones antiguas', 'Fósiles espaciales'], correctAnswer: 1 },
    { id: 'ev-9', question: '¿Qué es el sistema TRAPPIST-1?', options: ['Un telescopio', 'Un sistema con 7 planetas rocosos', 'Una misión espacial', 'Un asteroide'], correctAnswer: 1 },
    { id: 'ev-10', question: '¿Qué es SETI?', options: ['Un satélite espacial', 'Búsqueda de Inteligencia Extraterrestre', 'Un telescopio europeo', 'Un tipo de exoplaneta'], correctAnswer: 1 },
    { id: 'ev-11', question: '¿Qué es un "Júpiter caliente"?', options: ['Un planeta cercano a su estrella con alta temperatura', 'Un planeta sin atmósfera', 'Un planeta de lava', 'Una estrella caliente'], correctAnswer: 0 },
    { id: 'ev-12', question: '¿Qué instrumento del JWST busca atmósferas de exoplanetas?', options: ['NIRCam', 'MIRI', 'NIRSpec', 'FGS/NIRISS'], correctAnswer: 2 },
    { id: 'ev-13', question: '¿Qué es la ecuación de Drake?', options: ['Una fórmula para calcular distancias estelares', 'Una estimación del número de civilizaciones en la galaxia', 'La ley de la gravitación universal', 'Una fórmula para la velocidad de la luz'], correctAnswer: 1 },
    { id: 'ev-14', question: '¿Qué tipo de estrella es Proxima Centauri?', options: ['Enana amarilla', 'Enana roja', 'Enana blanca', 'Gigante roja'], correctAnswer: 1 },
    { id: 'ev-15', question: '¿Qué es un mini-Neptuno?', options: ['Un planeta más pequeño que Neptuno sin superficie rocosa', 'Un satélite de Neptuno', 'Un tipo de cometa', 'Un planeta enano'], correctAnswer: 0 },
  ],
  'El Universo Profundo': [
    { id: 'up-1', question: '¿Cuál es la edad aproximada del universo?', options: ['10 mil millones de años', '13.8 mil millones de años', '15 mil millones de años', '20 mil millones de años'], correctAnswer: 1 },
    { id: 'up-2', question: '¿Qué es el Big Bang?', options: ['Una explosión en el espacio', 'El evento inicial de expansión del universo', 'La colisión de dos galaxias', 'Una supernova gigante'], correctAnswer: 1 },
    { id: 'up-3', question: '¿Qué descubrió Edwin Hubble en 1929?', options: ['Que el universo se contrae', 'Que las galaxias se alejan unas de otras', 'Que la Tierra es plana', 'Que las estrellas no se mueven'], correctAnswer: 1 },
    { id: 'up-4', question: '¿Cuál es la composición aproximada del universo (materia ordinaria)?', options: ['5%', '27%', '68%', '50%'], correctAnswer: 0 },
    { id: 'up-5', question: '¿Qué porcentaje del universo es energía oscura?', options: ['5%', '27%', '68%', '90%'], correctAnswer: 2 },
    { id: 'up-6', question: '¿Qué es la inflación cósmica?', options: ['El aumento del precio de los telescopios', 'Una expansión exponencial del universo en sus primeros instantes', 'El calentamiento global espacial', 'El enfriamiento del universo'], correctAnswer: 1 },
    { id: 'up-7', question: '¿Qué es la radiación de fondo de microondas (CMB)?', options: ['Ruido de radio terrestre', 'El eco del Big Bang detectable en microondas', 'Luz de las estrellas más lejanas', 'Radiación solar reflejada'], correctAnswer: 1 },
    { id: 'up-8', question: '¿Qué es un cuásar?', options: ['Un tipo de estrella', 'Un núcleo galáctico extremadamente luminoso alimentado por un agujero negro', 'Una supernova', 'Una galaxia enana'], correctAnswer: 1 },
    { id: 'up-9', question: '¿Cuál es el tamaño observable del universo?', options: ['13.8 mil millones de años luz de radio', '46.5 mil millones de años luz de radio', '100 mil millones de años luz', 'Infinito'], correctAnswer: 1 },
    { id: 'up-10', question: '¿Qué es la nucleosíntesis primordial?', options: ['Fusión nuclear en estrellas', 'Creación de los primeros átomos (H, He, Li) tras el Big Bang', 'Creación de elementos pesados', 'Fisión nuclear'], correctAnswer: 1 },
    { id: 'up-11', question: '¿Qué es el horizonte de sucesos de un agujero negro?', options: ['El centro del agujero negro', 'El límite donde nada puede escapar', 'El disco de acreción', 'La superficie del agujero negro'], correctAnswer: 1 },
    { id: 'up-12', question: '¿Qué es un cúmulo de galaxias?', options: ['Un grupo de estrellas', 'Una agrupación de cientos a miles de galaxias unidas por gravedad', 'Un tipo de nebulosa', 'Un cúmulo de planetas'], correctAnswer: 1 },
    { id: 'up-13', question: '¿Qué摄影证明la existencia de materia oscura?', options: ['Fotos de telescopio', 'Curvas de rotación galáctica y lentes gravitacionales', 'Observaciones de la Luna', 'Experimentos de laboratorio'], correctAnswer: 1 },
    { id: 'up-14', question: '¿Qué es la singularidad en un agujero negro?', options: ['El evento de su formación', 'Un punto de densidad infinita donde las leyes de la física no aplican', 'La entrada del agujero negro', 'El borde exterior'], correctAnswer: 1 },
    { id: 'up-15', question: '¿Cuándo se descubrió la expansión acelerada del universo?', options: ['1985', '1998', '2005', '2012'], correctAnswer: 1 },
  ],
  'Mecánica Orbital': [
    { id: 'mo-1', question: '¿Cuáles son las tres leyes de Kepler?', options: ['De la inercia, aceleración y acción-reacción', 'Órbitas elípticas, áreas barridas y períodos', 'Gravitación, inercia y masa', 'Fuerza, velocidad y aceleración'], correctAnswer: 1 },
    { id: 'mo-2', question: '¿Cuál es la velocidad de escape de la Tierra?', options: ['7.9 km/s', '11.2 km/s', '3.1 km/s', '25 km/s'], correctAnswer: 1 },
    { id: 'mo-3', question: '¿Qué es la velocidad orbital de la ISS?', options: ['5 km/s', '7.66 km/s', '11 km/s', '15 km/s'], correctAnswer: 1 },
    { id: 'mo-4', question: '¿Qué es una órbita geoestacionaria?', options: ['Una órbita sobre el ecuador con período igual al día terrestre', 'Una órbita sobre el polo norte', 'Cualquier órbita circular', 'Una órbita elíptica'], correctAnswer: 0 },
    { id: 'mo-5', question: '¿A qué altitud se encuentra una órbita geoestacionaria?', options: ['400 km', '2,000 km', '35,786 km', '100,000 km'], correctAnswer: 2 },
    { id: 'mo-6', question: '¿Qué es una órbita de transferencia de Hohmann?', options: ['Una órbita circular', 'Una maniobra eficiente de dos impulsos para cambiar de órbita', 'Una órbita de escape', 'Una órbita polar'], correctAnswer: 1 },
    { id: 'mo-7', question: '¿Qué son los puntos de Lagrange?', options: ['Puntos de observación en la Tierra', 'Cinco posiciones donde las fuerzas gravitacionales se equilibran', 'Puntos en la Luna', 'Centros de masa de galaxias'], correctAnswer: 1 },
    { id: 'mo-8', question: '¿Cuál es la primera velocidad cósmica de la Tierra?', options: ['7.9 km/s', '11.2 km/s', '16.7 km/s', '3.1 km/s'], correctAnswer: 0 },
    { id: 'mo-9', question: '¿Qué es el apogeo de una órbita?', options: ['El punto más cercano a la Tierra', 'El punto más lejano de la Tierra en la órbita', 'El centro de la órbita', 'El plano orbital'], correctAnswer: 1 },
    { id: 'mo-10', question: '¿Qué es la gravedad específica de un planeta?', options: ['Su masa total', 'La aceleración gravitacional en su superficie', 'Su densidad', 'Su tamaño'], correctAnswer: 1 },
    { id: 'mo-11', question: '¿Cuánto tiempo tarda la ISS en dar una vuelta a la Tierra?', options: ['12 horas', '24 horas', '90 minutos', '45 minutos'], correctAnswer: 2 },
    { id: 'mo-12', question: '¿Qué es la ventana de lanzamiento espacial?', options: ['El momento cuando el cohete está listo', 'El período óptimo para lanzar dada la posición de los cuerpos celestes', 'La apertura de la rampa de lanzamiento', 'La duración del vuelo'], correctAnswer: 1 },
    { id: 'mo-13', question: '¿Qué maniobra se usa para desorbitar un satélite?', options: ['Aumentar la velocidad', 'Reducir la velocidad para que reingrese a la atmósfera', 'Girar 180°', 'Apagar los motores'], correctAnswer: 1 },
    { id: 'mo-14', question: '¿Cuál es la excentricidad de una órbita circular?', options: ['0', '1', '0.5', '∞'], correctAnswer: 0 },
    { id: 'mo-15', question: '¿Cuál es el satélite natural más grande del sistema solar?', options: ['Luna', 'Titán', 'Ganimedes', 'Calisto'], correctAnswer: 2 },
  ],
  'Astronomía de Radio': [
    { id: 'ar-1', question: '¿Qué es un radiotelescopio?', options: ['Un telescopio que emite ondas de radio', 'Un instrumento que detecta ondas de radio del espacio', 'Un telescopio óptico mejorado', 'Un satélite de comunicaciones'], correctAnswer: 1 },
    { id: 'ar-2', question: '¿Quién descubrió las ondas de radio cósmicas?', options: ['Albert Einstein', 'Karl Jansky', 'Edwin Hubble', 'Galileo Galilei'], correctAnswer: 1 },
    { id: 'ar-3', question: '¿Qué es un púlsar?', options: ['Una estrella que pulsa luz visible', 'Una estrella de neutrones que emite haces de radio al rotar', 'Un planeta que emite radio', 'Un tipo de quásar'], correctAnswer: 1 },
    { id: 'ar-4', question: '¿Qué es el Proyecto SETI?', options: ['Un programa de la NASA para enviar humanos al espacio', 'Búsqueda de inteligencia extraterrestre mediante señales de radio', 'Un observatorio en Chile', 'Un telescopio espacial'], correctAnswer: 1 },
    { id: 'ar-5', question: '¿Qué es ALMA?', options: ['Un satélite artístico', 'Atacama Large Millimeter/submillimeter Array', 'Una misión a Marte', 'Un telescopio óptico'], correctAnswer: 1 },
    { id: 'ar-6', question: '¿En qué rango del espectro opera un radiotelescopio?', options: ['Rayos gamma', 'Rayos X', 'Ondas de radio y microondas', 'Ultravioleta'], correctAnswer: 2 },
    { id: 'ar-7', question: '¿Qué es la línea de 21 cm del hidrógeno?', options: ['Una longitud de onda visible del hidrógeno', 'Una emisión de radio del hidrógeno neutro a 1420 MHz', 'Una línea espectral infrarroja', 'Una frecuencia de televisión'], correctAnswer: 1 },
    { id: 'ar-8', question: '¿Qué es el VLA?', options: ['Very Large Array, un interferómetro de radiotelescopios en Nuevo México', 'Very Light Array, un telescopio espacial', 'Variable Long Array, una constelación', 'Visible Light Array, un telescopio óptico'], correctAnswer: 0 },
    { id: 'ar-9', question: '¿Qué ventaja tiene la interferometría en radioastronomía?', options: ['Mayor campo de visión', 'Mayor resolución equivalente a un telescopio del tamaño de la separación', 'Menor costo', 'No necesita antenas'], correctAnswer: 1 },
    { id: 'ar-10', question: '¿Qué descubrió Jocelyn Bell en 1967?', options: ['Los quásares', 'Las microondas cósmicas', 'Los primeros púlsares', 'La materia oscura'], correctAnswer: 2 },
    { id: 'ar-11', question: '¿Qué es un máser cósmico?', options: ['Un láser espacial', 'Amplificación de microondas por emisión estimulada en el espacio', 'Un tipo de estrella', 'Un cometa'], correctAnswer: 1 },
    { id: 'ar-12', question: '¿Por qué los radiotelescopios pueden operar de día y noche?', options: ['Porque emiten su propia luz', 'Porque no dependen de la luz solar', 'Porque usan energía nuclear', 'Porque están en el espacio'], correctAnswer: 1 },
    { id: 'ar-13', question: '¿Qué es FAST?', options: ['Un cohete chino', 'Five-hundred-meter Aperture Spherical Telescope, el radiotelescopio más grande del mundo', 'Un programa de satélites', 'Un tipo de órbita'], correctAnswer: 1 },
    { id: 'ar-14', question: '¿Qué señales de radio estudioó el Radiotelescopio de Arecibo?', options: ['Música interestelar', 'Púlsares, radar planetario y buscó señales alienígenas', 'Televisión por cable', 'Comunicaciones militares'], correctAnswer: 1 },
    { id: 'ar-15', question: '¿Qué es el fondo cósmico de microondas (CMB) detectado por Penzias y Wilson?', options: ['Ruido de su radio', 'Radiación residual del Big Bang en radio/microondas', 'Señales de TV', 'Contaminación industrial'], correctAnswer: 1 },
  ],
  'El Clima Espacial': [
    { id: 'ce-1', question: '¿Cuánto dura aproximadamente un ciclo solar?', options: ['5 años', '11 años', '22 años', '50 años'], correctAnswer: 1 },
    { id: 'ce-2', question: '¿Qué es una eyección de masa coronal (CME)?', options: ['Una explosión en la superficie terrestre', 'Liberación masiva de plasma y campo magnético desde el Sol', 'Un eclipse solar', 'Un tipo de aurora'], correctAnswer: 1 },
    { id: 'ce-3', question: '¿Qué son las auroras boreales y australes?', options: ['Luz artificial en el cielo', 'Emisiones luminosas causadas por partículas solares interactuando con la magnetosfera', 'Estrellas fugaces', 'Nubes especiales'], correctAnswer: 1 },
    { id: 'ce-4', question: '¿Qué es el viento solar?', options: ['Viento en la atmósfera terrestre', 'Flujo continuo de partículas cargadas desde el Sol', 'Luz solar intensa', 'Tormenta eléctrica'], correctAnswer: 1 },
    { id: 'ce-5', question: '¿Qué es una tormenta geomagnética?', options: ['Un huracán espacial', 'Perturbación de la magnetosfera terrestre por actividad solar', 'Un terremoto', 'Un eclipse'], correctAnswer: 1 },
    { id: 'ce-6', question: '¿Qué capa de la Tierra nos protege del clima espacial?', options: ['La atmósfera', 'La magnetosfera', 'La litosfera', 'La hidrosfera'], correctAnswer: 1 },
    { id: 'ce-7', question: '¿Cuál fue la tormenta geomagnética más conocida?', options: ['Tormenta de Halloween 2003', 'Evento de Carrington de 1859', 'Tormenta de Quebec 1989', 'Tormenta de 2012'], correctAnswer: 1 },
    { id: 'ce-8', question: '¿Qué es un destello solar (flare)?', options: ['Un relámpago en el Sol', 'Una explosión repentina de radiación electromagnética en la atmósfera solar', 'Un eclipse parcial', 'Una mancha solar'], correctAnswer: 1 },
    { id: 'ce-9', question: '¿Qué impacto puede tener el clima espacial en los satélites?', options: ['Ninguno', 'Daños electrónicos, cambios de órbita y pérdida de comunicaciones', 'Mejora de señal', 'Mayor vida útil'], correctAnswer: 1 },
    { id: 'ce-10', question: '¿Qué es la ionosfera?', options: ['La capa más baja de la atmósfera', 'Capa ionizada de la atmósfera que refleja ondas de radio', 'El espacio entre planetas', 'La corona solar'], correctAnswer: 1 },
    { id: 'ce-11', question: '¿Qué son las manchas solares?', options: ['Marcas en la Tierra', 'Regiones más frías y oscuras en la superficie del Sol con fuerte campo magnético', 'Estrellas pequeñas en el Sol', 'Cráteres solares'], correctAnswer: 1 },
    { id: 'ce-12', question: '¿Qué índice mide la actividad geomagnética?', options: ['Índice UV', 'Índice Kp', 'Índice Richter', 'Índice de masa corporal'], correctAnswer: 1 },
    { id: 'ce-13', question: '¿Qué es la magnetopausa?', options: ['Un instrumento de medición', 'El límite entre la magnetosfera terrestre y el viento solar', 'El polo magnético', 'Una aurora'], correctAnswer: 1 },
    { id: 'ce-14', question: '¿Qué fue la tormenta de Quebec de 1989?', options: ['Un apagón causado por una tormenta geomagnética que dejó sin energía millones de personas', 'Una tormenta de nieve', 'Un tornado', 'Un terremoto'], correctAnswer: 0 },
    { id: 'ce-15', question: '¿Qué organismo predice el clima espacial?', options: ['OMM', 'NOAA SWPC', 'NASA', 'ESA'], correctAnswer: 1 },
  ],
  'Colonización del Espacio': [
    { id: 'cs-1', question: '¿Cuál es el principal desafío para colonizar Marte?', options: ['La distancia visual', 'La radiación cósmica, la baja presión atmosférica y la falta de oxígeno', 'La gravedad excesiva', 'La temperatura excesivamente alta'], correctAnswer: 1 },
    { id: 'cs-2', question: '¿Qué es la terraformación?', options: ['Construir estructuras en otro planeta', 'Modificar un planeta para hacerlo habitable para la vida terrestre', 'Cultivar plantas en el espacio', 'Explorar planetas'], correctAnswer: 1 },
    { id: 'cs-3', question: '¿Cuál es la gravedad de Marte respecto a la Tierra?', options: ['Aproximadamente 38%', 'Aproximadamente 50%', 'Aproximadamente 80%', 'Aproximadamente 100%'], correctAnswer: 0 },
    { id: 'cs-4', question: '¿Qué isótopo se encuentra en abundancia en la Luna y podría usarse como combustible nuclear?', options: ['Uranio-235', 'Helio-3', 'Plutonio-239', 'Carbono-14'], correctAnswer: 1 },
    { id: 'cs-5', question: '¿Cuál es la atmósfera principal de Marte?', options: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono (95%)', 'Metano'], correctAnswer: 2 },
    { id: 'cs-6', question: '¿Qué es la.propulsión iónica?', options: ['Propulsión por combustible sólido', 'Aceleración de iones mediante campos eléctricos para baja potencia y alta velocidad', 'Propulsión química convencional', 'Propulsión solar'], correctAnswer: 1 },
    { id: 'cs-7', question: '¿Cuánto tardaría un viaje tripulado a Marte con tecnología actual?', options: ['1 mes', '3 meses', '6-9 meses', '2 años'], correctAnswer: 2 },
    { id: 'cs-8', question: '¿Qué es un hábitat cerrado (como BIOS-3 o BIOSPHERE 2)?', options: ['Un tipo de cohete', 'Un ecosistema autosuficiente sellado que recicla aire, agua y alimentos', 'Un telescopio espacial', 'Un satélite de comunicaciones'], correctAnswer: 1 },
    { id: 'cs-9', question: '¿Qué企业提供资金para colonizar Marte?', options: ['NASA', 'ESA', 'SpaceX (programa Starship)', 'Roscosmos'], correctAnswer: 2 },
    { id: 'cs-10', question: '¿Qué es la velocidad de descuelgue de un cohete reutilizable?', options: ['Descender sin control', 'Aterrizar verticalmente para ser reutilizado', 'Caer en el océano', 'Desintegrarse en la atmósfera'], correctAnswer: 1 },
    { id: 'cs-11', question: '¿Cuál es la principal fuente de agua conocida en Marte?', options: ['Ríos superficiales', 'Hielo subterráneo y en los polos', 'Lagos de metano', 'Lluvias'], correctAnswer: 1 },
    { id: 'cs-12', question: '¿Qué es un escudo magnético artificial?', options: ['Un imán gigante', 'Un campo magnético generado para proteger de la radiación cósmica', 'Un paraguas espacial', 'Un satélite de defensa'], correctAnswer: 1 },
    { id: 'cs-13', question: '¿Qué es la sílice regolita marciana?', options: ['Agua en Marte', 'El polvo y suelo de la superficie de Marte', 'Un mineral valioso', 'Una roca volcánica'], correctAnswer: 1 },
    { id: 'cs-14', question: '¿Qué es la impresión 3D en la construcción espacial?', options: ['Imprimir fotos en el espacio', 'Fabricar estructuras in situ con materiales del lugar', 'Crear piezas de cohetes', 'Hacer trajes espaciales'], correctAnswer: 1 },
    { id: 'cs-15', question: '¿Cuál es el concepto de "Mars Direct" propuesto por Robert Zubrin?', options: ['Viajar directo a Marte sin escala', 'Un plan de misión directa que produce combustible de retorno en Marte', 'Una colonia subterránea', 'Comunicación directa con Marte'], correctAnswer: 1 },
  ],
}

// ─── Grade Calculation ────────────────────────────────────────
function calculateGrade(score: number): { grade: string; passed: boolean } {
  if (score >= 95) return { grade: 'Maestro Cosmico', passed: true }
  if (score >= 80) return { grade: 'Científico Espacial', passed: true }
  if (score >= 70) return { grade: 'Explorador Astral', passed: true }
  return { grade: 'Aprendiz Estelar', passed: false }
}

// ─── Generate Verification Code ──────────────────────────────
function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'CERT-'
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// ─── GET Handler ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const verificationCode = searchParams.get('verificationCode')

  try {
    // Return questions for a course (without correct answers)
    const getQuestions = searchParams.get('getQuestions')
    if (getQuestions && questionBank[getQuestions]) {
      const includeAnswers = searchParams.get('includeAnswers') === 'true'
      const questions = questionBank[getQuestions].map(q => {
        const base = { id: q.id, question: q.question, options: q.options }
        return includeAnswers ? { ...base, correctAnswer: q.correctAnswer } : base
      })
      return NextResponse.json({ questions })
    }

    // Return all exams for a user
    if (userId) {
      const exams = await db.certificationExam.findMany({
        where: { userId },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(exams)
    }

    // Return exam by verification code (public verification)
    if (verificationCode) {
      const exam = await db.certificationExam.findUnique({
        where: { verificationCode },
        include: { user: { select: { name: true } } },
      })
      if (!exam) {
        return NextResponse.json({ error: 'Examen no encontrado' }, { status: 404 })
      }
      return NextResponse.json(exam)
    }

    return NextResponse.json({ error: 'Parámetros requeridos: userId o verificationCode' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching certification exams:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// ─── POST Handler ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseName, answers, timeSpent } = body

    if (!userId || !courseName || !answers || typeof timeSpent !== 'number') {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: userId, courseName, answers, timeSpent' },
        { status: 400 }
      )
    }

    const questions = questionBank[courseName]
    if (!questions) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 })
    }

    // Validate answers
    let correctCount = 0
    for (const q of questions) {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++
      }
    }

    const totalQuestions = questions.length
    const score = Math.round((correctCount / totalQuestions) * 100)
    const { grade, passed } = calculateGrade(score)
    const verificationCode = generateVerificationCode()

    // Save to DB
    const exam = await db.certificationExam.create({
      data: {
        userId,
        courseName,
        score,
        totalQuestions,
        correctAnswers: correctCount,
        grade,
        verificationCode,
        passed,
        timeSpent: Math.round(timeSpent),
      },
      include: { user: { select: { name: true } } },
    })

    return NextResponse.json(exam)
  } catch (error) {
    console.error('Error creating certification exam:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
