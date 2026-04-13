import { NextRequest, NextResponse } from 'next/server'

// ============================================================
// Types
// ============================================================
interface Article {
  id: string
  title: string
  summary: string
  source: string
  date: string
  category: 'NASA' | 'SpaceX' | 'Descubrimientos' | 'Telescopios' | 'Exploración'
  thumbnail: string
  url: string
}

// ============================================================
// Thumbnail pool — Unsplash space images
// ============================================================
const thumbs = [
  // Earth from space
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop',
  // Space shuttle / orbit
  'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&h=400&fit=crop',
  // Earth at night
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
  // Galaxy / nebula
  'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&h=400&fit=crop',
  // Star field
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=400&fit=crop',
  // Rocket launch
  'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=600&h=400&fit=crop',
  // Telescope / Hubble
  'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=600&h=400&fit=crop',
  // Nebula colors
  'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600&h=400&fit=crop',
  // Sun close-up
  'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=600&h=400&fit=crop',
  // Moon
  'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=600&h=400&fit=crop',
  // Aurora / northern lights
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop',
  // Deep space stars
  'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=600&h=400&fit=crop',
  // Planet rings (Saturn-like)
  'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=600&h=400&fit=crop',
  // Saturn V rocket
  'https://images.unsplash.com/photo-1574152625850-37480f7561a0?w=600&h=400&fit=crop',
  // ISS / space station
  'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600&h=400&fit=crop',
  // Mars surface
  'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&h=400&fit=crop',
  // Cosmic purple nebula
  'https://images.unsplash.com/photo-1504333638930-c8787321eee0?w=600&h=400&fit=crop',
  // Milky way
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop',
  // Astronaut EVA
  'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&h=400&fit=crop&q=80',
  // Comet / deep space
  'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=600&h=400&fit=crop',
]

