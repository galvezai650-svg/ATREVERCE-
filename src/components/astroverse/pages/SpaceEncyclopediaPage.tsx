'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Globe2, Rocket, Satellite, Star, ChevronDown, ChevronUp,
  Thermometer, Wind, Weight, Ruler, Clock, Moon, Sun, Orbit,
  Zap, Shield, Compass, Mountain, Droplets, CloudRain, Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// DATA: Planets
// ============================================================
const planets = [
  {
    name: 'Sol', type: 'Estrella', emoji: '☀️', gradient: 'from-yellow-400 via-orange-500 to-red-500', color: '#f59e0b',
    tagline: 'Nuestra estrella madre',
    description: 'El Sol es una estrella enana amarilla de tipo G2V en la secuencia principal. Contiene el 99.86% de toda la masa del sistema solar y es la fuente de energía que sustenta la vida en la Tierra.',
    stats: [
      { label: 'Tipo', value: 'Enana Amarilla (G2V)', icon: Star },
      { label: 'Diámetro', value: '1,392,684 km', icon: Ruler },
      { label: 'Masa', value: '1.989 × 10³⁰ kg', icon: Weight },
      { label: 'Temperatura Superficie', value: '5,500°C', icon: Thermometer },
      { label: 'Temperatura Núcleo', value: '15,000,000°C', icon: Thermometer },
      { label: 'Edad', value: '4,600 millones años', icon: Clock },
      { label: 'Composición', value: '73% H, 25% He', icon: Zap },
      { label: 'Luminosidad', value: '3.828 × 10²⁶ W', icon: Sun },
    ],
    facts: [
      'Cada segundo, el Sol convierte 600 millones de toneladas de hidrógeno en helio.',
      'La luz del Sol tarda 8 minutos y 19 segundos en llegar a la Tierra.',
      'El Sol podría contener 1.3 millones de Tierras en su interior.',
      'Las manchas solares pueden ser más grandes que la Tierra.',
      'El viento solar viaja a 400-800 km/s.',
    ],
    missions: [
      { name: 'Parker Solar Probe', year: 2018, org: 'NASA', status: 'Activa', desc: 'Sonda más cercana al Sol, tocando la corona solar.' },
      { name: 'Solar Orbiter', year: 2020, org: 'ESA/NASA', status: 'Activa', desc: 'Observación detallada de los polos solares.' },
      { name: 'SOHO', year: 1995, org: 'ESA/NASA', status: 'Activa', desc: 'Observatorio solar y heliosférico.' },
    ],
  },
  {
    name: 'Mercurio', type: 'Planeta Rocoso', emoji: '🪨', gradient: 'from-gray-500 to-gray-700', color: '#9ca3af',
    tagline: 'El mensajero veloz',
    description: 'Mercurio es el planeta más pequeño y más cercano al Sol. No tiene atmósfera significativa, lo que causa temperaturas extremas: desde -180°C en la noche hasta 430°C durante el día.',
    stats: [
      { label: 'Diámetro', value: '4,879 km', icon: Ruler },
      { label: 'Masa', value: '3.30 × 10²³ kg', icon: Weight },
      { label: 'Distancia al Sol', value: '57.9 millones km', icon: Compass },
      { label: 'Temperatura', value: '-180°C a 430°C', icon: Thermometer },
      { label: 'Día', value: '59 días terrestres', icon: Clock },
      { label: 'Año', value: '88 días terrestres', icon: Clock },
      { label: 'Lunas', value: '0', icon: Moon },
      { label: 'Gravedad', value: '3.7 m/s²', icon: Weight },
    ],
    facts: [
      'Un día en Mercurio (amanecer a amanecer) dura 176 días terrestres.',
      'Mercurio se ha encogido ~7 km de diámetro desde su formación.',
      'Tiene hielo en sus polos a pesar de ser el planeta más caliente.',
      'Su núcleo de hierro ocupa el 85% del radio del planeta.',
      'La diferencia de temperatura entre día y noche es de 600°C.',
    ],
    missions: [
      { name: 'Mariner 10', year: 1974, org: 'NASA', status: 'Completada', desc: 'Primera nave en visitar Mercurio.' },
      { name: 'MESSENGER', year: 2011, org: 'NASA', status: 'Completada', desc: 'Primera en orbitar Mercurio. Confirmó hielo en polos.' },
      { name: 'BepiColombo', year: 2018, org: 'ESA/JAXA', status: 'En tránsito', desc: 'Llegada a Mercurio en 2025.' },
    ],
  },
  {
    name: 'Venus', type: 'Planeta Rocoso', emoji: '🌕', gradient: 'from-orange-400 to-yellow-600', color: '#f97316',
    tagline: 'El gemelo infernal de la Tierra',
    description: 'Venus es el planeta más caliente del sistema solar debido a su densa atmósfera de CO₂ que genera un efecto invernadero extremo. Rota en dirección opuesta a los demás planetas.',
    stats: [
      { label: 'Diámetro', value: '12,104 km', icon: Ruler },
      { label: 'Masa', value: '4.87 × 10²⁴ kg', icon: Weight },
      { label: 'Distancia al Sol', value: '108.2 millones km', icon: Compass },
      { label: 'Temperatura', value: '465°C promedio', icon: Thermometer },
      { label: 'Día', value: '243 días terrestres', icon: Clock },
      { label: 'Año', value: '225 días terrestres', icon: Clock },
      { label: 'Lunas', value: '0', icon: Moon },
      { label: 'Presión atmósfera', value: '92 atm', icon: Wind },
    ],
    facts: [
      'Un día en Venus es más largo que un año venusiano.',
      'La presión en su superficie es como estar a 900m bajo el mar.',
      'Llueve ácido sulfúrico en Venus, pero se evapora antes de tocar el suelo.',
      'Venus rota al revés: el Sol sale por el oeste y se pone por el este.',
      'Es el planeta más brillante visto desde la Tierra después del Sol y la Luna.',
    ],
    missions: [
      { name: 'Venera 7', year: 1970, org: 'URSS', status: 'Completada', desc: 'Primera nave en transmitir desde la superficie de otro planeta.' },
      { name: 'Magellan', year: 1990, org: 'NASA', status: 'Completada', desc: 'Mapeó el 98% de la superficie con radar.' },
      { name: 'DAVINCI+', year: 2029, org: 'NASA', status: 'Planeada', desc: 'Estudiará la atmósfera y superficie en profundidad.' },
    ],
  },
  {
    name: 'Tierra', type: 'Planeta Rocoso', emoji: '🌍', gradient: 'from-cyan-400 via-blue-500 to-green-500', color: '#00d4ff',
    tagline: 'Nuestro hogar azul',
    description: 'La Tierra es el único planeta conocido que alberga vida. Su distancia perfecta del Sol, atmósfera rica en oxígeno y agua líquida la hacen única en el sistema solar.',
    stats: [
      { label: 'Diámetro', value: '12,756 km', icon: Ruler },
      { label: 'Masa', value: '5.97 × 10²⁴ kg', icon: Weight },
      { label: 'Distancia al Sol', value: '149.6 millones km', icon: Compass },
      { label: 'Temperatura', value: '-89°C a 57°C', icon: Thermometer },
      { label: 'Día', value: '24 horas', icon: Clock },
      { label: 'Año', value: '365.25 días', icon: Clock },
      { label: 'Lunas', value: '1 (Luna)', icon: Moon },
      { label: 'Agua superficial', value: '71%', icon: Droplets },
    ],
    facts: [
      'La Tierra es el planeta más denso del sistema solar.',
      'El campo magnético nos protege del viento solar.',
      'La Tierra viaja por el espacio a 107,000 km/h.',
      'El 97% del agua de la Tierra es salada.',
      'Cada día, la Tierra recibe suficiente energía solar para abastecer al mundo por 27 años.',
    ],
    missions: [
      { name: 'ISS', year: 1998, org: 'Internacional', status: 'Activa', desc: 'Estación espacial internacional, habitada continuamente desde 2000.' },
      { name: 'Hubble', year: 1990, org: 'NASA/ESA', status: 'Activa', desc: 'Telescopio espacial que revolucionó la astronomía.' },
      { name: 'James Webb', year: 2021, org: 'NASA/ESA/CSA', status: 'Activa', desc: 'Telescopio más potente jamás construido.' },
    ],
  },
  {
    name: 'Marte', type: 'Planeta Rocoso', emoji: '🔴', gradient: 'from-red-500 to-red-800', color: '#ef4444',
    tagline: 'El planeta rojo',
    description: 'Marte es el objetivo principal de la exploración humana futura. Tiene el volcán más alto (Monte Olimpo, 21.9 km) y el cañón más largo (Valles Marineris, 4,000 km) del sistema solar.',
    stats: [
      { label: 'Diámetro', value: '6,792 km', icon: Ruler },
      { label: 'Masa', value: '6.42 × 10²³ kg', icon: Weight },
      { label: 'Distancia al Sol', value: '227.9 millones km', icon: Compass },
      { label: 'Temperatura', value: '-140°C a 20°C', icon: Thermometer },
      { label: 'Día', value: '24h 37min', icon: Clock },
      { label: 'Año', value: '687 días terrestres', icon: Clock },
      { label: 'Lunas', value: '2 (Fobos, Deimos)', icon: Moon },
      { label: 'Gravedad', value: '3.72 m/s²', icon: Weight },
    ],
    facts: [
      'El Monte Olimpo es casi 3 veces más alto que el Everest.',
      'Marte tiene estaciones similares a la Tierra debido a su inclinación.',
      'Fobos se acerca lentamente a Marte y en 50M años chocará.',
      'Se han encontrado rastros de agua líquida antigua en Marte.',
      'Un día en Marte se llama "sol" y dura 24h 39m.',
    ],
    missions: [
      { name: 'Perseverance', year: 2021, org: 'NASA', status: 'Activa', desc: 'Rover buscando vida antigua. Trae helicóptero Ingenuity.' },
      { name: 'Curiosity', year: 2012, org: 'NASA', status: 'Activa', desc: 'Rover nuclear explorando el cráter Gale.' },
      { name: 'Tianwen-1', year: 2021, org: 'CNSA', status: 'Activa', desc: 'Primera misión china con rover en Marte (Zhurong).' },
      { name: 'Mars Express', year: 2003, org: 'ESA', status: 'Activa', desc: 'Órbita y módulo de aterrizaje Beagle 2.' },
    ],
  },
  {
    name: 'Júpiter', type: 'Gigante Gaseoso', emoji: '🟠', gradient: 'from-amber-400 via-orange-500 to-red-600', color: '#f59e0b',
    tagline: 'El rey de los planetas',
    description: 'Júpiter es el planeta más grande del sistema solar. Su Gran Mancha Roja es una tormenta anticiclónica que ha durado más de 350 años y es más grande que la Tierra.',
    stats: [
      { label: 'Diámetro', value: '142,984 km', icon: Ruler },
      { label: 'Masa', value: '1.90 × 10²⁷ kg', icon: Weight },
      { label: 'Distancia al Sol', value: '778.6 millones km', icon: Compass },
      { label: 'Temperatura', value: '-110°C (nubes)', icon: Thermometer },
      { label: 'Día', value: '9h 56min', icon: Clock },
      { label: 'Año', value: '11.86 años terrestres', icon: Clock },
      { label: 'Lunas', value: '95 conocidas', icon: Moon },
      { label: 'Vientos máximos', value: '620 km/h', icon: Wind },
    ],
    facts: [
      'Júpiter podría contener 1,300 Tierras en su interior.',
      'Su luna Europa tiene un océano subterráneo con más agua que la Tierra.',
      'La Gran Mancha Roja se está encogiendo.',
      'Júpiter actúa como un "escudo"吸引了 hacia él muchos asteroides.',
      'Tiene el día más corto de todos los planetas: menos de 10 horas.',
    ],
    missions: [
      { name: 'Juno', year: 2016, org: 'NASA', status: 'Activa', desc: 'Estudia la atmósfera, magnetosfera y estructura interna.' },
      { name: 'Galileo', year: 1995, org: 'NASA', status: 'Completada', desc: 'Primera en orbitar Júpiter. Descubrió océano en Europa.' },
      { name: 'Europa Clipper', year: 2024, org: 'NASA', status: 'En tránsito', desc: 'Estudiará en detalle la luna Europa y su océano.' },
    ],
  },
  {
    name: 'Saturno', type: 'Gigante Gaseoso', emoji: '🪐', gradient: 'from-yellow-300 via-amber-400 to-orange-500', color: '#eab308',
    tagline: 'El señor de los anillos',
    description: 'Saturno es famoso por su espectacular sistema de anillos, compuestos principalmente de partículas de hielo y roca que van desde micrómetros hasta metros de tamaño.',
    stats: [
      { label: 'Diámetro', value: '120,536 km', icon: Ruler },
      { label: 'Masa', value: '5.68 × 10²⁶ kg', icon: Weight },
      { label: 'Distancia al Sol', value: '1,433.5 millones km', icon: Compass },
      { label: 'Temperatura', value: '-178°C', icon: Thermometer },
      { label: 'Día', value: '10h 42min', icon: Clock },
      { label: 'Año', value: '29.46 años terrestres', icon: Clock },
      { label: 'Lunas', value: '146 conocidas', icon: Moon },
      { label: 'Extensión anillos', value: '282,000 km', icon: Orbit },
    ],
    facts: [
      'Saturno es menos denso que el agua: flotaría en una bañera gigante.',
      'Sus anillos podrían tener solo 100 millones de años, mucho menos que Saturno.',
      'Titán, su luna más grande, tiene lagos de metano líquido.',
      'Los anillos son increíblemente delgados: solo ~10m de grosor.',
      'Titán tiene una atmósfera más densa que la de la Tierra.',
    ],
    missions: [
      { name: 'Cassini-Huygens', year: 2004, org: 'NASA/ESA', status: 'Completada', desc: 'Orbitó Saturno 13 años. Huygens aterrizó en Titán.' },
      { name: 'Pioneer 11', year: 1979, org: 'NASA', status: 'Completada', desc: 'Primera en sobrevolar Saturno de cerca.' },
      { name: 'Dragonfly', year: 2034, org: 'NASA', status: 'Planeada', desc: 'Dron nuclear que volará en la atmósfera de Titán.' },
    ],
  },
  {
    name: 'Urano', type: 'Gigante de Hielo', emoji: '🔵', gradient: 'from-cyan-300 to-teal-500', color: '#14b8a6',
    tagline: 'El gigante caído',
    description: 'Urano es único porque rota de lado, con una inclinación axial de 98°. Probablemente fue golpeado por un objeto del tamaño de la Tierra temprano en su historia.',
    stats: [
      { label: 'Diámetro', value: '51,118 km', icon: Ruler },
      { label: 'Masa', value: '8.68 × 10²⁵ kg', icon: Weight },
      { label: 'Distancia al Sol', value: '2,872.5 millones km', icon: Compass },
      { label: 'Temperatura', value: '-224°C', icon: Thermometer },
      { label: 'Día', value: '17h 14min', icon: Clock },
      { label: 'Año', value: '84 años terrestres', icon: Clock },
      { label: 'Lunas', value: '27 conocidas', icon: Moon },
      { label: 'Inclinación', value: '97.77°', icon: Globe2 },
    ],
    facts: [
      'Urano fue el primer planeta descubierto con telescopio (1781).',
      'Su eje de rotación está casi paralelo a su órbita.',
      'Tiene los anillos más oscuros del sistema solar.',
      'Puede hacer -224°C, es el planeta más frío.',
      'Fue visitado solo una vez por una nave: Voyager 2 en 1986.',
    ],
    missions: [
      { name: 'Voyager 2', year: 1986, org: 'NASA', status: 'Completada', desc: 'Única nave que ha visitado Urano. Descubrió 10 lunas nuevas.' },
      { name: 'Uranus Orbiter', year: '2030s', org: 'NASA', status: 'Propuesta', desc: 'Misión recomendada por el Decadal Survey 2023.' },
    ],
  },
  {
    name: 'Neptuno', type: 'Gigante de Hielo', emoji: '🫧', gradient: 'from-blue-500 to-indigo-700', color: '#6366f1',
    tagline: 'El gigante azul salvaje',
    description: 'Neptuno es el planeta más lejano del Sol y tiene los vientos más rápidos del sistema solar, alcanzando velocidades de hasta 2,100 km/h.',
    stats: [
      { label: 'Diámetro', value: '49,528 km', icon: Ruler },
      { label: 'Masa', value: '1.02 × 10²⁶ kg', icon: Weight },
      { label: 'Distancia al Sol', value: '4,495 millones km', icon: Compass },
      { label: 'Temperatura', value: '-214°C', icon: Thermometer },
      { label: 'Día', value: '16h 6min', icon: Clock },
      { label: 'Año', value: '164.8 años terrestres', icon: Clock },
      { label: 'Lunas', value: '16 conocidas', icon: Moon },
      { label: 'Vientos máximos', value: '2,100 km/h', icon: Wind },
    ],
    facts: [
      'Neptuno fue el primer planeta descubierto por predicción matemática.',
      'No ha completado ni una órbita desde que fue descubierto en 1846.',
      'Su luna Tritón orbita en dirección opuesta y es capturada del cinturón de Kuiper.',
      'Tiene la Gran Mancha Oscura, similar a la de Júpiter.',
      'Sus vientos supersónicos son los más rápidos del sistema solar.',
    ],
    missions: [
      { name: 'Voyager 2', year: 1989, org: 'NASA', status: 'Completada', desc: 'Única nave que ha visitado Neptuno.' },
      { name: 'Neptune Odyssey', year: '2030s', org: 'NASA', status: 'Propuesta', desc: 'Orbitador y sonda para estudiar Tritón.' },
    ],
  },
]

