'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'
import { toast } from 'sonner'
import {
  BookOpen,
  Library,
  Star,
  Users,
  Lock,
  Unlock,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Eye,
  Clock,
  Sparkles,
  GraduationCap,
  Crown,
  BookMarked,
  X,
  CheckCircle2,
  Filter,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────
interface Chapter {
  title: string
  free: boolean
}

interface Book {
  id: string
  title: string
  emoji: string
  author: string
  coverGradient: string
  category: string
  chapters: number
  pages: number
  isPremium: boolean
  rating: number
  readers: number
  description: string
  topics: string[]
  chaptersList: Chapter[]
}

type View = 'library' | 'reader' | 'chapter'

interface ReadingProgress {
  [bookId: string]: {
    currentChapter: number
    completedChapters: number[]
  }
}

// ─── Book Data ──────────────────────────────────────────────
const books: Book[] = [
  {
    id: 'solar-system',
    title: 'Guía Completa del Sistema Solar',
    emoji: '☀️',
    author: 'Dr. Carlos Méndez',
    coverGradient: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    category: 'Planetología',
    chapters: 12,
    pages: 86,
    isPremium: false,
    rating: 4.8,
    readers: 2340,
    description: 'Un recorrido exhaustivo por cada planeta, luna y cuerpo celeste de nuestro sistema solar. Datos actualizados con las últimas misiones espaciales.',
    topics: ['Los 8 Planetas', 'Lunas Principales', 'Cinturón de Asteroides', 'Cometas', 'El Sol'],
    chaptersList: [
      { title: 'Nuestro Vecindario Cósmico', free: true },
      { title: 'El Sol: Nuestra Estrella', free: true },
      { title: 'Planetas Rocosos', free: true },
      { title: 'La Tierra y la Luna', free: false },
      { title: 'Marte: El Planeta Rojo', free: false },
      { title: 'Júpiter: El Gigante', free: false },
      { title: 'Saturno y sus Anillos', free: false },
      { title: 'Urano y Neptuno', free: false },
      { title: 'Planetas Enanos', free: false },
      { title: 'Cinturón de Kuiper', free: false },
      { title: 'Cometas y Asteroides', free: false },
      { title: 'El Futuro del Sistema Solar', free: false },
    ],
  },
  {
    id: 'black-holes',
    title: 'Misterios de los Agujeros Negros',
    emoji: '🕳️',
    author: 'Dra. Ana Rodríguez',
    coverGradient: 'linear-gradient(135deg, #7c3aed, #000000)',
    category: 'Astrofísica',
    chapters: 10,
    pages: 64,
    isPremium: true,
    rating: 4.9,
    readers: 1856,
    description: 'Explora los objetos más misteriosos del universo. Desde los micro agujeros negros hasta los supermasivos en el centro de las galaxias.',
    topics: ['Horizonte de Sucesos', 'Singularidad', 'Hawking Radiation', 'Spaghettification', 'Información Cuántica'],
    chaptersList: [
      { title: '¿Qué es un Agujero Negro?', free: true },
      { title: 'Tipos de Agujeros Negros', free: true },
      { title: 'Formación y Evolución', free: false },
      { title: 'El Horizonte de Sucesos', free: false },
      { title: 'Singularidad y Densidad Infinita', free: false },
      { title: 'Radiación de Hawking', free: false },
      { title: 'Agujeros Negros Supermasivos', free: false },
      { title: 'Spaghettification', free: false },
      { title: 'Paradoja de la Información', free: false },
      { title: 'El Futuro de la Investigación', free: false },
    ],
  },
  {
    id: 'mars-mission',
    title: 'Misión a Marte: Guía del Futuro',
    emoji: '🔴',
    author: 'Ing. Miguel Torres',
    coverGradient: 'linear-gradient(135deg, #ef4444, #f59e0b)',
    category: 'Exploración',
    chapters: 14,
    pages: 102,
    isPremium: true,
    rating: 4.7,
    readers: 3100,
    description: 'Todo sobre la futura colonización de Marte. Tecnologías, desafíos y el plan detallado para establecer la primera base humana.',
    topics: ['SpaceX Starship', 'Artemis', 'Base Permanente', 'Terraformación', 'Supervivencia'],
    chaptersList: [
      { title: '¿Por qué Marte?', free: true },
      { title: 'Historia de la Exploración', free: true },
      { title: 'Rovers y Misiones Actuales', free: true },
      { title: 'El Viaje: 7 Meses', free: false },
      { title: 'Aterrizando en Marte', free: false },
      { title: 'Habitar Marte', free: false },
      { title: 'Producción de Oxígeno', free: false },
      { title: 'Cultivos en Marte', free: false },
      { title: 'Protección Radiación', free: false },
      { title: 'Comunicación con la Tierra', free: false },
      { title: 'Terraformación: ¿Es Posible?', free: false },
      { title: 'Starship de SpaceX', free: false },
      { title: 'Economía Marciana', free: false },
      { title: 'El Primer Colonizador', free: false },
    ],
  },
  {
    id: 'stellar-observation',
    title: 'Manual del Observador Estelar',
    emoji: '🔭',
    author: 'Prof. Laura Vega',
    coverGradient: 'linear-gradient(135deg, #00d4ff, #10b981)',
    category: 'Observación',
    chapters: 8,
    pages: 58,
    isPremium: false,
    rating: 4.6,
    readers: 1980,
    description: 'Aprende a observar el cielo nocturno como un profesional. Técnicas, equipos y guías de observación para cada estación.',
    topics: ['Telescopios', 'Astrofotografía', 'Cielos Oscuros', 'Constelaciones', 'Planetas'],
    chaptersList: [
      { title: 'Iniciación a la Observación', free: true },
      { title: 'El Cielo a Ojo Desnudo', free: true },
      { title: 'Elegiendo tu Telescopio', free: true },
      { title: 'Primeras Observaciones', free: false },
      { title: 'Constelaciones Principales', free: false },
      { title: 'Astrofotografía Básica', free: false },
      { title: 'Observación de Planetas', free: false },
      { title: 'Calendario de Eventos', free: false },
    ],
  },
  {
    id: 'galaxies',
    title: 'Atlas de Galaxias',
    emoji: '🌌',
    author: 'Dr. Roberto Fuentes',
    coverGradient: 'linear-gradient(135deg, #ec4899, #7c3aed)',
    category: 'Cosmología',
    chapters: 11,
    pages: 78,
    isPremium: true,
    rating: 4.8,
    readers: 1560,
    description: 'Un viaje visual por las galaxias del universo observable. Clasificación, estructura y los misterios que aún guardan.',
    topics: ['Vía Láctea', 'Galaxias Espirales', 'Elípticas', 'Irregulares', 'Cúmulos'],
    chaptersList: [
      { title: 'Nuestra Galaxia: La Vía Láctea', free: true },
      { title: 'Clasificación de Galaxias', free: true },
      { title: 'Galaxias Espirales', free: false },
      { title: 'Galaxias Elípticas', free: false },
      { title: 'Galaxias Irregulares', free: false },
      { title: 'Cúmulos de Galaxias', free: false },
      { title: 'Galaxias Activas y Quásares', free: false },
      { title: 'Colisiones Galácticas', free: false },
      { title: 'Materia Oscura en Galaxias', free: false },
      { title: 'Galaxias más Lejanas', free: false },
      { title: 'El Futuro de las Galaxias', free: false },
    ],
  },
  {
    id: 'space-history',
    title: 'Historia de la Exploración Espacial',
    emoji: '🚀',
    author: 'Dr. Fernando León',
    coverGradient: 'linear-gradient(135deg, #3b82f6, #10b981)',
    category: 'Historia',
    chapters: 16,
    pages: 120,
    isPremium: false,
    rating: 4.9,
    readers: 2890,
    description: 'Desde Sputnik hasta las misiones Artemis. La cronología completa de la humanidad en el espacio.',
    topics: ['Sputnik', 'Apollo', 'Era del Transbordador', 'ISS', 'Artemis'],
    chaptersList: [
      { title: 'Los Sueños Espaciales', free: true },
      { title: 'Sputnik: El Comienzo', free: true },
      { title: 'La Carrera Espacial', free: true },
      { title: 'Gagarin: El Primer Humano', free: true },
      { title: 'Misiones Mercury y Gemini', free: false },
      { title: 'Apollo 11: La Luna', free: false },
      { title: 'El Programa Apollo', free: false },
      { title: 'Estaciones Espaciales', free: false },
      { title: 'El Transbordador Espacial', free: false },
      { title: 'Telescopio Hubble', free: false },
      { title: 'La ISS', free: false },
      { title: 'Mars Rovers', free: false },
      { title: 'Nueva Era Comercial', free: false },
      { title: 'Programa Artemis', free: false },
      { title: 'Viaje a las Estrellas', free: false },
      { title: 'El Futuro', free: false },
    ],
  },
  {
    id: 'exoplanets',
    title: 'Mundos Extraterrestres: Exoplanetas',
    emoji: '🌍',
    author: 'Dra. Sofía Herrera',
    coverGradient: 'linear-gradient(135deg, #10b981, #00d4ff)',
    category: 'Exoplanetología',
    chapters: 9,
    pages: 68,
    isPremium: true,
    rating: 4.7,
    readers: 1420,
    description: 'Los planetas que orbitan otras estrellas. Métodos de detección, mundos habitables y la búsqueda de vida.',
    topics: ['Métodos de Detección', 'Zona Habitable', 'Biosignaturas', 'TRAPPIST-1', 'Proxima b'],
    chaptersList: [
      { title: 'Más Allá del Sistema Solar', free: true },
      { title: 'Primeros Descubrimientos', free: true },
      { title: 'Métodos de Detección', free: false },
      { title: 'Júpiteres Calientes', free: false },
      { title: 'Súper Tierras', free: false },
      { title: 'La Zona Habitable', free: false },
      { title: 'TRAPPIST-1', free: false },
      { title: 'Buscando Vida', free: false },
      { title: 'El Futuro de la Búsqueda', free: false },
    ],
  },
  {
    id: 'rocket-science',
    title: 'Física de los Cohetes',
    emoji: '🚀',
    author: 'Ing. Diego Ramírez',
    coverGradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    category: 'Ingeniería',
    chapters: 10,
    pages: 82,
    isPremium: true,
    rating: 4.8,
    readers: 2100,
    description: 'La física y la ingeniería detrás de los cohetes espaciales. Desde las leyes de Newton hasta los motores de combustible sólido.',
    topics: ['Ley de Acción-Reacción', 'Combustible', 'Órbitas', 'Reentry', 'Propulsión Iónica'],
    chaptersList: [
      { title: 'Fundamentos de Propulsión', free: true },
      { title: 'Las Tres Leyes de Newton', free: true },
      { title: 'Combustibles Químicos', free: false },
      { title: 'Motores de Cohete', free: false },
      { title: 'Aerodinámica y Drag', free: false },
      { title: 'Alcance y Órbita', free: false },
      { title: 'Etapas de un Lanzamiento', free: false },
      { title: 'Reentrada Atmosférica', free: false },
      { title: 'Propulsión Avanzada', free: false },
      { title: 'El Futuro de los Cohetes', free: false },
    ],
  },
]

// ─── Chapter Content ─────────────────────────────────────────
const chapterContent: Record<string, Record<number, string[]>> = {
  'solar-system': {
    0: [
      'El sistema solar es nuestro hogar cósmico, una vasta región del espacio dominada por la gravedad de una estrella mediana: el Sol. Se extiende aproximadamente 287 mil millones de kilómetros desde el Sol hasta la heliosfera, la burbuja protectora creada por el viento solar. Dentro de este inmenso espacio orbitan ocho planetas, docenas de lunas, millones de asteroides y miles de millones de cometas.',
      'Nuestro vecindario cósmico se divide en varias regiones distintas. Los cuatro planetas interiores — Mercurio, Venus, Tierra y Marte — son mundos rocosos y relativamente pequeños, conocidos como planetas terrestres. Más allá de la órbita de Marte se encuentra el cinturón de asteroides, seguido por los gigantes gaseosos Júpiter y Saturno, y los gigantes helados Urano y Neptuno.',
      'Cada cuerpo celeste del sistema solar tiene una historia fascinante que contar. Desde los volcanes de Io (la luna más activa volcánicamente del sistema solar) hasta los géiseres de Encélado, cada mundo ofrece pistas sobre la formación y evolución de nuestro rincón del universo. Los científicos estiman que el sistema solar se formó hace aproximadamente 4.600 millones de años a partir de un colapso de una nube molecular gigante.',
      'En las últimas décadas, las misiones espaciales como Voyager, Cassini-Huygens, New Horizons y los rovers de Marte han revolucionado nuestra comprensión del sistema solar. Cada descubrimiento nos acerca más a responder la pregunta fundamental: ¿somos los únicos seres vivos en este rincón de la Vía Láctea? La exploración continúa, y las próximas décadas prometen revelaciones aún más asombrosas.',
    ],
    1: [
      'El Sol es una estrella tipo G2V, una enana amarilla que contiene el 99,86% de toda la masa del sistema solar. Con un diámetro de 1,39 millones de kilómetros — 109 veces el de la Tierra — el Sol es una bola de plasma incandescente donde se producen reacciones de fusión nuclear que convierten hidrógeno en helio, liberando cantidades inconcebibles de energía.',
      'La temperatura en el núcleo del Sol alcanza los 15 millones de grados Celsius, mientras que su superficie visible (la fotosfera) ronda los 5.500 °C. Sin embargo, la corona solar — la atmósfera exterior — puede alcanzar temperaturas de hasta 3 millones de grados, un misterio que los científicos aún intentan resolver completamente.',
      'El Sol experimenta un ciclo de actividad de aproximadamente 11 años, conocido como ciclo solar. Durante el máximo solar, se producen más manchas solares, eyecciones de masa coronal y tormentas geomagnéticas que pueden afectar las comunicaciones por satélite, las redes eléctricas en la Tierra e incluso crear las espectaculares auroras boreales y australes.',
      'A pesar de su aparente estabilidad, el Sol está envejeciendo. Dentro de aproximadamente 5.000 millones de años, agotará su combustible de hidrógeno y se expandirá hasta convertirse en una gigante roja que engullirá a Mercurio, Venus y posiblemente la Tierra. Finalmente, shedderá sus capas exteriores y dejará atrás una enana blanca del tamaño de nuestro planeta.',
    ],
    2: [
      'Los planetas rocosos, también llamados planetas terrestres, son los cuatro mundos más cercanos al Sol: Mercurio, Venus, Tierra y Marte. A diferencia de los gigantes gaseosos, estos planetas tienen superficies sólidas compuestas principalmente de silicatos y metales, con atmósferas que varían desde inexistentes hasta densas y tóxicas.',
      'Mercurio, el más pequeño y cercano al Sol, es un mundo de extremos: las temperaturas oscilan entre -180 °C durante la noche y 430 °C bajo la luz solar directa. Su superficie, cubierta de cráteres, se parece a la de nuestra Luna. Sin embargo, bajo esa superficie desolada se esconde un núcleo de hierro sorprendentemente grande que genera un campo magnético débil pero detectable.',
      'Venus, frecuentemente llamado el "gemelo malvado" de la Tierra por su tamaño similar, tiene una atmósfera densa de dióxido de carbono que crea un efecto invernadero descontrolado. La temperatura en su superficie alcanza los 465 °C, suficiente para fundir plomo. La presión atmosférica es 90 veces superior a la terrestre, equivalente a estar a 900 metros de profundidad en el océano.',
      'Marte, el planeta rojo, ha capturado la imaginación humana durante siglos. Su color característico proviene del óxido de hierro (óxido) que cubre su superficie. Marte presenta el volcán más grande del sistema solar, el Monte Olimpo, con 21 kilómetros de altura y 600 kilómetros de diámetro en su base. Las evidencias de agua líquida en su pasado lo convierten en el candidato principal para la búsqueda de vida extraterrestre.',
    ],
  },
  'black-holes': {
    0: [
      'Un agujero negro es una región del espacio-tiempo donde la gravedad es tan intensa que nada, ni siquiera la luz, puede escapar una vez que cruza el horizonte de sucesos. Este concepto, predicho por la teoría de la relatividad general de Albert Einstein en 1915, representa uno de los fenómenos más extremos y fascinantes del universo.',
      'Para formar un agujero negro estelar, una estrella masiva (generalmente más de 20 veces la masa de nuestro Sol) debe agotar su combustible nuclear y colapsar bajo su propia gravedad. Cuando el núcleo ya no puede resistir la fuerza gravitatoria, se produce un colapso catastrófico que comprime toda la materia de la estrella en un volumen infinitesimalmente pequeño.',
      'Existen agujeros negros de diferentes tamaños. Los estelares tienen masas entre 5 y 100 veces la del Sol. Los supermasivos, como Sagitario A* en el centro de nuestra galaxia, pueden contener millones o incluso miles de millones de masas solares. Se cree que también existen agujeros negros de masa intermedia, aunque su detección es más difícil.',
      'En 2019, el Event Horizon Telescope logró la primera imagen directa de un agujero negro, específicamente el que reside en el centro de la galaxia M87. Esta imagen mostró una sombra oscura rodeada por un anillo brillante de gas caliente, confirmando las predicciones de Einstein con una precisión extraordinaria y abriendo una nueva era en la astronomía.',
    ],
    1: [
      'Los astrónomos clasifican los agujeros negros en tres categorías principales según su masa: estelares, intermedios y supermasivos. Los agujeros negros estelares se forman por el colapso de estrellas masivas individuales y típicamente tienen entre 5 y 100 masas solares. Se estima que existen millones de ellos solo en nuestra galaxia.',
      'Los agujeros negros supermasivos son los titanes cósmicos, con masas que van desde millones hasta miles de millones de veces la del Sol. Prácticamente todas las galaxias grandes albergan uno en su centro. El más masivo conocido, TON 618, tiene aproximadamente 66.000 millones de masas solares. Cómo crecen hasta tamaños tan colosales sigue siendo un tema de intenso debate científico.',
      'Los agujeros negros de masa intermedia (IMBH) son el eslabón perdido entre los estelares y los supermasivos. Con masas entre 100 y 100.000 masas solares, son extremadamente difíciles de detectar. Candidatos potenciales incluyen HLX-1 en la galaxia ESO 243-49, que emite rayos X a niveles que sugieren un agujero negro de unas 20.000 masas solares.',
      'También se teoriza la existencia de agujeros negros primordiales, formados en los primeros instantes después del Big Bang, cuando la materia del universo era extremadamente densa. Si existieran, algunos podrían tener la masa de una montaña pero el tamaño de un átomo, y podrían constituir parte de la misteriosa materia oscura que permea el cosmos.',
    ],
  },
  'mars-mission': {
    0: [
      'Marte, el cuarto planeta del sistema solar, ha sido el objetivo principal de la exploración espacial humana durante las últimas décadas. ¿Por qué este planeta rojo despierta tanto interés? La respuesta combina factores científicos, técnicos y, cada vez más, la posibilidad de convertir a Marte en el primer hogar extraterrestre de la humanidad.',
      'Marte ofrece condiciones que, aunque extremas, son las más hospitalarias de todos los planetas del sistema solar (excepto la Tierra). Su día dura 24 horas y 37 minutos, casi igual al nuestro. Tiene estaciones similares, aunque duran el doble. Su gravedad es aproximadamente el 38% de la terrestre, lo que facilitaría ciertas actividades físicas. Y, crucialmente, posee agua en forma de hielo.',
      'Desde el punto de vista científico, Marte es un laboratorio natural incomparable. Su superficie preserva evidencias de un pasado húmedo y cálido, con ríos, lagos y posiblemente un océano en su hemisferio norte. Estudiar la historia geológica de Marte nos ayuda a comprender mejor la evolución planetaria y las condiciones que permitieron (o impidieron) el surgimiento de la vida.',
      'El factor psicológico también es importante. Marte es visible a simple vista desde la Tierra como un punto rojizo brillante, lo que lo ha convertido en un símbolo de exploración y aventura durante milenios. Desde los romanos que lo llamaron su dios de la guerra hasta las novelas de ciencia ficción de Ray Bradbury, Marte siempre ha representado la frontera siguiente de la humanidad.',
    ],
    1: [
      'La exploración de Marte comenzó mucho antes de que existieran los cohetes. En el siglo XVII, Galileo Galilei fue uno de los primeros en observar Marte a través de un telescopio. En 1877, Giovanni Schiaparelli dibujó mapas de la superficie marciana que incluía lo que él llamó "canali" (canales), que más tarde se traduciría erróneamente como "canales artificiales", alimentando la idea de una civilización marciana.',
      'La era moderna de la exploración de Marte comenzó en 1965 cuando la sonda Mariner 4 de la NASA realizó el primer sobrevuelo exitoso, transmitiendo 22 fotos de la superficie. Las imágenes mostraron un mundo craterizado y estéril que destruyó las ilusiones de una civilización avanzada, pero inauguró una nueva era de descubrimientos científicos.',
      'La Unión Soviética fue el primer país en lograr un aterrizaje suave en Marte con la Mars 3 en 1971, aunque la transmisión duró solo 14 segundos. En 1976, las misiones Viking 1 y 2 de la NASA realizaron los primeros aterrizajes exitosos y prolongados, enviando las primeras fotos en color y realizando los primeros experimentos para buscar vida.',
      'La misión Mars Pathfinder de 1997 demostró que era posible aterrizar de manera económica usando airbags, y su pequeño rover Sojourner inauguró la era de la exploración robótica móvil. Este éxito allanó el camino para los misionarios gemelos Spirit y Opportunity en 2004, que superarían todas las expectativas operando durante años.',
    ],
    2: [
      'Hoy en día, Marte es el planeta más estudiado del sistema solar (excepto la Tierra) con una flota activa de vehículos en su superficie y en órbita. La misión Curiosity, que aterrizó en agosto de 2012 dentro del cráter Gale, es un laboratorio móvil del tamaño de un automóvil compacto equipado con 10 instrumentos científicos de última generación.',
      'Curiosity ha logrado descubrimientos revolucionarios. Ha confirmado que Marte tuvo las condiciones químicas necesarias para albergar vida microbiana en el pasado, incluyendo la presencia de moléculas orgánicas complejas y minerales que solo se forman en presencia de agua líquida. Su láser ChemCam puede vaporizar rocas a 7 metros de distancia para analizar su composición.',
      'El rover Perseverance, aterrizado en febrero de 2021 en el cráter Jezero — un antiguo delta fluvial — es el más avanzado jamás construido. Su principal misión es recolectar y almacenar muestras de roca y suelo para una futura misión de retorno a la Tierra. También lleva el helicóptero Ingenuity, que realizó el primer vuelo controlado en otro planeta.',
      'En órbita marciana, la Mars Reconnaissance Orbiter (MRO) continúa mapeando la superficie con una resolución sin precedentes, mientras que MAVEN estudia la atmósfera superior y cómo el viento solar arrancó lentamente la atmósfera primitiva de Marte. Estos datos son cruciales para planificar la futura misión humana al planeta rojo.',
    ],
  },
  'stellar-observation': {
    0: [
      'La observación del cielo nocturno es una de las actividades científicas más antiguas de la humanidad. Desde las primeras civilizaciones que trazaron mapas estelares hasta los astrónomos modernos con telescopios robóticos, observar las estrellas ha sido una fuente constante de asombro y conocimiento sobre nuestro lugar en el universo.',
      'Antes de comenzar a observar, es importante comprender algunos conceptos básicos. La bóveda celeste aparece como una esfera que nos rodea, rotando una vez cada 24 horas. Las estrellas forman patrones llamados constelaciones que sirven como mapa del cielo. Conocer las constelaciones principales es el primer paso para navegar el firmamento.',
      'La elección del lugar es fundamental para una buena observación. La contaminación lumínica de las ciudades puede reducir la visibilidad de estrellas hasta en un 90%. Busca lugares alejados de las luces urbanas, preferiblemente con horizontes despejados. Los parques nacionales y áreas rurales ofrecen las mejores condiciones.',
      'También es importante considerar el clima y las fases de la luna. Las noches claras y sin luna ofrecen el mejor cielo para observación profunda. Las herramientas modernas como aplicaciones de planetario en el teléfono y calendarios de eventos astronómicos pueden ayudarte a planificar tus sesiones de observación para aprovechar al máximo cada noche.',
    ],
    1: [
      'Observar el cielo a ojo desnudo es sorprendentemente gratificante y no requiere ningún equipo especial. Con solo tus ojos puedes ver aproximadamente 2.500 estrellas en condiciones ideales, identificar planetas, seguir el movimiento de la Luna y presenciar meteoros, eclipses y otros fenómenos celestes.',
      'Las estrellas más fáciles de reconocer son las que forman el asterismo del Gran Carro (o La Osa Mayor) en el hemisferio norte. Siguiendo las dos estrellas delanteras del "cuenco" cinco veces su separación, encontrarás a Polaris, la Estrella del Norte, que señala la dirección del polo norte celeste.',
      'Los planetas son fáciles de distinguir de las estrellas porque no parpadean (con pocas excepciones) y se mueven respecto a las estrellas de fondo a lo largo de las semanas. Venus es el objeto más brillante después del Sol y la Luna, visible al atardecer o al amanecer como el "lucero". Júpiter es el siguiente en brillo, con un tono ligeramente amarillento.',
      'Entre los fenómenos que puedes observar a simple vista destacan las lluvias de meteoros. Las Perseidas (agosto) y las Gemínidas (diciembre) son las más intensas, produciendo hasta 100 meteoros por hora en sus picos. También puedes observar la Vía Láctea como una banda tenue y luminosa que cruza el cielo en noches oscuras.',
    ],
    2: [
      'Elegir tu primer telescopio puede ser abrumador dada la variedad de opciones disponibles. Los dos tipos principales son los refractores (que usan lentes) y los reflectores (que usan espejos). Para principiantes, los reflectores tipo Dobson ofrecen la mejor relación calidad-precio, con aperturas generosas a precios accesibles.',
      'La característica más importante de un telescopio no es su aumento, sino su apertura (el diámetro del objetivo o espejo principal). Una mayor apertura captura más luz, permitiendo ver objetos más tenues y con mayor detalle. Un telescopio de 150mm de apertura es un excelente punto de partida que revelará cráteres lunares, los anillos de Saturno, las lunas de Júpiter y galaxias brillantes.',
      'Los accesorios esenciales incluyen un buen buscador (un telescopio pequeño montado en el principal para apuntar), oculares de diferentes distancias focales para variar el aumento, un filtro lunar para observaciones de la Luna llena, y una montura estable. Una montura inestable frustrará incluso al telescopio más caro.',
      'Para quienes buscan más portabilidad, los binoculares astronómicos son una excelente alternativa. Un par de 10x50 permite observar cráteres lunares detallados, los satélites de Júpiter, cúmulos abiertos y nebulosas brillantes. Su amplio campo de visión los hace ideales para explorar el cielo y para la observación casual.',
    ],
  },
  'galaxies': {
    0: [
      'La Vía Láctea, nuestra galaxia, es una estructura cósmica majestuosa que contiene entre 100 y 400 mil millones de estrellas, además de enormes cantidades de gas, polvo y materia oscura. Con un diámetro de aproximadamente 100.000 años luz, es una galaxia espiral barrada que gira como un pinwheel gigante en el espacio.',
      'Nuestro Sistema Solar se encuentra en uno de los brazos espirales de la Vía Láctea, el brazo de Orión, a unos 26.000 años luz del centro galáctico. Viajamos alrededor del centro galáctico a una velocidad de aproximadamente 828.000 km/h, completando una órbita cada 225-250 millones de años, un período conocido como "año cósmico".',
      'El centro de nuestra galaxia alberga un agujero negro supermasivo llamado Sagitario A*, con una masa de aproximadamente 4 millones de veces la del Sol. Rodeado por un denso cúmulo estelar y nubes de gas brillante, este monstruo cósmico influye en la dinámica de toda la galaxia.',
      'La Vía Láctea no está sola en el cosmos. Forma parte del Grupo Local, un cúmulo de más de 80 galaxias que incluye a Andrómeda (M31), la galaxia del Triángulo (M33) y decenas de galaxias enanas. Se estima que dentro de aproximadamente 4.500 millones de años, la Vía Láctea y Andrómeda colisionarán y fusionarán en una nueva galaxia elíptica, bautizada por los astrónomos como "Milkomeda".',
    ],
    1: [
      'La clasificación de galaxias es un sistema fundamental para comprender la diversidad del universo observable. Fue Edwin Hubble quien, en 1926, propuso el primer esquema de clasificación basado en la morfología, organizando las galaxias en una secuencia que va desde las espirales hasta las elípticas, pasando por las lenticulares.',
      'Las galaxias espirales, como la Vía Láctea y Andrómeda, se caracterizan por sus brazos espirales que se extienden desde un bulbo central. Se dividen en espirales normales (tipo Sa, Sb, Sc) según qué tan apretados estén los brazos y el tamaño del bulbo, y espirales barradas (SBa, SBb, SBc) que presentan una barra central de estrellas.',
      'Las galaxias elípticas tienen forma esférica o elipsoidal y carecen de la estructura espiral. Se clasifican de E0 (esférica) a E7 (muy aplanada). Generalmente están compuestas por estrellas viejas y rojas, con muy poco gas y polvo para formar nuevas estrellas. Son las galaxias más comunes en los cúmulos galácticos densos.',
      'Las galaxias irregulares, como las Nubes de Magallanes, no encajan en ninguna de las categorías anteriores. Tienen formas asimétricas y caóticas, a menudo con brotes intensos de formación estelar. Representan aproximadamente el 25% de todas las galaxias conocidas y son especialmente comunes en el universo temprano.',
    ],
  },
  'space-history': {
    0: [
      'Los sueños de viajar al espacio son tan antiguos como la humanidad misma. Desde los mitos griegos de Ícaro y Dédalo hasta las fantasías de Julio Verne en "De la Tierra a la Luna" (1865), los humanos siempre han mirado hacia las estrellas con una mezcla de curiosidad científica y anhelo de exploración.',
      'En la antigua China, la leyenda de Wan Hu, un funcionario del siglo XVI que supuestamente intentó llegar al espacio atado a 47 cohetes de pólvora, ilustra la fascinación milenaria por el vuelo espacial. Aunque la historia es probablemente mítica, representa uno de los primeros conceptos registrados de propulsión por cohete para viajes espaciales.',
      'Las contribuciones científicas fundamentales vinieron de tres pensadores: el polaco Konstantin Tsiolkovsky, que calculó la velocidad orbital necesaria y propuso los cohetes de múltiples etapas; el estadounidense Robert Goddard, quien construyó y lanzó el primer cohete de combustible líquido en 1926; y el alemán Hermann Oberth, cuyo libro "El cohete en el espacio interplanetario" (1923) inspiró a toda una generación de ingenieros.',
      'El desarrollo de los cohetes V-2 durante la Segunda Guerra Mundial, diseñados por Wernher von Braun, representó un trágico pero crucial avance tecnológico. Tras la guerra, tanto Estados Unidos como la Unión Soviética reclutaron científicos de cohetes alemanes, sentando las bases técnicas para la carrera espacial que transformaría el mundo.',
    ],
    1: [
      'El 4 de octubre de 1957, la Unión Soviética lanzó el Sputnik 1, el primer satélite artificial de la historia. Esta esfera de aluminio de apenas 58 centímetros de diámetro y 83 kilogramos cambió el mundo para siempre. Su señal de radio "bip-bip" fue captada por radioaficionados de todo el planeta, anunciando el inicio de la era espacial.',
      'El impacto del Sputnik fue inmediato y profundo. En Estados Unidos, provocó una crisis de confianza conocida como el "Momento Sputnik". El presidente Eisenhower respondió creando la NASA (Administración Nacional de Aeronáutica y del Espacio) el 29 de julio de 1958 y aumentando drásticamente la inversión en educación científica y tecnológica.',
      'El Sputnik 2, lanzado el 3 de noviembre de 1957, transportó a la perra Laika, el primer ser vivo en órbita. Aunque Laika no sobrevivió al viaje, su misión demostró que los organismos podían sobrevivir a las condiciones de lanzamiento y la ingravidez, un paso crucial para los futuros vuelos tripulados.',
      'El éxito soviético no terminó allí. En enero de 1958, Estados Unidos logró lanzar su primer satélite, el Explorer 1, que descubrió los cinturones de Van Allen — zonas de radiación atrapadas por el campo magnético terrestre. Así nació la carrera espacial, una competencia tecnológica y política que definiría una era.',
    ],
    2: [
      'La carrera espacial entre Estados Unidos y la Unión Soviética fue uno de los episodios más dramáticos de la Guerra Fría. Cada logro de un bando era respondido rápidamente por el otro, en una sucesión vertiginosa de primeros vuelos, misiones y descubrimientos que cautivaron al mundo entero.',
      'El 12 de abril de 1961, el cosmonauta soviético Yuri Gagarin se convirtió en el primer ser humano en el espacio a bordo de la Vostok 1. Su vuelo de 108 minutos lo convirtió en un héroe mundial. "La Tierra es azul", fueron sus famosas primeras palabras desde el espacio, una observación que resonó en millones de corazones.',
      'Estados Unidos respondió el 5 de mayo de 1961 con el vuelo suborbital de Alan Shepard a bordo de Freedom 7. Aunque Shepard no orbitó la Tierra (su vuelo duró solo 15 minutos), demostró que un americano también podía sobrevivir al viaje espacial. Poco después, el presidente John F. Kennedy pronunció su histórico discurso comprometiendo a EE.UU. a llevar un hombre a la Luna antes del final de la década.',
      'El programa Mercury de la NASA completó seis misiones tripuladas entre 1961 y 1963, estableciendo récords de altitud y duración. Le siguió el programa Gemini (1965-1966), con misiones de dos astronautas que perfeccionaron las técnicas críticas de caminata espacial, rendezvous orbital y acoplamiento — habilidades esenciales para el viaje a la Luna.',
    ],
    3: [
      'El 12 de abril de 1961, Yuri Gagarin escribió su nombre con letras de oro en la historia de la humanidad. A bordo de la cápsula Vostok 1, este joven piloto de la fuerza aérea soviética, de solo 27 años, se convirtió en el primer ser humano en viajar al espacio exterior y orbitar la Tierra.',
      'El vuelo de Gagarin duró apenas 108 minutos, pero el impacto fue eterno. Durante una órbita completa a unos 327 km de altitud, el cosmonauta experimentó ingravidez, observó la curvatura de la Tierra y presenció amaneceres y atardeceres cada 45 minutos. Su pulso llegó a 150 pulsaciones por minuto durante el lanzamiento, pero se estabilizó durante la órbita.',
      'La reacción mundial fue extraordinaria. Gagarin recibió títulos de héroe en docenas de países y fue recibido por multitudes wherever viajó. Incluso en plena Guerra Fría, sus logros fueron celebrados universalmente como un triunfo de toda la humanidad. Su sonrisa abierta y su carisma natural lo convirtieron en un símbolo de la era espacial.',
      'Trágicamente, Gagarin no viviría para ver los siguientes capítulos de la exploración espacial. Murió el 27 de marzo de 1968, a los 34 años, en un accidente durante un vuelo de entrenamiento en un avión MiG-15. Sin embargo, su legado como pionero del espacio continúa inspirando a cada nueva generación de astronautas y soñadores cósmicos.',
    ],
  },
  'exoplanets': {
    0: [
      'Hasta 1992, la idea de planetas orbitando otras estrellas era pura especulación científica. Hoy sabemos que los exoplanetas son increíblemente comunes en el universo: se estima que hay más planetas que estrellas en la Vía Láctea, con cifras que podrían superar el billón solo en nuestra galaxia. La búsqueda de mundos más allá del sistema solar ha revolucionado nuestra comprensión del cosmos.',
      'Los primeros exoplanetas confirmados fueron descubiertos en 1992 por los astrónomos Aleksander Wolszczan y Dale Frail. Sin embargo, no orbitaban una estrella normal: eran tres planetas que giraban alrededor de un púlsar, la estrella de neutrones remanente de una supernova. Fue un descubrimiento inesperado que demostró que los planetas podían existir en los ambientes más extremos.',
      'En 1995, Michel Mayor y Didier Queloz, de la Universidad de Ginebra, anunciaron el descubrimiento de 51 Pegasi b, el primer exoplaneta encontrado orbitando una estrella similar al Sol. Este planeta, un "Júpiter caliente" que orbita extremadamente cerca de su estrella, fue un descubrimiento que les valdría el Premio Nobel de Física en 2019.',
      'Desde entonces, la búsqueda de exoplanetas se ha acelerado exponencialmente. El telescopio espacial Kepler de la NASA, operativo entre 2009 y 2018, descubrió más de 2.600 exoplanetas confirmados. Su sucesor, TESS (Transiting Exoplanet Survey Satellite), continúa la búsqueda centrándose en estrellas brillantes cercanas, facilitando el estudio posterior con otros telescopios.',
    ],
    1: [
      'Los primeros descubrimientos de exoplanetas desafiaron completamente nuestras expectativas sobre cómo deberían ser los sistemas planetarios. El sistema solar, con sus planetas pequeños y rocosos cerca del Sol y gigantes gaseosos más lejos, parecía ser la norma. Los exoplanetas demostraron que la naturaleza es mucho más creativa de lo que imaginábamos.',
      'Los "Júpiteres calientes" fueron los primeros tipos de exoplanetas descubiertos en abundancia. Estos gigantes gaseosos con masas similares a Júpiter orbitan sus estrellas en cuestión de días, a distancias donde Mercurio parecería lejano. Sus temperaturas superficiales pueden superar los 1.000 °C, y algunos incluso tienen atmósferas de vapor de hierro y vidrio en forma de lluvia.',
      'El sistema 55 Cancri, descubierto entre 1997 y 2007, fue uno de los primeros sistemas planetarios múltiples encontrados. Contiene al menos cinco planetas, incluyendo un "Júpiter caliente" y un planeta (55 Cancri e) que podría estar cubierto de diamante líquido debido a su composición rica en carbono bajo presión extrema.',
      'En 2017, el descubrimiento del sistema TRAPPIST-1 causó sensación mundial. Se trata de siete planetas del tamaño de la Tierra orbitando una estrella enana ultrafría, tres de los cuales se encuentran en la zona habitable. Es el sistema planetario con más mundos potencialmente habitables conocidos hasta la fecha.',
    ],
  },
  'rocket-science': {
    0: [
      'La propulsión espacial es el arte y la ciencia de hacer que los vehículos abandonen la superficie terrestre y naveguen por el espacio. Se basa en uno de los principios más fundamentales de la física: la tercera ley de Newton, que establece que por cada acción existe una reacción igual y opuesta. Este principio simple es la base de toda la exploración espacial.',
      'Un cohete funciona expulsando masa a alta velocidad en una dirección, generando un empuje en la dirección opuesta. A diferencia de los aviones, que necesitan aire para volar (para generar sustentación con las alas y quemar combustible en los motores), los cohetes pueden funcionar en el vacío del espacio porque llevan su propio oxidante.',
      'La velocidad necesaria para que un objeto escape de la gravedad terrestre se llama velocidad de escape, que es aproximadamente 11,2 km/s (40.320 km/h). Alcanzar esta velocidad requiere una cantidad enorme de energía, lo que hace que la ingeniería de cohetes sea uno de los campos más desafiantes de la tecnología moderna.',
      'La relación entre combustible y carga útil es uno de los conceptos más contraintuitivos de la propulsión. Para enviar una carga útil relativamente pequeña al espacio, se necesita muchísimo combustible. Y ese combustible adicional también necesita combustible para moverse. Esta es la razón por la que los cohetes usan múltiples etapas: cada etapa se desecha cuando se agota, reduciendo el peso muerto.',
    ],
    1: [
      'Las tres leyes del movimiento de Isaac Newton, publicadas en 1687 en su obra "Principia Mathematica", son el fundamento absoluto de toda la ingeniería de cohetes. Sin estos principios, sería imposible diseñar, construir ni volar ningún vehículo espacial. Cada fase del vuelo de un cohete puede explicarse mediante estas leyes.',
      'La primera ley (inercia) establece que un objeto permanece en reposo o en movimiento rectilíneo uniforme a menos que una fuerza externa actúe sobre él. En el espacio, donde la fricción es prácticamente nula, un objeto en movimiento seguirá moviéndose indefinidamente. Es por esto que las sondas espaciales como Voyager continúan viajando décadas después de que sus motores se apagaron.',
      'La segunda ley (fuerza = masa × aceleración) explica cómo el empuje de un cohete genera aceleración. Si conocemos la masa del cohete y la fuerza que producen los motores, podemos calcular exactamente cuánta aceleración obtendremos. A medida que el cohete quema combustible y se vuelve más ligero, la aceleración aumenta con el mismo empuje.',
      'La tercera ley (acción y reacción) es el principio operativo del cohete. Los gases calientes expulsados por la tobera a alta velocidad son la "acción"; el empuje que impulsa al cohete hacia arriba es la "reacción". La ecuación del coete de Tsiolkovsky, derivada de estas leyes, permite calcular la velocidad final de un cohete basándose en la velocidad de escape de los gases y la relación entre masa inicial y final.',
    ],
  },
}

// ─── PRO Modal ───────────────────────────────────────────────
function ProModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(5, 5, 16, 0.9)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            ...cardBase,
            border: '1px solid rgba(245,158,11,0.2)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <CardGradientTop color="linear-gradient(90deg, #f59e0b, #ec4899)" />

          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
            />
          </div>

          <div className="relative z-10 p-6 md:p-8 text-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(236,72,153,0.15))',
                border: '1px solid rgba(245,158,11,0.25)',
              }}
            >
              <Crown className="w-8 h-8" style={{ color: '#f59e0b' }} />
            </motion.div>

            <h2 className="text-xl font-bold text-white mb-2">
              Contenido Exclusivo PRO
            </h2>
            <p className="text-white/50 text-sm mb-6">
              Este contenido es exclusivo para miembros PRO
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {[
                { icon: BookOpen, text: 'Acceso a todos los capítulos' },
                { icon: Eye, text: 'Lectura offline disponible' },
                { icon: Sparkles, text: 'Libros nuevos cada mes' },
              ].map((feat) => (
                <div key={feat.text} className="flex items-center gap-3 text-white/60 text-sm">
                  <feat.icon className="w-4 h-4" style={{ color: '#f59e0b' }} />
                  {feat.text}
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(245,158,11,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
                color: 'white',
              }}
            >
              <Crown className="w-4 h-4" />
              Hacerse PRO — $4.99/mes
            </motion.button>

            <button
              onClick={onClose}
              className="mt-3 text-white/30 text-xs hover:text-white/50 transition-colors"
            >
              Quizás después
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Book Reader View ────────────────────────────────────────
function BookReader({
  book,
  isPremium,
  progress,
  onOpenChapter,
  onBack,
}: {
  book: Book
  isPremium: boolean
  progress: ReadingProgress[string] | undefined
  onOpenChapter: (chapterIndex: number) => void
  onBack: () => void
}) {
  const completedChapters = progress?.completedChapters || []
  const currentChapter = progress?.currentChapter || 0
  const readCount = completedChapters.length
  const freeCount = book.chaptersList.filter((c) => c.free).length
  const totalFree = book.chaptersList.filter((c) => c.free).length
  const canAccessAll = isPremium || !book.isPremium

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la Biblioteca
      </motion.button>

      {/* Book header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl overflow-hidden mb-8"
        style={{
          background: book.coverGradient,
          minHeight: '200px',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <motion.span
            className="text-7xl md:text-8xl drop-shadow-2xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {book.emoji}
          </motion.span>
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-lg">
              {book.title}
            </h1>
            <p className="text-white/70 text-sm mb-2">por {book.author}</p>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="flex items-center gap-1 text-amber-300 text-xs">
                <Star className="w-3 h-3 fill-current" />
                {book.rating}
              </span>
              <span className="flex items-center gap-1 text-white/50 text-xs">
                <Users className="w-3 h-3" />
                {book.readers.toLocaleString()} lectores
              </span>
              <span className="flex items-center gap-1 text-white/50 text-xs">
                <BookMarked className="w-3 h-3" />
                {book.pages} páginas
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-xs">Progreso de lectura</span>
          <span className="text-xs font-semibold" style={{ color: '#00d4ff' }}>
            {readCount}/{book.chaptersList.length} capítulos
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: book.coverGradient }}
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: book.chaptersList.length > 0 ? readCount / book.chaptersList.length : 0,
              transition: { duration: 0.8, ease: 'easeOut' },
            }}
            originX={0}
          />
        </div>
      </div>

      {/* Chapter list */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-2"
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5" style={{ color: '#00d4ff' }} />
          <h2 className="text-lg font-semibold text-white">Capítulos</h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: '#00d4ff',
            }}
          >
            {book.chaptersList.length} capítulos
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
              color: '#10b981',
            }}
          >
            {totalFree} gratis
          </span>
        </div>

        {book.chaptersList.map((chapter, index) => {
          const isCompleted = completedChapters.includes(index)
          const isCurrent = index === currentChapter
          const isLocked = !canAccessAll && !chapter.free

          return (
            <motion.div
              key={index}
              variants={staggerItem}
              className={`relative rounded-xl overflow-hidden ${
                !isLocked ? 'cursor-pointer' : 'cursor-default'
              }`}
              style={{
                ...cardBase,
                borderColor: isCurrent
                  ? 'rgba(0,212,255,0.3)'
                  : isCompleted
                  ? 'rgba(16,185,129,0.2)'
                  : undefined,
                background: isLocked
                  ? 'rgba(255,255,255,0.01)'
                  : isCurrent
                  ? 'rgba(0,212,255,0.05)'
                  : undefined,
              }}
              onClick={() => {
                if (isLocked) return
                onOpenChapter(index)
              }}
              whileHover={!isLocked ? { x: 4, boxShadow: '0 0 20px rgba(0,212,255,0.08)' } : {}}
              whileTap={!isLocked ? { scale: 0.99 } : {}}
            >
              <CardGradientTop color={isCompleted ? 'linear-gradient(90deg, #10b981, #34d399)' : book.coverGradient} />

              <div className="relative z-10 flex items-center gap-3 p-4">
                {/* Chapter number */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{
                    background: isLocked
                      ? 'rgba(255,255,255,0.03)'
                      : isCompleted
                      ? 'rgba(16,185,129,0.15)'
                      : isCurrent
                      ? 'rgba(0,212,255,0.15)'
                      : 'rgba(255,255,255,0.05)',
                    color: isLocked ? 'rgba(255,255,255,0.15)' : isCompleted ? '#10b981' : isCurrent ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Chapter title */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      isLocked ? 'text-white/25' : isCurrent ? 'text-white' : isCompleted ? 'text-white/70' : 'text-white/50'
                    }`}
                  >
                    {chapter.title}
                  </p>
                  {chapter.free && (
                    <span className="text-[10px] font-medium" style={{ color: '#10b981' }}>
                      ✅ Gratis
                    </span>
                  )}
                </div>

                {/* Arrow */}
                {!isLocked && (
                  <ChevronRight
                    className="w-4 h-4 shrink-0"
                    style={{ color: isCurrent ? '#00d4ff' : 'rgba(255,255,255,0.2)' }}
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

// ─── Chapter Reader View ─────────────────────────────────────
function ChapterReader({
  book,
  chapterIndex,
  isPremium,
  onBack,
  onNavigate,
}: {
  book: Book
  chapterIndex: number
  isPremium: boolean
  onBack: () => void
  onNavigate: (direction: 'prev' | 'next') => void
}) {
  const chapter = book.chaptersList[chapterIndex]
  const content = chapterContent[book.id]?.[chapterIndex] || []
  const canAccessAll = isPremium || !book.isPremium
  const prevChapter = book.chaptersList[chapterIndex - 1]
  const nextChapter = book.chaptersList[chapterIndex + 1]
  const isPrevAccessible = chapterIndex > 0 && (canAccessAll || prevChapter?.free)
  const isNextAccessible = chapterIndex < book.chaptersList.length - 1 && (canAccessAll || nextChapter?.free)

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {book.title}
      </motion.button>

      {/* Chapter header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium" style={{ color: '#00d4ff' }}>
            Capítulo {chapterIndex + 1}
          </span>
          {chapter.free && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.3)',
                color: '#10b981',
              }}
            >
              GRATIS
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {chapter.title}
        </h1>
        <p className="text-white/40 text-sm">de {book.author}</p>
      </motion.div>

      {/* Reading progress bar */}
      <div className="mb-8">
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: book.coverGradient }}
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: book.chaptersList.length > 0 ? (chapterIndex + 1) / book.chaptersList.length : 0,
              transition: { duration: 0.8, ease: 'easeOut' },
            }}
            originX={0}
          />
        </div>
      </div>

      {/* Chapter content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative rounded-2xl overflow-hidden mb-8"
        style={cardBase}
      >
        <CardGradientTop color={book.coverGradient} />
        <div className="relative z-10 p-6 md:p-8 space-y-5" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {content.length > 0 ? (
            content.map((paragraph, i) => (
              <p key={i} className="text-white/65 text-sm md:text-base leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-10 h-10 text-white/15 mx-auto mb-3" />
              <p className="text-white/30 text-sm">
                Contenido del capítulo en desarrollo. ¡Pronto estará disponible!
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,212,255,0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('prev')}
          disabled={!isPrevAccessible}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          Capítulo Anterior
        </motion.button>

        {isNextAccessible ? (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,212,255,0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('next')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
              border: '1px solid rgba(0,212,255,0.3)',
              color: '#00d4ff',
            }}
          >
            Siguiente Capítulo
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        ) : chapterIndex < book.chaptersList.length - 1 ? (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
            style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              color: '#f59e0b',
            }}
          >
            <Lock className="w-3.5 h-3.5" />
            Desbloquea con PRO
          </motion.button>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────
export default function BibliotecaPage({
  userId,
  isPremium,
  userName,
}: {
  userId: string
  isPremium: boolean
  userName: string
}) {
  const [view, setView] = useState<View>('library')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number>(0)
  const [filter, setFilter] = useState<'all' | 'free' | 'pro' | 'new'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showProModal, setShowProModal] = useState(false)
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const stored = localStorage.getItem('astroverse_library_progress')
      if (stored) return JSON.parse(stored)
    } catch {
      // ignore
    }
    return {}
  })

  // ─── Save reading progress ───────────────────────────────
  const saveProgress = useCallback(
    (bookId: string, chapterIndex: number) => {
      setReadingProgress((prev) => {
        const existing = prev[bookId] || { currentChapter: 0, completedChapters: [] }
        const updated = {
          ...prev,
          [bookId]: {
            currentChapter: chapterIndex,
            completedChapters: existing.completedChapters.includes(chapterIndex)
              ? existing.completedChapters
              : [...existing.completedChapters, chapterIndex],
          },
        }
        try {
          localStorage.setItem('astroverse_library_progress', JSON.stringify(updated))
        } catch {
          // ignore
        }
        return updated
      })
    },
    []
  )

  // ─── Filter books ────────────────────────────────────────
  const categories = useMemo(() => {
    const cats = Array.from(new Set(books.map((b) => b.category)))
    return ['all', ...cats]
  }, [])

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (categoryFilter !== 'all' && book.category !== categoryFilter) return false
      if (filter === 'free') return !book.isPremium
      if (filter === 'pro') return book.isPremium
      if (filter === 'new') return book.id === 'mars-mission' || book.id === 'exoplanets' || book.id === 'rocket-science'
      return true
    })
  }, [filter, categoryFilter])

  // ─── Stats ───────────────────────────────────────────────
  const totalBooks = books.length
  const freeBooks = books.filter((b) => !b.isPremium).length
  const proBooks = books.filter((b) => b.isPremium).length

  // ─── Handle open book ────────────────────────────────────
  const handleOpenBook = (book: Book) => {
    setSelectedBook(book)
    setSelectedChapter(readingProgress[book.id]?.currentChapter || 0)
    setView('reader')
  }

  // ─── Handle open chapter ─────────────────────────────────
  const handleOpenChapter = (chapterIndex: number) => {
    if (!selectedBook) return
    const chapter = selectedBook.chaptersList[chapterIndex]
    const canAccess = isPremium || !selectedBook.isPremium

    if (!canAccess && !chapter.free) {
      setShowProModal(true)
      return
    }

    setSelectedChapter(chapterIndex)
    saveProgress(selectedBook.id, chapterIndex)
    setView('chapter')
  }

  // ─── Handle chapter navigation ───────────────────────────
  const handleChapterNavigate = (direction: 'prev' | 'next') => {
    if (!selectedBook) return
    const newIndex = direction === 'prev' ? selectedChapter - 1 : selectedChapter + 1

    if (newIndex < 0 || newIndex >= selectedBook.chaptersList.length) return

    const chapter = selectedBook.chaptersList[newIndex]
    const canAccess = isPremium || !selectedBook.isPremium

    if (!canAccess && !chapter.free) {
      setShowProModal(true)
      return
    }

    setSelectedChapter(newIndex)
    saveProgress(selectedBook.id, newIndex)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ─── Filter tabs ─────────────────────────────────────────
  const filterTabs = [
    { key: 'all' as const, label: 'Todos', count: totalBooks },
    { key: 'free' as const, label: 'Gratis', count: freeBooks },
    { key: 'pro' as const, label: 'PRO', count: proBooks },
    { key: 'new' as const, label: 'Nuevos', count: 3 },
  ]

  // ─── Book Reader View ────────────────────────────────────
  if (view === 'reader' && selectedBook) {
    return (
      <BookReader
        book={selectedBook}
        isPremium={isPremium}
        progress={readingProgress[selectedBook.id]}
        onOpenChapter={handleOpenChapter}
        onBack={() => setView('library')}
      />
    )
  }

  // ─── Chapter Reader View ─────────────────────────────────
  if (view === 'chapter' && selectedBook) {
    return (
      <ChapterReader
        book={selectedBook}
        chapterIndex={selectedChapter}
        isPremium={isPremium}
        onBack={() => setView('reader')}
        onNavigate={handleChapterNavigate}
      />
    )
  }

  // ─── Main Library View ───────────────────────────────────
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* PRO Modal */}
      <AnimatePresence>
        {showProModal && <ProModal onClose={() => setShowProModal(false)} />}
      </AnimatePresence>

      {/* ─── Header ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        className="text-center"
      >
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
            border: '1px solid rgba(0,212,255,0.2)',
          }}
        >
          <Library className="w-7 h-7" style={{ color: '#00d4ff' }} />
        </div>
        <h1
          className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}
        >
          📚 Biblioteca ASTROVERSE
        </h1>
        <p className="text-white/50 text-sm md:text-base">
          Libros y guías interactivas de astronomía
        </p>
      </motion.div>

      {/* ─── Stats Bar ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: 'Total libros', value: totalBooks, color: '#00d4ff', icon: BookMarked },
          { label: 'Gratis', value: freeBooks, color: '#10b981', icon: Unlock },
          { label: 'Premium', value: proBooks, color: '#f59e0b', icon: Crown },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center"
            style={{
              background: `${stat.color}08`,
              border: `1px solid ${stat.color}18`,
            }}
          >
            <stat.icon className="w-4 h-4 mx-auto mb-1" style={{ color: stat.color }} />
            <p className="text-lg font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-white/35 text-[10px]">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* ─── Filter Tabs ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        {filterTabs.map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFilter(tab.key)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0"
            style={{
              background: filter === tab.key ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.03)',
              border: filter === tab.key ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: filter === tab.key ? '#00d4ff' : 'rgba(255,255,255,0.4)',
            }}
          >
            {tab.label}
            <span className="text-[10px] opacity-60">({tab.count})</span>
          </motion.button>
        ))}
      </motion.div>

      {/* ─── Category Filter ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
      >
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs font-medium appearance-none cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <option value="all">Todas las categorías</option>
            {categories.slice(1).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* ─── Books Grid ──────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {filteredBooks.map((book) => {
          const progress = readingProgress[book.id]
          const readCount = progress?.completedChapters.length || 0

          return (
            <motion.div
              key={book.id}
              variants={staggerItem}
              className="relative overflow-hidden rounded-2xl cursor-pointer group"
              style={cardBase}
              onClick={() => handleOpenBook(book)}
              whileHover={{
                y: -4,
                boxShadow: '0 0 30px rgba(0,212,255,0.06), 0 8px 32px rgba(0,0,0,0.3)',
              }}
              whileTap={{ scale: 0.99 }}
            >
              <CardGradientTop color={book.coverGradient} />

              <div className="relative z-10">
                {/* Book cover */}
                <div
                  className="relative h-40 overflow-hidden"
                  style={{ background: book.coverGradient }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <motion.span
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl drop-shadow-2xl"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    {book.emoji}
                  </motion.span>
                  {/* Premium badge */}
                  {book.isPremium && (
                    <div
                      className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold"
                      style={{
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(236,72,153,0.2))',
                        border: '1px solid rgba(245,158,11,0.35)',
                        color: '#f59e0b',
                      }}
                    >
                      <Crown className="w-3 h-3" />
                      PRO
                    </div>
                  )}
                  {!book.isPremium && (
                    <div
                      className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold"
                      style={{
                        background: 'rgba(16,185,129,0.15)',
                        border: '1px solid rgba(16,185,129,0.3)',
                        color: '#10b981',
                      }}
                    >
                      <Unlock className="w-3 h-3" />
                      GRATIS
                    </div>
                  )}
                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-sm font-bold text-white truncate">{book.title}</h3>
                  </div>
                </div>

                {/* Info section */}
                <div className="p-4">
                  {/* Author & category */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/40 text-xs">{book.author}</span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {book.category}
                    </span>
                  </div>

                  {/* Rating & readers */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center gap-1 text-amber-300 text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      {book.rating}
                    </span>
                    <span className="flex items-center gap-1 text-white/30 text-xs">
                      <Users className="w-3 h-3" />
                      {book.readers.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-white/30 text-xs">
                      <BookMarked className="w-3 h-3" />
                      {book.chapters} cap.
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-white/40 text-xs leading-relaxed mb-3 line-clamp-2">
                    {book.description}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {book.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{
                          background: 'rgba(0,212,255,0.08)',
                          border: '1px solid rgba(0,212,255,0.15)',
                          color: 'rgba(0,212,255,0.7)',
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                    {book.topics.length > 3 && (
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          color: 'rgba(255,255,255,0.3)',
                        }}
                      >
                        +{book.topics.length - 3} más
                      </span>
                    )}
                  </div>

                  {/* Reading progress */}
                  {readCount > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/30 text-[10px]">Progreso</span>
                        <span className="text-[10px] font-semibold" style={{ color: '#10b981' }}>
                          {readCount}/{book.chaptersList.length} leídos
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }}
                          initial={{ scaleX: 0 }}
                          animate={{
                            scaleX: readCount / book.chaptersList.length,
                            transition: { duration: 0.6, ease: 'easeOut' },
                          }}
                          originX={0}
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <motion.button
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(124,58,237,0.12))',
                      border: '1px solid rgba(0,212,255,0.25)',
                      color: '#00d4ff',
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 0 20px rgba(0,212,255,0.15)',
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(124,58,237,0.18))',
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenBook(book)
                    }}
                  >
                    <BookOpen className="w-4 h-4" />
                    Leer Ahora
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ─── Empty State ─────────────────────────────────── */}
      {filteredBooks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-8 text-center"
          style={cardBase}
        >
          <BookOpen className="w-10 h-10 text-white/15 mx-auto mb-3" />
          <p className="text-white/40 text-sm">
            No se encontraron libros con los filtros seleccionados.
          </p>
          <button
            onClick={() => {
              setFilter('all')
              setCategoryFilter('all')
            }}
            className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Limpiar filtros
          </button>
        </motion.div>
      )}
    </div>
  )
}