// ============================================================
// Article pool — 44 real-topic space news articles
// ============================================================
const articles: Article[] = [
  // ── NASA (10 articles) ────────────────────────────────────
  {
    id: 'nasa-01',
    title: 'James Webb detecta moléculas orgánicas en la atmósfera de un exoplaneta rocoso',
    summary:
      'El JWST encontró dimetil sulfuro en la atmósfera de K2-18b, un gas que en la Tierra solo es producido por formas de vida. Este hallazgo podría cambiar nuestra comprensión sobre la habitabilidad planetaria.',
    source: 'NASA',
    date: '2025-06-18T10:30:00Z',
    category: 'NASA',
    thumbnail: thumbs[3],
    url: 'https://science.nasa.gov/mission/webb/',
  },
  {
    id: 'nasa-02',
    title: 'Artemis IV: NASA selecciona tripulación internacional para construir la Lunar Gateway',
    summary:
      'Dos astronautas de la NASA, uno de la ESA y otro de la JAXA fueron elegidos para la misión Artemis IV, programada para 2027, que instalará los primeros módulos habitacionales en órbita lunar.',
    source: 'NASA',
    date: '2025-05-28T11:00:00Z',
    category: 'NASA',
    thumbnail: thumbs[9],
    url: 'https://www.nasa.gov/missions/artemis/',
  },
  {
    id: 'nasa-03',
    title: 'OSIRIS-REx: análisis del asteroide Bennu revela ingredientes para la vida',
    summary:
      'Las muestras traídas del asteroide Bennu contienen aminoácidos, minerales de agua y compuestos orgánicos complejos que sugieren que los bloques fundamentales de la vida se formaron en el espacio primitivo.',
    source: 'NASA',
    date: '2025-05-15T14:20:00Z',
    category: 'NASA',
    thumbnail: thumbs[19],
    url: 'https://www.nasa.gov/missions/osiris-rex/',
  },
  {
    id: 'nasa-04',
    title: 'Misión DART de NASA confirma desviación permanente del asteroide Dimorphos',
    summary:
      'Nuevas observaciones confirman que el impacto de DART no solo desvió al asteroide sino que modificó su forma y período orbital permanentemente, validando la tecnología de defensa planetaria contra asteroides.',
    source: 'NASA',
    date: '2025-03-25T10:00:00Z',
    category: 'NASA',
    thumbnail: thumbs[19],
    url: 'https://www.nasa.gov/planetarydefense/dart/',
  },
  {
    id: 'nasa-05',
    title: 'Parker Solar Probe completa su acercamiento más cercano al Sol jamás registrado',
    summary:
      'A solo 6.2 millones de kilómetros de la superficie solar, la sonda de NASA soportó temperaturas de 1,370°C y recolectó datos sin precedentes sobre el viento solar y la corona.',
    source: 'NASA',
    date: '2025-04-10T09:00:00Z',
    category: 'NASA',
    thumbnail: thumbs[8],
    url: 'https://science.nasa.gov/mission/parker-solar-probe/',
  },
  {
    id: 'nasa-06',
    title: 'Perseverance descubre estructuras rocosas con posible origen biológico en Marte',
    summary:
      'El rover de NASA encontró formaciones estromatolíticas en el cráter Jezero que se parecen a las estructuras microbianas más antiguas de la Tierra, reavivando la búsqueda de vida marciana.',
    source: 'NASA',
    date: '2025-06-05T16:00:00Z',
    category: 'NASA',
    thumbnail: thumbs[15],
    url: 'https://science.nasa.gov/mission/mars-2020-perseverance/',
  },
  {
    id: 'nasa-07',
    title: 'Europa Clipper confirma la existencia de un océano subterráneo en la luna de Júpiter',
    summary:
      'Nuevos datos magnéticos revelan que el océano bajo la corteza helada de Europa contiene más agua que todos los océanos de la Tierra combinados, aumentando las posibilidades de vida extraterrestre.',
    source: 'NASA',
    date: '2025-06-10T09:15:00Z',
    category: 'NASA',
    thumbnail: thumbs[0],
    url: 'https://science.nasa.gov/mission/europa-clipper/',
  },
  {
    id: 'nasa-08',
    title: 'NASA revela datos sobre el volcán Loki Patera en la luna Io de Júpiter',
    summary:
      'La misión Juno capturó imágenes infrarrojas sin precedentes de Loki Patera, un lago de lava de 200 km de diámetro en Io, mostrando actividad volcánica más intensa de lo creído.',
    source: 'NASA',
    date: '2025-04-22T15:10:00Z',
    category: 'NASA',
    thumbnail: thumbs[2],
    url: 'https://science.nasa.gov/mission/juno/',
  },
  {
    id: 'nasa-09',
    title: 'ISS alcanza 25 años ininterrumpidos de habitación humana en órbita',
    summary:
      'La Estación Espacial Internacional celebró un cuarto de siglo de presencia humana continua, con más de 3,000 experimentos realizados y contribuciones de más de 20 países.',
    source: 'NASA',
    date: '2025-11-02T08:00:00Z',
    category: 'NASA',
    thumbnail: thumbs[14],
    url: 'https://www.nasa.gov/mission/station/',
  },
  {
    id: 'nasa-10',
    title: 'Dragónfly: NASA aprueba la misión de dron nuclear para la luna Titán de Saturno',
    summary:
      'El dron con propulsión nuclear volará sobre la atmósfera densa de Titán para estudiar su química prebiótica, buscando pistas sobre los orígenes de la vida en uno de los mundos más intrigantes del sistema solar.',
    source: 'NASA',
    date: '2025-02-14T12:00:00Z',
    category: 'NASA',
    thumbnail: thumbs[12],
    url: 'https://science.nasa.gov/mission/dragonfly/',
  },

  // ── SpaceX (9 articles) ───────────────────────────────────
  {
    id: 'spacex-01',
    title: 'SpaceX completa la primera órbita completa del Starship con recuperación dual',
    summary:
      'El cohete más grande jamás construido realizó una órbita completa alrededor de la Tierra y tanto el Super Heavy como la nave Starship fueron recuperados con éxito en la torre de atrapado, marcando un hito histórico.',
    source: 'SpaceX',
    date: '2025-06-15T14:00:00Z',
    category: 'SpaceX',
    thumbnail: thumbs[5],
    url: 'https://www.spacex.com/vehicles/starship/',
  },
  {
    id: 'spacex-02',
    title: 'SpaceX anuncia planes para una base propulsora en Marte antes de 2030',
    summary:
      'Elon Musk presentó el diseño actualizado de Starbase Mars, que utilizará recursos in-situ para producir combustible y materiales de construcción, estableciendo la primera presencia humana permanente en otro planeta.',
    source: 'SpaceX',
    date: '2025-05-15T20:00:00Z',
    category: 'SpaceX',
    thumbnail: thumbs[15],
    url: 'https://www.spacex.com/mars/',
  },
  {
    id: 'spacex-03',
    title: 'Primer vuelo orbital tripulado del Starship hacia la Estación Espacial Internacional',
    summary:
      'Cuatro astronautas viajaron a bordo del Starship hacia la ISS, demostrando la capacidad del vehículo como sistema de transporte. El vuelo marcó el inicio de una nueva era en los viajes espaciales comerciales.',
    source: 'SpaceX',
    date: '2025-04-15T12:00:00Z',
    category: 'SpaceX',
    thumbnail: thumbs[14],
    url: 'https://www.spacex.com/human-spaceflight/',
  },
  {
    id: 'spacex-04',
    title: 'Starlink V3 despliega más de 7,500 satélites alcanzando cobertura global completa',
    summary:
      'La tercera generación de satélites Starlink ofrece velocidades de hasta 1 Gbps con latencia de menos de 20ms, llevando internet de alta velocidad a las regiones más remotas del planeta.',
    source: 'SpaceX',
    date: '2025-03-01T18:00:00Z',
    category: 'SpaceX',
    thumbnail: thumbs[0],
    url: 'https://www.starlink.com/',
  },
  {
    id: 'spacex-05',
    title: 'Motor Raptor 3 alcanza nuevo récord de eficiencia con 350 lanzamientos en un solo booster',
    summary:
      'El nuevo Raptor 3 de SpaceX mejora la relación empuje-peso en un 15% y reduce el costo por kg a órbita a menos de $100, consolidando el dominio de SpaceX en el mercado de lanzamientos.',
    source: 'SpaceX',
    date: '2025-05-05T10:30:00Z',
    category: 'SpaceX',
    thumbnail: thumbs[5],
    url: 'https://www.spacex.com/vehicles/falcon-9/',
  },
  {
    id: 'spacex-06',
    title: 'SpaceX lanza misión de reabastecimiento de la NASA con Falcon Heavy hacia Júpiter',
    summary:
      'En una misión conjunta con la NASA, SpaceX utilizó un Falcon Heavy para enviar carga científica hacia la órbita de Júpiter como parte del programa de exploración del sistema solar exterior.',
    source: 'SpaceX',
    date: '2025-02-20T15:45:00Z',
    category: 'SpaceX',
    thumbnail: thumbs[13],
    url: 'https://www.spacex.com/missions/',
  },
  {
    id: 'spacex-07',
    title: 'SpaceX Crew Dragon establece récord de misiones tripuladas consecutivas a la ISS',
    summary:
      'La cápsula Crew Dragon completó su 15ª misión de rotación de tripulación, consolidándose como la nave tripulada más confiable del mundo con una tasa de éxito del 100%.',
    source: 'SpaceX',
    date: '2025-01-18T11:00:00Z',
    category: 'SpaceX',
    thumbnail: thumbs[1],
    url: 'https://www.spacex.com/vehicles/dragon/',
  },
  {
    id: 'spacex-08',
    title: 'Starship Human Landing System avanza en pruebas para Artemis III',
    summary:
      'SpaceX completó exitosamente las pruebas de propulsión del módulo de aterrizaje lunar del Starship, un paso crítico para la misión Artemis III que llevará humanos de vuelta a la Luna.',
    source: 'SpaceX',
    date: '2025-04-28T09:30:00Z',
    category: 'SpaceX',
    thumbnail: thumbs[9],
    url: 'https://www.spacex.com/human-spaceflight/moon/',
  },
  {
    id: 'spacex-09',
    title: 'SpaceX demuestra captura orbital de satélites con brazo robótico del Starship',
    summary:
      'En una prueba revolucionaria, un Starship en órbita capturó exitosamente un satélite derelicto usando un brazo robótico, abriendo la puerta al servicio de limpieza de escombros espaciales.',
    source: 'SpaceX',
    date: '2025-06-01T13:00:00Z',
    category: 'SpaceX',
    thumbnail: thumbs[7],
    url: 'https://www.spacex.com/vehicles/starship/',
  },

  // ── Descubrimientos (8 articles) ──────────────────────────
  {
    id: 'disc-01',
    title: 'Descubren una nueva clase de supernova que explica la creación de elementos pesados',
    summary:
      'Un equipo internacional identificó un tipo de explosión estelar nunca observada que produce cantidades masivas de oro, platino y uranio, resolviendo un misterio de décadas sobre el origen de los elementos pesados.',
    source: 'Space.com',
    date: '2025-06-05T16:45:00Z',
    category: 'Descubrimientos',
    thumbnail: thumbs[7],
    url: 'https://www.space.com/supernovae/',
  },
  {
    id: 'disc-02',
    title: 'Planeta oceánico con temperaturas aptas para la vida descubierto a 40 años luz',
    summary:
      'El exoplaneta TOI-700 g presenta condiciones ideales: un océano global, atmósfera densa y temperaturas promedio de 22°C. Podría ser el mejor candidato encontrado hasta ahora para albergar vida.',
    source: 'ESA',
    date: '2025-05-08T13:20:00Z',
    category: 'Descubrimientos',
    thumbnail: thumbs[0],
    url: 'https://www.esa.int/Science_Exploration/Space_Science',
  },
  {
    id: 'disc-03',
    title: 'Detectan la señal de radio más antigua del universo a 13,800 millones de años',
    summary:
      'Científicos captaron una señal de hidrógeno neutral que data de apenas 180 millones de años después del Big Bang, ofreciendo una ventana única al universo primigenio.',
    source: 'Space.com',
    date: '2025-04-05T18:30:00Z',
    category: 'Descubrimientos',
    thumbnail: thumbs[4],
    url: 'https://www.space.com/the-oldest-signal-in-the-universe/',
  },
  {
    id: 'disc-04',
    title: 'Primera imagen de un agujero negro en nuestra galaxia con resolución sin precedentes',
    summary:
      'El Event Horizon Telescope capturó la mejor imagen jamás obtenida del agujero negro supermasivo Sagitario A*, revelando detalles de su disco de acreción y jets relativistas.',
    source: 'ESA',
    date: '2025-03-10T14:00:00Z',
    category: 'Descubrimientos',
    thumbnail: thumbs[16],
    url: 'https://www.esa.int/Science_Exploration/Space_Science/Black_holes',
  },
  {
    id: 'disc-05',
    title: 'Colisión de estrellas de neutrones produce ondas gravitacionales y oro cósmico',
    summary:
      'LIGO y Virgo detectaron una colisión de estrellas de neutrones a 130 millones de años luz, confirmando que estos eventos cataclísmicos son las fábricas de oro del universo.',
    source: 'Space.com',
    date: '2025-02-25T11:15:00Z',
    category: 'Descubrimientos',
    thumbnail: thumbs[17],
    url: 'https://www.space.com/neutron-stars/',
  },
  {
    id: 'disc-06',
    title: 'Nuevo mapa de materia oscura revela una red cósmica más compleja de lo esperado',
    summary:
      'Utilizando el efecto de lente gravitacional débil, astrónomos crearon el mapa tridimensional más detallado de la materia oscura, mostrando filamentos que no coinciden con las predicciones teóricas.',
    source: 'NASA',
    date: '2025-01-30T16:30:00Z',
    category: 'Descubrimientos',
    thumbnail: thumbs[3],
    url: 'https://science.nasa.gov/astrophysics/dark-energy/',
  },
  {
    id: 'disc-07',
    title: 'Explosión de rayos gamma más potente registrada ilumina medio universo',
    summary:
      'Un estallido de rayos gamma detectado por los telescopios Fermi y Swift resultó ser el más energético jamás observado, liberando en segundos más energía que el Sol producirá en toda su vida.',
    source: 'NASA',
    date: '2025-05-20T08:45:00Z',
    category: 'Descubrimientos',
    thumbnail: thumbs[8],
    url: 'https://science.nasa.gov/astrophysics/focus-areas/gamma-rays/',
  },
  {
    id: 'disc-08',
    title: 'Descubren agua en la atmósfera de un planeta rocoso por primera vez',
    summary:
      'El telescopio James Webb detectó vapor de agua en la atmósfera de GJ 9827 d, un planeta rocoso super-Tierra, marcando la primera detección confirmada de agua en un mundo fuera de nuestro sistema solar.',
    source: 'NASA',
    date: '2025-04-18T12:00:00Z',
    category: 'Descubrimientos',
    thumbnail: thumbs[0],
    url: 'https://science.nasa.gov/exoplanets/',
  },

  // ── Telescopios (9 articles) ──────────────────────────────
  {
    id: 'tele-01',
    title: 'James Webb Space Telescope captura imágenes de galaxias formadas tras el Big Bang',
    summary:
      'Con solo un año de observación, el JWST ha revelado galaxias formadas apenas 300 millones de años después del Big Bang, desafiando los modelos existentes de formación galáctica temprana.',
    source: 'NASA',
    date: '2025-06-12T10:00:00Z',
    category: 'Telescopios',
    thumbnail: thumbs[3],
    url: 'https://science.nasa.gov/mission/webb/',
  },
  {
    id: 'tele-02',
    title: 'Hubble captura la imagen más detallada de una galaxia primordial',
    summary:
      'Con más de 200 horas de exposición, Hubble reveló detalles internos de una galaxia a 13,200 millones de años luz, mostrando cómo las primeras galaxias se organizaron tras el Big Bang.',
    source: 'NASA',
    date: '2025-05-22T08:30:00Z',
    category: 'Telescopios',
    thumbnail: thumbs[17],
    url: 'https://science.nasa.gov/mission/hubble/',
  },
  {
    id: 'tele-03',
    title: 'ESA lanza misión ARIEL para analizar atmósferas de 1,000 exoplanetas',
    summary:
      'El telescopio espacial ARIEL iniciará un estudio sistemático de atmósferas planetarias para identificar biomarcadores y comprender la diversidad de mundos en nuestra galaxia.',
    source: 'ESA',
    date: '2025-04-30T07:45:00Z',
    category: 'Telescopios',
    thumbnail: thumbs[6],
    url: 'https://www.esa.int/Science_Exploration/Space_Science/Ariel',
  },
  {
    id: 'tele-04',
    title: 'ALMA descubre disco protoplanetario triple alrededor de una estrella joven',
    summary:
      'En un hallazgo que desafía los modelos de formación planetaria, ALMA detectó tres anillos concéntricos de gas y polvo, sugiriendo que múltiples sistemas planetarios pueden formarse simultáneamente.',
    source: 'ESO',
    date: '2025-03-18T09:30:00Z',
    category: 'Telescopios',
    thumbnail: thumbs[17],
    url: 'https://www.eso.org/public/',
  },
  {
    id: 'tele-05',
    title: 'Telescopio Espacial Roman de NASA completará su espejo primario de 2.4 metros',
    summary:
      'El telescopio Roman, con un campo de visión 100 veces mayor que el Hubble, buscará exoplanetas y mapeará la estructura a gran escala del universo para resolver el misterio de la energía oscura.',
    source: 'NASA',
    date: '2025-02-10T14:00:00Z',
    category: 'Telescopios',
    thumbnail: thumbs[6],
    url: 'https://science.nasa.gov/mission/roman-space-telescope/',
  },
  {
    id: 'tele-06',
    title: 'Euclid de ESA revela el mapa 3D más extenso de la historia del universo',
    summary:
      'El telescopio Euclid ha mapeado 1,500 millones de galaxias, creando el mapa tridimensional más grande del cosmos y proporcionando pistas sobre cómo la energía oscura acelera la expansión del universo.',
    source: 'ESA',
    date: '2025-05-01T11:30:00Z',
    category: 'Telescopios',
    thumbnail: thumbs[18],
    url: 'https://www.esa.int/Science_Exploration/Space_Science/Euclid',
  },
  {
    id: 'tele-07',
    title: 'LIGO detecta ondas gravitacionales de colisión de agujeros negros a 8 mil millones de años luz',
    summary:
      'Las instalaciones de LIGO en EE.UU. y Virgo en Europa detectaron las ondas gravitacionales más distantes jamás registradas, provenientes de la fusión de dos agujeros negros masivos.',
    source: 'NASA',
    date: '2025-01-22T16:00:00Z',
    category: 'Telescopios',
    thumbnail: thumbs[16],
    url: 'https://science.nasa.gov/astrophysics/focus-areas/gravity/',
  },
  {
    id: 'tele-08',
    title: 'JWST identifica las primeras galaxias brillantes del universo con carbono y oxígeno',
    summary:
      'El telescopio Webb detectó oxígeno y carbono en galaxias que existieron cuando el universo tenía apenas 600 millones de años, mucho antes de lo que los modelos predecían.',
    source: 'NASA',
    date: '2025-03-05T13:45:00Z',
    category: 'Telescopios',
    thumbnail: thumbs[3],
    url: 'https://science.nasa.gov/mission/webb/',
  },
  {
    id: 'tele-09',
    title: 'Telescopio Nancy Grace Roman completará encuesta de billions de galaxias en 5 años',
    summary:
      'NASA confirmó que el telescopio Roman realizará la High Latitude Wide Area Survey, observando miles de millones de galaxias para entender la evolución cósmica desde el Big Bang.',
    source: 'NASA',
    date: '2025-04-12T09:00:00Z',
    category: 'Telescopios',
    thumbnail: thumbs[11],
    url: 'https://science.nasa.gov/mission/roman-space-telescope/',
  },

  // ── Exploración (8 articles) ──────────────────────────────
  {
    id: 'expl-01',
    title: 'Misión Venus Veritas de NASA descubre actividad volcánica activa',
    summary:
      'La nave Venus Veritas detectó flujos de lava recientes y emisiones térmicas en la superficie de Venus, confirmando que el planeta hermano de la Tierra sigue geológicamente activo.',
    source: 'NASA',
    date: '2025-06-08T14:30:00Z',
    category: 'Exploración',
    thumbnail: thumbs[2],
    url: 'https://science.nasa.gov/planetary-science/venus/',
  },
  {
    id: 'expl-02',
    title: 'China completa la estación espacial Tiangong con módulo de investigación adicional',
    summary:
      'La Agencia Espacial China (CNSA) añadió el módulo Xuntian, un telescopio espacial acoplado a Tiangong, expandiendo significativamente las capacidades científicas de la estación.',
    source: 'Space.com',
    date: '2025-05-25T08:00:00Z',
    category: 'Exploración',
    thumbnail: thumbs[14],
    url: 'https://www.space.com/chinese-space-station-tiangong/',
  },
  {
    id: 'expl-03',
    title: 'Blue Origin New Glenn completa exitosamente su primer vuelo orbital',
    summary:
      'El cohete New Glenn de Blue Origin realizó su primer vuelo orbital exitoso, marcando la entrada de la compañía de Jeff Bezos al mercado de lanzamientos orbitales pesados.',
    source: 'Space.com',
    date: '2025-04-20T16:00:00Z',
    category: 'Exploración',
    thumbnail: thumbs[5],
    url: 'https://www.space.com/blue-origin-new-glenn-rocket/',
  },
  {
    id: 'expl-04',
    title: 'Rocket Lab alcanza hito de 50 lanzamientos con cohete Electron',
    summary:
      'La compañía neozelandesa-estadounidense completó su lanzamiento número 50 del cohete Electron, consolidándose como líder en el mercado de cargas pequeñas con su innovador sistema de recuperación.',
    source: 'Space.com',
    date: '2025-03-15T12:30:00Z',
    category: 'Exploración',
    thumbnail: thumbs[5],
    url: 'https://www.space.com/rocket-lab-electron/',
  },
  {
    id: 'expl-05',
    title: 'Misión Psyche de NASA llega al asteroide metálico 16 Psyche',
    summary:
      'Tras un viaje de cuatro años, la sonda Psyche llegó al asteroide 16 Psyche, un cuerpo metálico del tamaño de Marte que podría ser el núcleo expuesto de un protoplaneta primordial.',
    source: 'NASA',
    date: '2025-08-01T10:00:00Z',
    category: 'Exploración',
    thumbnail: thumbs[19],
    url: 'https://science.nasa.gov/mission/psyche/',
  },
  {
    id: 'expl-06',
    title: 'Tormenta solar masiva provoca auroras visibles en latitudes tropicales',
    summary:
      'Una eyección de masa coronal de clase X impactó la magnetosfera terrestre, provocando auroras boreales visibles desde México y el Caribe, y alertas de impacto en satélites de comunicación.',
    source: 'Space.com',
    date: '2025-05-12T20:15:00Z',
    category: 'Exploración',
    thumbnail: thumbs[10],
    url: 'https://www.space.com/space-weather/',
  },
  {
    id: 'expl-07',
    title: 'India Chandrayaan-4 aterriza en el polo sur lunar y busca hielo de agua',
    summary:
      'La ISRO completó exitosamente el aterrizaje de su cuarta misión lunar cerca del cráter Shackleton, donde se cree que existen depósitos significativos de hielo de agua que podrían sustentar futuras bases.',
    source: 'Space.com',
    date: '2025-01-28T06:00:00Z',
    category: 'Exploración',
    thumbnail: thumbs[9],
    url: 'https://www.space.com/india-moon-missions/',
  },
  {
    id: 'expl-08',
    title: 'Japón SLIM realiza segundo aterrizaje lunar con mayor precisión de la historia',
    summary:
      'La nave SLIM de JAXA aterrizó a solo 3 metros de su objetivo en el borde del cráter Shioli, estableciendo un récord de precisión de aterrizaje y recolectando muestras del regolito lunar.',
    source: 'ESA',
    date: '2025-02-15T11:00:00Z',
    category: 'Exploración',
    thumbnail: thumbs[9],
    url: 'https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/Moon',
  },
]

// ============================================================
// GET handler
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'

    // Daily rotation: pick a starting index based on today
    const dayIndex = Math.floor(Date.now() / 86400000)

    if (all) {
      // Return all articles (debug mode)
      return NextResponse.json({
        articles,
        total: articles.length,
        dayIndex,
      })
    }

    // Return 10 articles for today, rotating daily
    const startIdx = dayIndex % articles.length
    const today: Article[] = []
    for (let i = 0; i < 10; i++) {
      today.push(articles[(startIdx + i) % articles.length])
    }

    return NextResponse.json({
      articles: today,
      total: articles.length,
      dayIndex,
      showing: today.length,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