// ============================================================
// DATA: Rockets
// ============================================================
const rockets = [
  {
    name: 'Saturn V', org: 'NASA', year: 1967, emoji: '🚀', gradient: 'from-gray-400 to-gray-600', color: '#9ca3af',
    description: 'El cohete más poderoso jamás construido que llevó al hombre a la Luna. Alcanzaba 3,400 toneladas de empuje.',
    height: '110.6 m', mass: '2,970 ton', thrust: '34.02 MN', payload: '140 ton (LEO)',
    missions: 13, status: 'Retirado', notable: 'Apollo 11 — Primer hombre en la Luna (1969)',
  },
  {
    name: 'Falcon 9', org: 'SpaceX', year: 2010, emoji: '🔥', gradient: 'from-zinc-700 to-zinc-900', color: '#a1a1aa',
    description: 'Revolutionó la industria aeroespacial con su booster reutilizable. Ha realizado más de 300 misiones exitosas.',
    height: '70 m', mass: '549 ton', thrust: '7.6 MN', payload: '22.8 ton (LEO)',
    missions: '300+', status: 'Activo', notable: 'Transporta astronautas a la ISS (Crew Dragon)',
  },
  {
    name: 'Starship', org: 'SpaceX', year: 2023, emoji: '⭐', gradient: 'from-stone-500 to-stone-700', color: '#78716c',
    description: 'El cohete más grande y poderoso jamás construido. Diseñado para llevar humanos a Marte y ser 100% reutilizable.',
    height: '121 m', mass: '5,000 ton', thrust: '75.9 MN', payload: '150 ton (LEO)',
    missions: 'En desarrollo', status: 'En pruebas', notable: 'Destinado a llevar humanos a Marte',
  },
  {
    name: 'SLS (Space Launch System)', org: 'NASA', year: 2022, emoji: '🌟', gradient: 'from-orange-400 to-orange-600', color: '#f97316',
    description: 'El cohete más potente operacional de la NASA. Diseñado para el programa Artemis de retorno a la Luna.',
    height: '98.1 m', mass: '2,613 ton', thrust: '39.1 MN', payload: '95 ton (LEO)',
    missions: 2, status: 'Activo', notable: 'Artemis I — Órbita lunar sin tripulación (2022)',
  },
  {
    name: 'Falcon Heavy', org: 'SpaceX', year: 2018, emoji: '💪', gradient: 'from-amber-500 to-amber-700', color: '#f59e0b',
    description: 'El cohete operacional más potente del mundo hasta el SLS. Compuesto por tres Falcon 9 acoplados.',
    height: '70 m', mass: '1,428 ton', thrust: '22.8 MN', payload: '63.8 ton (LEO)',
    missions: 10, status: 'Activo', notable: 'Lanzó el Tesla Roadster de Elon Musk al espacio (2018)',
  },
  {
    name: 'Ariane 5', org: 'Arianespace', year: 1996, emoji: '🇪🇺', gradient: 'from-blue-400 to-blue-600', color: '#3b82f6',
    description: 'El cohete europeo que lanzó el Telescopio James Webb. Desarrollado por la ESA para misiones comerciales y científicas.',
    height: '57 m', mass: '780 ton', thrust: '13.7 MN', payload: '21 ton (GTO)',
    missions: 117, status: 'Retirado (2023)', notable: 'Lanzamiento del JWST (2021)',
  },
  {
    name: 'Long March 5', org: 'CASC/CNSA', year: 2016, emoji: '🇨🇳', gradient: 'from-red-500 to-red-700', color: '#ef4444',
    description: 'El cohete más potente de China. Utilizado para lanzar la estación espacial Tiangong y misiones lunares.',
    height: '56.97 m', mass: '869 ton', thrust: '10.5 MN', payload: '25 ton (LEO)',
    missions: 15, status: 'Activo', notable: 'Estación Espacial Tiangong y misión Chang\'e 5 (lunar)',
  },
  {
    name: 'Vulcan Centaur', org: 'ULA', year: 2024, emoji: '🇺🇸', gradient: 'from-blue-300 to-indigo-500', color: '#818cf8',
    description: 'Nuevo cohete pesado de ULA reemplazando al Atlas V y Delta IV. Utiliza motores BE-4 de Blue Origin.',
    height: '64.8 m', mass: '567 ton', thrust: '16.4 MN', payload: '27.2 ton (LEO)',
    missions: 2, status: 'Activo', notable: 'Primera misión lunar comercial Peregrine (2024)',
  },
]

