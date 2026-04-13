'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Send,
  Sparkles,
  Lock,
  Crown,
  ChevronDown,
  Image as ImageIcon,
  Zap,
  Infinity as InfinityIcon,
  RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// Types
// ============================================================
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AiChatPageProps {
  userId: string
  isPremium: boolean
  userName: string
}

// ============================================================
// Hardcoded responses for free users (30+ keyword-matched)
// ============================================================
const HARDCODED_RESPONSES: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['planeta', 'planetas', 'cuántos planetas'],
    response: '🌍 **Los 8 Planetas del Sistema Solar** (en orden del Sol):\n\n1. **Mercurio** - El más pequeño y cercano al Sol\n2. **Venus** - El más caliente (462°C), rotación invertida\n3. **Tierra** - Nuestro hogar, el único con vida conocida\n4. **Marte** - El planeta rojo, objetivo de colonización humana\n5. **Júpiter** - El gigante gaseoso más grande (1,431× el tamaño de la Tierra)\n6. **Saturno** - Famoso por sus impresionantes anillos\n7. **Urano** - Gira de lado, con eje inclinado 98°\n8. **Neptuno** - El más lejano, vientos de 2,100 km/h\n\n💡 *¿Sabías que Plutón fue reclasificado como "planeta enano" en 2006 por la IAU?*',
  },
  {
    keywords: ['agujero negro', 'black hole', 'agujeros negros'],
    response: '🕳️ **Los Agujeros Negros**\n\nUn agujero negro es una región del espacio-tiempo donde la gravedad es tan extrema que nada puede escapar, ni siquiera la luz.\n\n**Datos clave:**\n- **Sagitario A***: El agujero negro supermasivo en el centro de nuestra Vía Láctea, con 4 millones de masas solares\n- **Gaia BH1**: El más cercano a la Tierra, a ~1,560 años luz\n- **Evento Horizon Telescope**: En 2019 capturó la primera imagen de un agujero negro (M87*)\n\n**Tipos:** Estelares (3-10 masas solares), Intermedios, Supermasivos (millones de masas solares)\n\n*¿Te gustaría saber más sobre la primera foto de un agujero negro?*',
  },
  {
    keywords: ['vía láctea', 'via lactea', 'galaxia', 'galaxias'],
    response: '🌌 **La Vía Láctea**\n\nNuestra galaxia es una espiral barrada con aproximadamente:\n- **100-400 mil millones de estrellas**\n- **Diámetro**: ~100,000 años luz\n- **Espesor del disco**: ~1,000 años luz\n- Nuestro Sol está a **26,000 años luz** del centro galáctico\n\n**Datos curiosos:**\n- La Vía Láctea colisionará con Andrómeda en ~4.5 mil millones de años\n- Viajamos alrededor del centro galáctico a 828,000 km/h\n- Se estima que hay más de **200 mil millones de galaxias** en el universo observable\n\n*¡Con un telescopio modesto puedes ver millones de estrellas de nuestra galaxia!*',
  },
  {
    keywords: ['marte', 'mars', 'planeta rojo', 'misión a marte'],
    response: '🔴 **Marte - El Planeta Rojo**\n\n**Datos fundamentales:**\n- Distancia al Sol: 228 millones km\n- Temperatura promedio: -60°C\n- Día marciano (sol): 24h 37min\n- Año marciano: 687 días terrestres\n\n**Exploración:**\n- **Perseverance** (NASA, 2021): Buscando rastros de vida pasada\n- **Ingenuity**: Primer helicóptero en otro planeta\n- **Zhurong** (CNSA, 2021): Rover chino\n- SpaceX planea misión tripulada para la década de 2030\n\n**Monte Olimpo**: El volcán más alto del sistema solar (21.9 km), casi 3× el Everest\n\n*¿Sabías que un atardecer en Marte se ve de color azul?*',
  },
  {
    keywords: ['big bang', 'gran explosión', 'origen del universo'],
    response: '💥 **La Teoría del Big Bang**\n\nEl Big Bang ocurrió hace aproximadamente **13.8 mil millones de años**.\n\n**Línea temporal:**\n1. **t = 0**: Singularidad inicial, toda la materia y energía concentrada\n2. **10⁻³⁶ s**: Inflación cósmica (expansión exponencial)\n3. **3 minutos**: Se forman los primeros núcleos atómicos (H, He)\n4. **380,000 años**: El universo se vuelve transparente (CMB)\n5. **200 millones de años**: Se forman las primeras estrellas\n\n**Evidencias:**\n- Radiación de Fondo de Microondas (CMB)\n- Expansiones de las galaxias (Ley de Hubble)\n- Abundancia de elementos ligeros (H, He, Li)\n\n*El universo sigue expandiéndose y acelerando su expansión*',
  },
  {
    keywords: ['vida extraterrestre', 'extraterrestre', 'alien', 'aliens', 'ovni', 'ufo'],
    response: '👽 **Vida Extraterrestre**\n\n¿Estamos solos? Es una de las mayores preguntas de la ciencia.\n\n**La búsqueda:**\n- **SETI**: Escucha señales de radio desde 1960\n- **Mars 2020**: Busca biomarcadores en Marte\n- **Europa Clipper** (NASA, 2024): Explorará el océano subterráneo de Europa (luna de Júpiter)\n- **James Webb**: Analiza atmósferas de exoplanetas\n\n**La Ecuación de Drake** estima civilizaciones en nuestra galaxía\n\n**Hechos:**\n- Se han descubierto **5,500+ exoplanetas** confirmados\n- La zona habitable de una estrella es clave\n- Europa y Encélado son los mejores candidatos en nuestro sistema solar\n\n*Quizás la pregunta no sea SI hay vida, sino CUÁNDO la encontraremos*',
  },
  {
    keywords: ['sol', 'estrella', 'sol', 'nuestro sol'],
    response: '☀️ **El Sol - Nuestra Estrella**\n\n**Datos:**\n- Tipo: Enana amarilla (G2V)\n- Edad: ~4,600 millones de años (mitad de su vida)\n- Temperatura superficial: 5,500°C\n- Temperatura del núcleo: 15 millones °C\n- Diámetro: 1.39 millones km (109× la Tierra)\n- Masa: 333,000× la Tierra\n\n**El Sol contiene:** 73% Hidrógeno, 25% Helio, 2% otros\n\n**Procesos:**\n- Fusiona 600 millones de toneladas de hidrógeno por segundo\n- La luz tarda 8 minutos y 20 segundos en llegar a la Tierra\n- En ~5 mil millones de años se expandirá hasta convertirse en gigante roja\n\n*El Sol representa el 99.86% de toda la masa del sistema solar*',
  },
  {
    keywords: ['luna', 'satélite', 'nuestra luna'],
    response: '🌙 **La Luna**\n\n**Datos:**\n- Diámetro: 3,474 km (¼ de la Tierra)\n- Distancia a la Tierra: 384,400 km\n- Gravedad: 1/6 de la terrestre\n- Período orbital: 27.3 días\n\n**Misiones:**\n- **Apollo 11** (1969): Primeros humanos en la Luna\n- **Artemis** (NASA): Retorno humano planeado para 2025-2026\n- China: Programa Chang\'e con exploración del lado oculto\n\n**Influencia terrestre:**\n- Causa las mareas oceánicas\n- Estabiliza el eje de rotación de la Tierra\n- Un día en la Luna dura 29.5 días terrestres\n\n*12 humanos han caminado sobre la Luna, todos entre 1969 y 1972*',
  },
  {
    keywords: ['saturno', 'anillos', 'ring'],
    response: '🪐 **Saturno y sus Anillos**\n\n**Datos de Saturno:**\n- Segundo planeta más grande del sistema solar\n- Diámetro: 116,460 km (9.5× la Tierra)\n- Densidad menor que el agua (flotaría)\n- 146 lunas conocidas\n\n**Los Anillos:**\n- Extensión: ~282,000 km de diámetro pero solo 10m de grosor promedio\n- Compuestos principalmente de hielo y roca\n- 7 anillos principales (A, B, C, D, E, F, G)\n- Edad estimada: 10-100 millones de años\n\n**Luna Titán:**\n- Única luna con atmósfera densa\n- Lagos de metano líquido en su superficie\n- Objetivo de la misión Dragonfly (NASA)',
  },
  {
    keywords: ['júpiter', 'jupiter', 'gran mancha roja'],
    response: '🟤 **Júpiter - El Gigante**\n\n**Datos:**\n- El planeta más grande del sistema solar\n- Diámetro: 142,984 km (11× la Tierra)\n- Masa: 318× la Tierra\n- 95 lunas conocidas\n\n**La Gran Mancha Roja:**\n- Tormenta anticiclónica activa por más de 350 años\n- Mayor que la Tierra\n- Vientos de hasta 640 km/h\n\n**Lunas Galileanas:**\n- **Io**: El cuerpo más volcánico del sistema solar\n- **Europa**: Océano subterráneo, posible vida\n- **Ganímedes**: La luna más grande del sistema solar\n- **Calisto**: Superficie más antigua conocida\n\n**Juno** (NASA) orbita Júpiter desde 2016 estudiando su interior',
  },
  {
    keywords: ['telescopio', 'hubble', 'james webb', 'jwst'],
    response: '🔭 **Telescopios Espaciales**\n\n**James Webb Space Telescope (JWST):**\n- Lanzado: diciembre 2021\n- Espejo: 6.5m de diámetro (6× Hubble)\n- Órbita: Punto de Lagrange L2 (1.5M km)\n- Observa en infrarrojo\n- Descubrió las galaxias más antiguas conocidas (~13.5 mil millones de años)\n\n**Hubble Space Telescope:**\n- Activo desde 1990\n- Más de 1.5 millones de observaciones\n- Imágenes icónicas: Pilares de la Creación, Nebulosa del Águila\n\n**Otros notables:**\n- **Euclid** (ESA, 2023): Mapeo de materia oscura\n- **Roman** (NASA, 2027): Campo de visión 100× Hubble\n\n*Los telescopios nos permiten ver el pasado, ya que la luz viaja a velocidad finita*',
  },
  {
    keywords: ['nebulosa', 'nebulosas'],
    response: '🌸 **Las Nebulosas**\n\nLas nebulosas son enormes nubes de gas y polvo donde nacen y mueren las estrellas.\n\n**Tipos principales:**\n- **Emissión**: Emiten luz propia (ej: Nebulosa de Orión)\n- **Reflexión**: Reflejan luz de estrellas cercanas\n- **Oscuras**: Bloquean la luz de fondo\n- **Planetarias**: Restos de estrellas moribundas (ej: Nebulosa del Caracol)\n\n**Las más famosas:**\n- **Orión (M42)**: A 1,344 años luz, visible a simple vista\n- **Carina**: Una de las más grandes, 4× el tamaño de Orión\n- **Pilares de la Creación**: En la Nebulosa del Águila\n\n*Las nebulosas son "guarderías estelares" donde se forman nuevas estrellas*',
  },
  {
    keywords: ['estrella fugaz', 'meteoro', 'meteorito', 'asteroide', 'cometa'],
    response: '☄️ **Cuerpos Menores del Sistema Solar**\n\n**Asteroides:**\n- Cinturón principal: entre Marte y Júpiter\n- Millones de asteroides, el más grande es Ceres (940 km)\n- **Apofis**: Pasará cerca de la Tierra en 2029\n\n**Cometas:**\n- "Bolas de nieve sucia" de hielo, polvo y roca\n- Cuando se acercan al Sol, desarrollan cola (vapor y polvo)\n- **Halley**: Visible cada 76 años (próximo en 2061)\n- **Neowise** (2020): Cometa brillante reciente\n\n**Meteoritos:**\n- Fragmentos que entran a la atmósfera terrestre\n- **Lluvia de meteoros** anuales: Perseidas (agosto), Gemínidas (diciembre)\n- ~48.5 toneladas de material caen diariamente en la Tierra',
  },
  {
    keywords: ['espacio', 'vacío', 'vacio', 'infinito', 'universo'],
    response: '✨ **El Espacio y el Universo**\n\n**El universo observable:**\n- Radio: ~46.5 mil millones de años luz\n- Edad: 13.8 mil millones de años\n- Contiene ~200 mil millones de galaxias\n- ~10²⁴ estrellas estimadas (un septillón)\n\n**El vacío espacial:**\n- No está completamente vacío: ~5 átomos por m³\n- Temperatura del fondo cósmico: -270.45°C (2.7K)\n- El 95% del universo es materia oscura (27%) y energía oscura (68%)\n\n**Expansión acelerada:**\n- El universo se expande cada vez más rápido\n- La causa desconocida se llama "energía oscura"\n- Galaxias lejanas se alejan más rápido que la luz\n\n*El universo podría ser infinito, pero solo podemos observar una porción limitada*',
  },
  {
    keywords: ['nasa', 'esa', 'spacex', 'agencia'],
    response: '🚀 **Agencias Espaciales**\n\n**NASA** (Estados Unidos):\n- Fundada en 1958\n- Apollo, Space Shuttle, ISS, Artemis\n- Presupuesto: ~$25 mil millones/año\n\n**ESA** (Europa):\n- 22 estados miembros\n- Rosetta, Gaia, Juice, JUICE\n\n**SpaceX** (Privada):\n- Fundada por Elon Musk (2002)\n- Falcon 9: reutilización de cohetes\n- Starship: el cohete más grande jamás construido\n- Starlink: 6,000+ satélites de internet\n\n**CNSA** (China): Estación espacial Tiangong, exploración lunar\n**ROSCOSMOS** (Rusia): Historia en la era soviética\n**ISRO** (India): Missión Chandrayaan a la Luna, Mars Orbiter\n\n*La era del espacio se está democratizando con empresas privadas*',
  },
  {
    keywords: ['iss', 'estación espacial', 'estación'],
    response: '🛰️ **Estación Espacial Internacional (ISS)**\n\n**Datos:**\n- En órbita desde 1998\n- Órbita: 408 km de altitud, 27,600 km/h\n- Tamaño: campo de fútbol\n- 16 módulos presurizados\n- 6 astronautas habitualmente\n\n**Agencias participantes:** NASA, ESA, Roscosmos, JAXA, CSA\n\n**Récords:**\n- Lleva habitada ininterrumpidamente desde 2000\n- Orbita la Tierra ~16 veces por día\n- Ha sido visitada por más de 270 personas de 21 países\n\n**Futuro:**\n- Operación garantizada hasta 2030\n- Programas comerciales: Axiom, Blue Origin\n- China opera su propia estación: Tiangong',
  },
  {
    keywords: ['edad', 'cuántos años', 'cuantos años'],
    response: '🎂 **Edad en Otros Planetas**\n\nSi tienes 25 años en la Tierra:\n- **Mercurio**: ~104 años (año = 88 días)\n- **Venus**: ~40.5 años (año = 225 días)\n- **Marte**: ~13.3 años (año = 687 días)\n- **Júpiter**: ~2.1 años (año = 11.86 años terrestres)\n- **Saturno**: ~0.84 años (año = 29.46 años)\n- **Urano**: ~0.29 años (año = 84 años)\n- **Neptuno**: ~0.15 años (año = 164.8 años)\n\n📅 **Edades del universo:**\n- Universo: 13.8 mil millones de años\n- Tierra: 4.5 mil millones de años\n- Vida en Tierra: ~3.8 mil millones de años\n- Humanos: ~300,000 años\n\n*¡Usa nuestro Simulador de Edad Espacial para calcular tu edad en cualquier planeta!*',
  },
  {
    keywords: ['gravedad', 'gravedad', 'peso', 'fuerza'],
    response: '⚖️ **La Gravedad en el Espacio**\n\nLa gravedad es la fuerza que atrae objetos entre sí.\n\n**Gravedad en diferentes lugares:**\n- Tierra: 9.8 m/s² (1g)\n- Luna: 1.6 m/s² (0.16g) — 1/6\n- Marte: 3.7 m/s² (0.38g) — 1/3\n- Júpiter: 24.8 m/s² (2.53g) — 2.5×\n- Sol: 274 m/s² (28g)\n- ISS: Microgravedad (~0g aparente)\n\n**Datos curiosos:**\n- La gravedad viaja a la velocidad de la luz\n- Las ondas gravitacionales se detectaron por primera vez en 2015 (LIGO)\n- Un agujero negro puede tener gravedad infinita en su singularidad\n\n*¡Usa nuestro Simulador de Peso para saber cuánto pesarías en otros planetas!*',
  },
  {
    keywords: ['exoplaneta', 'exoplanetas', 'planeta extrasolar'],
    response: '🌍 **Exoplanetas - Mundos Lejanos**\n\n**Número confirmados:** 5,500+ exoplanetas\n\n**Métodos de detección:**\n1. **Tránsito**: Variación de brillo estelar (Kepler, TESS)\n2. **Velocidad radial**: "Baluarte" de la estrella\n3. **Imaging directo**: Solo para planetas grandes lejanos\n\n**Descubrimientos destacados:**\n- **Proxima Centauri b**: Exoplaneta más cercano (4.24 años luz)\n- **TRAPPIST-1**: Sistema con 7 planetas, 3 en zona habitable\n- **Kepler-452b**: "Primo de la Tierra", 60% más grande\n- **HD 106906 b**: Planeta errante a 650 UA de su estrella\n\n**James Webb** analiza atmósferas en busca de biomarcadores (O₂, CH₄, H₂O)\n\n*¿Podría alguno de estos mundos albergar vida? Es la pregunta del milenio*',
  },
  {
    keywords: ['constelación', 'constelaciones', 'estrellas'],
    response: '⭐ **Constelaciones**\n\nLas 88 constelaciones oficiales cubren todo el cielo.\n\n**Más reconocibles:**\n- **Orión**: El cazador, visible en ambos hemisferios. Betelgeuse y Rigel son sus estrellas principales\n- **Osa Mayor**: Contiene la "Osa Mayor" usada para encontrar el norte\n- **Escorpio**: Con Antares, la estrella roja gigante\n- **Casiopea**: Forma una "W" en el cielo norte\n\n**Datos curiosos:**\n- Las constelaciones son patrones aparentes; las estrellas no están relacionadas entre sí\n- La Osa Mayor se invertirá en ~50,000 años por el movimiento estelar\n- Sirio (en Can Mayor) es la estrella más brillante vista desde la Tierra\n- Polaris (en la Osa Menor) marca el norte celeste\n\n*¡Prueba nuestra función de Observación del Cielo para identificar constelaciones!*',
  },
  {
    keywords: ['plutón', 'planeta enano'],
    response: '🔵 **Plutón - El Planeta Enano**\n\n**Datos:**\n- Diámetro: 2,377 km (menor que la Luna)\n- Distancia al Sol: 5,900 millones km\n- Órbita: 248 años terrestres\n- 5 lunas: Caronte, Nix, Hidra, Cerberus, Estigia\n\n**Reclasificación (2006):**\n- La IAU lo reclasificó como "planeta enano"\n- Razón: No ha "limpiado su órbita" de otros objetos\n- Categoría: Cinturón de Kuiper\n\n**New Horizons (2015):**\n- Primera nave en visitar Plutón\n- Descubrió una estructura en forma de corazón (Tombaugh Regio)\n- Montañas de hielo de agua de 3,500m\n- Atmósfera delgada de nitrógeno\n\n*La misión reveló que Plutón es mucho más complejo de lo que imaginábamos*',
  },
  {
    keywords: ['eclipse', 'lunar', 'solar'],
    response: '🌑 **Los Eclipses**\n\n**Eclipse Solar:**\n- La Luna bloquea la luz del Sol\n- Ocurre en Luna Nueva\n- **Total**: La Luna cubre completamente al Sol\n- La corona solar se hace visible\n- Máxima duración: ~7.5 minutos\n\n**Eclipse Lunar:**\n- La Tierra bloquea la luz solar hacia la Luna\n- Ocurre en Luna Llena\n- La Luna adquiere un color rojo ("Luna de sangre")\n- Visibles desde toda la mitad nocturna de la Tierra\n\n**Coincidencia cósmica:**\n- El Sol es 400× más grande que la Luna pero está 400× más lejos\n- Por eso se ven del mismo tamaño en el cielo\n\n*Próximo eclipse solar total visible desde España: 2026 (Islandia/España)*',
  },
  {
    keywords: ['ciencia', 'física', 'relatividad', 'einstein', 'quantum', 'cuántica'],
    response: '🔬 **Física Espacial**\n\n**Relatividad (Einstein):**\n- **E = mc²**: Masa y energía son equivalentes\n- El tiempo pasa más lento cuanto más rápido te mueves\n- La gravedad curva el espacio-tiempo\n- GPS debe corregir efectos relativistas\n\n**Mecánica Cuántica:**\n- Gobierna el mundo subatómico\n- Superposición: partículas en múltiples estados\n- Entrelazamiento: conexión instantánea a distancia\n- Aplicaciones: láseres, semiconductores, resonancia magnética\n\n**Materia y Energía Oscura:**\n- Materia oscura: 27% del universo (no la podemos ver)\n- Energía oscura: 68% (causa la expansión acelerada)\n- Materia normal: solo 5% del universo total\n\n*¡El 95% del universo nos es invisible!*',
  },
  {
    keywords: ['urano'],
    response: '🟦 **Urano - El Gigante Helado**\n\n**Datos:**\n- Tercer planeta más grande\n- Diámetro: 51,118 km (4× la Tierra)\n- Temperatura: -224°C\n- 27 lunas conocidas\n- Rotación invertida (gira de lado, inclinación 98°)\n\n**Características únicas:**\n- El único planeta que gira "acostado" en su eje\n- Anillos tenues (13 conocidos), descubiertos en 1977\n- Atmósfera de hidrógeno, helio y metano (color azul-verde)\n\n**Lunas destacadas:**\n- Miranda: Acantilados de 20 km de altura\n- Titania: La más grande (1,578 km)\n\n**Exploración:**\n- Voyager 2 (1986): Única visita hasta la fecha\n- NASA estudia posibles misiones futuras',
  },
  {
    keywords: ['neptuno'],
    response: '🔵 **Neptuno - El Gigante Azul**\n\n**Datos:**\n- Cuarto planeta más grande\n- Diámetro: 49,528 km (3.9× la Tierra)\n- Temperatura: -214°C\n- 16 lunas conocidas\n- Vientos más rápidos del sistema solar: 2,100 km/h\n\n**Características:**\n- Color azul intenso por metano en la atmósfera\n- Gran Mancha Oscura (tormenta similar a Júpiter)\n- Campo magnético fuertemente inclinado\n\n**Luna Tritón:**\n- La única luna grande con órbita retrógrada\n- Géiseres de nitrógeno en su superficie\n- Probablemente un objeto capturado del cinturón de Kuiper\n\n**Exploración:** Voyager 2 (1989) - única visita hasta hoy',
  },
  {
    keywords: ['venus'],
    response: '🟡 **Venus - El Gemelo Infernal**\n\n**Datos:**\n- Segundo planeta del sistema solar\n- Similar tamaño a la Tierra (12,104 km diámetro)\n- Temperatura: 462°C (el más caliente del sistema solar)\n- Presión atmosférica: 92× la terrestre\n\n**Características:**\n- Rotación retrógrada (gira en dirección opuesta)\n- Un día en Venus (243 días) > un año (225 días)\n- Atmósfera densa de CO₂ con nubes de ácido sulfúrico\n- Efecto invernadero descontrolado\n\n**Misiones recientes:**\n- Veritas y DAVINCI+ (NASA): Misiones planeadas\n- EnVision (ESA): Mapeo detallado\n\n*Venus muestra qué puede pasar con un efecto invernadero extremo*',
  },
  {
    keywords: ['mercurio'],
    response: '⚪ **Mercurio - El Mensajero Veloz**\n\n**Datos:**\n- El planeta más pequeño del sistema solar\n- Diámetro: 4,880 km (0.38× la Tierra)\n- Órbita más cercana al Sol: 58 millones km\n- Temperatura: -180°C a 430°C (extremos extremos)\n- Año: 88 días terrestres\n\n**Características:**\n- Sin atmósfera significativa\n- Cráteres similares a la Luna\n- Núcleo de hierro inusualmente grande (75% del radio)\n- Contracción de 7 km desde su formación\n\n**Misiones:**\n- **MESSENGER** (NASA, 2011-2015): Mapeó toda la superficie\n- **BepiColombo** (ESA/JAXA, 2018): En viaje, llegará en 2025',
  },
  {
    keywords: ['materia oscura', 'energía oscura', 'dark matter', 'dark energy'],
    response: '🌑 **Materia y Energía Oscura**\n\n**Lo que sabemos del universo:**\n- Materia normal (átomos): **5%**\n- Materia oscura: **27%**\n- Energía oscura: **68%**\n\n**Materia Oscura:**\n- No interactúa con la luz electromagnética\n- Se detecta por sus efectos gravitacionales\n- Evidencia: Rotación de galaxias, lentes gravitacionales\n- Candidatos: WIMPs, axiones, partículas exóticas\n\n**Energía Oscura:**\n- Fuerza misteriosa que acelera la expansión del universo\n- Descubierta en 1998 (Premio Nobel 2011)\n- Se integra en la constante cosmológica de Einstein\n\n*El 95% del universo es un misterio que aún no comprendemos*',
  },
  {
    keywords: ['viaje espacial', 'viajar', 'velocidad de la luz', 'luz'],
    response: '🚀 **Viaje Espacial y Velocidad de la Luz**\n\n**Velocidad de la luz:** 299,792 km/s (1,080 millones km/h)\n\n**Tiempos de viaje a velocidad de la luz:**\n- Luna: 1.3 segundos\n- Marte: 4-24 minutos\n- Júpiter: 35-52 minutos\n- Sol: 8 minutos 20 segundos\n- Próxima Centauri: 4.24 años\n- Centro de la Vía Láctea: 26,000 años\n- Galaxia de Andrómeda: 2.5 millones de años\n\n**Vehículos humanos:**\n- Voyager 1: 61,200 km/h (la nave más rápida)\n- New Horizons: 58,000 km/h\n- Llegar a Proxima Centauri tomaría ~73,000 años\n\n**Conceptos futuros:**\n- Propulsión nuclear: podría reducir a décadas\n- Velas solares: empujadas por luz láser\n- Warp drive: hipotético (Alcubierre)',
  },
  {
    keywords: ['tierra', 'nuestro planeta', 'home'],
    response: '🌍 **La Tierra - Nuestro Hogar Cósmico**\n\n**Datos:**\n- Edad: 4,540 millones de años\n- Diámetro: 12,742 km\n- Masa: 5.97 × 10²⁴ kg\n- Distancia al Sol: 150 millones km (1 UA)\n\n**Composición:**\n- Atmósfera: 78% N₂, 21% O₂, 1% otros\n- 71% de la superficie cubierta de agua\n- Núcleo de hierro a 5,400°C\n- Campo magnético nos protege del viento solar\n\n**Datos únicos:**\n- Único lugar conocido con vida\n- Zona habitable perfecta del Sol\n- Tectónica de placas activa\n- Luna estabiliza nuestro eje (estaciones)\n\n*Desde el espacio, la Tierra se ve como un "punto azul pálido" (Carl Sagan)*',
  },
  {
    keywords: ['satélite', 'artificial'],
    response: '📡 **Satélites Artificiales**\n\n**En órbita:** ~10,000 satélites activos\n\n**Tipos:**\n- **Comunicaciones**: Starlink (6,000+), OneWeb\n- **Navegación**: GPS, Galileo, GLONASS, BeiDou\n- **Observación terrestre**: Landsat, Sentinel\n- **Científicos**: Hubble, JWST, Chandra\n- **Militares**: Clasificados por cada país\n\n**Basura espacial:**\n- ~36,000 objetos >10 cm rastreados\n- ~130 millones de fragmentos <1 cm\n- Kessler Syndrome: riesgo de cascada de colisiones\n\n**Starlink (SpaceX):**\n- 6,000+ satélites en operación\n- Plan: 42,000 satélites\n- Internet global de alta velocidad\n\n*Los satélites son esenciales para la vida moderna: GPS, clima, comunicaciones*',
  },
  {
    keywords: ['rocket', 'cohete', 'lanzamiento', 'falcon'],
    response: '🚀 **Cohetes y Lanzamientos**\n\n**Cohetes activos principales:**\n- **Falcon 9** (SpaceX): Reutilizable, 200+ lanzamientos\n- **Starship** (SpaceX): 121m, el más grande jamás construido\n- **SLS** (NASA): Para Artemis, 2,000 toneladas de empuje\n- **Falcon Heavy** (SpaceX): 3 Falcon 9 juntos\n- **Ariane 6** (ESA): Lanzamiento inaugural en 2024\n- **Long March 5** (China): Pesado, misiones lunares\n\n**Récords:**\n- Saturno V (Apollo): El más potente usado (3,400 toneladas empuje)\n- Starship pretende superar ese récord\n- Falcon 9 Booster B1062: 20+ vuelos reutilizados\n\n**Costos:**\n- SpaceX redujo el costo de acceso al espacio en ~90%\n- Lanzamiento Falcon 9: ~$67 millones\n- Starship objetivo: ~$10 millones',
  },
  {
    keywords: ['qué es', 'explicar', 'explica', 'dime', 'cómo'],
    response: '🤖 ¡Esa es una gran pregunta! Como AstroAsistente, puedo ayudarte con temas como:\n\n- 🪐 **Planetas** y sus características\n- 🌌 **Galaxias** y el universo\n- ⭐ **Estrellas** y su ciclo de vida\n- 🚀 **Exploración espacial** y misiones\n- 🕳️ **Agujeros negros** y física extrema\n- ☄️ **Asteroides** y cometas\n- 🔭 **Telescopios** y observación\n\nPrueba preguntarme algo más específico sobre astronomía, ¡estaré encantado de ayudarte!',
  },
]

