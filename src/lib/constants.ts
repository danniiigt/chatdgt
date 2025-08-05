export enum LOCALE {
  EN = "en",
  ES = "es",
}

export const LOCALES: LOCALE[] = [LOCALE.ES, LOCALE.EN];
export const DEFAULT_LOCALE: LOCALE = LOCALE.ES;
export const RESEND_COOLDOWN_SECONDS = 90;
export const RESEND_STORAGE_KEY_PREFIX = "email_resend";

type SuggestedMessage = {
  key: string;
  keyFallback: string;
};

export const suggestedMessages: SuggestedMessage[] = [
  {
    key: "chat.suggested-messages.learn-about-ai",
    keyFallback: "Explícame cómo funciona la inteligencia artificial",
  },
  {
    key: "chat.suggested-messages.productivity-tips",
    keyFallback: "Dame consejos para ser más productivo en mi día a día",
  },
  {
    key: "chat.suggested-messages.healthy-habits",
    keyFallback: "¿Cómo puedo crear hábitos más saludables?",
  },
  {
    key: "chat.suggested-messages.career-advice",
    keyFallback: "Necesito consejos para avanzar en mi carrera profesional",
  },
  {
    key: "chat.suggested-messages.time-management",
    keyFallback: "Ayúdame a gestionar mejor mi tiempo",
  },
  {
    key: "chat.suggested-messages.learn-new-language",
    keyFallback: "¿Cuál es la mejor forma de aprender un nuevo idioma?",
  },
  {
    key: "chat.suggested-messages.cooking-help",
    keyFallback: "Recomiéndame una receta fácil para esta noche",
  },
  {
    key: "chat.suggested-messages.workout-routine",
    keyFallback: "Necesito una rutina de ejercicios para hacer en casa",
  },
  {
    key: "chat.suggested-messages.book-recommendations",
    keyFallback: "¿Qué libros me recomiendas leer?",
  },
  {
    key: "chat.suggested-messages.travel-planning",
    keyFallback: "Ayúdame a planificar mi próximo viaje",
  },
  {
    key: "chat.suggested-messages.stress-management",
    keyFallback: "¿Cómo puedo manejar mejor el estrés?",
  },
  {
    key: "chat.suggested-messages.sleep-improvement",
    keyFallback: "Tengo problemas para dormir bien, ¿qué puedo hacer?",
  },
  {
    key: "chat.suggested-messages.creative-writing",
    keyFallback: "Ayúdame a escribir una historia interesante",
  },
  {
    key: "chat.suggested-messages.meditation-guide",
    keyFallback: "¿Cómo puedo empezar a meditar?",
  },
  {
    key: "chat.suggested-messages.interview-prep",
    keyFallback: "Tengo una entrevista de trabajo, ¿cómo me preparo?",
  },
  {
    key: "chat.suggested-messages.budget-planning",
    keyFallback: "Ayúdame a organizar mis finanzas personales",
  },
  {
    key: "chat.suggested-messages.home-organization",
    keyFallback: "¿Cómo puedo organizar mejor mi casa?",
  },
  {
    key: "chat.suggested-messages.learning-strategies",
    keyFallback: "¿Cuáles son las mejores técnicas de estudio?",
  },
  {
    key: "chat.suggested-messages.relationship-advice",
    keyFallback: "Dame consejos para mejorar mis relaciones personales",
  },
  {
    key: "chat.suggested-messages.creative-hobbies",
    keyFallback: "¿Qué hobbies creativos puedo empezar?",
  },
  {
    key: "chat.suggested-messages.mental-health",
    keyFallback: "¿Cómo puedo cuidar mejor mi salud mental?",
  },
  {
    key: "chat.suggested-messages.goal-setting",
    keyFallback: "Ayúdame a establecer objetivos realistas",
  },
  {
    key: "chat.suggested-messages.technology-explained",
    keyFallback: "Explícame las últimas tendencias tecnológicas",
  },
  {
    key: "chat.suggested-messages.sustainable-living",
    keyFallback: "¿Cómo puedo vivir de forma más sostenible?",
  },
  {
    key: "chat.suggested-messages.photography-tips",
    keyFallback: "Dame consejos para mejorar mis fotografías",
  },
  {
    key: "chat.suggested-messages.music-recommendations",
    keyFallback: "¿Qué música nueva me recomiendas?",
  },
  {
    key: "chat.suggested-messages.space-facts",
    keyFallback: "Cuéntame curiosidades sobre el espacio",
  },
  {
    key: "chat.suggested-messages.gardening-help",
    keyFallback: "¿Cómo puedo empezar un pequeño huerto?",
  },
  {
    key: "chat.suggested-messages.movie-recommendations",
    keyFallback: "Recomiéndame películas interesantes para ver",
  },
  {
    key: "chat.suggested-messages.history-curiosities",
    keyFallback: "Cuéntame datos curiosos de la historia",
  },
  {
    key: "chat.suggested-messages.science-explained",
    keyFallback: "Explícame conceptos científicos de forma simple",
  },
  {
    key: "chat.suggested-messages.art-appreciation",
    keyFallback: "Háblame sobre diferentes estilos de arte",
  },
  {
    key: "chat.suggested-messages.cultural-differences",
    keyFallback: "Cuéntame sobre culturas diferentes del mundo",
  },
  {
    key: "chat.suggested-messages.memory-improvement",
    keyFallback: "¿Cómo puedo mejorar mi memoria?",
  },
  {
    key: "chat.suggested-messages.confidence-building",
    keyFallback: "Ayúdame a ganar más confianza en mí mismo",
  },
  {
    key: "chat.suggested-messages.public-speaking",
    keyFallback: "Tengo miedo a hablar en público, ¿qué hago?",
  },
  {
    key: "chat.suggested-messages.decision-making",
    keyFallback: "¿Cómo puedo tomar mejores decisiones?",
  },
  {
    key: "chat.suggested-messages.creativity-boost",
    keyFallback: "Ayúdame a ser más creativo",
  },
  {
    key: "chat.suggested-messages.morning-routine",
    keyFallback: "¿Cómo crear una rutina matutina efectiva?",
  },
  {
    key: "chat.suggested-messages.evening-routine",
    keyFallback: "Necesito una buena rutina para antes de dormir",
  },
  {
    key: "chat.suggested-messages.communication-skills",
    keyFallback: "¿Cómo puedo comunicarme mejor con otros?",
  },
  {
    key: "chat.suggested-messages.mindfulness-practice",
    keyFallback: "Enséñame ejercicios de mindfulness",
  },
  {
    key: "chat.suggested-messages.food-nutrition",
    keyFallback: "¿Cómo puedo mejorar mi alimentación?",
  },
  {
    key: "chat.suggested-messages.energy-boost",
    keyFallback: "Me siento sin energía, ¿qué puedo hacer?",
  },
  {
    key: "chat.suggested-messages.weather-chat",
    keyFallback: "Explícame cómo se forman los fenómenos meteorológicos",
  },
  {
    key: "chat.suggested-messages.animal-facts",
    keyFallback: "Cuéntame datos fascinantes sobre animales",
  },
  {
    key: "chat.suggested-messages.ocean-mysteries",
    keyFallback: "Háblame de los misterios del océano",
  },
  {
    key: "chat.suggested-messages.brain-facts",
    keyFallback: "¿Cómo funciona realmente nuestro cerebro?",
  },
  {
    key: "chat.suggested-messages.future-predictions",
    keyFallback: "¿Cómo crees que será el mundo en 20 años?",
  },
  {
    key: "chat.suggested-messages.childhood-nostalgia",
    keyFallback: "Háblame de juegos y cosas de cuando era niño",
  },
  {
    key: "chat.suggested-messages.urban-myths",
    keyFallback: "Cuéntame sobre mitos urbanos interesantes",
  },
  {
    key: "chat.suggested-messages.daily-motivation",
    keyFallback: "Necesito motivación para empezar el día",
  },
  {
    key: "chat.suggested-messages.climate-change",
    keyFallback: "Explícame el cambio climático de forma simple",
  },
  {
    key: "chat.suggested-messages.social-situations",
    keyFallback: "¿Cómo puedo ser menos tímido en situaciones sociales?",
  },
  {
    key: "chat.suggested-messages.weekend-activities",
    keyFallback: "Dame ideas de qué hacer este fin de semana",
  },
  {
    key: "chat.suggested-messages.gift-ideas",
    keyFallback: "Ayúdame a encontrar el regalo perfecto",
  },
  {
    key: "chat.suggested-messages.learning-motivation",
    keyFallback: "¿Cómo puedo mantenerme motivado para aprender?",
  },
  {
    key: "chat.suggested-messages.random-facts",
    keyFallback: "Cuéntame datos curiosos que no sabía",
  },
  {
    key: "chat.suggested-messages.daily-habits",
    keyFallback: "¿Qué hábitos pequeños pueden mejorar mi vida?",
  },
  {
    key: "chat.suggested-messages.seasonal-advice",
    keyFallback: "Dame consejos para esta época del año",
  },
  {
    key: "chat.suggested-messages.life-philosophy",
    keyFallback: "Háblame sobre diferentes filosofías de vida",
  },
  {
    key: "chat.suggested-messages.problem-solving",
    keyFallback: "Ayúdame a resolver un problema que tengo",
  },
  {
    key: "chat.suggested-messages.future-career",
    keyFallback: "¿Qué trabajos crees que existirán en el futuro?",
  },
  {
    key: "chat.suggested-messages.daily-gratitude",
    keyFallback: "¿Cómo puedo practicar la gratitud cada día?",
  },
  {
    key: "chat.suggested-messages.personality-types",
    keyFallback: "Explícame los diferentes tipos de personalidad",
  },
  {
    key: "chat.suggested-messages.language-curiosities",
    keyFallback: "Cuéntame curiosidades sobre los idiomas",
  },
  {
    key: "chat.suggested-messages.food-culture",
    keyFallback: "Háblame sobre la comida de diferentes países",
  },
  {
    key: "chat.suggested-messages.invention-stories",
    keyFallback: "Cuéntame historias de inventos famosos",
  },
  {
    key: "chat.suggested-messages.natural-wonders",
    keyFallback: "Descríbeme las maravillas naturales del mundo",
  },
  {
    key: "chat.suggested-messages.human-achievements",
    keyFallback: "¿Cuáles han sido los mayores logros humanos?",
  },
  {
    key: "chat.suggested-messages.daily-routine",
    keyFallback: "Ayúdame a optimizar mi rutina diaria",
  },
  {
    key: "chat.suggested-messages.emotion-management",
    keyFallback: "¿Cómo puedo manejar mejor mis emociones?",
  },
  {
    key: "chat.suggested-messages.world-cultures",
    keyFallback: "Enséñame sobre tradiciones de otros países",
  },
  {
    key: "chat.suggested-messages.simple-pleasures",
    keyFallback: "Háblame de los pequeños placeres de la vida",
  },
  {
    key: "chat.suggested-messages.coincidences",
    keyFallback: "Cuéntame sobre coincidencias increíbles",
  },
  {
    key: "chat.suggested-messages.dreams-meaning",
    keyFallback: "¿Qué significan los sueños que tenemos?",
  },
  {
    key: "chat.suggested-messages.color-psychology",
    keyFallback: "Explícame cómo los colores afectan nuestro estado de ánimo",
  },
  {
    key: "chat.suggested-messages.memory-lane",
    keyFallback: "Háblame de cosas que eran populares en el pasado",
  },
  {
    key: "chat.suggested-messages.life-hacks",
    keyFallback: "Dame trucos útiles para la vida cotidiana",
  },
  {
    key: "chat.suggested-messages.seasonal-changes",
    keyFallback: "¿Por qué cambian las estaciones del año?",
  },
  {
    key: "chat.suggested-messages.human-behavior",
    keyFallback: "Explícame por qué las personas actúan como lo hacen",
  },
  {
    key: "chat.suggested-messages.ancient-mysteries",
    keyFallback: "Cuéntame misterios de civilizaciones antiguas",
  },
  {
    key: "chat.suggested-messages.funny-stories",
    keyFallback: "Cuéntame algo gracioso o divertido",
  },
  {
    key: "chat.suggested-messages.world-records",
    keyFallback: "Háblame de récords mundiales increíbles",
  },
  {
    key: "chat.suggested-messages.daily-reflection",
    keyFallback: "Ayúdame a reflexionar sobre mi día",
  },
  {
    key: "chat.suggested-messages.optimism-tips",
    keyFallback: "¿Cómo puedo ser más optimista?",
  },
  {
    key: "chat.suggested-messages.local-traditions",
    keyFallback: "Cuéntame tradiciones interesantes de España",
  },
  {
    key: "chat.suggested-messages.weather-phenomena",
    keyFallback: "Explícame fenómenos meteorológicos raros",
  },
  {
    key: "chat.suggested-messages.body-language",
    keyFallback: "¿Cómo puedo entender mejor el lenguaje corporal?",
  },
  {
    key: "chat.suggested-messages.daily-inspiration",
    keyFallback: "Dame una frase inspiradora para hoy",
  },
  {
    key: "chat.suggested-messages.friendship-advice",
    keyFallback: "¿Cómo puedo ser un mejor amigo?",
  },
  {
    key: "chat.suggested-messages.seasonal-activities",
    keyFallback: "¿Qué actividades puedo hacer según la época del año?",
  },
  {
    key: "chat.suggested-messages.mindful-moments",
    keyFallback: "Ayúdame a encontrar momentos de calma en mi día",
  },
  {
    key: "chat.suggested-messages.life-lessons",
    keyFallback: "¿Qué lecciones de vida son importantes aprender?",
  },
  {
    key: "chat.suggested-messages.curiosity-topics",
    keyFallback: "Háblame de algo que despierte mi curiosidad",
  },
  {
    key: "chat.suggested-messages.personal-growth",
    keyFallback: "¿Cómo puedo seguir creciendo como persona?",
  },
  {
    key: "chat.suggested-messages.kindness-acts",
    keyFallback: "Dame ideas de actos de bondad que puedo hacer",
  },
  {
    key: "chat.suggested-messages.simple-joys",
    keyFallback: "Recuérdame las cosas simples que traen felicidad",
  },
  {
    key: "chat.suggested-messages.conversation-starters",
    keyFallback: "Dame ideas para iniciar conversaciones interesantes",
  },
  {
    key: "chat.suggested-messages.life-balance",
    keyFallback: "¿Cómo puedo encontrar mejor equilibrio en mi vida?",
  },
  {
    key: "chat.suggested-messages.nature-connection",
    keyFallback: "¿Cómo puedo conectar más con la naturaleza?",
  },
  {
    key: "chat.suggested-messages.self-care",
    keyFallback: "Dame ideas para cuidarme mejor a mí mismo",
  },
  {
    key: "chat.suggested-messages.positive-thinking",
    keyFallback: "Ayúdame a desarrollar pensamientos más positivos",
  },
  {
    key: "chat.suggested-messages.random-knowledge",
    keyFallback: "Comparte conmigo conocimiento aleatorio pero interesante",
  },
  {
    key: "chat.suggested-messages.language-learning",
    keyFallback: "¿Cómo puedo mejorar mi inglés rápidamente?",
  },
  {
    key: "chat.suggested-messages.pet-care",
    keyFallback: "Dame consejos para cuidar mejor a mi mascota",
  },
  {
    key: "chat.suggested-messages.home-cooking",
    keyFallback: "Enséñame a cocinar algo delicioso y fácil",
  },
  {
    key: "chat.suggested-messages.exercise-motivation",
    keyFallback: "No tengo ganas de hacer ejercicio, ¿cómo me motivo?",
  },
  {
    key: "chat.suggested-messages.money-saving",
    keyFallback: "Ayúdame a ahorrar dinero en mi día a día",
  },
  {
    key: "chat.suggested-messages.weekend-plans",
    keyFallback: "Estoy aburrido, ¿qué puedo hacer hoy?",
  },
  {
    key: "chat.suggested-messages.study-tips",
    keyFallback: "¿Cómo puedo concentrarme mejor al estudiar?",
  },
  {
    key: "chat.suggested-messages.social-media",
    keyFallback: "¿Debería usar menos las redes sociales?",
  },
  {
    key: "chat.suggested-messages.fashion-advice",
    keyFallback: "Ayúdame a mejorar mi estilo de vestir",
  },
  {
    key: "chat.suggested-messages.phone-addiction",
    keyFallback: "Paso demasiado tiempo en el móvil, ¿qué hago?",
  },
  {
    key: "chat.suggested-messages.birthday-party",
    keyFallback: "Dame ideas para organizar una fiesta de cumpleaños",
  },
  {
    key: "chat.suggested-messages.procrastination",
    keyFallback: "Siempre dejo todo para último momento, ¿cómo cambio?",
  },
  {
    key: "chat.suggested-messages.first-job",
    keyFallback: "Es mi primer trabajo, ¿qué consejos me das?",
  },
  {
    key: "chat.suggested-messages.bad-day",
    keyFallback: "He tenido un día horrible, ¿cómo mejoro mi ánimo?",
  },
  {
    key: "chat.suggested-messages.new-city",
    keyFallback: "Me mudé a una nueva ciudad, ¿cómo hago amigos?",
  },
  {
    key: "chat.suggested-messages.college-life",
    keyFallback: "Voy a empezar la universidad, ¿qué debo saber?",
  },
  {
    key: "chat.suggested-messages.family-problems",
    keyFallback: "Tengo problemas familiares, ¿cómo los manejo?",
  },
  {
    key: "chat.suggested-messages.night-routine",
    keyFallback: "¿Qué debería hacer antes de acostarme?",
  },
  {
    key: "chat.suggested-messages.eating-healthy",
    keyFallback: "Quiero comer más sano pero no sé por dónde empezar",
  },
  {
    key: "chat.suggested-messages.dating-advice",
    keyFallback: "Dame consejos para las citas amorosas",
  },
  {
    key: "chat.suggested-messages.job-interview",
    keyFallback: "Estoy nervioso por una entrevista, ¿qué hago?",
  },
  {
    key: "chat.suggested-messages.learning-online",
    keyFallback: "¿Cuáles son los mejores cursos online gratuitos?",
  },
  {
    key: "chat.suggested-messages.winter-blues",
    keyFallback: "Me siento triste en invierno, ¿es normal?",
  },
  {
    key: "chat.suggested-messages.toxic-people",
    keyFallback: "¿Cómo lidio con personas tóxicas en mi vida?",
  },
  {
    key: "chat.suggested-messages.car-maintenance",
    keyFallback: "¿Qué cuidados básicos necesita mi coche?",
  },
  {
    key: "chat.suggested-messages.plant-care",
    keyFallback: "Se me mueren todas las plantas, ¿qué hago mal?",
  },
  {
    key: "chat.suggested-messages.gift-wrapping",
    keyFallback: "Enséñame formas creativas de envolver regalos",
  },
  {
    key: "chat.suggested-messages.loneliness",
    keyFallback: "Me siento solo últimamente, ¿qué puedo hacer?",
  },
  {
    key: "chat.suggested-messages.morning-energy",
    keyFallback: "Siempre me levanto sin energía, ¿cómo cambio esto?",
  },
  {
    key: "chat.suggested-messages.social-anxiety",
    keyFallback: "Me da ansiedad hablar con desconocidos, ¿consejos?",
  },
  {
    key: "chat.suggested-messages.phone-etiquette",
    keyFallback: "¿Cuáles son las reglas básicas del móvil en sociedad?",
  },
  {
    key: "chat.suggested-messages.hobby-ideas",
    keyFallback: "Busco un hobby nuevo que no sea caro",
  },
  {
    key: "chat.suggested-messages.productivity-apps",
    keyFallback: "¿Qué aplicaciones me ayudan a ser más productivo?",
  },
  {
    key: "chat.suggested-messages.room-decoration",
    keyFallback: "Quiero decorar mi habitación con poco dinero",
  },
  {
    key: "chat.suggested-messages.healthy-snacks",
    keyFallback: "Dame ideas de snacks saludables y ricos",
  },
  {
    key: "chat.suggested-messages.first-date",
    keyFallback: "Tengo una primera cita, ¿de qué hablo?",
  },
  {
    key: "chat.suggested-messages.bad-habits",
    keyFallback: "Ayúdame a dejar un mal hábito que tengo",
  },
  {
    key: "chat.suggested-messages.surprise-party",
    keyFallback: "Quiero organizar una fiesta sorpresa, ¿cómo?",
  },
  {
    key: "chat.suggested-messages.water-intake",
    keyFallback: "Nunca me acuerdo de beber agua, ¿cómo crear el hábito?",
  },
  {
    key: "chat.suggested-messages.music-discovery",
    keyFallback: "¿Cómo puedo descubrir música nueva que me guste?",
  },
  {
    key: "chat.suggested-messages.email-etiquette",
    keyFallback: "¿Cómo escribir emails profesionales correctamente?",
  },
  {
    key: "chat.suggested-messages.netflix-recommendations",
    keyFallback: "No sé qué ver en Netflix, ¿me recomiendas algo?",
  },
  {
    key: "chat.suggested-messages.small-talk",
    keyFallback: "¿Cómo iniciar conversaciones casuales con la gente?",
  },
  {
    key: "chat.suggested-messages.apartment-hunting",
    keyFallback: "Busco apartamento por primera vez, ¿qué debo saber?",
  },
  {
    key: "chat.suggested-messages.workout-home",
    keyFallback: "No puedo ir al gym, ¿cómo ejercitarme en casa?",
  },
  {
    key: "chat.suggested-messages.saving-money",
    keyFallback: "Gasto demasiado dinero, ¿cómo controlo mis gastos?",
  },
  {
    key: "chat.suggested-messages.cooking-basics",
    keyFallback: "No sé cocinar nada, ¿por dónde empiezo?",
  },
  {
    key: "chat.suggested-messages.phone-photography",
    keyFallback: "¿Cómo tomar mejores fotos con mi móvil?",
  },
  {
    key: "chat.suggested-messages.party-games",
    keyFallback: "Dame ideas de juegos para una reunión con amigos",
  },
  {
    key: "chat.suggested-messages.morning-motivation",
    keyFallback: "¿Cómo empezar el día con energía positiva?",
  },
  {
    key: "chat.suggested-messages.weekend-getaway",
    keyFallback: "Quiero hacer una escapada de fin de semana, ¿dónde?",
  },
  {
    key: "chat.suggested-messages.learning-guitar",
    keyFallback: "¿Es difícil aprender a tocar la guitarra de adulto?",
  },
  {
    key: "chat.suggested-messages.job-search",
    keyFallback: "Llevo meses buscando trabajo, ¿qué hago mal?",
  },
  {
    key: "chat.suggested-messages.birthday-ideas",
    keyFallback: "Es mi cumpleaños pronto, ¿cómo lo celebro?",
  },
  {
    key: "chat.suggested-messages.night-out",
    keyFallback: "Salgo esta noche con amigos, ¿qué planes hay?",
  },
  {
    key: "chat.suggested-messages.cleaning-motivation",
    keyFallback: "Odio limpiar la casa, ¿cómo me motivo?",
  },
  {
    key: "chat.suggested-messages.rainy-day",
    keyFallback: "Está lloviendo y me aburro, ¿qué hago en casa?",
  },
  {
    key: "chat.suggested-messages.cheap-dates",
    keyFallback: "Dame ideas de citas románticas que no cuesten mucho",
  },
  {
    key: "chat.suggested-messages.morning-coffee",
    keyFallback: "¿Cómo hacer un café perfecto en casa?",
  },
];

export type Model = {
  id: string;
  name: string;
};

export const DEFAULT_MODEL = "gpt-4o-mini";

export const AVAILABLE_MODELS: Model[] = [
  { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
];

export const randomColors = [
  "#0093E9", // #0093E9
  "#00B4DB", // #00B4DB
  "#6A11CB", // #6A11CB
  "#833ab4", // #833ab4
  "#f5851f", // #f5851f
  "#f44336", // #f44336
  "#f57c00", // #f57c00
];
export const randomColor =
  randomColors[Math.floor(Math.random() * randomColors.length)];
