import { NextResponse } from 'next/server'

interface Article {
  id: string
  title: string
  summary: string
  source: string
  date: string
  category: 'NASA' | 'SpaceX' | 'Descubrimientos' | 'Telescopios' | 'Exploración'
  imageUrl: string
}

const articles: Article[] = [
  {
    id: '1',
    title: 'El Telescopio Espacial James Webb detecta moléculas orgánicas en la atmósfera de un exoplaneta rocoso',
    summary: 'Un hallazgo sin precedentes que podría revolucionar nuestra comprensión sobre la habitabilidad de planetas similares a la Tierra en sistemas estelares cercanos. Los científicos detectaron dimetil sulfuro, un gas que en la Tierra solo es producido por formas de vida.',
    source: 'NASA',
    date: '2025-06-18T10:30:00Z',
    category: 'Telescopios',
    imageUrl: '/images/news/jwst-exoplanet.jpg',
  },
  {
    id: '2',
    title: 'SpaceX completa exitosamente la primera órbita completa del Starship con recuperación de ambos boosters',
    summary: 'El cohete más grande jamás construido realizó una órbita completa alrededor de la Tierra y tanto el Super Heavy como la nave Starship fueron recuperados con éxito en el océano, marcando un hito histórico en la exploración espacial.',
    source: 'SpaceX',
    date: '2025-06-15T14:00:00Z',
    category: 'SpaceX',
    imageUrl: '/images/news/starship-orbit.jpg',
  },
  {
    id: '3',
    title: 'La sonda Europa Clipper de NASA confirma la existencia de un océano subterráneo en Europa',
    summary: 'Nuevos datos magnéticos revelan que el océano bajo la corteza helada de Europa, la luna de Júpiter, contiene más agua que todos los océanos de la Tierra combinados, aumentando las posibilidades de vida extraterrestre.',
    source: 'NASA',
    date: '2025-06-10T09:15:00Z',
    category: 'Exploración',
    imageUrl: '/images/news/europa-clipper.jpg',
  },
  {
    id: '4',
    title: 'Descubren una nueva clase de supernova que podría explicar la creación de elementos pesados',
    summary: 'Un equipo internacional de astrónomos ha identificado un tipo de explosión estelar nunca antes observada que produce cantidades masivas de oro, platino y uranio, resolviendo un misterio de décadas sobre el origen de los elementos pesados.',
    source: 'Science Daily',
    date: '2025-06-05T16:45:00Z',
    category: 'Descubrimientos',
    imageUrl: '/images/news/supernova-heavy.jpg',
  },
  {
    id: '5',
    title: 'NASA selecciona a cuatro astronautas para la misión Artemis IV que construirá la estación Lunar Gateway',
    summary: 'La tripulación internacional incluye a dos astronautas de la NASA, uno de la ESA y otro de la JAXA. La misión se lanzará en 2027 y pondrá los primeros módulos habitacionales en órbita lunar.',
    source: 'NASA',
    date: '2025-05-28T11:00:00Z',
    category: 'NASA',
    imageUrl: '/images/news/artemis-iv.jpg',
  },
  {
    id: '6',
    title: 'El Telescopio Espacial Hubble captura la imagen más detallada de una galaxia en formación',
    summary: 'Con más de 200 horas de exposición, Hubble reveló los detalles internos de una galaxia primordial a 13.200 millones de años luz, mostrando cómo las primeras galaxias comenzaron a organizarse tras el Big Bang.',
    source: 'NatGeo',
    date: '2025-05-22T08:30:00Z',
    category: 'Telescopios',
    imageUrl: '/images/news/hubble-galaxy.jpg',
  },
  {
    id: '7',
    title: 'SpaceX anuncia planes para construir una base propulsora en Marte antes de 2030',
    summary: 'Elon Musk presentó el diseño actualizado de la base Starbase Mars, que utilizará recursos in-situ para producir combustible y materiales de construcción, estableciendo la primera presencia humana permanente en otro planeta.',
    source: 'SpaceX',
    date: '2025-05-15T20:00:00Z',
    category: 'SpaceX',
    imageUrl: '/images/news/mars-base.jpg',
  },
  {
    id: '8',
    title: 'Descubren un planeta oceánico con temperaturas aptas para la vida a solo 40 años luz',
    summary: 'El exoplaneta TOI-700 g presenta condiciones ideales: un océano global, atmósfera densa y temperaturas promedio de 22°C. Los investigadores creen que podría ser el mejor candidato encontrado hasta ahora para albergar vida.',
    source: 'ESA',
    date: '2025-05-08T13:20:00Z',
    category: 'Descubrimientos',
    imageUrl: '/images/news/ocean-planet.jpg',
  },
  {
    id: '9',
    title: 'La ESA lanza la misión ARIEL para analizar las atmósferas de 1.000 exoplanetas',
    summary: 'El telescopio espacial ARIEL de la Agencia Espacial Europea iniciará un estudio sistemático de las atmósferas planetarias para identificar biomarcadores y comprender la diversidad de mundos en nuestra galaxia.',
    source: 'ESA',
    date: '2025-04-30T07:45:00Z',
    category: 'Telescopios',
    imageUrl: '/images/news/ariel-mission.jpg',
  },
  {
    id: '10',
    title: 'NASA revela nuevos datos sobre el volcán más alto del sistema solar en la luna Io de Júpiter',
    summary: 'La misión Juno capturó imágenes infrarrojas sin precedentes de Loki Patera, un lago de lava de 200 km de diámetro en Io, mostrando actividad volcánica más intensa de lo que se creía posible.',
    source: 'NASA',
    date: '2025-04-22T15:10:00Z',
    category: 'Exploración',
    imageUrl: '/images/news/io-volcano.jpg',
  },
  {
    id: '11',
    title: 'SpaceX realiza el primer vuelo orbital tripulado con Starship hacia la Estación Espacial Internacional',
    summary: 'Cuatro astronautas viajaron a bordo del Starship, demostrando la capacidad del vehículo como sistema de transporte hacia la ISS. El vuelo marcó el inicio de una nueva era en los viajes espaciales comerciales.',
    source: 'SpaceX',
    date: '2025-04-15T12:00:00Z',
    category: 'SpaceX',
    imageUrl: '/images/news/starship-iss.jpg',
  },
  {
    id: '12',
    title: 'Astrónomos detectan la señal de radio más antigua del universo a 13.800 millones de años',
    summary: 'Utilizando una red de radiotelescopios en el desierto de Atacama, científicos captaron una señal de hidrógeno neutral que data de apenas 180 millones de años después del Big Bang, ofreciendo una ventana única al universo primigenio.',
    source: 'Science Daily',
    date: '2025-04-05T18:30:00Z',
    category: 'Descubrimientos',
    imageUrl: '/images/news/oldest-signal.jpg',
  },
  {
    id: '13',
    title: 'NASA confirma que la misión DART alteró permanentemente la órbita del asteroide Dimorphos',
    summary: 'Nuevas observaciones confirman que el impacto de la misión DART no solo desvió al asteroide sino que modificó su forma y periodo orbital de forma permanente, validando la tecnología de defensa planetaria.',
    source: 'NASA',
    date: '2025-03-25T10:00:00Z',
    category: 'Exploración',
    imageUrl: '/images/news/dart-mission.jpg',
  },
  {
    id: '14',
    title: 'El observatorio ALMA descubre un disco protoplanetario triple alrededor de una estrella joven',
    summary: 'En un hallazgo que desafía los modelos de formación planetaria, ALMA detectó tres anillos concéntricos de gas y polvo alrededor de una estrella de solo 2 millones de años, sugiriendo que múltiples sistemas planetarios pueden formarse simultáneamente.',
    source: 'NatGeo',
    date: '2025-03-18T09:30:00Z',
    category: 'Telescopios',
    imageUrl: '/images/news/alma-triple.jpg',
  },
]

export async function GET() {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  return NextResponse.json({ articles: sorted })
}