// ============================================================
// Helper: Simple markdown renderer
// ============================================================
function renderMarkdown(text: string) {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white/90">
          {part.slice(2, -2)}
        </strong>
      )
    }
    // Italic: *text*
    const italicParts = part.split(/(\*[^*]+\*)/g)
    return italicParts.map((ip, j) => {
      if (ip.startsWith('*') && ip.endsWith('*') && !ip.startsWith('**')) {
        return (
          <em key={`${i}-${j}`} className="italic text-white/50">
            {ip.slice(1, -1)}
          </em>
        )
      }
      return <React.Fragment key={`${i}-${j}`}>{ip}</React.Fragment>
    })
  })
}

// ============================================================
// Helper: Get hardcoded response for free users
// ============================================================
function getHardcodedResponse(input: string): string {
  const lower = input.toLowerCase()

  // Sort by longest keywords first for better matching
  const sorted = [...HARDCODED_RESPONSES].sort(
    (a, b) => Math.max(...b.keywords.map(k => k.length)) - Math.max(...a.keywords.map(k => k.length))
  )

  for (const item of sorted) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.response
    }
  }

  return '¡Interesante pregunta! 🌟 Los datos que tengo indican que el universo es vasto y lleno de misterios por descubrir. Te recomiendo explorar nuestra sección de Simuladores, la Galería NASA o las Noticias Espaciales para experimentar el cosmos de forma interactiva. ¿Te gustaría saber sobre algún tema específico como planetas, galaxias o misiones espaciales?'
}