// ============================================================
// DATA: Satellites
// ============================================================
const satellites = [
  {
    name: 'Hubble', year: 1990, org: 'NASA/ESA', type: 'Telescopio Espacial', emoji: '🔭', color: '#8b5cf6', status: 'Activo',
    orbit: 'LEO (547 km)', description: 'Telescopio espacial que ha revolucionado nuestra comprensión del universo con imágenes espectaculares de galaxias, nebulosas y planetas.',
  },
  {
    name: 'James Webb (JWST)', year: 2021, org: 'NASA/ESA/CSA', type: 'Telescopio Espacial', emoji: '✨', color: '#f59e0b', status: 'Activo',
    orbit: 'L2 (1.5M km)', description: 'El telescopio más potente jamás construido. Observa en infrarrojo, pudiendo ver las galaxias más antiguas del universo.',
  },
  {
    name: 'ISS', year: 1998, org: 'Internacional', type: 'Estación Espacial', emoji: '🛸', color: '#00d4ff', status: 'Activo',
    orbit: 'LEO (408 km)', description: 'La estructura más grande construida en el espacio. Habitada continuamente desde noviembre de 2000 por tripulaciones internacionales.',
  },
  {
    name: 'Starlink', year: 2019, org: 'SpaceX', type: 'Constelación', emoji: '📡', color: '#3b82f6', status: 'Activo (6,000+ satélites)',
    orbit: 'LEO (550 km)', description: 'Megaconstelación de satélites de SpaceX para proveer internet de banda ancha a todo el mundo, especialmente áreas rurales.',
  },
  {
    name: 'GPS (Navstar)', year: 1978, org: 'USAF', type: 'Navegación', emoji: '📍', color: '#10b981', status: 'Activo (31+ satélites)',
    orbit: 'MEO (20,200 km)', description: 'Sistema de posicionamiento global que permite localización precisa en cualquier punto de la Tierra con precisión de metros.',
  },
  {
    name: 'GOES-16', year: 2016, org: 'NASA/NOAA', type: 'Meteorológico', emoji: '🌦️', color: '#06b6d4', status: 'Activo',
    orbit: 'GEO (35,786 km)', description: 'Satélite meteorológico geoesincronizado que monitorea el clima de las Américas con imágenes cada 30 segundos.',
  },
  {
    name: 'Kepler', year: 2009, org: 'NASA', type: 'Exoplanetas', emoji: '🪐', color: '#ec4899', status: 'Retirado (2018)',
    orbit: 'Heliocéntrica', description: 'Descubrió más de 5,000 candidatos a exoplanetas. Demostró que hay más planetas que estrellas en la Vía Láctea.',
  },
  {
    name: 'Voyager 1', year: 1977, org: 'NASA', type: 'Sonda Interestelar', emoji: '🌌', color: '#f97316', status: 'Activa',
    orbit: 'Espacio interestelar (24.4 milM km)', description: 'El objeto humano más lejano de la Tierra. Actualmente a más de 162 UA del Sol. Sigue transmitiendo datos.',
  },
  {
    name: 'Parker Solar Probe', year: 2018, org: 'NASA', type: 'Sonda Solar', emoji: '☀️', color: '#eab308', status: 'Activa',
    orbit: 'Heliocéntrica (elíptica)', description: 'La sonda más cercana al Sol jamás construida. Se acerca a 6.2 millones de km de la superficie solar.',
  },
  {
    name: 'Tiangong', year: 2021, org: 'CNSA', type: 'Estación Espacial', emoji: '🏙️', color: '#ef4444', status: 'Activa',
    orbit: 'LEO (340-450 km)', description: 'Estación espacial china de tres módulos. Operada por la CNSA como rival de la ISS con capacidad de 3 astronautas.',
  },
  {
    name: 'Hubble (hst)', year: 1990, org: 'NASA/ESA', type: 'Telescopio', emoji: '🔭', color: '#a855f7', status: 'Activo',
    orbit: 'LEO (547 km)', description: 'Más de 30 años de servicio. Ha realizado más de 1.5 millones de observaciones y publicado 19,000+ artículos científicos.',
  },
  {
    name: 'Mars Reconnaissance Orbiter', year: 2006, org: 'NASA', type: 'Orbitador Marciano', emoji: '🔴', color: '#dc2626', status: 'Activo',
    orbit: 'Órbita marciana (250-316 km)', description: 'Ha transmitido más datos que todas las otras naves interplanetarias juntas. Descubrió evidencia de agua líquida en Marte.',
  },
]

