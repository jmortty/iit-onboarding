import React, { useEffect, useMemo, useState, useContext, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogIn, LogOut, Menu, X, GraduationCap,
  Home as HomeIcon, Info, Mail, LayoutDashboard,
  Facebook, Instagram, Linkedin, Twitter, Youtube
} from "lucide-react";

/**
 * Illinois Institute of Technology brand palette (approximate)
 */
const brand = {
  red: "#cc0000",
  redDark: "#990000",
  black: "#000000",
  white: "#ffffff",
  gray: "#f5f5f5",
  accent: "#ffcc00",
};

// Animations and shared styles
const container = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const glossy = "bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.08)]";

/* ===========================
   i18n: super-light provider
=========================== */
const messages = {
  en: {
    brand: { app: "ILLINOIS TECH ONBOARDING", sub: "International Students" },
    nav: {
      home: "Home", about: "About", contact: "Contact",
      dashboard: "Dashboard", login: "Login", logout: "Logout"
    },
    hero: {
      badge: "Welcome to ILLINOIS TECH",
      title: "International Students Onboarding Platform",
      body: "Your guided path from admission to arrival: tasks, checklists, compliance, housing, and campus life.",
      ctaDash: "Go to Dashboard",
      ctaLearn: "Learn more",
    },
    home: {
      welcomeTitle: "Welcome to the International Student Onboarding Platform",
      welcomeSubtitle:
        "Designed with international students, for international students. Here, you’ll find everything you need to transition smoothly into life at Illinois Institute of Technology (IIT) — from your I-20 submission to your first class and community event.",
      bannerNote:
        "Background banner: smiling international students at IIT’s Mies Campus. Below is a dynamic onboarding preview:",
      ctas: {
        getStarted: "🔹 Get Started",
        getStartedAria: "Get Started – Begin your onboarding journey",
        progress: "🔹 Check Your Progress",
        progressAria: "Check Your Progress – View your onboarding checklist",
        explore: "🔹 Explore IIT Resources",
        exploreAria: "Explore IIT Resources – Visit key student services",
      },
      progressTitle: "Onboarding Progress",
      progressComplete: "75% Complete",
      progressFootnote: "Housing Contract Submitted • I-20 Uploaded • Orientation Scheduled",
      stepsTitle: "Your Onboarding Steps",
      stepsLine:
        "Step 1: Log in • Step 2: View dashboard • Step 3: Complete visa/housing/health tasks • Step 4: Attend orientation • Step 5: Arrive with confidence",
      whyTitle: "💡 Why This Platform?",
      whyTagline: "“Designed with international students — for a smooth start at Illinois Tech.”",
      whyIntro1:
        "The onboarding experience for international students can be overwhelming. Between visa paperwork, housing decisions, and settling into a new culture, many students struggle to track deadlines or access essential resources.",
      whyIntro2:
        "This platform simplifies your journey — combining all key onboarding steps, resources, and contacts into one secure digital home.",
      cards: {
        tasksTitle: "🧭 1. Centralized Tasks with Smart Reminders",
        tasksList: [
          "Manage your entire onboarding process through a single dashboard.",
          "Personalized checklist that adapts to your stage (Pre-Arrival, Arrival, Post-Arrival).",
          "Automatic email and in-app deadline notifications (I-20, orientation, housing).",
          "Visual progress tracking (e.g., 75% Complete — Housing Contract Submitted).",
        ],
        tasksQuote: "“No more scattered emails — all your tasks, tracked and synced.”",
        docsTitle: "🔒 2. Secure Document Uploads",
        docsList: [
          "Upload I-20, visa copies, insurance, and immunization records with encryption.",
          "Automatic verification reminders for incomplete submissions.",
          "Secure storage accessible only by authorized IIT staff.",
        ],
        docsQuote: "“Your paperwork, protected and organized — ready for your arrival.”",
        lifeTitle: "🏙 3. Local Living Tips",
        lifeList: [
          "Banking: How to open U.S. accounts & set up digital payments.",
          "Transit: CTA passes, IIT shuttles, Metra and “L” stations.",
          "Groceries: Student-friendly stores & halal/specialty options near Mies Campus.",
          "Campus Jobs: Student employment, HR onboarding, career fairs.",
        ],
        lifeQuote: "“Practical guidance for living confidently — both on and off campus.”",
        connectTitle: "🤝 4. Connect with Mentors, Advisors, and Communities",
        connectList: [
          "Match with IIT peer mentors and cultural ambassadors.",
          "Schedule meetings with academic advisors and orientation leaders.",
          "Join international student groups and upcoming IIT social events.",
        ],
        connectQuote: "“From your first hello to lifelong connections — start your IIT journey with the right people.”",
      },
      howTitle: "🧩 How It Works",
      howSubtitle: "Simple. Secure. Student-centered.",
      howSteps: [
        ["Step 1", "Log in with your IIT credentials (Single Sign-On)."],
        ["Step 2", "View your personalized onboarding dashboard."],
        ["Step 3", "Complete tasks: visa upload, housing application, health check."],
        ["Step 4", "Attend virtual orientation or live sessions."],
        ["Step 5", "Arrive at IIT with confidence — paperwork done, support waiting."],
      ],
    },
    about: {
      title: "About",
      subtitle: "Our mission is to streamline the onboarding journey for international students at IIT.",
      body:
        "The International Students Onboarding Platform provides a guided experience from admission to arrival. It helps students complete immigration steps, understand housing options, prepare for orientation, and access essential campus resources — all in one place.",
      cards: {
        visa: {
          title: "Compliance & Visa",
          body:
            "Step-by-step guidance on visa processing, SEVIS registration, and immigration document submission with reminders tailored to IIT’s requirements.",
        },
        housing: {
          title: "Housing & Arrival",
          body:
            "Explore on-campus housing, nearby apartments, temporary stay options, and arrival check-ins for a stress-free transition.",
        },
        orient: {
          title: "Orientation & Community",
          body:
            "Learn about orientation week, student organizations, and cultural clubs. Connect with mentors and peers.",
        },
        resources: {
          title: "Campus Resources",
          body:
            "Find student support, advising, banking, phone setup, healthcare, the One Stop office, and wellness/tutoring.",
        },
      },
    },
    contact: {
      title: "Contact",
      subtitle: "Questions or feedback? Reach out—we’re here to help.",
      name: "Name",
      email: "Email",
      message: "Message",
      placeholderName: "Your full name",
      placeholderEmail: "you@hawk.iit.edu",
      placeholderMsg: "Tell us how we can help",
      send: "Send Message",
    },
    login: {
      title: "IIT Onboarding Login",
      helper: "Access your onboarding dashboard and continue your journey at Illinois Tech.",
      email: "Email",
      password: "Password",
      placeholderEmail: "you@hawk.illinoistech.edu",
      placeholderPw: "••••••••",
      submit: "Sign in",
      policy: "By signing in, you agree to the Student Code of Conduct and platform usage policy.",
    },
    dash: {
      title: "Dashboard",
      welcome: "Welcome",
      checklist: "Checklist",
      resources: "Key Resources",
      announcements: "Announcements",
      pre: "Pre-Arrival Preparation",
      campus: "Campus Navigation",
      academic: "Academic Integration",
      social: "Social Networking",
      directory: "Resource Directory",
      items: {
        visa: "Visa & Documentation",
        housing: "Housing Options",
        culture: "Cultural Orientation",
        documents: "Document Presentation",
        maps: "Interactive Campus Maps",
        buildings: "Building Information",
        loc: "Location-Based Services",
        reg: "Course Registration Guidance",
        cal: "Academic Calendar Integration",
        adv: "Advisor Connection",
        comm: "Student Communities",
        mentor: "Mentor Matching",
        events: "Event Participation",
        serv: "Campus Services",
        amen: "Local Amenities",
        emerg: "Emergency Contacts",
      },
      dummy: {
        visa: "Provide visa requirements and step-by-step guidance for document submission.",
        housing: "Display on/off-campus housing with availability, pricing, and amenities.",
        culture: "Guides, videos, and webinars about local customs and cultural norms.",
        documents: "Upload and securely store essential documents.",
        maps: "Visual maps of buildings, lecture halls, libraries, and facilities.",
        buildings: "Opening hours, services, and accessibility details for each building.",
        loc: "Notifications for nearby events or facilities based on your location.",
        reg: "Step-by-step instructions for enrolling in classes.",
        cal: "Sync with semester schedules and important deadlines.",
        adv: "Contact academic advisors directly via the platform.",
        comm: "Connect with peers and international student groups.",
        mentor: "Pair new students with senior students for guidance.",
        events: "Discover social events, clubs, and workshops to join.",
        serv: "Dining, health, counseling, recreation, and more.",
        amen: "Transport, groceries, banks, and essential local services.",
        emerg: "Campus security, health centers, and local emergency numbers.",
      },
      due: "Due",
      coming: "This section is under construction. Content coming soon.",
      nav: "Navigation",
    },
    footer: {
      follow: "Follow Us",
      campusLinks: "Campus Links",
      webPolicies: "Web & Policies",
      contactLabel: "Contact",
      contactUs: "Contact Us",
      emergency: "Emergency Information",
      employment: "Employment",
      alumni: "Alumni",
      portal: "Illinois Tech Portal",
      privacy: "Privacy",
      copyright: "Copyright Concerns",
      ibhe: "IBHE Online Complaint System",
      stuComplaint: "Student Complaint Information",
      nondisc: "Student Non-Discrimination Policy",
      rights: "All Rights Reserved",
      university: "Illinois Institute of Technology",
    },
    ui: { language: "Language" },
    notFound: { title: "Not Found", body: "Page not found." },
  },
  fr: {
    brand: { app: "Intégration IIT", sub: "Étudiants internationaux" },
    nav: {
      home: "Accueil", about: "À propos", contact: "Contact",
      dashboard: "Tableau de bord", login: "Connexion", logout: "Déconnexion"
    },
    hero: {
      badge: "Bienvenue à IIT",
      title: "Plateforme d’intégration des étudiants internationaux",
      body: "Votre parcours guidé de l’admission à l’arrivée : tâches, listes, conformité, logement et vie sur le campus.",
      ctaDash: "Aller au tableau de bord",
      ctaLearn: "En savoir plus",
    },
    home: {
      welcomeTitle: "Bienvenue sur la plateforme d’intégration des étudiants internationaux",
      welcomeSubtitle:
        "Conçue avec les étudiants internationaux, pour les étudiants internationaux. Ici, vous trouverez tout pour réussir votre arrivée à l’Illinois Institute of Technology (IIT) — de votre I-20 à votre premier cours et vos événements communautaires.",
      bannerNote:
        "Bannière : étudiants internationaux souriants sur le campus Mies d’IIT. Ci-dessous, un aperçu dynamique de l’intégration :",
      ctas: {
        getStarted: "🔹 Commencer",
        getStartedAria: "Commencer — Démarrer votre parcours d’intégration",
        progress: "🔹 Voir votre progression",
        progressAria: "Voir votre progression — Consulter votre liste d’intégration",
        explore: "🔹 Explorer les ressources IIT",
        exploreAria: "Explorer — Accéder aux principaux services étudiants",
      },
      progressTitle: "Progression d’intégration",
      progressComplete: "75 % terminé",
      progressFootnote: "Contrat de logement soumis • I-20 téléversé • Orientation programmée",
      stepsTitle: "Vos étapes d’intégration",
      stepsLine:
        "Étape 1 : Connexion • Étape 2 : Tableau de bord • Étape 3 : Visa/logement/santé • Étape 4 : Orientation • Étape 5 : Arrivée sereine",
      whyTitle: "💡 Pourquoi cette plateforme ?",
      whyTagline: "« Conçue avec les étudiants internationaux — pour un démarrage fluide à Illinois Tech. »",
      whyIntro1:
        "L’intégration peut être déroutante : visa, logement, culture… Il est difficile de suivre les échéances et d’accéder aux ressources essentielles.",
      whyIntro2:
        "Cette plateforme simplifie votre parcours — tâches, ressources et contacts réunis dans un espace numérique sécurisé.",
      cards: {
        tasksTitle: "🧭 1. Tâches centralisées avec rappels intelligents",
        tasksList: [
          "Gérez toute votre intégration depuis un tableau de bord unique.",
          "Liste personnalisée selon votre étape (pré-arrivée, arrivée, post-arrivée).",
          "Notifications email et in-app (I-20, orientation, logement).",
          "Suivi visuel de progression (ex. 75 % — Contrat de logement soumis).",
        ],
        tasksQuote: "« Fini les emails éparpillés — toutes vos tâches, suivies et synchronisées. »",
        docsTitle: "🔒 2. Téléversement sécurisé des documents",
        docsList: [
          "I-20, visa, assurance, vaccins avec chiffrement.",
          "Rappels automatiques en cas de soumissions incomplètes.",
          "Accès sécurisé réservé au personnel IIT autorisé.",
        ],
        docsQuote: "« Vos documents, protégés et organisés — prêts pour votre arrivée. »",
        lifeTitle: "🏙 3. Conseils de vie locale",
        lifeList: [
          "Banque : ouvrir un compte US et paiements numériques.",
          "Transport : CTA, navettes IIT, Metra et « L ».",
          "Courses : magasins étudiants et options halal/spéciales près de Mies.",
          "Emplois : jobs étudiants, onboarding RH, forums carrière.",
        ],
        lifeQuote: "« Des conseils pratiques pour vivre en confiance — sur et hors campus. »",
        connectTitle: "🤝 4. Se connecter à des mentors, conseillers et communautés",
        connectList: [
          "Trouvez des mentors et ambassadeurs culturels IIT.",
          "Planifiez des rendez-vous avec les conseillers et leaders d’orientation.",
          "Rejoignez des groupes internationaux et les événements IIT.",
        ],
        connectQuote: "« Du premier bonjour à des liens durables — démarrez avec les bonnes personnes. »",
      },
      howTitle: "🧩 Comment ça marche",
      howSubtitle: "Simple. Sécurisé. Centré sur l’étudiant.",
      howSteps: [
        ["Étape 1", "Connectez-vous avec vos identifiants IIT (SSO)."],
        ["Étape 2", "Consultez votre tableau de bord personnalisé."],
        ["Étape 3", "Effectuez les tâches : visa, logement, santé."],
        ["Étape 4", "Participez à l’orientation (en ligne ou sur place)."],
        ["Étape 5", "Arrivez à IIT sereinement — documents prêts, soutien en place."],
      ],
    },
    about: {
      title: "À propos",
      subtitle: "Notre mission : fluidifier l’intégration des étudiants internationaux à IIT.",
      body:
        "La plateforme offre un accompagnement de l’admission à l’arrivée : démarches d’immigration, logement, orientation et ressources essentielles — tout au même endroit.",
      cards: {
        visa: { title: "Conformité et Visa", body: "Guidage pas à pas (visa, SEVIS, documents) avec rappels adaptés à IIT." },
        housing: { title: "Logement et Arrivée", body: "Logement sur campus, appartements proches, séjours temporaires, contrôles d’arrivée." },
        orient: { title: "Orientation et Communauté", body: "Semaine d’orientation, associations, clubs culturels, connexion aux mentors." },
        resources: { title: "Ressources du Campus", body: "Aide étudiante, conseil académique, banque, téléphonie, santé, bien-être, tutorat." },
      },
    },
    contact: {
      title: "Contact",
      subtitle: "Des questions ou retours ? Écrivez-nous — nous sommes là pour vous.",
      name: "Nom",
      email: "Email",
      message: "Message",
      placeholderName: "Votre nom complet",
      placeholderEmail: "vous@hawk.iit.edu",
      placeholderMsg: "Expliquez-nous comment aider",
      send: "Envoyer",
    },
    login: {
      title: "Connexion à la plateforme IIT",
      helper: "Accédez à votre tableau de bord et poursuivez votre parcours à Illinois Tech.",
      email: "Email",
      password: "Mot de passe",
      placeholderEmail: "vous@hawk.illinoistech.edu",
      placeholderPw: "••••••••",
      submit: "Se connecter",
      policy:
        "En vous connectant, vous acceptez le code de conduite de l’étudiant et la politique d’utilisation de la plateforme.",
    },
    dash: {
      title: "Tableau de bord",
      welcome: "Bienvenue",
      checklist: "Liste de tâches",
      resources: "Ressources clés",
      announcements: "Annonces",
      pre: "Préparation avant l’arrivée",
      campus: "Navigation sur le campus",
      academic: "Intégration académique",
      social: "Réseautage social",
      directory: "Annuaire des ressources",
      items: {
        visa: "Visa et documents",
        housing: "Options de logement",
        culture: "Orientation culturelle",
        documents: "Présentation des documents",
        maps: "Cartes interactives du campus",
        buildings: "Informations sur les bâtiments",
        loc: "Services basés sur la localisation",
        reg: "Inscription aux cours",
        cal: "Intégration du calendrier",
        adv: "Contacter un conseiller",
        comm: "Communautés étudiantes",
        mentor: "Mentorat",
        events: "Participation aux événements",
        serv: "Services du campus",
        amen: "Commodités locales",
        emerg: "Contacts d’urgence",
      },
      dummy: {
        visa: "Exigences de visa et guidage pas à pas pour la soumission.",
        housing: "Logement sur/hors campus (disponibilité, prix, services).",
        culture: "Guides, vidéos et webinaires sur les coutumes locales.",
        documents: "Téléverser et stocker en toute sécurité les documents essentiels.",
        maps: "Cartes des bâtiments, amphithéâtres, bibliothèques, installations.",
        buildings: "Horaires, services et accessibilité par bâtiment.",
        loc: "Notifications d’événements ou services à proximité.",
        reg: "Instructions pour s’inscrire aux cours.",
        cal: "Synchroniser avec les échéances du semestre.",
        adv: "Contacter directement les conseillers académiques.",
        comm: "Se connecter aux pairs et groupes internationaux.",
        mentor: "Associer nouveaux étudiants et mentors.",
        events: "Découvrir des événements, clubs et ateliers.",
        serv: "Restauration, santé, conseil, loisirs, etc.",
        amen: "Transports, supermarchés, banques et services essentiels.",
        emerg: "Sécurité du campus, centres de santé, numéros d’urgence.",
      },
      due: "Échéance",
      coming: "Section en construction. Bientôt disponible.",
      nav: "Navigation",
    },
    footer: {
      follow: "Suivez-nous",
      campusLinks: "Liens du campus",
      webPolicies: "Web et Politiques",
      contactLabel: "Contact",
      contactUs: "Nous contacter",
      emergency: "Informations d’urgence",
      employment: "Emploi",
      alumni: "Anciens élèves",
      portal: "Portail Illinois Tech",
      privacy: "Confidentialité",
      copyright: "Droits d’auteur",
      ibhe: "Système de plainte IBHE",
      stuComplaint: "Infos plaintes étudiantes",
      nondisc: "Politique de non-discrimination",
      rights: "Tous droits réservés",
      university: "Illinois Institute of Technology",
    },
    ui: { language: "Langue" },
    notFound: { title: "Introuvable", body: "Page introuvable." },
  },
  es: {
    brand: { app: "Integración IIT", sub: "Estudiantes internacionales" },
    nav: {
      home: "Inicio", about: "Acerca de", contact: "Contacto",
      dashboard: "Panel", login: "Ingresar", logout: "Salir"
    },
    hero: {
      badge: "Bienvenido a IIT",
      title: "Plataforma de Integración para Estudiantes Internacionales",
      body: "Tu ruta guiada desde la admisión hasta la llegada: tareas, listas, cumplimiento, vivienda y vida en el campus.",
      ctaDash: "Ir al Panel",
      ctaLearn: "Más información",
    },
    home: {
      welcomeTitle: "Bienvenido a la Plataforma de Integración de Estudiantes Internacionales",
      welcomeSubtitle:
        "Diseñada con estudiantes internacionales, para estudiantes internacionales. Aquí encontrarás todo para una transición fluida a la vida en IIT — desde tu I-20 hasta tu primera clase y evento comunitario.",
      bannerNote:
        "Banner: estudiantes internacionales sonriendo en el Campus Mies de IIT. Abajo verás una vista previa dinámica:",
      ctas: {
        getStarted: "🔹 Comenzar",
        getStartedAria: "Comenzar — Inicia tu proceso de integración",
        progress: "🔹 Ver tu progreso",
        progressAria: "Ver tu progreso — Revisa tu lista de integración",
        explore: "🔹 Explorar recursos de IIT",
        exploreAria: "Explorar — Servicios estudiantiles clave",
      },
      progressTitle: "Progreso de integración",
      progressComplete: "75% completado",
      progressFootnote: "Contrato de vivienda enviado • I-20 cargado • Orientación programada",
      stepsTitle: "Tus pasos de integración",
      stepsLine:
        "Paso 1: Iniciar sesión • Paso 2: Ver panel • Paso 3: Completar visa/vivienda/salud • Paso 4: Asistir a orientación • Paso 5: Llegar con confianza",
      whyTitle: "💡 ¿Por qué esta plataforma?",
      whyTagline: "“Diseñada con estudiantes internacionales — para un inicio fluido en Illinois Tech.”",
      whyIntro1:
        "La integración puede ser abrumadora: trámites de visa, vivienda y adaptación cultural. Muchos estudiantes tienen dificultades con fechas y recursos.",
      whyIntro2:
        "Esta plataforma simplifica tu camino — pasos, recursos y contactos en un único hogar digital seguro.",
      cards: {
        tasksTitle: "🧭 1. Tareas centralizadas con recordatorios",
        tasksList: [
          "Gestiona todo tu proceso desde un solo panel.",
          "Lista personalizada según tu etapa (pre-llegada, llegada, post-llegada).",
          "Notificaciones por email y en la app (I-20, orientación, vivienda).",
          "Seguimiento visual del progreso (ej. 75% — Contrato de vivienda enviado).",
        ],
        tasksQuote: "“No más correos dispersos — todas tus tareas, controladas y sincronizadas.”",
        docsTitle: "🔒 2. Carga segura de documentos",
        docsList: [
          "Sube I-20, visa, seguro y vacunas con cifrado.",
          "Recordatorios automáticos si falta información.",
          "Acceso seguro solo para personal autorizado de IIT.",
        ],
        docsQuote: "“Tu documentación, protegida y organizada — lista para tu llegada.”",
        lifeTitle: "🏙 3. Consejos de vida local",
        lifeList: [
          "Banca: abre cuentas en EE. UU. y pagos digitales.",
          "Transporte: CTA, shuttles IIT, Metra y líneas del ‘L’.",
          "Compras: tiendas económicas y opciones halal/especiales cerca de Mies.",
          "Empleos: trabajo estudiantil, onboarding de RR. HH., ferias de empleo.",
        ],
        lifeQuote: "“Guía práctica para vivir con confianza — dentro y fuera del campus.”",
        connectTitle: "🤝 4. Conéctate con mentores, asesores y comunidades",
        connectList: [
          "Conecta con mentores y embajadores culturales de IIT.",
          "Agenda reuniones con asesores y líderes de orientación.",
          "Únete a grupos internacionales y próximos eventos.",
        ],
        connectQuote: "“Del primer saludo a conexiones duraderas — empieza con la gente adecuada.”",
      },
      howTitle: "🧩 Cómo funciona",
      howSubtitle: "Simple. Seguro. Centrado en el estudiante.",
      howSteps: [
        ["Paso 1", "Inicia sesión con tus credenciales IIT (SSO)."],
        ["Paso 2", "Consulta tu panel de integración personalizado."],
        ["Paso 3", "Completa tareas: visa, vivienda, salud."],
        ["Paso 4", "Asiste a orientación virtual o presencial."],
        ["Paso 5", "Llega a IIT con confianza — trámites listos, apoyo esperando."],
      ],
    },
    about: {
      title: "Acerca de",
      subtitle: "Nuestra misión es simplificar la integración de estudiantes internacionales en IIT.",
      body:
        "La plataforma ofrece una experiencia guiada desde la admisión hasta la llegada: trámites migratorios, vivienda, orientación y recursos esenciales — todo en un solo lugar.",
      cards: {
        visa: { title: "Cumplimiento y Visa", body: "Guía paso a paso (visa, SEVIS, documentos) con recordatorios según IIT." },
        housing: { title: "Vivienda y Llegada", body: "Vivienda en campus, apartamentos cercanos, estancias temporales y controles de llegada." },
        orient: { title: "Orientación y Comunidad", body: "Semana de orientación, asociaciones estudiantiles, clubes culturales y mentores." },
        resources: { title: "Recursos del Campus", body: "Apoyo estudiantil, asesoría académica, banca, telefonía, salud, bienestar y tutoría." },
      },
    },
    contact: {
      title: "Contacto",
      subtitle: "¿Preguntas o comentarios? Escríbenos — estamos para ayudarte.",
      name: "Nombre",
      email: "Correo",
      message: "Mensaje",
      placeholderName: "Tu nombre completo",
      placeholderEmail: "tú@hawk.iit.edu",
      placeholderMsg: "Cuéntanos cómo podemos ayudar",
      send: "Enviar",
    },
    login: {
      title: "Ingreso a la plataforma IIT",
      helper: "Accede a tu panel y continúa tu camino en Illinois Tech.",
      email: "Correo",
      password: "Contraseña",
      placeholderEmail: "tú@hawk.illinoistech.edu",
      placeholderPw: "••••••••",
      submit: "Ingresar",
      policy: "Al ingresar, aceptas el Código de Conducta Estudiantil y la política de uso.",
    },
    dash: {
      title: "Panel",
      welcome: "Bienvenido",
      checklist: "Lista de tareas",
      resources: "Recursos clave",
      announcements: "Anuncios",
      pre: "Preparación previa a la llegada",
      campus: "Navegación del campus",
      academic: "Integración académica",
      social: "Red social",
      directory: "Directorio de recursos",
      items: {
        visa: "Visa y documentación",
        housing: "Opciones de vivienda",
        culture: "Orientación cultural",
        documents: "Presentación de documentos",
        maps: "Mapas interactivos del campus",
        buildings: "Información de edificios",
        loc: "Servicios basados en ubicación",
        reg: "Guía de inscripción en cursos",
        cal: "Integración del calendario",
        adv: "Contacto con asesores",
        comm: "Comunidades estudiantiles",
        mentor: "Mentoría",
        events: "Participación en eventos",
        serv: "Servicios del campus",
        amen: "Servicios locales",
        emerg: "Contactos de emergencia",
      },
      dummy: {
        visa: "Requisitos de visa y guía paso a paso para enviar documentos.",
        housing: "Vivienda en/del campus (disponibilidad, precios y servicios).",
        culture: "Guías, videos y seminarios sobre costumbres locales.",
        documents: "Sube y almacena de forma segura documentos esenciales.",
        maps: "Mapas de edificios, aulas, bibliotecas e instalaciones.",
        buildings: "Horarios, servicios y accesibilidad por edificio.",
        loc: "Notificaciones de eventos o servicios cercanos.",
        reg: "Instrucciones para inscribirse en clases.",
        cal: "Sincroniza con fechas del semestre.",
        adv: "Contacta a asesores académicos desde la plataforma.",
        comm: "Conéctate con pares y grupos internacionales.",
        mentor: "Empareja estudiantes nuevos con mentores.",
        events: "Descubre eventos, clubes y talleres.",
        serv: "Comedores, salud, consejería, recreación y más.",
        amen: "Transporte, supermercados, bancos y servicios esenciales.",
        emerg: "Seguridad del campus, centros de salud y números de emergencia.",
      },
      due: "Entrega",
      coming: "Sección en construcción. Próximamente.",
      nav: "Navegación",
    },
    footer: {
      follow: "Síguenos",
      campusLinks: "Enlaces del campus",
      webPolicies: "Web y Políticas",
      contactLabel: "Contacto",
      contactUs: "Contáctanos",
      emergency: "Información de emergencias",
      employment: "Empleo",
      alumni: "Alumni",
      portal: "Portal Illinois Tech",
      privacy: "Privacidad",
      copyright: "Derechos de autor",
      ibhe: "Sistema de quejas IBHE",
      stuComplaint: "Información de quejas estudiantiles",
      nondisc: "Política de no discriminación",
      rights: "Todos los derechos reservados",
      university: "Illinois Institute of Technology",
    },
    ui: { language: "Idioma" },
    notFound: { title: "No encontrado", body: "Página no encontrada." },
  },
};