// ============================================================
// Helper: Question counter management
// ============================================================
const QUESTIONS_KEY = 'astroverse_ai_questions'
const QUESTIONS_LIMIT = 10

function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

function loadQuestionCount(): { count: number; date: string } {
  if (typeof window === 'undefined') return { count: 0, date: getTodayStr() }
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { count: number; date: string }
      if (parsed.date === getTodayStr()) return parsed
      return { count: 0, date: getTodayStr() }
    }
  } catch { /* ignore */ }
  return { count: 0, date: getTodayStr() }
}

function saveQuestionCount(count: number) {
  if (typeof window === 'undefined') return
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify({ count, date: getTodayStr() }))
}

// ============================================================
// AiChatPage Component
// ============================================================
export default function AiChatPage({ userId, isPremium, userName }: AiChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: isPremium
        ? `¡Hola ${userName}! 🚀 Soy **AstroAsistente PRO**. Con tu cuenta PRO tienes acceso a respuestas avanzadas y explicaciones detalladas. Pregúntame cualquier cosa sobre astronomía y ciencia espacial.`
        : `¡Hola ${userName}! 🤖 Soy **AstroAsistente**. Estoy aquí para ayudarte a explorar el universo. Tienes **10 preguntas gratuitas hoy**. Pregúntame sobre planetas, galaxias, estrellas o cualquier tema espacial.`,
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [questionsLeft, setQuestionsLeft] = useState(QUESTIONS_LIMIT)
  const [showLimitOverlay, setShowLimitOverlay] = useState(false)
  const [detailedMode, setDetailedMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load question count on mount
  useEffect(() => {
    if (!isPremium) {
      const { count } = loadQuestionCount()
      setQuestionsLeft(QUESTIONS_LIMIT - count)
      if (count >= QUESTIONS_LIMIT) {
        setShowLimitOverlay(true)
      }
    }
  }, [isPremium])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const quickSuggestions = [
    '¿Cuántos planetas hay?',
    'Explícame los agujeros negros',
    '¿Qué es la Vía Láctea?',
    'Misión a Marte',
    'Teoría del Big Bang',
    'Vida extraterrestre',
  ]

  const handleSend = useCallback(async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend) return

    // Check free user limit
    if (!isPremium) {
      const { count } = loadQuestionCount()
      const currentCount = count
      if (currentCount >= QUESTIONS_LIMIT) {
        setShowLimitOverlay(true)
        toast.error('Has alcanzado tu límite diario de preguntas')
        return
      }
      saveQuestionCount(currentCount + 1)
      setQuestionsLeft(QUESTIONS_LIMIT - currentCount - 1)
    }

    const userMessage: ChatMessage = { role: 'user', content: textToSend }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      if (isPremium) {
        // PRO: call real LLM API
        const chatHistory = [...messages, userMessage].map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))

        // Add detailed mode instruction if enabled
        if (detailedMode) {
          chatHistory.push({
            role: 'user' as const,
            content: 'Por favor, dame una explicación más detallada y científica sobre este tema.',
          })
        }

        const res = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: chatHistory, isPremium: true }),
        })

        if (res.ok) {
          const data = await res.json()
          setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
        } else {
          throw new Error('API error')
        }
      } else {
        // Free: use hardcoded responses with simulated delay
        setTimeout(() => {
          const response = getHardcodedResponse(textToSend)
          setMessages(prev => [...prev, { role: 'assistant', content: response }])
          setIsTyping(false)
        }, 1200 + Math.random() * 800)
        return
      }
    } catch {
      // Fallback on error
      const fallback = getHardcodedResponse(textToSend)
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }])
    }

    setIsTyping(false)
  }, [input, messages, isPremium, detailedMode])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const showSuggestions = messages.length <= 1

  const remaining = isPremium ? Number.POSITIVE_INFINITY : questionsLeft

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] relative">
      {/* ====== FREE USER: Upgrade banner ====== */}
      {!isPremium && !showLimitOverlay && (
        <motion.div
          className="flex items-center justify-center gap-2 px-4 py-2 mb-3 rounded-xl cursor-pointer"
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ background: 'rgba(245,158,11,0.12)' }}
          onClick={() => toast.info('¡Actualiza a PRO para preguntas ilimitadas!')}
        >
          <Crown size={14} className="text-amber-400" />
          <span className="text-amber-300 text-xs font-medium">
            Obtén preguntas ilimitadas con PRO →
          </span>
        </motion.div>
      )}

      {/* ====== HEADER ====== */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center relative"
            style={{ background: 'rgba(124,58,237,0.1)' }}
          >
            <MessageSquare size={20} className="text-violet-400" />
            {isPremium && (
              <motion.div
                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  boxShadow: '0 0 8px rgba(0,212,255,0.5)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <Zap size={8} className="text-white" />
              </motion.div>
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Mentor IA PRO
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/30 text-xs">En línea</span>
            </div>
          </div>
        </div>

        {/* Question counter / PRO badge */}
        <div className="flex items-center gap-2">
          {isPremium ? (
            <motion.div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.2)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <InfinityIcon size={14} className="text-cyan-400" />
              <span className="text-cyan-300 text-xs font-semibold">Preguntas ∞</span>
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{
                background: remaining <= 3 ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                border: remaining <= 3
                  ? '1px solid rgba(239,68,68,0.2)'
                  : '1px solid rgba(245,158,11,0.2)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className={remaining <= 3 ? 'text-red-400' : 'text-amber-400'}>
                {remaining}
              </span>
              <span className="text-white/40 text-xs">/10 hoy</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ====== PRO Features Bar ====== */}
      {isPremium && (
        <motion.div
          className="flex items-center gap-2 mb-3"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: detailedMode ? 'rgba(0,212,255,0.15)' : 'rgba(0,212,255,0.05)',
              border: `1px solid ${detailedMode ? 'rgba(0,212,255,0.3)' : 'rgba(0,212,255,0.1)'}`,
              color: detailedMode ? '#00d4ff' : 'rgba(0,212,255,0.6)',
            }}
            onClick={() => setDetailedMode(!detailedMode)}
            whileHover={{ background: 'rgba(0,212,255,0.15)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles size={12} />
            Explicación Detallada
            <ChevronDown
              size={12}
              className={`transition-transform ${detailedMode ? 'rotate-180' : ''}`}
            />
          </motion.button>

          <motion.button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: 'rgba(124,58,237,0.05)',
              border: '1px solid rgba(124,58,237,0.1)',
              color: 'rgba(124,58,237,0.6)',
            }}
            onClick={() => toast.info('Generación de imágenes disponible próximamente en PRO+')}
            whileHover={{ background: 'rgba(124,58,237,0.1)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ImageIcon size={12} />
            Generar Imagen
            <span className="text-[9px] opacity-50">PRO+</span>
          </motion.button>
        </motion.div>
      )}

      {/* ====== MESSAGES AREA ====== */}
      <div
        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 rounded-2xl p-4"
        style={{
          ...cardBase,
          maxHeight: 'calc(100vh - 22rem)',
        }}
      >
        <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed)" />

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
              }`}
              style={{
                background:
                  msg.role === 'user'
                    ? 'rgba(0,212,255,0.1)'
                    : 'rgba(124,58,237,0.08)',
                border: msg.role === 'user'
                  ? '1px solid rgba(0,212,255,0.15)'
                  : '1px solid rgba(124,58,237,0.12)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={12} className="text-violet-400" />
                  <span className="text-violet-400 text-[10px] font-semibold tracking-wide">
                    AstroAsistente
                  </span>
                  {isPremium && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      PRO
                    </span>
                  )}
                </div>
              )}
              <div
                className={`text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user' ? 'text-white/80' : 'text-white/60'
                }`}
              >
                {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Quick suggestions */}
        {showSuggestions && !isTyping && (
          <motion.div
            className="flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {quickSuggestions.map(suggestion => (
              <motion.button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="px-4 py-2 rounded-xl text-xs font-medium"
                style={{
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.15)',
                  color: '#a78bfa',
                }}
                whileHover={{
                  background: 'rgba(124,58,237,0.15)',
                  boxShadow: '0 0 15px rgba(124,58,237,0.1)',
                  scale: 1.03,
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles size={12} className="inline mr-1.5 opacity-60" />
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="rounded-2xl rounded-bl-md px-4 py-3"
              style={{
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.12)',
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={12} className="text-violet-400" />
                <span className="text-violet-400 text-[10px] font-semibold tracking-wide">
                  AstroAsistente
                </span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-violet-400/50"
                    style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ====== INPUT AREA ====== */}
      <AnimatePresence>
        {!showLimitOverlay && (
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                !isPremium && questionsLeft <= 0
                  ? 'Has alcanzado tu límite diario'
                  : 'Pregúntame sobre el universo...'
              }
              disabled={!isPremium && questionsLeft <= 0}
              className="flex-1 px-4 py-3 rounded-xl text-white text-sm placeholder:text-white/20 transition-all duration-200 focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
              }}
              whileFocus={{
                boxShadow: isPremium
                  ? '0 0 20px rgba(0,212,255,0.15), 0 0 40px rgba(124,58,237,0.1)'
                  : '0 0 15px rgba(124,58,237,0.1)',
                borderColor: isPremium ? 'rgba(0,212,255,0.3)' : 'rgba(124,58,237,0.3)',
              }}
            />
            <motion.button
              onClick={() => handleSend()}
              disabled={!input.trim() || (!isPremium && questionsLeft <= 0)}
              className="w-11 h-11 rounded-xl flex items-center justify-center disabled:opacity-30"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                boxShadow: '0 0 20px rgba(124,58,237,0.3), 0 4px 15px rgba(0,0,0,0.3)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
            >
              <Send size={18} className="text-white" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== LIMIT OVERLAY (Free users) ====== */}
      <AnimatePresence>
        {showLimitOverlay && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl"
            style={{
              background: 'rgba(5,5,16,0.92)',
              backdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center p-8 max-w-sm mx-4 rounded-2xl relative overflow-hidden"
              style={cardBase}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              <CardGradientTop color="linear-gradient(90deg, #f59e0b, #ef4444)" />

              {/* Lock icon */}
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.2)',
                }}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Lock size={28} className="text-amber-400" />
              </motion.div>

              <motion.h3
                className="text-xl font-bold text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Límite diario alcanzado
              </motion.h3>

              <motion.p
                className="text-white/40 text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                Has usado tus 10 preguntas gratuitas de hoy. Vuelve mañana o desbloquea acceso ilimitado.
              </motion.p>

              {/* Features list */}
              <motion.div
                className="space-y-3 mb-6 text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {[
                  { icon: '∞', label: 'Preguntas ilimitadas', color: '#00d4ff' },
                  { icon: '🔬', label: 'Explicaciones detalladas', color: '#7c3aed' },
                  { icon: '🚀', label: 'Sin restricciones', color: '#10b981' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-white/70 text-sm">{feature.label}</span>
                  </div>
                ))}
              </motion.div>

              <motion.button
                className="w-full py-3 rounded-xl font-semibold text-white text-sm"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  boxShadow: '0 0 20px rgba(0,212,255,0.3), 0 4px 15px rgba(0,0,0,0.3)',
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,212,255,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toast.info('Actualiza a PRO para acceso ilimitado')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Obtén acceso ilimitado
              </motion.button>

              {/* Reset counter button (debug) */}
              <motion.button
                className="mt-3 flex items-center justify-center gap-1 text-white/20 text-xs hover:text-white/40 transition-colors mx-auto"
                onClick={() => {
                  saveQuestionCount(0)
                  setQuestionsLeft(QUESTIONS_LIMIT)
                  setShowLimitOverlay(false)
                  toast.success('Contador reiniciado')
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <RotateCcw size={10} />
                Reiniciar contador (debug)
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