// ============================================================
// Detail Panel Component
// ============================================================
function DetailPanel({ item, type, onClose }: {
  item: typeof planets[0] | typeof rockets[0] | typeof satellites[0]
  type: 'planet' | 'rocket' | 'satellite'
  onClose: () => void
}) {
  const p = item as any

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="fixed inset-0 z-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className="relative z-10 w-full max-w-2xl my-8 rounded-2xl overflow-hidden"
        style={{
          ...cardBase,
          background: 'rgba(8,8,24,0.97)',
          backdropFilter: 'blur(40px)',
        }}
        initial={{ scale: 0.92, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 30, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
      >
        <CardGradientTop color={`linear-gradient(90deg, ${p.color}, ${p.color}00)`} />

        {/* Header */}
        <div className="relative p-6 pb-4">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90">
            <ChevronUp size={16} className="rotate-90" />
          </button>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-3xl shrink-0`} style={{ boxShadow: `0 0 40px ${p.color}25` }}>
              {p.emoji}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-white">{p.name}</h2>
                {p.type && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${p.color}15`, border: `1px solid ${p.color}30`, color: p.color }}>
                    {p.type}
                  </span>
                )}
              </div>
              {p.tagline && <p className="text-white/40 text-sm italic mt-0.5">"{p.tagline}"</p>}
              {p.org && <p className="text-white/25 text-xs mt-0.5">{p.org} {p.year ? `· ${p.year}` : ''}</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 pb-4">
          <p className="text-white/60 text-sm leading-relaxed">{p.description}</p>
        </div>

        {/* Stats Grid */}
        {p.stats && p.stats.length > 0 && (
          <div className="px-6 pb-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <BarChart3 size={14} className="text-cyan-400" />
              Datos y Estadísticas
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {p.stats.map((s: any) => (
                <div key={s.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <s.icon size={10} className="text-white/20" />
                    <span className="text-white/25 text-[10px]">{s.label}</span>
                  </div>
                  <p className="text-white/80 text-xs font-semibold">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rocket specs */}
        {(p as any).height && (
          <div className="px-6 pb-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Ruler size={14} className="text-amber-400" />
              Especificaciones del Cohete
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Altura', value: (p as any).height },
                { label: 'Masa', value: (p as any).mass },
                { label: 'Empuje', value: (p as any).thrust },
                { label: 'Carga útil', value: (p as any).payload },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-white/25 text-[10px]">{s.label}</span>
                  <p className="text-white/80 text-xs font-semibold mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Satellite orbit */}
        {(p as any).orbit && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Orbit size={16} className="text-cyan-400 shrink-0" />
              <div>
                <span className="text-white/25 text-[10px]">Órbita</span>
                <p className="text-white/70 text-xs font-semibold">{(p as any).orbit}</p>
              </div>
            </div>
          </div>
        )}

        {/* Facts */}
        {p.facts && p.facts.length > 0 && (
          <div className="px-6 pb-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              Datos Curiosos
            </h3>
            <div className="space-y-2">
              {p.facts.map((f: string, i: number) => (
                <div key={i} className="flex gap-2 items-start rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="text-amber-400/50 text-[10px] mt-0.5 shrink-0">✦</span>
                  <p className="text-white/50 text-xs leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missions */}
        {Array.isArray(p.missions) && p.missions.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Rocket size={14} className="text-emerald-400" />
              Misiones
            </h3>
            <div className="space-y-2">
              {p.missions.map((m: any, i: number) => (
                <div key={i} className="rounded-xl p-3 flex items-start gap-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: m.status === 'Activa' ? '#10b981' : m.status === 'En tránsito' ? '#f59e0b' : m.status === 'Planeada' || m.status === 'Propuesta' ? '#00d4ff' : '#6b7280' }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/80 text-xs font-semibold">{m.name}</span>
                      <span className="text-white/20 text-[10px]">{m.year}</span>
                      {m.org && <span className="text-white/15 text-[10px]">{m.org}</span>}
                    </div>
                    <p className="text-white/40 text-[11px] mt-0.5">{m.desc}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold shrink-0" style={{ background: m.status === 'Activa' ? 'rgba(16,185,129,0.1)' : m.status === 'En tránsito' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.03)', color: m.status === 'Activa' ? '#10b981' : m.status === 'En tránsito' ? '#f59e0b' : '#6b7280' }}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notable */}
        {(p as any).notable && (
          <div className="px-6 pb-6">
            <div className="rounded-xl p-4" style={{ background: `${p.color}08`, border: `1px solid ${p.color}15` }}>
              <p className="text-white/25 text-[10px] uppercase tracking-wider mb-1">Destacado</p>
              <p className="text-white/70 text-sm">{(p as any).notable}</p>
            </div>
          </div>
        )}

        {/* Rocket mission count */}
        {(p as any).missions && typeof (p as any).missions === 'number' && (
          <div className="px-6 pb-6">
            <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: `${p.color}08`, border: `1px solid ${p.color}15` }}>
              <Rocket size={18} className={p.color} style={{ color: p.color }} />
              <div>
                <p className="text-white/25 text-[10px]">Misiones Completadas</p>
                <p className="text-white font-bold text-lg">{(p as any).missions}+</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// Missing import
import { BarChart3, Sparkles } from 'lucide-react'

// ============================================================
// Main Page
// ============================================================
export default function SpaceEncyclopediaPage() {
  const [activeTab, setActiveTab] = useState<'planets' | 'rockets' | 'satellites'>('planets')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedType, setSelectedType] = useState<'planet' | 'rocket' | 'satellite'>('planet')

  const tabs = [
    { id: 'planets' as const, label: 'Planetas', emoji: '🪐', count: planets.length },
    { id: 'rockets' as const, label: 'Cohetes', emoji: '🚀', count: rockets.length },
    { id: 'satellites' as const, label: 'Satélites', emoji: '📡', count: satellites.length },
  ]

  const openDetail = (item: any, type: 'planet' | 'rocket' | 'satellite') => {
    setSelectedItem(item)
    setSelectedType(type)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Enciclopedia Espacial</h1>
        <p className="text-white/40">Base de datos completa del sistema solar, cohetes, satélites y misiones</p>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        {[
          { label: 'Cuerpos Celestes', value: `${planets.length}`, emoji: '🪐', color: '#00d4ff' },
          { label: 'Cohetes Registrados', value: `${rockets.length}`, emoji: '🚀', color: '#f59e0b' },
          { label: 'Satélites Activos', value: `${satellites.filter(s => s.status.includes('Activo')).length}`, emoji: '📡', color: '#10b981' },
          { label: 'Misiones Totales', value: '600+', emoji: '🎯', color: '#ec4899' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-3 text-center" style={{ ...cardBase }}>
            <div className="text-xl mb-1">{stat.emoji}</div>
            <p className="text-white font-bold text-lg" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-white/25 text-[10px]">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Tab navigation */}
      <motion.div
        className="flex items-center gap-2 p-1 rounded-2xl w-fit"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97]"
            style={{
              background: activeTab === tab.id ? 'rgba(0,212,255,0.08)' : 'transparent',
              border: activeTab === tab.id ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
              color: activeTab === tab.id ? '#00d4ff' : 'rgba(255,255,255,0.4)',
              boxShadow: activeTab === tab.id ? '0 0 15px rgba(0,212,255,0.08)' : 'none',
            }}
          >
            <span>{tab.emoji}</span>
            {tab.label}
            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: activeTab === tab.id ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)' }}>
              {tab.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* PLANETS GRID */}
      <AnimatePresence mode="wait">
        {activeTab === 'planets' && (
          <motion.div
            key="planets"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, y: -10 }}
          >
            {planets.map(planet => (
              <motion.div
                key={planet.name}
                className="rounded-xl overflow-hidden cursor-pointer relative group"
                style={cardBase}
                variants={staggerItem}
                whileHover={{ scale: 1.02 }}
                onHoverStart={e => { if (e.currentTarget) { e.currentTarget.style.borderColor = `${planet.color}25`; e.currentTarget.style.boxShadow = `0 0 25px ${planet.color}10` } }}
                onHoverEnd={e => { if (e.currentTarget) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' } }}
                onClick={() => openDetail(planet, 'planet')}
              >
                <CardGradientTop color={`linear-gradient(90deg, ${planet.color}, transparent)`} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${planet.gradient} flex items-center justify-center text-2xl shrink-0`} style={{ boxShadow: `0 0 20px ${planet.color}20` }}>
                      {planet.emoji}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-bold text-sm">{planet.name}</h3>
                      <p className="text-white/25 text-[10px]">{planet.type}</p>
                    </div>
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: `${planet.color}12`, border: `1px solid ${planet.color}25`, color: planet.color }}>
                      {planet.missions.length} misiones
                    </span>
                  </div>
                  <p className="text-white/35 text-xs leading-relaxed mb-3 line-clamp-2">{planet.description}</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {planet.stats.slice(0, 4).map(s => (
                      <div key={s.label} className="rounded-lg p-1.5 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <s.icon size={10} className="text-white/15 mx-auto mb-0.5" />
                        <p className="text-white/40 text-[9px] font-semibold leading-tight">{s.value}</p>
                        <p className="text-white/15 text-[8px]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ROCKETS GRID */}
        {activeTab === 'rockets' && (
          <motion.div
            key="rockets"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, y: -10 }}
          >
            {rockets.map(rocket => (
              <motion.div
                key={rocket.name}
                className="rounded-xl overflow-hidden cursor-pointer relative group"
                style={cardBase}
                variants={staggerItem}
                whileHover={{ scale: 1.01 }}
                onHoverStart={e => { if (e.currentTarget) { e.currentTarget.style.borderColor = `${rocket.color}25`; e.currentTarget.style.boxShadow = `0 0 25px ${rocket.color}10` } }}
                onHoverEnd={e => { if (e.currentTarget) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' } }}
                onClick={() => openDetail(rocket, 'rocket')}
              >
                <CardGradientTop color={`linear-gradient(90deg, ${rocket.color}, transparent)`} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rocket.gradient} flex items-center justify-center text-2xl shrink-0`} style={{ boxShadow: `0 0 20px ${rocket.color}20` }}>
                      {rocket.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-bold text-sm">{rocket.name}</h3>
                      <p className="text-white/25 text-[10px]">{rocket.org} · {rocket.year}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${rocket.status === 'Activo' || rocket.status === 'En pruebas' ? '' : ''}`} style={{ background: rocket.status === 'Activo' ? 'rgba(16,185,129,0.1)' : rocket.status === 'En pruebas' ? 'rgba(245,158,11,0.1)' : 'rgba(107,114,128,0.1)', color: rocket.status === 'Activo' ? '#10b981' : rocket.status === 'En pruebas' ? '#f59e0b' : '#6b7280', border: rocket.status === 'Activo' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>
                      {rocket.status}
                    </span>
                  </div>
                  <p className="text-white/35 text-xs leading-relaxed mb-3 line-clamp-2">{rocket.description}</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: 'Altura', value: rocket.height },
                      { label: 'Empuje', value: rocket.thrust },
                      { label: 'Carga', value: rocket.payload },
                      { label: 'Misiones', value: rocket.missions },
                    ].map(s => (
                      <div key={s.label} className="rounded-lg p-1.5 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <p className="text-white/40 text-[9px] font-semibold leading-tight">{s.value}</p>
                        <p className="text-white/15 text-[8px]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* SATELLITES GRID */}
        {activeTab === 'satellites' && (
          <motion.div
            key="satellites"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, y: -10 }}
          >
            {satellites.map(sat => (
              <motion.div
                key={sat.name}
                className="rounded-xl overflow-hidden cursor-pointer relative group"
                style={cardBase}
                variants={staggerItem}
                whileHover={{ scale: 1.02 }}
                onHoverStart={e => { if (e.currentTarget) { e.currentTarget.style.borderColor = `${sat.color}25`; e.currentTarget.style.boxShadow = `0 0 25px ${sat.color}10` } }}
                onHoverEnd={e => { if (e.currentTarget) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' } }}
                onClick={() => openDetail(sat, 'satellite')}
              >
                <CardGradientTop color={`linear-gradient(90deg, ${sat.color}, transparent)`} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${sat.color}15`, boxShadow: `0 0 20px ${sat.color}15` }}>
                      {sat.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-bold text-sm">{sat.name}</h3>
                      <p className="text-white/25 text-[10px]">{sat.org} · {sat.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: `${sat.color}12`, border: `1px solid ${sat.color}25`, color: sat.color }}>
                      {sat.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold`} style={{ background: sat.status.includes('Activo') ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', color: sat.status.includes('Activo') ? '#10b981' : '#6b7280' }}>
                      {sat.status}
                    </span>
                  </div>
                  <p className="text-white/35 text-xs leading-relaxed line-clamp-2">{sat.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAIL PANEL */}
      <AnimatePresence>
        {selectedItem && (
          <DetailPanel item={selectedItem} type={selectedType} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