const I18nContext = createContext(null);
function useI18n() {
  return useContext(I18nContext);
}
function get(obj, path, fallback = "") {
  return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj) ?? fallback;
}
function I18nProvider({ children }) {
  const detect = () => {
    const n = (navigator.language || "en").slice(0, 2);
    return ["en", "fr", "es"].includes(n) ? n : "en";
  };
  const [lang, setLang] = useState(localStorage.getItem("lang") || detect());
  useEffect(() => localStorage.setItem("lang", lang), [lang]);
  const t = useMemo(() => (key) => get(messages[lang], key, key), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/* ===========================
   UI components
=========================== */

function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  return (
    <label className="hidden md:inline-flex items-center gap-2 text-sm">
      <span className="text-black/70">{t("ui.language")}:</span>
      <select
        className="px-2 py-1 rounded-lg border border-black/10 bg-white/70"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
      >
        <option value="en">EN</option>
        <option value="fr">FR</option>
        <option value="es">ES</option>
      </select>
    </label>
  );
}

function BrandMark() {
  const { t } = useI18n();
  return (
    <Link to="/" className="inline-flex items-center gap-2">
      <span className="inline-grid place-items-center w-8 h-8 rounded-full" style={{ background: brand.red }}>
        <GraduationCap className="w-5 h-5 text-white" />
      </span>
      <div className="leading-tight">
        <div className="font-bold tracking-tight" style={{ color: brand.black }}>
          {t("brand.app")}
        </div>
        <div className="text-xs text-black/60">{t("brand.sub")}</div>
      </div>
    </Link>
  );
}

function NavItem({ to, icon: Icon, labelKey }) {
  const { t } = useI18n();
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center gap-2 px-3 py-2 rounded-xl transition ${
          isActive ? "text-black bg-black/5" : "text-black/80 hover:text-black hover:bg-black/5"
        }`
      }
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{t(labelKey)}</span>
    </NavLink>
  );
}

function Header({ authed, onLogout }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-50">
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3 rounded-2xl ${glossy}`}
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.70) 100%)" }}
      >
        <div className="flex items-center justify-between py-3">
          <BrandMark />

          <nav className="hidden md:flex items-center gap-3">
            <NavItem to="/" icon={HomeIcon} labelKey="nav.home" />
            <NavItem to="/about" icon={Info} labelKey="nav.about" />
            <NavItem to="/contact" icon={Mail} labelKey="nav.contact" />
            <NavItem to="/dashboard" icon={LayoutDashboard} labelKey="nav.dashboard" />
            <LanguageSwitcher />
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {authed ? (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white shadow hover:opacity-95"
                style={{ background: brand.red }}
                aria-label={t("nav.logout")}
              >
                <LogOut className="w-4 h-4" /> {t("nav.logout")}
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white shadow hover:opacity-95"
                style={{ background: brand.red }}
                aria-label={t("nav.login")}
              >
                <LogIn className="w-4 h-4" /> {t("nav.login")}
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 rounded-xl hover:bg-black/5" onClick={() => setOpen((v) => !v)} aria-label="Toggle Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 border-t border-black/10 mt-2">
            <div className="flex flex-col gap-1 pt-3">
              <NavItem to="/" icon={HomeIcon} labelKey="nav.home" />
              <NavItem to="/about" icon={Info} labelKey="nav.about" />
              <NavItem to="/contact" icon={Mail} labelKey="nav.contact" />
              <NavItem to="/dashboard" icon={LayoutDashboard} labelKey="nav.dashboard" />
              <div className="pt-3 flex items-center justify-between">
                <div />
                <LanguageSwitcher />
              </div>
              <div className="pt-2">
                {authed ? (
                  <button
                    onClick={onLogout}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-white shadow hover:opacity-95"
                    style={{ background: brand.red }}
                  >
                    <LogOut className="w-4 h-4" /> {t("nav.logout")}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-white shadow hover:opacity-95"
                    style={{ background: brand.red }}
                  >
                    <LogIn className="w-4 h-4" /> {t("nav.login")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Page({ title, subtitle, children }) {
  const { t } = useI18n();
  return (
    <motion.section variants={container} initial="hidden" animate="show" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className={`rounded-3xl p-6 md:p-10 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.70) 100%)" }}>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">{typeof title === "string" ? t(title) : title}</h1>
        {subtitle && <p className="mt-2 text-black/70 max-w-2xl">{typeof subtitle === "string" ? t(subtitle) : subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </motion.section>
  );
}

function Hero() {
  const { t } = useI18n();
  const images = ["Students1.jpg", "/Housing.jpg"];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => { if (paused) return; const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 3000); return () => clearInterval(id); }, [paused, images.length]);

  return (
    <section className="relative overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="absolute inset-0 -z-10">
        {images.map((src, i) => (
          <div key={i} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${i === index ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `url(${src})` }} />
        ))}
        <div className="absolute inset-0 bg-white/9" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div className={`rounded-3xl p-8 md:p-5 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 10%)" }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border border-black/10" style={{ background: brand.gray }}>
              <span className="w-2 h-2 rounded-full" style={{ background: brand.red }} />
              <span className="ml-1">{t("hero.badge")}</span>
            </span>

            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-black text-left" style={{ maxWidth: "640px" }}>
              {t("hero.title")}
            </h1>

            <p className="mt-3 text-lg text-black/70 max-w-xl text-left">{t("hero.body")}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/dashboard" className="px-5 py-3 rounded-xl font-semibold text-white shadow hover:opacity-95" style={{ background: brand.red }}>
                {t("hero.ctaDash")}
              </Link>
              <Link to="/about" className="px-5 py-3 rounded-xl font-semibold border border-black/10 hover:bg-black/5">
                {t("hero.ctaLearn")}
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="hidden md:block" aria-hidden />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
        <div className="flex gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`h-2.5 rounded-full transition-all ${i === index ? "w-6" : "w-2.5"}`} style={{ background: i === index ? brand.red : "#d1d5db" }} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================
   HOME (expanded, localized)
=========================== */
function Home() {
  const { t } = useI18n();
  return (
    <>
      <Hero />

      <Page title={t("home.welcomeTitle")} subtitle={t("home.welcomeSubtitle")}>
        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-3 rounded-xl font-semibold text-white shadow hover:opacity-95"
            style={{ background: brand.red }}
            aria-label={t("home.ctas.getStartedAria")}
          >
            {t("home.ctas.getStarted")}
          </Link>
        <Link
            to="/dashboard"
            className="px-5 py-3 rounded-xl font-semibold border border-black/10 hover:bg-black/5"
            aria-label={t("home.ctas.progressAria")}
          >
            {t("home.ctas.progress")}
          </Link>
          <Link
            to="/about"
            className="px-5 py-3 rounded-xl font-semibold border border-black/10 hover:bg-black/5"
            aria-label={t("home.ctas.exploreAria")}
          >
            {t("home.ctas.explore")}
          </Link>
        </div>

        <p className="mt-4 text-sm text-black/60">{t("home.bannerNote")}</p>

        {/* Progress + Stepper */}
        <div className="mt-5 grid lg:grid-cols-3 gap-6">
          {/* Progress Card */}
          <div className={`rounded-2xl p-5 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)" }}>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-black">{t("home.progressTitle")}</h4>
              <span className="text-sm text-black/70">{t("home.progressComplete")}</span>
            </div>
            <div className="mt-3 h-3 w-full rounded-full bg-black/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: brand.red }}
                initial={{ width: "0%" }}
                animate={{ width: "75%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="mt-2 text-xs text-black/60">{t("home.progressFootnote")}</p>
          </div>

          {/* Stepper */}
          <div className={`rounded-2xl p-5 ${glossy} lg:col-span-2`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)" }}>
            <h4 className="font-bold text-black">{t("home.stepsTitle")}</h4>
            <div className="mt-4 grid sm:grid-cols-5 gap-3">
              {["1","2","3","4","5"].map((num, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full grid place-items-center text-white font-bold" style={{ background: i < 3 ? brand.red : "#d1d5db" }}>
                    {num}
                  </div>
                  <span className="text-xs text-black/70 text-center">Step {num}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-black/70">{t("home.stepsLine")}</p>
          </div>
        </div>
      </Page>

      {/* Why This Platform */}
      <Page title={t("home.whyTitle")} subtitle={t("home.whyTagline")}>
        <p className="text-black/80">
          {t("home.whyIntro1")}
          <br /><br />
          {t("home.whyIntro2")}
        </p>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {/* 1 */}
          <div className={`rounded-2xl p-5 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)" }}>
            <h4 className="font-bold text-black">{t("home.cards.tasksTitle")}</h4>
            <ul className="mt-2 text-sm text-black/75 list-disc pl-5 space-y-1">
              {t("home.cards.tasksList").map((line, i) => <li key={i}>{line}</li>)}
            </ul>
            <p className="mt-2 text-sm italic text-black/60">{t("home.cards.tasksQuote")}</p>
          </div>
          {/* 2 */}
          <div className={`rounded-2xl p-5 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)" }}>
            <h4 className="font-bold text-black">{t("home.cards.docsTitle")}</h4>
            <ul className="mt-2 text-sm text-black/75 list-disc pl-5 space-y-1">
              {t("home.cards.docsList").map((line, i) => <li key={i}>{line}</li>)}
            </ul>
            <p className="mt-2 text-sm italic text-black/60">{t("home.cards.docsQuote")}</p>
          </div>
          {/* 3 */}
          <div className={`rounded-2xl p-5 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)" }}>
            <h4 className="font-bold text-black">{t("home.cards.lifeTitle")}</h4>
            <ul className="mt-2 text-sm text-black/75 list-disc pl-5 space-y-1">
              {t("home.cards.lifeList").map((line, i) => <li key={i}>{line}</li>)}
            </ul>
            <p className="mt-2 text-sm italic text-black/60">{t("home.cards.lifeQuote")}</p>
          </div>
          {/* 4 */}
          <div className={`rounded-2xl p-5 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)" }}>
            <h4 className="font-bold text-black">{t("home.cards.connectTitle")}</h4>
            <ul className="mt-2 text-sm text-black/75 list-disc pl-5 space-y-1">
              {t("home.cards.connectList").map((line, i) => <li key={i}>{line}</li>)}
            </ul>
            <p className="mt-2 text-sm italic text-black/60">{t("home.cards.connectQuote")}</p>
          </div>
        </div>
      </Page>

      {/* How It Works */}
      <Page title={t("home.howTitle")} subtitle={t("home.howSubtitle")}>
        <ol className="grid md:grid-cols-5 gap-4 text-sm">
          {t("home.howSteps").map(([title, body], i) => (
            <li key={i} className={`rounded-2xl p-4 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)" }}>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full grid place-items-center text-white text-xs font-bold" style={{ background: brand.red }}>{i + 1}</span>
                <h5 className="font-semibold text-black">{title}</h5>
              </div>
              <p className="mt-2 text-black/70">{body}</p>
            </li>
          ))}
        </ol>
      </Page>
    </>
  );
}

/* ===========================
   ABOUT (2 columns)
=========================== */
function About() {
  const { t } = useI18n();
  return (
    <Page title="about.title" subtitle="about.subtitle">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className={`relative rounded-3xl overflow-hidden ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.70) 100%)" }}>
          <img src="/About.jpg" alt="International students on IIT campus" className="w-full h-[320px] md:h-[480px] object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10" />
        </motion.div>

        <div>
          <p className="text-black/80">{t("about.body")}</p>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {[
              ["about.cards.visa.title", "about.cards.visa.body"],
              ["about.cards.housing.title", "about.cards.housing.body"],
              ["about.cards.orient.title", "about.cards.orient.body"],
              ["about.cards.resources.title", "about.cards.resources.body"],
            ].map(([titleKey, bodyKey]) => (
              <div key={titleKey} className={`rounded-2xl p-5 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)" }}>
                <h4 className="font-bold text-black">{t(titleKey)}</h4>
                <p className="mt-2 text-sm text-black/70">{t(bodyKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ===========================
   CONTACT (2 columns)
=========================== */
function Contact() {
  const { t } = useI18n?.() ?? { t: (s) => s };
  return (
    <Page title="contact.title" subtitle="contact.subtitle">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* LEFT: Offices (≈40%) */}
        <div className="md:col-span-2 rounded-3xl p-6 text-white" style={{ background: "linear-gradient(135deg, #cc0000 0%, #990000 55%, #4a0000 100%)" }}>
          <h3 className="text-xl font-extrabold mb-4">Key Offices</h3>

          {/* Registrar */}
          <div className="rounded-2xl p-4 bg-white/10 ring-1 ring-white/15 mb-4">
            <h4 className="font-bold">Registrar (One Stop)</h4>
            <p className="text-sm text-white/90 mt-1">
              10 W 35th St, Chicago, IL 60616<br />
              Mon–Fri, 9:00 AM – 5:00 PM
            </p>
            <div className="mt-2 space-x-3 text-sm">
              <a href="https://www.iit.edu/registrar" className="underline hover:opacity-90" target="_blank" rel="noreferrer">Website</a>
              <a href="mailto:registrar@iit.edu" className="underline hover:opacity-90">registrar@iit.edu</a>
            </div>
          </div>

          {/* Office of Global Services */}
          <div className="rounded-2xl p-4 bg-white/10 ring-1 ring-white/15 mb-4">
            <h4 className="font-bold">Office of Global Services (OGS)</h4>
            <p className="text-sm text-white/90 mt-1">
              10 W 35th St, Chicago, IL 60616<br />
              Visa &amp; immigration support
            </p>
            <div className="mt-2 space-x-3 text-sm">
              <a href="https://www.iit.edu/ogs" className="underline hover:opacity-90" target="_blank" rel="noreferrer">Website</a>
              <a href="mailto:ogs@iit.edu" className="underline hover:opacity-90">ogs@iit.edu</a>
            </div>
          </div>

          {/* Graduate Admissions */}
          <div className="rounded-2xl p-4 bg-white/10 ring-1 ring-white/15 mb-4">
            <h4 className="font-bold">Graduate Admissions</h4>
            <p className="text-sm text-white/90 mt-1">
              10 W 35th St, Chicago, IL 60616<br />
              Application &amp; enrollment
            </p>
            <div className="mt-2 space-x-3 text-sm">
              <a href="https://www.iit.edu/admissions-aid/graduate-admission" className="underline hover:opacity-90" target="_blank" rel="noreferrer">Website</a>
              <a href="mailto:grad.admission@iit.edu" className="underline hover:opacity-90">grad.admission@iit.edu</a>
            </div>
          </div>

          {/* IT Support */}
          <div className="rounded-2xl p-4 bg-white/10 ring-1 ring-white/15">
            <h4 className="font-bold">IT Support (OTS)</h4>
            <p className="text-sm text-white/90 mt-1">
              TechCommons, Galvin Library<br />
              Help with portal, Wi-Fi, accounts
            </p>
            <div className="mt-2 space-x-3 text-sm">
              <a href="https://ots.iit.edu/" className="underline hover:opacity-90" target="_blank" rel="noreferrer">Website</a>
              <a href="mailto:supportdesk@iit.edu" className="underline hover:opacity-90">supportdesk@iit.edu</a>
            </div>
          </div>
        </div>

        {/* RIGHT: Form (≈60%) */}
        <div className="md:col-span-3">
          <form className="grid gap-4">
            <div>
              <label className="text-sm font-semibold text-black" htmlFor="name">
                {t("contact.name")}
              </label>
              <input
                id="name"
                type="text"
                className="mt-1 w-full rounded-xl px-4 py-3 border border-black/10 focus:outline-none focus:ring-2"
                style={{ outlineColor: brand.red }}
                placeholder={t("contact.placeholderName")}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-black" htmlFor="email">
                {t("contact.email")}
              </label>
              <input
                id="email"
                type="email"
                className="mt-1 w-full rounded-xl px-4 py-3 border border-black/10 focus:outline-none focus:ring-2"
                style={{ outlineColor: brand.red }}
                placeholder={t("contact.placeholderEmail")}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-black" htmlFor="msg">
                {t("contact.message")}
              </label>
              <textarea
                id="msg"
                rows={6}
                className="mt-1 w-full rounded-xl px-4 py-3 border border-black/10 focus:outline-none focus:ring-2"
                style={{ outlineColor: brand.red }}
                placeholder={t("contact.placeholderMsg")}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white shadow hover:opacity-95 w-max"
              style={{ background: brand.red }}
            >
              {t("contact.send")}
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

/* ===========================
   LOGIN
=========================== */
function Login({ onLogin }) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const submit = (e) => { e.preventDefault(); onLogin({ email }); navigate("/dashboard"); };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 relative"
      style={{ backgroundImage: "url('../src/img/Login.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-black/30" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className={`relative z-10 max-w-md w-full rounded-3xl p-8 md:p-10 ${glossy}`}
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.85) 100%)", boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 justify-center mb-3">
            <GraduationCap className="w-8 h-8 text-[#cc0000]" />
            <h1 className="text-2xl font-extrabold text-black">{t("login.title")}</h1>
          </div>
          <p className="text-black/70 text-sm">{t("login.helper")}</p>
        </div>

        <form onSubmit={submit} className="grid gap-5">
          <div>
            <label className="text-sm font-semibold text-black" htmlFor="lemail">{t("login.email")}</label>
            <input id="lemail" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl px-4 py-3 border border-black/10 focus:outline-none focus:ring-2"
              style={{ outlineColor: brand.red }} placeholder={t("login.placeholderEmail")} required />
          </div>
          <div>
            <label className="text-sm font-semibold text-black" htmlFor="lpw">{t("login.password")}</label>
            <input id="lpw" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl px-4 py-3 border border-black/10 focus:outline-none focus:ring-2"
              style={{ outlineColor: brand.red }} placeholder={t("login.placeholderPw")} required />
          </div>
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white shadow hover:opacity-95 w-full" style={{ background: brand.red }}>
            <LogIn className="w-4 h-4" /> {t("login.submit")}
          </button>
          <p className="text-sm text-black/60 text-center mt-2">{t("login.policy")}</p>
        </form>
      </motion.div>
    </section>
  );
}

/* ===========================
   Dashboard with Sidebar
=========================== */
function DummyPage({ title, desc }) {
  return (
    <div className={`rounded-2xl p-6 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)" }}>
      <h3 className="text-xl font-bold text-black">{title}</h3>
      <p className="mt-2 text-black/70">{desc}</p>
    </div>
  );
}

function DashboardHome({ user }) {
  const { t } = useI18n();
  const tasks = [
    { name: "Upload Passport & I-20", due: "Nov 10", status: "In Progress" },
    { name: "SEVIS Fee Payment", due: "Nov 12", status: "Not Started" },
    { name: "Housing Confirmation", due: "Nov 18", status: "Complete" },
    { name: "Immunization Records", due: "Nov 22", status: "Not Started" },
  ];
  return (
    <Page title="dash.title" subtitle={`${t("dash.welcome")}${user?.email ? `, ${user.email}` : ""}.`}>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className={`rounded-2xl p-6 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.70) 100%)" }}>
          <h3 className="font-bold text-black">{t("dash.checklist")}</h3>
          <ul className="mt-4 space-y-3">
            {tasks.map((tItem, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: tItem.status === "Complete" ? brand.accent : brand.red }} />
                  <span className="text-sm text-black/80">{tItem.name}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-lg border border-black/10 text-black/60">{t("dash.due")} {tItem.due}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`rounded-2xl p-6 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.70) 100%)" }}>
          <h3 className="font-bold text-black">{t("dash.resources")}</h3>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {["items.visa", "items.housing", "items.culture", "items.documents"].map((k, i) => (
              <a key={i} href="#" className="rounded-xl border border-black/10 px-4 py-3 text-sm hover:bg-black/5">
                {t(`dash.${k}`)}
              </a>
            ))}
          </div>
        </div>
        <div className={`rounded-2xl p-6 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.70) 100%)" }}>
          <h3 className="font-bold text-black">{t("dash.announcements")}</h3>
          <ul className="mt-4 space-y-3 text-sm text-black/75">
            <li>📣 Welcome Week schedule released. Check your email.</li>
            <li>🧭 Airport pickup sign-ups close on Nov 5.</li>
            <li>💳 Bank account setup help desk in MTCC, Nov 12–14.</li>
          </ul>
        </div>
      </div>
    </Page>
  );
}

function SidebarLink({ to, children }) {
  return (
    <NavLink to={to} className={({ isActive }) => `block px-3 py-2 rounded-lg text-sm ${isActive ? "bg-black/5 text-black font-semibold" : "text-black/80 hover:bg-black/5"}`}>
      {children}
    </NavLink>
  );
}

function SidebarSection({ title, items, base }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4">
      <button onClick={() => setOpen((v) => !v)} className="w-full text-left px-2 py-2 font-semibold text-black flex items-center justify-between">
        <span>{title}</span>
        <span className="text-black/50">{open ? "–" : "+"}</span>
      </button>
      {open && (
        <div className="mt-1 pl-1 space-y-1">
          {items.map(([label, slug]) => (
            <SidebarLink key={slug} to={`/dashboard/${base}/${slug}`}>{label}</SidebarLink>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardLayout({ user }) {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className={`lg:col-span-3 rounded-2xl p-4 ${glossy}`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)" }}>
          <h2 className="text-lg font-extrabold mb-3" style={{ color: brand.black }}>{t("dash.nav")}</h2>

          <SidebarSection
            title={t("dash.pre")}
            base="pre-arrival"
            items={[
              [t("dash.items.visa"), "visa"],
              [t("dash.items.housing"), "housing"],
              [t("dash.items.culture"), "culture"],
              [t("dash.items.documents"), "documents"],
            ]}
          />
          <SidebarSection
            title={t("dash.campus")}
            base="campus"
            items={[
              [t("dash.items.maps"), "maps"],
              [t("dash.items.buildings"), "buildings"],
              [t("dash.items.loc"), "location-services"],
            ]}
          />
          <SidebarSection
            title={t("dash.academic")}
            base="academic"
            items={[
              [t("dash.items.reg"), "registration"],
              [t("dash.items.cal"), "calendar"],
              [t("dash.items.adv"), "advisors"],
            ]}
          />
          <SidebarSection
            title={t("dash.social")}
            base="social"
            items={[
              [t("dash.items.comm"), "communities"],
              [t("dash.items.mentor"), "mentors"],
              [t("dash.items.events"), "events"],
            ]}
          />
          <SidebarSection
            title={t("dash.directory")}
            base="resources"
            items={[
              [t("dash.items.serv"), "services"],
              [t("dash.items.amen"), "amenities"],
              [t("dash.items.emerg"), "emergency"],
            ]}
          />
        </aside>

        <main className="lg:col-span-9">
          <Routes>
            <Route index element={<DashboardHome user={user} />} />
            {/* Pre-Arrival */}
            <Route path="pre-arrival/visa" element={<DummyPage title={t("dash.items.visa")} desc={t("dash.dummy.visa")} />} />
            <Route path="pre-arrival/housing" element={<DummyPage title={t("dash.items.housing")} desc={t("dash.dummy.housing")} />} />
            <Route path="pre-arrival/culture" element={<DummyPage title={t("dash.items.culture")} desc={t("dash.dummy.culture")} />} />
            <Route path="pre-arrival/documents" element={<DummyPage title={t("dash.items.documents")} desc={t("dash.dummy.documents")} />} />
            {/* Campus */}
            <Route path="campus/maps" element={<DummyPage title={t("dash.items.maps")} desc={t("dash.dummy.maps")} />} />
            <Route path="campus/buildings" element={<DummyPage title={t("dash.items.buildings")} desc={t("dash.dummy.buildings")} />} />
            <Route path="campus/location-services" element={<DummyPage title={t("dash.items.loc")} desc={t("dash.dummy.loc")} />} />
            {/* Academic */}
            <Route path="academic/registration" element={<DummyPage title={t("dash.items.reg")} desc={t("dash.dummy.reg")} />} />
            <Route path="academic/calendar" element={<DummyPage title={t("dash.items.cal")} desc={t("dash.dummy.cal")} />} />
            <Route path="academic/advisors" element={<DummyPage title={t("dash.items.adv")} desc={t("dash.dummy.adv")} />} />
            {/* Social */}
            <Route path="social/communities" element={<DummyPage title={t("dash.items.comm")} desc={t("dash.dummy.comm")} />} />
            <Route path="social/mentors" element={<DummyPage title={t("dash.items.mentor")} desc={t("dash.dummy.mentor")} />} />
            <Route path="social/events" element={<DummyPage title={t("dash.items.events")} desc={t("dash.dummy.events")} />} />
            {/* Directory */}
            <Route path="resources/services" element={<DummyPage title={t("dash.items.serv")} desc={t("dash.dummy.serv")} />} />
            <Route path="resources/amenities" element={<DummyPage title={t("dash.items.amen")} desc={t("dash.dummy.amen")} />} />
            <Route path="resources/emergency" element={<DummyPage title={t("dash.items.emerg")} desc={t("dash.dummy.emerg")} />} />
            <Route path="*" element={<DummyPage title={t("dash.title")} desc={t("dash.coming")} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/* ===========================
   Footer
=========================== */
function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-10 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`rounded-2xl p-8 md:p-10 ${glossy}`} style={{ background: "linear-gradient(135deg, #cc0000 0%, #990000 60%, #111111 120%)", color: "white" }}>
          <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-white/10 pb-8">
            <div className="max-w-sm">
              <div className="flex items-center gap-2 mb-3">
                <h2><strong>{t("footer.university")}</strong></h2>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">
                <strong>{t("footer.contactLabel")}</strong>
                <br />
                10 West 35th Street
                <br />
                Chicago, IL 60616
                <br />
                <span className="block mt-2 font-medium text-white/90">312.567.3000</span>
                <a href="https://www.iit.edu/contact" className="hover:underline font-medium" target="_blank" rel="noreferrer">
                  {t("footer.contactUs")}
                </a>
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-bold text-white mb-3">{t("footer.follow")}</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { name: "Facebook", href: "https://www.facebook.com/illinoistech", Icon: Facebook },
                  { name: "Instagram", href: "https://www.instagram.com/illinoistech/", Icon: Instagram },
                  { name: "LinkedIn", href: "https://www.linkedin.com/school/illinois-institute-of-technology/", Icon: Linkedin },
                  { name: "Twitter", href: "https://twitter.com/illinoistech", Icon: Twitter },
                  { name: "YouTube", href: "https://www.youtube.com/user/illinoistech", Icon: Youtube },
                ].map(({ name, href, Icon }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={name}
                      className="group inline-flex items-center gap-2 text-white/85 hover:text-white transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 ring-1 ring-white/15 group-hover:bg-white/15">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="underline-offset-2 group-hover:underline">{name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">{t("footer.campusLinks")}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.iit.edu/emergency" target="_blank" rel="noreferrer" className="hover:underline text-white/80">{t("footer.emergency")}</a></li>
                <li><a href="https://www.iit.edu/employment" target="_blank" rel="noreferrer" className="hover:underline text-white/80">{t("footer.employment")}</a></li>
                <li><a href="https://alumni.iit.edu/" target="_blank" rel="noreferrer" className="hover:underline text-white/80">{t("footer.alumni")}</a></li>
                <li><a href="https://my.iit.edu/" target="_blank" rel="noreferrer" className="hover:underline text-white/80">{t("footer.portal")}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">{t("footer.webPolicies")}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.iit.edu/privacy" target="_blank" rel="noreferrer" className="hover:underline text-white/80">{t("footer.privacy")}</a></li>
                <li><a href="https://www.iit.edu/copyright" target="_blank" rel="noreferrer" className="hover:underline text-white/80">{t("footer.copyright")}</a></li>
                <li><a href="https://complaints.ibhe.org/" target="_blank" rel="noreferrer" className="hover:underline text-white/80">{t("footer.ibhe")}</a></li>
                <li><a href="https://www.iit.edu/student-affairs/handbook/policies-and-procedures/student-complaint-information" target="_blank" rel="noreferrer" className="hover:underline text-white/80">{t("footer.stuComplaint")}</a></li>
                <li><a href="https://www.iit.edu/non-discrimination-policy" target="_blank" rel="noreferrer" className="hover:underline text-white/80">{t("footer.nondisc")}</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
            <BrandMark />
            <p className="text-xs text-white/70 text-center md:text-right">
              © {new Date().getFullYear()} {t("footer.university")} • {t("footer.rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ===========================
   App Root
=========================== */
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState(null);
  const handleLogin = (u) => { setAuthed(true); setUser(u); };
  const handleLogout = () => { setAuthed(false); setUser(null); };

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(1200px 600px at 10% -10%, ${brand.red}10%, transparent 40%), radial-gradient(1000px 500px at 110% 10%, ${brand.redDark}10%, transparent 35%), linear-gradient(180deg, #fff 0%, #f9f9f9 100%)` }}>
      <I18nProvider>
        <Router>
          <Header authed={authed} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/dashboard/*" element={<DashboardLayout user={user} />} />
            <Route
              path="*"
              element={
                <Page title="notFound.title">
                  <p className="text-black/70">{messages.en.notFound.body /* fallback text key is used via t in title */}</p>
                </Page>
              }
            />
          </Routes>
          <Footer />
        </Router>
      </I18nProvider>
    </div>
  );
}
