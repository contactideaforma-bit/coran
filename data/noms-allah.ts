/* Les 99 noms d'Allah (al-Asmâ' al-Husnâ), dans l'ordre de la liste rapportée
   par At-Tirmidhi. Le hadith de base est authentique : « Allah a quatre-vingt-dix-
   neuf noms, cent moins un : quiconque les dénombre entre au Paradis »
   (Al-Bukhari & Muslim) ; l'énumération elle-même vient d'At-Tirmidhi.
   Chaque nom est accompagné d'un verset : soit le nom y figure (« contient »),
   soit le verset en exprime le sens quand le nom n'apparaît pas tel quel
   dans le Coran (« lien »). */

export interface NomAllah {
  n: number;
  arabe: string;
  translit: string;
  nomFr: string;
  sens: string;
  note?: string;
  verset: { s: number; v: number; contient: boolean };
}

type Ligne = [string, string, string, string, string, "c" | "l", string?];

const L: Ligne[] = [
  ["الرَّحْمَنُ", "Ar-Raḥmân", "Le Tout Miséricordieux", "Sa miséricorde embrasse toute la création, croyants et non-croyants, en ce monde.", "1:3", "c"],
  ["الرَّحِيمُ", "Ar-Raḥîm", "Le Très Miséricordieux", "Il réserve une miséricorde particulière aux croyants, ici-bas et dans l'au-delà.", "2:163", "c"],
  ["الْمَلِكُ", "Al-Malik", "Le Roi", "Le Souverain absolu : tout Lui appartient et Il en dispose comme Il veut.", "20:114", "c"],
  ["الْقُدُّوسُ", "Al-Quddûs", "Le Très Saint", "Il est pur et exempt de toute imperfection, de tout défaut et de toute ressemblance avec Ses créatures.", "62:1", "c"],
  ["السَّلَامُ", "As-Salâm", "La Paix", "Il est exempt de tout défaut, et c'est de Lui que vient toute paix.", "59:23", "c"],
  ["الْمُؤْمِنُ", "Al-Mu'min", "Celui qui rassure", "Il accorde la sécurité à Ses serviteurs et confirme la véracité de Ses messagers.", "59:23", "c"],
  ["الْمُهَيْمِنُ", "Al-Muhaymin", "Le Préservateur", "Il veille sur toute chose, en est témoin et la préserve.", "59:23", "c"],
  ["الْعَزِيزُ", "Al-'Azîz", "Le Tout-Puissant", "L'Invincible, que rien ne peut vaincre ni atteindre.", "2:129", "c"],
  ["الْجَبَّارُ", "Al-Jabbâr", "Le Contraignant", "Sa volonté s'impose à tout, et Il répare les cœurs brisés.", "59:23", "c"],
  ["الْمُتَكَبِّرُ", "Al-Mutakabbir", "Le Suprême", "À Lui seul reviennent la grandeur et la majesté.", "59:23", "c"],
  ["الْخَالِقُ", "Al-Khâliq", "Le Créateur", "Il a décrété et créé toute chose selon une mesure parfaite.", "59:24", "c"],
  ["الْبَارِئُ", "Al-Bâri'", "Le Producteur", "Il fait exister les créatures à partir du néant.", "59:24", "c"],
  ["الْمُصَوِّرُ", "Al-Muṣawwir", "Le Formateur", "Il donne à chaque créature sa forme et son apparence propres.", "59:24", "c"],
  ["الْغَفَّارُ", "Al-Ghaffâr", "Le Grand Pardonneur", "Il pardonne encore et encore, autant de fois que le serviteur revient à Lui.", "39:5", "c"],
  ["الْقَهَّارُ", "Al-Qahhâr", "Le Dominateur", "Toute la création Lui est soumise et rien ne Lui résiste.", "12:39", "c"],
  ["الْوَهَّابُ", "Al-Wahhâb", "Le Donateur", "Il donne sans compter et sans rien attendre en retour.", "3:8", "c"],
  ["الرَّزَّاقُ", "Ar-Razzâq", "Le Pourvoyeur", "Il assure la subsistance de toutes les créatures, du corps comme du cœur.", "51:58", "c"],
  ["الْفَتَّاحُ", "Al-Fattâḥ", "Celui qui ouvre", "Il ouvre les portes de la miséricorde et de la subsistance, et tranche entre les gens avec vérité.", "34:26", "c"],
  ["الْعَلِيمُ", "Al-'Alîm", "L'Omniscient", "Sa science englobe tout : le passé, le présent, l'avenir, l'apparent et le caché.", "2:32", "c"],
  ["الْقَابِضُ", "Al-Qâbiḍ", "Celui qui restreint", "Il restreint la subsistance et les âmes selon Sa sagesse.", "2:245", "l", "Se mentionne avec Al-Bâsiṭ (Celui qui étend)."],
  ["الْبَاسِطُ", "Al-Bâsiṭ", "Celui qui étend", "Il étend largement Ses dons et Sa subsistance à qui Il veut.", "13:26", "l"],
  ["الْخَافِضُ", "Al-Khâfiḍ", "Celui qui abaisse", "Il abaisse les orgueilleux et les injustes.", "56:3", "l", "Se mentionne avec Ar-Râfi' (Celui qui élève)."],
  ["الرَّافِعُ", "Ar-Râfi'", "Celui qui élève", "Il élève en rang les croyants et ceux qui ont reçu la science.", "3:55", "l"],
  ["الْمُعِزُّ", "Al-Mu'izz", "Celui qui honore", "Il donne l'honneur et la puissance à qui Il veut.", "3:26", "l"],
  ["الْمُذِلُّ", "Al-Mudhill", "Celui qui humilie", "Il humilie qui Il veut, par Sa justice.", "3:26", "l", "Se mentionne avec Al-Mu'izz (Celui qui honore)."],
  ["السَّمِيعُ", "As-Samî'", "L'Audient", "Il entend toute chose, les paroles comme les murmures du cœur.", "42:11", "c"],
  ["الْبَصِيرُ", "Al-Baṣîr", "Le Clairvoyant", "Il voit toute chose, même la fourmi noire sur le rocher noir dans la nuit noire.", "17:1", "c"],
  ["الْحَكَمُ", "Al-Ḥakam", "Le Juge", "C'est Lui qui juge entre Ses créatures, ici-bas et au Jour dernier.", "6:114", "c"],
  ["الْعَدْلُ", "Al-'Adl", "Le Juste", "Il ne commet aucune injustice, pas même du poids d'un atome.", "16:90", "l"],
  ["اللَّطِيفُ", "Al-Laṭîf", "Le Subtil", "Il connaît le plus infime détail et fait parvenir Ses bienfaits avec douceur.", "6:103", "c"],
  ["الْخَبِيرُ", "Al-Khabîr", "Le Parfaitement Informé", "Il connaît le fond et la réalité de toute chose.", "6:18", "c"],
  ["الْحَلِيمُ", "Al-Ḥalîm", "Le Longanime", "Il ne se hâte pas de punir et laisse à Ses serviteurs le temps de revenir.", "2:225", "c"],
  ["الْعَظِيمُ", "Al-'Aẓîm", "L'Immense", "Sa grandeur dépasse tout ce que l'on peut concevoir.", "2:255", "c"],
  ["الْغَفُورُ", "Al-Ghafûr", "Le Pardonneur", "Il couvre les fautes et efface les péchés de celui qui se repent.", "39:53", "c"],
  ["الشَّكُورُ", "Ash-Shakûr", "Le Reconnaissant", "Il récompense le peu de bien par une récompense immense.", "35:34", "c"],
  ["الْعَلِيُّ", "Al-'Aliyy", "Le Très-Haut", "Il est au-dessus de toute Sa création, par Son essence, Sa valeur et Sa domination.", "2:255", "c"],
  ["الْكَبِيرُ", "Al-Kabîr", "Le Grand", "Tout est petit devant Sa grandeur.", "22:62", "c"],
  ["الْحَفِيظُ", "Al-Ḥafîẓ", "Le Gardien", "Il préserve Ses créatures et consigne toutes leurs œuvres.", "11:57", "c"],
  ["الْمُقِيتُ", "Al-Muqît", "Celui qui nourrit", "Il donne à chaque créature sa nourriture et veille sur elle.", "4:85", "c"],
  ["الْحَسِيبُ", "Al-Ḥasîb", "Celui qui suffit", "Il suffit à qui s'en remet à Lui, et Il demandera compte de tout.", "4:6", "c"],
  ["الْجَلِيلُ", "Al-Jalîl", "Le Majestueux", "Il possède toutes les qualités de majesté et de grandeur.", "55:27", "l"],
  ["الْكَرِيمُ", "Al-Karîm", "Le Généreux", "Sa générosité est sans limite : Il donne sans qu'on Le lui demande.", "82:6", "c"],
  ["الرَّقِيبُ", "Ar-Raqîb", "L'Observateur", "Rien de ce que nous faisons ne Lui échappe.", "4:1", "c"],
  ["الْمُجِيبُ", "Al-Mujîb", "Celui qui exauce", "Il répond à celui qui L'invoque.", "11:61", "c"],
  ["الْوَاسِعُ", "Al-Wâsi'", "Le Vaste", "Sa science, Sa miséricorde et Sa générosité n'ont pas de limite.", "2:115", "c"],
  ["الْحَكِيمُ", "Al-Ḥakîm", "Le Sage", "Il place chaque chose à sa juste place, et rien de ce qu'Il décrète n'est vain.", "31:27", "c"],
  ["الْوَدُودُ", "Al-Wadûd", "Le Bien-Aimant", "Il aime Ses serviteurs pieux et Se fait aimer d'eux.", "85:14", "c"],
  ["الْمَجِيدُ", "Al-Majîd", "Le Glorieux", "Il est immense en gloire, en noblesse et en générosité.", "11:73", "c"],
  ["الْبَاعِثُ", "Al-Bâ'ith", "Celui qui ressuscite", "Il ressuscitera les morts de leurs tombes pour le Jugement.", "22:7", "l"],
  ["الشَّهِيدُ", "Ash-Shahîd", "Le Témoin", "Il est témoin de toute chose, rien ne Lui est caché.", "4:79", "c"],
  ["الْحَقُّ", "Al-Ḥaqq", "La Vérité", "Son existence est certaine, Sa parole est vraie et Sa promesse se réalise.", "22:6", "c"],
  ["الْوَكِيلُ", "Al-Wakîl", "Le Garant", "Il prend en charge les affaires de celui qui s'en remet à Lui.", "3:173", "c"],
  ["الْقَوِيُّ", "Al-Qawiyy", "Le Fort", "Sa force est parfaite et ne connaît aucune faiblesse.", "42:19", "c"],
  ["الْمَتِينُ", "Al-Matîn", "L'Inébranlable", "Sa puissance est ferme et ne faiblit jamais.", "51:58", "c"],
  ["الْوَلِيُّ", "Al-Waliyy", "Le Protecteur", "Il est l'Allié des croyants : Il les soutient et les guide.", "42:28", "c"],
  ["الْحَمِيدُ", "Al-Ḥamîd", "Le Digne de louange", "Il est loué pour Ses noms, Ses attributs et Ses actes, en toute circonstance.", "42:28", "c"],
  ["الْمُحْصِي", "Al-Muḥṣî", "Celui qui dénombre", "Il connaît le nombre exact de toute chose.", "19:94", "l"],
  ["الْمُبْدِئُ", "Al-Mubdi'", "Celui qui commence", "Il a commencé la création sans modèle préalable.", "85:13", "l"],
  ["الْمُعِيدُ", "Al-Mu'îd", "Celui qui recommence", "Il recommencera la création après la mort.", "85:13", "l"],
  ["الْمُحْيِي", "Al-Muḥyî", "Celui qui donne la vie", "Il a donné la vie et la redonnera aux morts.", "30:50", "c"],
  ["الْمُمِيتُ", "Al-Mumît", "Celui qui donne la mort", "Il décrète la mort de chaque être à son terme fixé.", "57:2", "l"],
  ["الْحَيُّ", "Al-Ḥayy", "Le Vivant", "Il vit d'une vie parfaite, sans commencement ni fin.", "25:58", "c"],
  ["الْقَيُّومُ", "Al-Qayyûm", "Le Subsistant", "Il subsiste par Lui-même et fait subsister toute chose.", "3:2", "c"],
  ["الْوَاجِدُ", "Al-Wâjid", "Celui qui ne manque de rien", "Il possède tout et rien ne Lui fait défaut.", "93:6", "l"],
  ["الْمَاجِدُ", "Al-Mâjid", "Le Noble", "Il est parfait en noblesse et en générosité.", "85:15", "l"],
  ["الْوَاحِدُ", "Al-Wâḥid", "L'Unique", "Il est unique dans Son essence, Ses attributs et Ses actes.", "12:39", "c"],
  ["الْأَحَدُ", "Al-Aḥad", "L'Un", "Il n'a ni égal, ni semblable, ni associé.", "112:1", "c"],
  ["الصَّمَدُ", "Aṣ-Ṣamad", "L'Absolu", "Toutes les créatures ont besoin de Lui, et Lui n'a besoin de personne.", "112:2", "c"],
  ["الْقَادِرُ", "Al-Qâdir", "Le Capable", "Rien ne Lui est impossible.", "6:65", "c"],
  ["الْمُقْتَدِرُ", "Al-Muqtadir", "Le Tout-Puissant", "Sa puissance s'exerce parfaitement sur toute chose.", "54:55", "c"],
  ["الْمُقَدِّمُ", "Al-Muqaddim", "Celui qui fait avancer", "Il fait avancer qui Il veut, dans le temps comme en rang.", "50:28", "l", "Se mentionne avec Al-Mu'akhkhir (Celui qui fait reculer)."],
  ["الْمُؤَخِّرُ", "Al-Mu'akhkhir", "Celui qui fait reculer", "Il retarde ce qu'Il veut, selon Sa sagesse.", "14:42", "l"],
  ["الْأَوَّلُ", "Al-Awwal", "Le Premier", "Rien n'existait avant Lui.", "57:3", "c"],
  ["الْآخِرُ", "Al-Âkhir", "Le Dernier", "Rien ne sera après Lui : Il demeure quand tout disparaît.", "57:3", "c"],
  ["الظَّاهِرُ", "Aẓ-Ẓâhir", "L'Apparent", "Rien n'est au-dessus de Lui, et Ses signes sont manifestes partout.", "57:3", "c"],
  ["الْبَاطِنُ", "Al-Bâṭin", "Le Caché", "Rien n'est en deçà de Lui : Il connaît l'intime de toute chose.", "57:3", "c"],
  ["الْوَالِي", "Al-Wâlî", "Le Gouverneur", "Il gouverne et administre toutes les affaires de la création.", "13:11", "c"],
  ["الْمُتَعَالِي", "Al-Muta'âlî", "Le Très Élevé", "Il est élevé au-dessus de tout défaut et de toute Sa création.", "13:9", "c"],
  ["الْبَرُّ", "Al-Barr", "Le Bienfaisant", "Sa bonté et Ses bienfaits envers Ses serviteurs sont immenses.", "52:28", "c"],
  ["التَّوَّابُ", "At-Tawwâb", "Celui qui accueille le repentir", "Il guide Ses serviteurs vers le repentir puis l'accepte, encore et encore.", "110:3", "c"],
  ["الْمُنْتَقِمُ", "Al-Muntaqim", "Celui qui châtie", "Il châtie par justice ceux qui persistent dans le crime.", "32:22", "l", "Ce nom rappelle Sa justice : Il ne châtie que celui qui persiste dans l'injustice."],
  ["الْعَفُوُّ", "Al-'Afuww", "Celui qui efface", "Il efface les péchés au point d'en faire disparaître la trace.", "4:149", "c"],
  ["الرَّءُوفُ", "Ar-Ra'ûf", "Le Très Doux", "Sa compassion envers Ses serviteurs est d'une infinie tendresse.", "57:9", "c"],
  ["مَالِكُ الْمُلْكِ", "Mâlik al-Mulk", "Le Possesseur de la royauté", "Il donne le pouvoir à qui Il veut et le retire à qui Il veut.", "3:26", "c"],
  ["ذُو الْجَلَالِ وَالْإِكْرَامِ", "Dhul-Jalâli wal-Ikrâm", "Le Détenteur de la majesté et de la générosité", "Il mérite d'être glorifié, et Il honore Ses serviteurs de Ses bienfaits.", "55:78", "c"],
  ["الْمُقْسِطُ", "Al-Muqsiṭ", "L'Équitable", "Il juge avec une équité parfaite.", "3:18", "l"],
  ["الْجَامِعُ", "Al-Jâmi'", "Celui qui rassemble", "Il rassemblera toutes les créatures au Jour dernier.", "3:9", "c"],
  ["الْغَنِيُّ", "Al-Ghaniyy", "Le Riche", "Il n'a besoin de rien ni de personne.", "35:15", "c"],
  ["الْمُغْنِي", "Al-Mughnî", "Celui qui enrichit", "Il enrichit qui Il veut, de biens comme de contentement.", "93:8", "l"],
  ["الْمَانِعُ", "Al-Mâni'", "Celui qui retient", "Nul ne peut donner ce qu'Il retient, et Il retient par sagesse.", "35:2", "l", "Se mentionne avec Al-Mu'ṭî (Celui qui donne)."],
  ["الضَّارُّ", "Aḍ-Ḍârr", "Celui qui éprouve", "Rien de mal n'atteint quiconque sans Sa permission.", "10:107", "l", "Se mentionne avec An-Nâfi' : rien ne nuit ni ne profite sans Sa permission."],
  ["النَّافِعُ", "An-Nâfi'", "Celui qui accorde le bienfait", "Tout bien qui nous atteint vient de Lui.", "10:107", "l"],
  ["النُّورُ", "An-Nûr", "La Lumière", "Il est la Lumière des cieux et de la terre, et guide par Sa lumière.", "24:35", "c"],
  ["الْهَادِي", "Al-Hâdî", "Le Guide", "Il guide les cœurs vers la vérité et les créatures vers ce qui leur est utile.", "25:31", "c"],
  ["الْبَدِيعُ", "Al-Badî'", "Le Créateur sans modèle", "Il a créé les cieux et la terre sans exemple antérieur.", "2:117", "c"],
  ["الْبَاقِي", "Al-Bâqî", "L'Éternel", "Il demeure à jamais, quand toute chose disparaît.", "55:27", "l"],
  ["الْوَارِثُ", "Al-Wârith", "L'Héritier", "Tout Lui revient après la disparition des créatures.", "15:23", "c"],
  ["الرَّشِيدُ", "Ar-Rashîd", "Le Guide vers la droiture", "Tous Ses actes et Ses décrets mènent à ce qui est juste.", "18:10", "l"],
  ["الصَّبُورُ", "Aṣ-Ṣabûr", "Le Patient", "Il ne se hâte pas de punir ceux qui Lui désobéissent.", "2:153", "l"],
];

export const NOMS_ALLAH: NomAllah[] = L.map(([arabe, translit, nomFr, sens, ref, type, note], i) => {
  const [s, v] = ref.split(":").map(Number);
  return { n: i + 1, arabe, translit, nomFr, sens, note, verset: { s, v, contient: type === "c" } };
});
