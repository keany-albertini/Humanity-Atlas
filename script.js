const bg=document.getElementById('sceneBg');
const canvas=document.getElementById('ambientCanvas');
const ctx=canvas.getContext('2d',{alpha:true});
const library=document.getElementById('library');
const grid=document.getElementById('knowledgeGrid');
const rail=document.getElementById('domainRail');
const filters=document.getElementById('filters');
const search=document.getElementById('knowledgeSearch');
const lesson=document.getElementById('lesson');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

const domains=[
  {id:'eau',name:'Eau',icon:'≈',group:'foundations',desc:'Cycle, collecte, usage, sobriété'},
  {id:'sol',name:'Sol',icon:'◍',group:'foundations',desc:'Vie du sol, fertilité, lecture'},
  {id:'agriculture',name:'Agriculture',icon:'✦',group:'skills',desc:'Semer, cultiver, récolter'},
  {id:'elevage',name:'Élevage',icon:'◌',group:'skills',desc:'Besoins, habitat, cycle'},
  {id:'alimentation',name:'Alimentation',icon:'⌁',group:'autonomy',desc:'Préparer, conserver, stocker'},
  {id:'construction',name:'Construction',icon:'⌂',group:'skills',desc:'Abri, bois, pierre, assemblages'},
  {id:'outils',name:'Outils',icon:'×',group:'materials',desc:'Choisir, entretenir, réparer'},
  {id:'metallurgie',name:'Métallurgie',icon:'◇',group:'materials',desc:'Métaux, forge, alliages'},
  {id:'energie',name:'Énergie',icon:'☼',group:'autonomy',desc:'Chaleur, mécanique, électricité'},
  {id:'textile',name:'Textile',icon:'≋',group:'materials',desc:'Fibres, fil, tissu, réparation'},
  {id:'orientation',name:'Orientation',icon:'⌖',group:'foundations',desc:'Carte, terrain, météo'},
  {id:'habitat',name:'Habitat',icon:'△',group:'autonomy',desc:'Confort, ventilation, entretien'},
  {id:'ecosystemes',name:'Écosystèmes',icon:'∞',group:'foundations',desc:'Observer, préserver, restaurer'}
];

const raw={
eau:[
 ['Calculer ce que ton toit peut récupérer','Transformer pluie + surface de toit en litres récupérables.','Guide pas à pas'],
 ['Installer une récupération de pluie','Gouttière, collecteur, cuve, trop-plein et premier contrôle.','Guide pas à pas'],
 ['Économiser l’eau à la maison','Mesurer douche, WC, robinets et fuites puis réduire les gros postes.','Guide pas à pas'],
 ['Arroser un jardin avec moins d’eau','Paillage, arrosage ciblé et contrôle de l’humidité du sol.','Guide pas à pas']
],
sol:[
 ['Lire un sol','Texture, structure, humidité, matière organique et vie visible.','Débutant'],
 ['Nourrir le sol','Compost, couverture, résidus végétaux et rotations.','Pratique'],
 ['Limiter l’érosion','Ralentir l’eau, protéger la surface, garder des racines.','Pratique'],
 ['Tester sans laboratoire','Petits tests d’observation pour comparer deux parcelles.','Atelier']
],
agriculture:[
 ['Préparer 1 m² de potager','Un exemple complet pour passer d’un sol nu à une planche prête à semer.','Guide pas à pas'],
 ['Semer radis, haricots et tomates','Trois exemples concrets pour apprendre profondeur, espacement et levée.','Guide pas à pas'],
 ['Arroser sans gaspiller','Savoir quand arroser, combien apporter et comment contrôler le sol.','Guide pas à pas'],
 ['Récolter et garder ses graines','Exemples simples avec haricot et tomate pour recommencer l’année suivante.','Guide pas à pas']
],
elevage:[
 ['Comprendre les besoins d’un animal','Eau, alimentation, espace, comportement et sécurité.','Essentiel'],
 ['Créer un habitat sain','Abri, ventilation, litière, protection et nettoyage.','Pratique'],
 ['Observer la santé au quotidien','Repérer rapidement les changements de comportement.','Pratique'],
 ['Comprendre reproduction et cycle','Croissance, maturité, reproduction et renouvellement.','Avancé']
],
alimentation:[
 ['Conserver au frais','Température, humidité, durée et organisation.','Essentiel'],
 ['Sécher les aliments','Réduire l’eau disponible pour ralentir l’altération.','Pratique'],
 ['Fermenter simplement','Comprendre le rôle du sel, du temps et de l’hygiène.','Pratique'],
 ['Construire un garde-manger','Stocker, tourner les réserves et éviter les pertes.','Atelier']
],
construction:[
 ['Lire les charges','Comprendre appuis, compression, traction et stabilité.','Débutant'],
 ['Assembler le bois','Mesurer, tracer, couper et choisir un assemblage simple.','Pratique'],
 ['Construire avec la pierre','Choisir, caler, répartir les charges et drainer.','Pratique'],
 ['Protéger un ouvrage','Eau, ventilation, débords, entretien et durée de vie.','Essentiel']
],
outils:[
 ['Choisir le bon outil','Associer forme, matière, effort et précision.','Débutant'],
 ['Affûter un tranchant','Comprendre angle, bavure, progression et contrôle.','Pratique'],
 ['Entretenir les manches','Inspecter, ajuster, protéger et remplacer.','Atelier'],
 ['Réparer plutôt que jeter','Diagnostic, pièce faible, démontage et remontage.','Pratique']
],
metallurgie:[
 ['Reconnaître et choisir un métal','Acier, inox, aluminium, cuivre : comment les distinguer et quoi en faire.','Guide pas à pas'],
 ['Percer et assembler une pièce d’acier','Tracer, pointer, percer, ébavurer puis boulonner proprement.','Guide pas à pas'],
 ['Protéger l’acier contre la rouille','Préparer la surface, traiter puis peindre pour prolonger la durée de vie.','Guide pas à pas'],
 ['Organiser un atelier métal sûr','Fixation des pièces, projections, poussières, chaleur et rangement.','Sécurité']
],
energie:[
 ['Comprendre puissance et énergie','Watts, kilowattheures, durée et rendement.','Essentiel'],
 ['Produire de la chaleur utile','Isolation, combustion, solaire et pertes.','Pratique'],
 ['Transformer un mouvement','Levier, poulie, engrenage et transmission.','Débutant'],
 ['Lire un petit système électrique','Source, tension, courant, charge et protection.','Pratique']
],
textile:[
 ['Reconnaître les fibres','Végétales, animales, synthétiques : comportement et usage.','Débutant'],
 ['Faire un fil','Torsion, continuité et résistance.','Atelier'],
 ['Réparer un vêtement','Point simple, renfort, pièce et reprise.','Pratique'],
 ['Protéger un textile','Lavage, séchage, stockage et parasites.','Essentiel']
],
orientation:[
 ['Lire une carte','Échelle, relief, symboles et distances.','Essentiel'],
 ['S’orienter au terrain','Repères, direction, pente et position relative.','Pratique'],
 ['Lire les signes météo','Nuages, vent, pression et évolution locale.','Débutant'],
 ['Préparer un déplacement','Itinéraire, marge, eau, abri et solution de repli.','Pratique']
],
habitat:[
 ['Comprendre le confort thermique','Chaleur, rayonnement, air, humidité et isolation.','Essentiel'],
 ['Ventiler sans gaspiller','Renouveler l’air et contrôler l’humidité.','Pratique'],
 ['Repérer une infiltration','Suivre les traces et remonter à la cause.','Pratique'],
 ['Planifier l’entretien','Inspecter avant la panne et garder un historique.','Atelier']
],
ecosystemes:[
 ['Observer avant d’agir','Lire le milieu, les saisons et les interactions.','Essentiel'],
 ['Prélever sans épuiser','Comprendre le renouvellement et laisser des refuges.','Pratique'],
 ['Restaurer un petit milieu','Sol, eau, végétation et continuités écologiques.','Atelier'],
 ['Favoriser la diversité','Créer plusieurs habitats plutôt qu’un espace uniforme.','Pratique']
]
};

const detail={
 'eau-0':{
  intro:"Voici le calcul de base : 1 mm de pluie sur 1 m² représente environ 1 litre d’eau. On multiplie donc la surface de toit projetée par la pluie reçue, puis on retire une marge pour les pertes.",
  diagram:['Mesurer le toit','Lire la pluie','Multiplier','Appliquer les pertes','Choisir la cuve'],
  material:['Mètre ou plan du toit','Pluviométrie locale en mm','Calculatrice','Surface raccordée aux gouttières'],
  steps:['Mesure la surface de toit réellement raccordée à la descente. Exemple : 50 m².','Prends un épisode de pluie : par exemple 20 mm.','Calcul brut : 50 × 20 = 1 000 litres tombés sur cette surface.','Pour une estimation réaliste, applique un rendement d’environ 0,8 à 0,9 selon toiture, filtre et pertes. À 85 %, cela donne environ 850 L.','Compare ce volume à ta cuve : une cuve de 500 L déborderait pendant cet épisode si elle était vide au départ.'],
  mistakes:['Utiliser la surface totale de la maison au lieu de la partie raccordée','Oublier que la cuve peut déjà être partiellement pleine','Confondre mm de pluie et litres','Dimensionner sans prévoir de trop-plein'],
  safety:"L’eau de pluie récupérée n’est pas automatiquement potable. Son usage intérieur est réglementé et demande un réseau séparé et des équipements adaptés.",
  exercise:"Exemple : avec 80 m² de toiture et 10 mm de pluie, calcule le volume brut puis le volume à 85 % de rendement. Réponse attendue : 800 L bruts, environ 680 L récupérables."
 },
 'eau-1':{
  intro:"Une récupération simple pour le jardin peut fonctionner avec une descente de gouttière, un collecteur filtrant, une cuve opaque et un trop-plein dirigé vers une zone sûre.",
  diagram:['Gouttière','Collecteur','Cuve opaque','Robinet bas','Trop-plein'],
  material:['Cuve stable et opaque','Collecteur de descente avec filtre','Flexible adapté','Robinet ou sortie basse','Trop-plein','Support parfaitement stable'],
  steps:['Place la cuve sur un support plat, solide et capable de porter son poids pleine : 500 L d’eau pèsent environ 500 kg, hors cuve.','Monte le collecteur sur la descente conformément à sa notice et relie-le à l’entrée haute de la cuve.','Ferme la cuve à la lumière et aux moustiques avec couvercle et grilles adaptées.','Prévois un trop-plein vers l’évacuation existante ou une zone d’infiltration qui ne menace pas les fondations.','Après la première pluie, vérifie fuites, stabilité, débit du trop-plein et propreté du filtre.'],
  mistakes:['Poser une grosse cuve sur des parpaings instables','Laisser la cuve ouverte à la lumière','Oublier le trop-plein','Faire ruisseler le débordement vers les fondations'],
  safety:"Une cuve pleine est extrêmement lourde. Le support doit être dimensionné pour la charge et la cuve doit rester inaccessible aux jeunes enfants.",
  exercise:"Exemple : pour une cuve de 300 L, prévois un emplacement stable, marque entrée, sortie et trop-plein sur un croquis avant l’installation."
 },
 'eau-2':{
  intro:"Le meilleur moyen d’économiser est d’abord de mesurer. Pendant 24 heures, note les gros usages puis attaque les plus importants : douches, WC, fuites et robinets.",
  diagram:['Mesurer','Classer','Réduire','Réparer','Re-mesurer'],
  material:['Seau gradué ou récipient connu','Chronomètre','Papier ou téléphone','Accès au compteur si disponible'],
  steps:['Mesure le débit d’un robinet : remplis un récipient pendant 10 secondes puis multiplie le volume par 6 pour obtenir des litres/minute. Exemple : 1,5 L en 10 s = 9 L/min.','Chronomètre une douche. À 9 L/min pendant 8 minutes, cela représente environ 72 L. À 5 minutes, environ 45 L.','Teste les WC : une fuite silencieuse peut être recherchée en observant si de l’eau continue de couler dans la cuvette après remplissage ou via la méthode recommandée par le fabricant.','Répare d’abord les fuites et installe des mousseurs/douchettes économes compatibles si les débits sont élevés.','Re-mesure après modification pour vérifier le gain réel au lieu de supposer.'],
  mistakes:['Acheter des équipements sans mesurer avant/après','Se concentrer sur de très petits usages en laissant une grosse fuite','Réduire excessivement un débit nécessaire à un appareil','Négliger les notices des équipements'],
  safety:"Ne modifie pas un réseau d’eau sanitaire si tu n’es pas sûr du montage. Pour les installations fixes ou douteuses, passe par un professionnel.",
  exercise:"Exemple : si ton pommeau débite 10 L/min et que tu passes de 10 à 6 minutes, tu économises environ 40 L par douche."
 },
 'eau-3':{
  intro:"Au jardin, l’objectif est de garder l’eau dans le sol et de l’amener aux racines. Un paillage et des arrosages plus profonds mais moins fréquents sont souvent plus efficaces qu’un petit arrosage superficiel quotidien.",
  diagram:['Pailler','Tester le sol','Arroser au pied','Laisser infiltrer','Recontrôler'],
  material:['Paillage végétal','Arrosoir ou goutte-à-goutte','Petit transplantoir','Récipient gradué'],
  steps:['Couvre la terre autour des plantes avec quelques centimètres de paillage, sans coller le paillis contre les tiges.','Avant d’arroser, vérifie l’humidité à quelques centimètres sous la surface.','Arrose lentement au pied. Pour apprendre à doser, mesure réellement 5 ou 10 L avec un arrosoir gradué.','Attends l’infiltration puis contrôle la profondeur humide avec un petit trou d’observation.','Adapte ensuite la fréquence au type de sol, à la plante et à la météo plutôt qu’à un calendrier fixe.'],
  mistakes:['Arroser seulement la surface','Arroser en plein vent ou aux heures très chaudes','Mouiller systématiquement le feuillage','Mettre du paillage sur un sol totalement sec sans l’avoir d’abord humidifié'],
  safety:"Les besoins varient énormément. Les quantités doivent être ajustées à la plante, au sol et au climat.",
  exercise:"Exemple : choisis deux plants similaires. Paille l’un et laisse l’autre sans paillage, puis compare l’humidité du sol 24 h après le même arrosage."
 },
 'agriculture-0':{
  intro:"Objectif : préparer une planche de 1 m × 1 m prête à recevoir des semis sans retourner profondément toute la terre.",
  diagram:['Choisir 1 m²','Désherber','Ameublir','Ajouter compost','Pailler'],
  material:['1 m² de terrain','Fourche-bêche ou grelinette','Râteau','Environ 10 à 20 L de compost mûr','Paillage végétal'],
  steps:['Choisis une zone recevant plusieurs heures de soleil et où l’eau ne stagne pas.','Retire les grosses adventices avec leurs racines.','Ameublis sur la profondeur des dents de l’outil sans retourner complètement les couches.','Étale environ 1 à 2 cm de compost mûr en surface, soit grosso modo 10 à 20 L sur 1 m².','Si tu ne sèmes pas immédiatement, protège avec un paillage léger. Pour un semis fin, écarte le paillage sur la ligne de semis.'],
  mistakes:['Ajouter une énorme quantité de compost parce que “plus = mieux”','Travailler un sol détrempé','Piétiner ensuite la planche','Enterrer un paillage grossier dans la zone de semis'],
  safety:"Les besoins en amendement dépendent du sol. Si la terre est déjà très riche, réduis l’apport.",
  exercise:"Exemple réel : fais cette planche de 1 m², puis sème une moitié en radis et garde l’autre moitié pour un autre essai. Photographier avant/après permet de comparer."
 },
 'agriculture-1':{
  intro:"Trois graines permettent d’apprendre trois logiques différentes : radis en ligne, haricot plus profond, tomate en godet.",
  diagram:['Préparer','Mesurer profondeur','Semer','Tasser léger','Garder humide'],
  material:['Graines de radis','Graines de haricot','Graines de tomate','Règle','Arrosoir à pomme fine','Étiquettes'],
  steps:['Radis : sème généralement autour de 1 cm de profondeur, en ligne, puis éclaircis selon la variété pour éviter la concurrence.','Haricot : enterre typiquement autour de 3 à 5 cm selon le sol et la variété, en respectant l’espacement indiqué sur le sachet.','Tomate : en godet, couvre très légèrement la graine, autour de 0,5 cm, puis garde le substrat humide et chaud sans le détremper.','Après chaque semis, tasse très légèrement afin que la graine touche bien le sol.','Étiquette toujours date + variété. Compare ensuite le nombre de graines semées et le nombre de plants levés.'],
  mistakes:['Semer toutes les graines à la même profondeur','Arroser avec un jet qui déplace les graines','Détremper les godets','Oublier d’éclaircir les radis'],
  safety:"Les profondeurs exactes varient selon variété et type de sol : le sachet de semences reste la référence.",
  exercise:"Exemple : sème 10 radis. Si 8 lèvent, ton taux de levée est de 80 %. Recommence en changeant un seul paramètre."
 },
 'agriculture-2':{
  intro:"Un guide simple : mesurer ce que tu apportes, vérifier jusqu’où l’eau descend et ne ré-arroser que lorsque la zone racinaire commence réellement à sécher.",
  diagram:['Mesurer 5 L','Arroser lentement','Attendre','Creuser témoin','Adapter'],
  material:['Arrosoir de 5 ou 10 L','Paillage','Petit transplantoir','Carnet'],
  steps:['Commence sur une petite zone, par exemple 1 m². Mesure 5 L dans l’arrosoir pour savoir ce que représente réellement cette quantité.','Verse lentement au pied des plantes pour éviter ruissellement.','Attends 15 à 30 minutes que l’eau se répartisse.','À côté des racines, fais un petit trou témoin et regarde jusqu’où la terre est humide.','Si seule la surface est mouillée, l’apport était trop faible ou trop rapide. Si le sol reste humide longtemps, espace davantage les arrosages.'],
  mistakes:['Arroser “5 minutes” sans connaître le débit','Ajouter un peu d’eau tous les jours sans vérifier le sol','Arroser rapidement sur une terre très sèche','Ignorer la pluie récente'],
  safety:"Il n’existe pas de quantité universelle : texture du sol, météo, taille de la plante et enracinement changent les besoins.",
  exercise:"Exemple : compare 5 L appliqués rapidement et 5 L appliqués lentement sur deux petites zones identiques, puis regarde la profondeur humide."
 },
 'agriculture-3':{
  intro:"Commence avec des espèces faciles. Le haricot est simple à sécher et stocker ; la tomate demande de récupérer puis sécher les graines.",
  diagram:['Choisir plant sain','Laisser mûrir','Prélever','Sécher','Étiqueter'],
  material:['Haricots mûrs ou tomate bien mûre','Assiette ou papier','Sachets papier','Étiquettes','Boîte sèche'],
  steps:['Haricot : laisse quelques gousses finir leur maturité sur le plant jusqu’à ce qu’elles soient bien sèches, puis récupère les graines.','Laisse encore sécher les graines quelques jours dans un endroit sec et ventilé avant stockage.','Tomate : prélève les graines d’un fruit très mûr, nettoie-les soigneusement selon la méthode choisie, puis fais-les sécher complètement en couche fine.','Stocke au sec, au frais et à l’abri de la lumière dans un sachet identifié.','Note espèce, variété, année et lieu de récolte.'],
  mistakes:['Stocker une graine encore humide','Utiliser un contenant non identifié','Prendre des graines sur un plant malade','Supposer qu’un hybride donnera exactement la même descendance'],
  safety:"Certaines variétés hybrides ou espèces à pollinisation croisée ne reproduisent pas fidèlement les caractéristiques du plant parent.",
  exercise:"Exemple : stocke 20 graines de haricot et, quelques mois plus tard, fais germer 10 graines pour mesurer leur taux de germination."
 },
 'elevage-0':{
  intro:"Avant de choisir une espèce, il faut être capable d’assurer chaque jour ses besoins physiques et comportementaux.",
  diagram:['Eau','Nourriture','Espace','Comportement','Surveillance'],
  material:['Fiche des besoins de l’espèce','Point d’eau fiable','Zone d’abri','Matériel de nettoyage','Registre simple'],
  steps:['Lister les besoins quotidiens de l’espèce.','Calculer l’espace et le temps réellement disponibles.','Prévoir une eau propre accessible en permanence selon l’espèce.','Créer des possibilités de repos, mouvement et comportement naturel.','Observer chaque jour consommation, activité et aspect général.'],
  mistakes:['Choisir uniquement selon la taille de l’animal','Sous-estimer le temps quotidien','Négliger l’ombre ou la ventilation','Changer brutalement d’alimentation'],
  safety:"Les besoins varient fortement selon l’espèce, l’âge et le climat. Les soins vétérinaires restent indispensables en cas de maladie ou blessure.",
  exercise:"Exercice : construis une fiche quotidienne avec 5 indicateurs observables et teste-la pendant une semaine."
 },
 'elevage-1':{
  intro:"Un bon habitat protège sans enfermer dans un air humide ou vicié. Il reste sec, ventilé, nettoyable et adapté au comportement de l’animal.",
  diagram:['Protéger','Ventiler','Garder sec','Nettoyer','Observer'],
  material:['Abri adapté','Litière','Mangeoires et abreuvoirs','Matériel de nettoyage','Zones d’ombre'],
  steps:['Protéger des intempéries et des prédateurs adaptés au contexte.','Assurer une circulation d’air sans courant direct excessif.','Évacuer l’eau et garder une zone de couchage sèche.','Nettoyer à une fréquence adaptée à la densité et à l’espèce.','Observer où les animaux choisissent naturellement de se placer.'],
  mistakes:['Fermer totalement un abri pour garder la chaleur','Laisser l’eau stagner','Mettre nourriture et déjections trop proches','Créer un sol impossible à nettoyer'],
  safety:"Un habitat propre n’est pas forcément stérile ; l’objectif est de réduire humidité, parasites et accumulation de déchets.",
  exercise:"Exercice : dessine le plan d’un habitat avec zones eau, nourriture, repos, ombre et nettoyage."
 },
 'elevage-2':{
  intro:"La détection précoce repose souvent sur un principe simple : connaître le comportement normal pour repérer vite ce qui change.",
  diagram:['Regarder','Comparer','Noter','Isoler si besoin','Consulter'],
  material:['Carnet ou tableau','Balance si adaptée','Éclairage correct','Zone calme d’observation'],
  steps:['Observer appétit, eau, posture, déplacement et interactions.','Comparer avec les habitudes individuelles.','Noter les changements plutôt que de se fier à la mémoire.','Limiter le stress et séparer temporairement si la sécurité du groupe l’exige.','Contacter un professionnel lorsque les signes persistent ou sont inquiétants.'],
  mistakes:['Attendre une aggravation visible','Changer plusieurs choses à la fois','Forcer un animal stressé','Donner un traitement non adapté sans avis'],
  safety:"Ce module apprend l’observation, pas le diagnostic médical. En cas de doute sérieux, consulter un vétérinaire.",
  exercise:"Exercice : crée une ligne de base de 7 jours sur appétit, activité et comportement."
 },
 'elevage-3':{
  intro:"Comprendre le cycle de vie permet d’anticiper espace, alimentation, séparation, renouvellement et responsabilité sur plusieurs années.",
  diagram:['Naissance','Croissance','Maturité','Reproduction','Vieillissement'],
  material:['Calendrier','Fiches individuelles','Plan de capacité maximale','Zones séparables'],
  steps:['Connaître la durée approximative des grandes étapes de vie.','Adapter alimentation et espace à l’âge.','Éviter les reproductions non planifiées.','Prévoir l’accueil des jeunes avant toute reproduction.','Intégrer vieillissement et fin de vie dans la responsabilité d’élevage.'],
  mistakes:['Raisonner uniquement à court terme','Sous-estimer le nombre d’animaux après reproduction','Mélanger des âges incompatibles','Ne pas prévoir de solution pour les jeunes'],
  safety:"La reproduction doit être planifiée selon la santé, le bien-être, l’espace disponible et la réglementation locale.",
  exercise:"Exercice : fais un calendrier d’un cycle complet pour une espèce et liste les besoins qui changent à chaque étape."
 },
 'metallurgie-0':{
  intro:"Avant de couper ou percer une pièce, identifie au moins sa famille. Acier, inox, aluminium et cuivre ne se travaillent pas exactement de la même manière.",
  diagram:['Observer','Aimant','Comparer poids','Regarder corrosion','Choisir usage'],
  material:['Aimant','Balance simple','Échantillons connus','Lunettes de protection','Fiche de comparaison'],
  steps:['Acier courant : souvent magnétique, relativement lourd, rouille brun-orangé si non protégé.','Inox : aspect proche de l’acier ; certains inox sont peu ou pas magnétiques, donc l’aimant seul ne suffit pas.','Aluminium : beaucoup plus léger à volume égal et non magnétique.','Cuivre : couleur rouge-orangée caractéristique ; il peut verdir en vieillissant.','Si le métal est peint, galvanisé ou inconnu, traite-le comme matériau non identifié et évite chauffe/meulage avant identification fiable.'],
  mistakes:['Identifier uniquement avec un aimant','Confondre acier galvanisé et métal “sans risque à chauffer”','Couper un revêtement inconnu sans précaution','Choisir un métal uniquement pour son apparence'],
  safety:"Ne chauffe ni ne soude un métal inconnu ou galvanisé : certains revêtements peuvent libérer des fumées dangereuses.",
  exercise:"Exemple : prends une vis en acier, une canette en aluminium et un morceau de cuivre. Compare aimant, masse relative, couleur et corrosion."
 },
 'metallurgie-1':{
  intro:"Exemple concret : percer un trou dans une petite patte d’acier doux puis l’assembler avec un boulon. Le point essentiel est de fixer la pièce : jamais la tenir à la main.",
  diagram:['Tracer','Pointer','Serrer','Percer','Ébavurer'],
  material:['Pièce d’acier doux identifiée','Étau ou serre-joints','Pointeau','Perceuse','Foret HSS adapté','Lunettes de protection','Boulon + rondelles + écrou'],
  steps:['Trace précisément le centre du trou.','Marque un petit creux au pointeau pour empêcher le foret de glisser.','Serre fermement la pièce dans un étau ou sur un support stable.','Perce perpendiculairement avec un foret adapté au métal. Pour un diamètre important, un avant-trou peut faciliter le travail. Adapte la vitesse au diamètre du foret et aux recommandations du fabricant ; plus le foret est gros, plus la vitesse doit généralement être réduite.','Ébavure le trou puis assemble avec boulon, rondelles et écrou sans serrer au point de déformer la pièce.'],
  mistakes:['Tenir la pièce d’une main pendant le perçage','Percer trop vite avec un gros foret','Mettre les doigts près du foret pour retenir la pièce','Laisser une grosse bavure coupante après perçage'],
  safety:"Lunettes obligatoires. Attache cheveux et vêtements amples. Les gants peuvent s’accrocher aux outils rotatifs : ne les utilise pas près d’un foret en rotation sauf procédure spécifiquement prévue.",
  exercise:"Exemple : sur une chute d’acier doux, réalise un trou de petit diamètre, ébavure-le et monte un boulon avec deux rondelles. Le résultat doit être propre, sans jeu excessif ni arête vive."
 },
 'metallurgie-2':{
  intro:"Exemple concret : remettre en état une petite équerre en acier rouillée sans la remplacer.",
  diagram:['Décaper','Dégraisser','Inspecter','Apprêter','Peindre'],
  material:['Brosse métallique manuelle ou abrasif adapté','Chiffon','Dégraissant compatible','Primaire anticorrosion','Peinture métal','Lunettes et masque adaptés aux poussières/produits'],
  steps:['Retire la rouille non adhérente et la peinture qui se décolle.','Dépoussière puis dégraisse la surface selon les instructions du produit.','Inspecte : si la corrosion a profondément aminci ou perforé la pièce structurelle, ne te contente pas de peindre — remplace ou fais vérifier la pièce.','Applique un primaire anticorrosion compatible avec le métal et respecte le temps de séchage fabricant.','Applique la finition métal en couvrant aussi les arêtes et zones de fixation.'],
  mistakes:['Peindre directement sur de la rouille friable','Enfermer de l’humidité sous la peinture','Négliger les chants et perçages','Réutiliser une pièce structurelle fortement amincie'],
  safety:"Poussières de peinture ancienne et revêtements inconnus peuvent être dangereux. Évite le ponçage agressif d’un revêtement inconnu et respecte les fiches de sécurité des produits.",
  exercise:"Exemple : traite une petite équerre non structurelle rouillée, photographie chaque étape et vérifie après quelques semaines si la rouille réapparaît."
 },
 'metallurgie-3':{
  intro:"Un atelier métal efficace commence par l’immobilisation des pièces et une séparation claire entre zone de perçage, zone d’étincelles et stockage.",
  diagram:['Fixer','Éclairer','Protéger','Séparer','Ranger'],
  material:['Étau solidement fixé','Serre-joints','Lunettes/écran adaptés','Éclairage','Rangement des chutes','Extincteur adapté au contexte'],
  steps:['Fixe l’étau sur un support stable ; une pièce qui tourne avec le foret devient immédiatement dangereuse.','Garde l’espace devant les machines dégagé et suffisamment éclairé.','Sépare les matériaux combustibles des opérations produisant étincelles ou chaleur.','Range les chutes de métal verticalement ou dans un bac où les arêtes ne dépassent pas.','À la fin, enlève copeaux, vérifie les pièces chaudes et remets les protections en place.'],
  mistakes:['Percer une pièce non bridée','Laisser des copeaux au sol','Stocker solvants et chiffons près des étincelles','Manipuler des copeaux coupants à main nue'],
  safety:"Chaque machine a ses propres règles. La notice fabricant et une formation pratique priment sur un guide général.",
  exercise:"Exemple : organise une petite zone de 1 m de large avec étau, éclairage, bac à chutes et emplacement outils ; vérifie qu’aucun matériau combustible n’est dans la zone de projection."
 },st bg=document.getElementById('sceneBg');
const canvas=document.getElementById('ambientCanvas');
const ctx=canvas.getContext('2d',{alpha:true});
const library=document.getElementById('library');
const grid=document.getElementById('knowledgeGrid');
const rail=document.getElementById('domainRail');
const filters=document.getElementById('filters');
const search=document.getElementById('knowledgeSearch');
const lesson=document.getElementById('lesson');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

const domains=[
  {id:'eau',name:'Eau',icon:'≈',group:'foundations',desc:'Cycle, collecte, usage, sobriété'},
  {id:'sol',name:'Sol',icon:'◍',group:'foundations',desc:'Vie du sol, fertilité, lecture'},
  {id:'agriculture',name:'Agriculture',icon:'✦',group:'skills',desc:'Semer, cultiver, récolter'},
  {id:'elevage',name:'Élevage',icon:'◌',group:'skills',desc:'Besoins, habitat, cycle'},
  {id:'alimentation',name:'Alimentation',icon:'⌁',group:'autonomy',desc:'Préparer, conserver, stocker'},
  {id:'construction',name:'Construction',icon:'⌂',group:'skills',desc:'Abri, bois, pierre, assemblages'},
  {id:'outils',name:'Outils',icon:'×',group:'materials',desc:'Choisir, entretenir, réparer'},
  {id:'metallurgie',name:'Métallurgie',icon:'◇',group:'materials',desc:'Métaux, forge, alliages'},
  {id:'energie',name:'Énergie',icon:'☼',group:'autonomy',desc:'Chaleur, mécanique, électricité'},
  {id:'textile',name:'Textile',icon:'≋',group:'materials',desc:'Fibres, fil, tissu, réparation'},
  {id:'orientation',name:'Orientation',icon:'⌖',group:'foundations',desc:'Carte, terrain, météo'},
  {id:'habitat',name:'Habitat',icon:'△',group:'autonomy',desc:'Confort, ventilation, entretien'},
  {id:'ecosystemes',name:'Écosystèmes',icon:'∞',group:'foundations',desc:'Observer, préserver, restaurer'}
];

const raw={
eau:[
 ['Calculer ce que ton toit peut récupérer','Transformer pluie + surface de toit en litres récupérables.','Guide pas à pas'],
 ['Installer une récupération de pluie','Gouttière, collecteur, cuve, trop-plein et premier contrôle.','Guide pas à pas'],
 ['Économiser l’eau à la maison','Mesurer douche, WC, robinets et fuites puis réduire les gros postes.','Guide pas à pas'],
 ['Arroser un jardin avec moins d’eau','Paillage, arrosage ciblé et contrôle de l’humidité du sol.','Guide pas à pas']
],
sol:[
 ['Lire un sol','Texture, structure, humidité, matière organique et vie visible.','Débutant'],
 ['Nourrir le sol','Compost, couverture, résidus végétaux et rotations.','Pratique'],
 ['Limiter l’érosion','Ralentir l’eau, protéger la surface, garder des racines.','Pratique'],
 ['Tester sans laboratoire','Petits tests d’observation pour comparer deux parcelles.','Atelier']
],
agriculture:[
 ['Préparer 1 m² de potager','Un exemple complet pour passer d’un sol nu à une planche prête à semer.','Guide pas à pas'],
 ['Semer radis, haricots et tomates','Trois exemples concrets pour apprendre profondeur, espacement et levée.','Guide pas à pas'],
 ['Arroser sans gaspiller','Savoir quand arroser, combien apporter et comment contrôler le sol.','Guide pas à pas'],
 ['Récolter et garder ses graines','Exemples simples avec haricot et tomate pour recommencer l’année suivante.','Guide pas à pas']
],
elevage:[
 ['Comprendre les besoins d’un animal','Eau, alimentation, espace, comportement et sécurité.','Essentiel'],
 ['Créer un habitat sain','Abri, ventilation, litière, protection et nettoyage.','Pratique'],
 ['Observer la santé au quotidien','Repérer rapidement les changements de comportement.','Pratique'],
 ['Comprendre reproduction et cycle','Croissance, maturité, reproduction et renouvellement.','Avancé']
],
alimentation:[
 ['Conserver au frais','Température, humidité, durée et organisation.','Essentiel'],
 ['Sécher les aliments','Réduire l’eau disponible pour ralentir l’altération.','Pratique'],
 ['Fermenter simplement','Comprendre le rôle du sel, du temps et de l’hygiène.','Pratique'],
 ['Construire un garde-manger','Stocker, tourner les réserves et éviter les pertes.','Atelier']
],
construction:[
 ['Lire les charges','Comprendre appuis, compression, traction et stabilité.','Débutant'],
 ['Assembler le bois','Mesurer, tracer, couper et choisir un assemblage simple.','Pratique'],
 ['Construire avec la pierre','Choisir, caler, répartir les charges et drainer.','Pratique'],
 ['Protéger un ouvrage','Eau, ventilation, débords, entretien et durée de vie.','Essentiel']
],
outils:[
 ['Choisir le bon outil','Associer forme, matière, effort et précision.','Débutant'],
 ['Affûter un tranchant','Comprendre angle, bavure, progression et contrôle.','Pratique'],
 ['Entretenir les manches','Inspecter, ajuster, protéger et remplacer.','Atelier'],
 ['Réparer plutôt que jeter','Diagnostic, pièce faible, démontage et remontage.','Pratique']
],
metallurgie:[
 ['Reconnaître et choisir un métal','Acier, inox, aluminium, cuivre : comment les distinguer et quoi en faire.','Guide pas à pas'],
 ['Percer et assembler une pièce d’acier','Tracer, pointer, percer, ébavurer puis boulonner proprement.','Guide pas à pas'],
 ['Protéger l’acier contre la rouille','Préparer la surface, traiter puis peindre pour prolonger la durée de vie.','Guide pas à pas'],
 ['Organiser un atelier métal sûr','Fixation des pièces, projections, poussières, chaleur et rangement.','Sécurité']
],
energie:[
 ['Comprendre puissance et énergie','Watts, kilowattheures, durée et rendement.','Essentiel'],
 ['Produire de la chaleur utile','Isolation, combustion, solaire et pertes.','Pratique'],
 ['Transformer un mouvement','Levier, poulie, engrenage et transmission.','Débutant'],
 ['Lire un petit système électrique','Source, tension, courant, charge et protection.','Pratique']
],
textile:[
 ['Reconnaître les fibres','Végétales, animales, synthétiques : comportement et usage.','Débutant'],
 ['Faire un fil','Torsion, continuité et résistance.','Atelier'],
 ['Réparer un vêtement','Point simple, renfort, pièce et reprise.','Pratique'],
 ['Protéger un textile','Lavage, séchage, stockage et parasites.','Essentiel']
],
orientation:[
 ['Lire une carte','Échelle, relief, symboles et distances.','Essentiel'],
 ['S’orienter au terrain','Repères, direction, pente et position relative.','Pratique'],
 ['Lire les signes météo','Nuages, vent, pression et évolution locale.','Débutant'],
 ['Préparer un déplacement','Itinéraire, marge, eau, abri et solution de repli.','Pratique']
],
habitat:[
 ['Comprendre le confort thermique','Chaleur, rayonnement, air, humidité et isolation.','Essentiel'],
 ['Ventiler sans gaspiller','Renouveler l’air et contrôler l’humidité.','Pratique'],
 ['Repérer une infiltration','Suivre les traces et remonter à la cause.','Pratique'],
 ['Planifier l’entretien','Inspecter avant la panne et garder un historique.','Atelier']
],
ecosystemes:[
 ['Observer avant d’agir','Lire le milieu, les saisons et les interactions.','Essentiel'],
 ['Prélever sans épuiser','Comprendre le renouvellement et laisser des refuges.','Pratique'],
 ['Restaurer un petit milieu','Sol, eau, végétation et continuités écologiques.','Atelier'],
 ['Favoriser la diversité','Créer plusieurs habitats plutôt qu’un espace uniforme.','Pratique']
]
};

const detail={
 'eau-0':{
  intro:"Voici le calcul de base : 1 mm de pluie sur 1 m² représente environ 1 litre d’eau. On multiplie donc la surface de toit projetée par la pluie reçue, puis on retire une marge pour les pertes.",
  diagram:['Mesurer le toit','Lire la pluie','Multiplier','Appliquer les pertes','Choisir la cuve'],
  material:['Mètre ou plan du toit','Pluviométrie locale en mm','Calculatrice','Surface raccordée aux gouttières'],
  steps:['Mesure la surface de toit réellement raccordée à la descente. Exemple : 50 m².','Prends un épisode de pluie : par exemple 20 mm.','Calcul brut : 50 × 20 = 1 000 litres tombés sur cette surface.','Pour une estimation réaliste, applique un rendement d’environ 0,8 à 0,9 selon toiture, filtre et pertes. À 85 %, cela donne environ 850 L.','Compare ce volume à ta cuve : une cuve de 500 L déborderait pendant cet épisode si elle était vide au départ.'],
  mistakes:['Utiliser la surface totale de la maison au lieu de la partie raccordée','Oublier que la cuve peut déjà être partiellement pleine','Confondre mm de pluie et litres','Dimensionner sans prévoir de trop-plein'],
  safety:"L’eau de pluie récupérée n’est pas automatiquement potable. Son usage intérieur est réglementé et demande un réseau séparé et des équipements adaptés.",
  exercise:"Exemple : avec 80 m² de toiture et 10 mm de pluie, calcule le volume brut puis le volume à 85 % de rendement. Réponse attendue : 800 L bruts, environ 680 L récupérables."
 },
 'eau-1':{
  intro:"Une récupération simple pour le jardin peut fonctionner avec une descente de gouttière, un collecteur filtrant, une cuve opaque et un trop-plein dirigé vers une zone sûre.",
  diagram:['Gouttière','Collecteur','Cuve opaque','Robinet bas','Trop-plein'],
  material:['Cuve stable et opaque','Collecteur de descente avec filtre','Flexible adapté','Robinet ou sortie basse','Trop-plein','Support parfaitement stable'],
  steps:['Place la cuve sur un support plat, solide et capable de porter son poids pleine : 500 L d’eau pèsent environ 500 kg, hors cuve.','Monte le collecteur sur la descente conformément à sa notice et relie-le à l’entrée haute de la cuve.','Ferme la cuve à la lumière et aux moustiques avec couvercle et grilles adaptées.','Prévois un trop-plein vers l’évacuation existante ou une zone d’infiltration qui ne menace pas les fondations.','Après la première pluie, vérifie fuites, stabilité, débit du trop-plein et propreté du filtre.'],
  mistakes:['Poser une grosse cuve sur des parpaings instables','Laisser la cuve ouverte à la lumière','Oublier le trop-plein','Faire ruisseler le débordement vers les fondations'],
  safety:"Une cuve pleine est extrêmement lourde. Le support doit être dimensionné pour la charge et la cuve doit rester inaccessible aux jeunes enfants.",
  exercise:"Exemple : pour une cuve de 300 L, prévois un emplacement stable, marque entrée, sortie et trop-plein sur un croquis avant l’installation."
 },
 'eau-2':{
  intro:"Le meilleur moyen d’économiser est d’abord de mesurer. Pendant 24 heures, note les gros usages puis attaque les plus importants : douches, WC, fuites et robinets.",
  diagram:['Mesurer','Classer','Réduire','Réparer','Re-mesurer'],
  material:['Seau gradué ou récipient connu','Chronomètre','Papier ou téléphone','Accès au compteur si disponible'],
  steps:['Mesure le débit d’un robinet : remplis un récipient pendant 10 secondes puis multiplie le volume par 6 pour obtenir des litres/minute. Exemple : 1,5 L en 10 s = 9 L/min.','Chronomètre une douche. À 9 L/min pendant 8 minutes, cela représente environ 72 L. À 5 minutes, environ 45 L.','Teste les WC : une fuite silencieuse peut être recherchée en observant si de l’eau continue de couler dans la cuvette après remplissage ou via la méthode recommandée par le fabricant.','Répare d’abord les fuites et installe des mousseurs/douchettes économes compatibles si les débits sont élevés.','Re-mesure après modification pour vérifier le gain réel au lieu de supposer.'],
  mistakes:['Acheter des équipements sans mesurer avant/après','Se concentrer sur de très petits usages en laissant une grosse fuite','Réduire excessivement un débit nécessaire à un appareil','Négliger les notices des équipements'],
  safety:"Ne modifie pas un réseau d’eau sanitaire si tu n’es pas sûr du montage. Pour les installations fixes ou douteuses, passe par un professionnel.",
  exercise:"Exemple : si ton pommeau débite 10 L/min et que tu passes de 10 à 6 minutes, tu économises environ 40 L par douche."
 },
 'eau-3':{
  intro:"Au jardin, l’objectif est de garder l’eau dans le sol et de l’amener aux racines. Un paillage et des arrosages plus profonds mais moins fréquents sont souvent plus efficaces qu’un petit arrosage superficiel quotidien.",
  diagram:['Pailler','Tester le sol','Arroser au pied','Laisser infiltrer','Recontrôler'],
  material:['Paillage végétal','Arrosoir ou goutte-à-goutte','Petit transplantoir','Récipient gradué'],
  steps:['Couvre la terre autour des plantes avec quelques centimètres de paillage, sans coller le paillis contre les tiges.','Avant d’arroser, vérifie l’humidité à quelques centimètres sous la surface.','Arrose lentement au pied. Pour apprendre à doser, mesure réellement 5 ou 10 L avec un arrosoir gradué.','Attends l’infiltration puis contrôle la profondeur humide avec un petit trou d’observation.','Adapte ensuite la fréquence au type de sol, à la plante et à la météo plutôt qu’à un calendrier fixe.'],
  mistakes:['Arroser seulement la surface','Arroser en plein vent ou aux heures très chaudes','Mouiller systématiquement le feuillage','Mettre du paillage sur un sol totalement sec sans l’avoir d’abord humidifié'],
  safety:"Les besoins varient énormément. Les quantités doivent être ajustées à la plante, au sol et au climat.",
  exercise:"Exemple : choisis deux plants similaires. Paille l’un et laisse l’autre sans paillage, puis compare l’humidité du sol 24 h après le même arrosage."
 },
 'agriculture-0':{
  intro:"Objectif : préparer une planche de 1 m × 1 m prête à recevoir des semis sans retourner profondément toute la terre.",
  diagram:['Choisir 1 m²','Désherber','Ameublir','Ajouter compost','Pailler'],
  material:['1 m² de terrain','Fourche-bêche ou grelinette','Râteau','Environ 10 à 20 L de compost mûr','Paillage végétal'],
  steps:['Choisis une zone recevant plusieurs heures de soleil et où l’eau ne stagne pas.','Retire les grosses adventices avec leurs racines.','Ameublis sur la profondeur des dents de l’outil sans retourner complètement les couches.','Étale environ 1 à 2 cm de compost mûr en surface, soit grosso modo 10 à 20 L sur 1 m².','Si tu ne sèmes pas immédiatement, protège avec un paillage léger. Pour un semis fin, écarte le paillage sur la ligne de semis.'],
  mistakes:['Ajouter une énorme quantité de compost parce que “plus = mieux”','Travailler un sol détrempé','Piétiner ensuite la planche','Enterrer un paillage grossier dans la zone de semis'],
  safety:"Les besoins en amendement dépendent du sol. Si la terre est déjà très riche, réduis l’apport.",
  exercise:"Exemple réel : fais cette planche de 1 m², puis sème une moitié en radis et garde l’autre moitié pour un autre essai. Photographier avant/après permet de comparer."
 },
 'agriculture-1':{
  intro:"Trois graines permettent d’apprendre trois logiques différentes : radis en ligne, haricot plus profond, tomate en godet.",
  diagram:['Préparer','Mesurer profondeur','Semer','Tasser léger','Garder humide'],
  material:['Graines de radis','Graines de haricot','Graines de tomate','Règle','Arrosoir à pomme fine','Étiquettes'],
  steps:['Radis : sème généralement autour de 1 cm de profondeur, en ligne, puis éclaircis selon la variété pour éviter la concurrence.','Haricot : enterre typiquement autour de 3 à 5 cm selon le sol et la variété, en respectant l’espacement indiqué sur le sachet.','Tomate : en godet, couvre très légèrement la graine, autour de 0,5 cm, puis garde le substrat humide et chaud sans le détremper.','Après chaque semis, tasse très légèrement afin que la graine touche bien le sol.','Étiquette toujours date + variété. Compare ensuite le nombre de graines semées et le nombre de plants levés.'],
  mistakes:['Semer toutes les graines à la même profondeur','Arroser avec un jet qui déplace les graines','Détremper les godets','Oublier d’éclaircir les radis'],
  safety:"Les profondeurs exactes varient selon variété et type de sol : le sachet de semences reste la référence.",
  exercise:"Exemple : sème 10 radis. Si 8 lèvent, ton taux de levée est de 80 %. Recommence en changeant un seul paramètre."
 },
 'agriculture-2':{
  intro:"Un guide simple : mesurer ce que tu apportes, vérifier jusqu’où l’eau descend et ne ré-arroser que lorsque la zone racinaire commence réellement à sécher.",
  diagram:['Mesurer 5 L','Arroser lentement','Attendre','Creuser témoin','Adapter'],
  material:['Arrosoir de 5 ou 10 L','Paillage','Petit transplantoir','Carnet'],
  steps:['Commence sur une petite zone, par exemple 1 m². Mesure 5 L dans l’arrosoir pour savoir ce que représente réellement cette quantité.','Verse lentement au pied des plantes pour éviter ruissellement.','Attends 15 à 30 minutes que l’eau se répartisse.','À côté des racines, fais un petit trou témoin et regarde jusqu’où la terre est humide.','Si seule la surface est mouillée, l’apport était trop faible ou trop rapide. Si le sol reste humide longtemps, espace davantage les arrosages.'],
  mistakes:['Arroser “5 minutes” sans connaître le débit','Ajouter un peu d’eau tous les jours sans vérifier le sol','Arroser rapidement sur une terre très sèche','Ignorer la pluie récente'],
  safety:"Il n’existe pas de quantité universelle : texture du sol, météo, taille de la plante et enracinement changent les besoins.",
  exercise:"Exemple : compare 5 L appliqués rapidement et 5 L appliqués lentement sur deux petites zones identiques, puis regarde la profondeur humide."
 },
 'agriculture-3':{
  intro:"Commence avec des espèces faciles. Le haricot est simple à sécher et stocker ; la tomate demande de récupérer puis sécher les graines.",
  diagram:['Choisir plant sain','Laisser mûrir','Prélever','Sécher','Étiqueter'],
  material:['Haricots mûrs ou tomate bien mûre','Assiette ou papier','Sachets papier','Étiquettes','Boîte sèche'],
  steps:['Haricot : laisse quelques gousses finir leur maturité sur le plant jusqu’à ce qu’elles soient bien sèches, puis récupère les graines.','Laisse encore sécher les graines quelques jours dans un endroit sec et ventilé avant stockage.','Tomate : prélève les graines d’un fruit très mûr, nettoie-les soigneusement selon la méthode choisie, puis fais-les sécher complètement en couche fine.','Stocke au sec, au frais et à l’abri de la lumière dans un sachet identifié.','Note espèce, variété, année et lieu de récolte.'],
  mistakes:['Stocker une graine encore humide','Utiliser un contenant non identifié','Prendre des graines sur un plant malade','Supposer qu’un hybride donnera exactement la même descendance'],
  safety:"Certaines variétés hybrides ou espèces à pollinisation croisée ne reproduisent pas fidèlement les caractéristiques du plant parent.",
  exercise:"Exemple : stocke 20 graines de haricot et, quelques mois plus tard, fais germer 10 graines pour mesurer leur taux de germination."
 },
 'elevage-0':{
  intro:"Avant de choisir une espèce, il faut être capable d’assurer chaque jour ses besoins physiques et comportementaux.",
  diagram:['Eau','Nourriture','Espace','Comportement','Surveillance'],
  material:['Fiche des besoins de l’espèce','Point d’eau fiable','Zone d’abri','Matériel de nettoyage','Registre simple'],
  steps:['Lister les besoins quotidiens de l’espèce.','Calculer l’espace et le temps réellement disponibles.','Prévoir une eau propre accessible en permanence selon l’espèce.','Créer des possibilités de repos, mouvement et comportement naturel.','Observer chaque jour consommation, activité et aspect général.'],
  mistakes:['Choisir uniquement selon la taille de l’animal','Sous-estimer le temps quotidien','Négliger l’ombre ou la ventilation','Changer brutalement d’alimentation'],
  safety:"Les besoins varient fortement selon l’espèce, l’âge et le climat. Les soins vétérinaires restent indispensables en cas de maladie ou blessure.",
  exercise:"Exercice : construis une fiche quotidienne avec 5 indicateurs observables et teste-la pendant une semaine."
 },
 'elevage-1':{
  intro:"Un bon habitat protège sans enfermer dans un air humide ou vicié. Il reste sec, ventilé, nettoyable et adapté au comportement de l’animal.",
  diagram:['Protéger','Ventiler','Garder sec','Nettoyer','Observer'],
  material:['Abri adapté','Litière','Mangeoires et abreuvoirs','Matériel de nettoyage','Zones d’ombre'],
  steps:['Protéger des intempéries et des prédateurs adaptés au contexte.','Assurer une circulation d’air sans courant direct excessif.','Évacuer l’eau et garder une zone de couchage sèche.','Nettoyer à une fréquence adaptée à la densité et à l’espèce.','Observer où les animaux choisissent naturellement de se placer.'],
  mistakes:['Fermer totalement un abri pour garder la chaleur','Laisser l’eau stagner','Mettre nourriture et déjections trop proches','Créer un sol impossible à nettoyer'],
  safety:"Un habitat propre n’est pas forcément stérile ; l’objectif est de réduire humidité, parasites et accumulation de déchets.",
  exercise:"Exercice : dessine le plan d’un habitat avec zones eau, nourriture, repos, ombre et nettoyage."
 },
 'elevage-2':{
  intro:"La détection précoce repose souvent sur un principe simple : connaître le comportement normal pour repérer vite ce qui change.",
  diagram:['Regarder','Comparer','Noter','Isoler si besoin','Consulter'],
  material:['Carnet ou tableau','Balance si adaptée','Éclairage correct','Zone calme d’observation'],
  steps:['Observer appétit, eau, posture, déplacement et interactions.','Comparer avec les habitudes individuelles.','Noter les changements plutôt que de se fier à la mémoire.','Limiter le stress et séparer temporairement si la sécurité du groupe l’exige.','Contacter un professionnel lorsque les signes persistent ou sont inquiétants.'],
  mistakes:['Attendre une aggravation visible','Changer plusieurs choses à la fois','Forcer un animal stressé','Donner un traitement non adapté sans avis'],
  safety:"Ce module apprend l’observation, pas le diagnostic médical. En cas de doute sérieux, consulter un vétérinaire.",
  exercise:"Exercice : crée une ligne de base de 7 jours sur appétit, activité et comportement."
 },
 'elevage-3':{
  intro:"Comprendre le cycle de vie permet d’anticiper espace, alimentation, séparation, renouvellement et responsabilité sur plusieurs années.",
  diagram:['Naissance','Croissance','Maturité','Reproduction','Vieillissement'],
  material:['Calendrier','Fiches individuelles','Plan de capacité maximale','Zones séparables'],
  steps:['Connaître la durée approximative des grandes étapes de vie.','Adapter alimentation et espace à l’âge.','Éviter les reproductions non planifiées.','Prévoir l’accueil des jeunes avant toute reproduction.','Intégrer vieillissement et fin de vie dans la responsabilité d’élevage.'],
  mistakes:['Raisonner uniquement à court terme','Sous-estimer le nombre d’animaux après reproduction','Mélanger des âges incompatibles','Ne pas prévoir de solution pour les jeunes'],
  safety:"La reproduction doit être planifiée selon la santé, le bien-être, l’espace disponible et la réglementation locale.",
  exercise:"Exercice : fais un calendrier d’un cycle complet pour une espèce et liste les besoins qui changent à chaque étape."
 },
 'metallurgie-0':{
  intro:"Avant de couper ou percer une pièce, identifie au moins sa famille. Acier, inox, aluminium et cuivre ne se travaillent pas exactement de la même manière.",
  diagram:['Observer','Aimant','Comparer poids','Regarder corrosion','Choisir usage'],
  material:['Aimant','Balance simple','Échantillons connus','Lunettes de protection','Fiche de comparaison'],
  steps:['Acier courant : souvent magnétique, relativement lourd, rouille brun-orangé si non protégé.','Inox : aspect proche de l’acier ; certains inox sont peu ou pas magnétiques, donc l’aimant seul ne suffit pas.','Aluminium : beaucoup plus léger à volume égal et non magnétique.','Cuivre : couleur rouge-orangée caractéristique ; il peut verdir en vieillissant.','Si le métal est peint, galvanisé ou inconnu, traite-le comme matériau non identifié et évite chauffe/meulage avant identification fiable.'],
  mistakes:['Identifier uniquement avec un aimant','Confondre acier galvanisé et métal “sans risque à chauffer”','Couper un revêtement inconnu sans précaution','Choisir un métal uniquement pour son apparence'],
  safety:"Ne chauffe ni ne soude un métal inconnu ou galvanisé : certains revêtements peuvent libérer des fumées dangereuses.",
  exercise:"Exemple : prends une vis en acier, une canette en aluminium et un morceau de cuivre. Compare aimant, masse relative, couleur et corrosion."
 },
 'metallurgie-1':{
  intro:"Exemple concret : percer un trou dans une petite patte d’acier doux puis l’assembler avec un boulon. Le point essentiel est de fixer la pièce : jamais la tenir à la main.",
  diagram:['Tracer','Pointer','Serrer','Percer','Ébavurer'],
  material:['Pièce d’acier doux identifiée','Étau ou serre-joints','Pointeau','Perceuse','Foret HSS adapté','Lunettes de protection','Boulon + rondelles + écrou'],
  steps:['Trace précisément le centre du trou.','Marque un petit creux au pointeau pour empêcher le foret de glisser.','Serre fermement la pièce dans un étau ou sur un support stable.','Perce perpendiculairement avec un foret adapté au métal. Pour un diamètre important, un avant-trou peut faciliter le travail. Adapte la vitesse au diamètre du foret et aux recommandations du fabricant ; plus le foret est gros, plus la vitesse doit généralement être réduite.','Ébavure le trou puis assemble avec boulon, rondelles et écrou sans serrer au point de déformer la pièce.'],
  mistakes:['Tenir la pièce d’une main pendant le perçage','Percer trop vite avec un gros foret','Mettre les doigts près du foret pour retenir la pièce','Laisser une grosse bavure coupante après perçage'],
  safety:"Lunettes obligatoires. Attache cheveux et vêtements amples. Les gants peuvent s’accrocher aux outils rotatifs : ne les utilise pas près d’un foret en rotation sauf procédure spécifiquement prévue.",
  exercise:"Exemple : sur une chute d’acier doux, réalise un trou de petit diamètre, ébavure-le et monte un boulon avec deux rondelles. Le résultat doit être propre, sans jeu excessif ni arête vive."
 },
 'metallurgie-2':{
  intro:"Exemple concret : remettre en état une petite équerre en acier rouillée sans la remplacer.",
  diagram:['Décaper','Dégraisser','Inspecter','Apprêter','Peindre'],
  material:['Brosse métallique manuelle ou abrasif adapté','Chiffon','Dégraissant compatible','Primaire anticorrosion','Peinture métal','Lunettes et masque adaptés aux poussières/produits'],
  steps:['Retire la rouille non adhérente et la peinture qui se décolle.','Dépoussière puis dégraisse la surface selon les instructions du produit.','Inspecte : si la corrosion a profondément aminci ou perforé la pièce structurelle, ne te contente pas de peindre — remplace ou fais vérifier la pièce.','Applique un primaire anticorrosion compatible avec le métal et respecte le temps de séchage fabricant.','Applique la finition métal en couvrant aussi les arêtes et zones de fixation.'],
  mistakes:['Peindre directement sur de la rouille friable','Enfermer de l’humidité sous la peinture','Négliger les chants et perçages','Réutiliser une pièce structurelle fortement amincie'],
  safety:"Poussières de peinture ancienne et revêtements inconnus peuvent être dangereux. Évite le ponçage agressif d’un revêtement inconnu et respecte les fiches de sécurité des produits.",
  exercise:"Exemple : traite une petite équerre non structurelle rouillée, photographie chaque étape et vérifie après quelques semaines si la rouille réapparaît."
 },
 'metallurgie-3':{
  intro:"Un atelier métal sûr sépare chaleur, étincelles, stockage, circulation et opérations produisant poussières ou fumées.",
  diagram:['Délimiter','Ventiler','Protéger','Ranger','Vérifier'],
  material:['Lunettes ou écran facial selon opération','Gants adaptés à la tâche','Extincteur approprié','Rangement métal','Ventilation adaptée'],
  steps:['Définir une zone chaude clairement identifiable.','Éloigner les matériaux combustibles et garder les passages libres.','Prévoir captation ou ventilation selon les opérations.','Ranger outils et pièces chaudes de façon non ambiguë.','Faire une vérification de fin de séance : chaleur résiduelle, étincelles, alimentation, rangement.'],
  mistakes:['Mettre toutes les protections dans une seule catégorie','Utiliser des gants près de machines rotatives quand ils créent un risque d’entraînement','Laisser solvants ou bois près de la zone d’étincelles','Négliger la ventilation'],
  safety:"Chaque opération a ses propres risques. Les consignes du fabricant, la réglementation et une formation pratique priment toujours.",
  exercise:"Exercice : dessine le plan d’un atelier en séparant zone chaude, découpe, stockage, circulation et ventilation."
 }
};

const knowledge=[];
domains.forEach(d=>raw[d.id].forEach((item,i)=>knowledge.push({
 id:d.id+'-'+i,domain:d.id,title:item[0],summary:item[1],level:item[2],group:d.group
})));

const genericDetail=(item)=>{
 const domain=domains.find(d=>d.id===item.domain);
 return {
  intro:item.summary+" Cette fiche pose un socle pratique : observer, comprendre le principe, essayer à petite échelle et vérifier le résultat.",
  diagram:['Observer','Comprendre','Préparer','Faire','Vérifier'],
  material:['Carnet de notes','Matériel adapté au contexte','Protection adaptée si nécessaire','Un espace d’essai limité'],
  steps:['Observer la situation avant toute action.','Identifier le résultat recherché et la contrainte principale.','Préparer le matériel et réduire les risques évidents.','Réaliser un premier essai simple et réversible.','Comparer le résultat attendu au résultat réel et noter ce qui change.'],
  mistakes:['Agir sans observer','Copier une méthode sans l’adapter au lieu','Changer plusieurs paramètres en même temps','Ne pas conserver de trace de l’essai'],
  safety:"Commencer à petite échelle permet d’apprendre sans gaspiller de ressources ni dégrader le milieu.",
  exercise:"Exercice : réalise une observation ou un mini-essai de 15 minutes lié à « "+item.title+" » et note trois choses apprises.",
  domain
 };
};

let activeDomain='all',activeGroup='all';

function domainById(id){return domains.find(d=>d.id===id)}
function renderFilters(){
 const gs=[['all','Tout'],['foundations','Fondamentaux'],['materials','Matières & outils'],['skills','Savoir-faire'],['autonomy','Autonomie']];
 filters.innerHTML=gs.map(([id,n])=>'<button class="filter '+(activeGroup===id?'active':'')+'" data-group="'+id+'">'+n+'</button>').join('');
 filters.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>{activeGroup=b.dataset.group;activeDomain='all';renderAll()});
}
function renderRail(){
 rail.innerHTML='<button class="domainButton '+(activeDomain==='all'?'active':'')+'" data-d="all"><i>✣</i><strong>Tous les domaines</strong><small>52</small></button>'+
 domains.map(d=>'<button class="domainButton '+(activeDomain===d.id?'active':'')+'" data-d="'+d.id+'"><i>'+d.icon+'</i><span><strong>'+d.name+'</strong></span><small>4</small></button>').join('');
 rail.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{activeDomain=b.dataset.d;renderAll()});
}
function filteredKnowledge(){
 const q=search.value.trim().toLocaleLowerCase('fr');
 return knowledge.filter(k=>{
  const d=domainById(k.domain);
  const hitDomain=activeDomain==='all'||k.domain===activeDomain;
  const hitGroup=activeGroup==='all'||k.group===activeGroup;
  const hitText=!q||(k.title+' '+k.summary+' '+d.name).toLocaleLowerCase('fr').includes(q);
  return hitDomain&&hitGroup&&hitText;
 });
}
function renderGrid(){
 const list=filteredKnowledge();
 grid.innerHTML=list.length?list.map((k,i)=>{
  const d=domainById(k.domain);
  const num=String(i+1).padStart(2,'0');
  return '<button class="lessonCard lessonCard--'+d.id+'" data-lesson="'+k.id+'">'+
    '<div class="lessonCard__visual"><span class="lessonCard__icon">'+d.icon+'</span></div>'+
    '<div class="lessonCard__copy">'+
      '<div class="lessonCard__number">'+num+'</div>'+
      '<div class="lessonCard__meta">'+d.name+' · '+k.level+'</div>'+
      '<h3>'+k.title+'</h3><p>'+k.summary+'</p>'+
      '<span class="lessonCard__read">Lire le savoir <b>→</b></span>'+
    '</div></button>';
 }).join(''):'<div class="empty">Aucun savoir ne correspond à cette recherche.</div>';
 grid.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>openLesson(b.dataset.lesson));
}
function renderAll(){renderFilters();renderRail();renderGrid()}

function openLibrary(target='all'){
 library.classList.add('open');library.setAttribute('aria-hidden','false');
 lesson.classList.remove('open');lesson.setAttribute('aria-hidden','true');
 if(target==='all'){activeDomain='all';activeGroup='all'}
 else if(['foundations','materials','skills','autonomy'].includes(target)){activeGroup=target;activeDomain='all'}
 else {activeDomain=target;activeGroup='all'}
 renderAll();setTimeout(()=>search.focus({preventScroll:true}),350);
}
function closeLibrary(){library.classList.remove('open');library.setAttribute('aria-hidden','true');lesson.classList.remove('open')}
document.querySelectorAll('[data-open-library]').forEach(b=>b.onclick=()=>openLibrary(b.dataset.openLibrary));
document.querySelectorAll('[data-domain]').forEach(b=>b.onclick=()=>openLibrary(b.dataset.domain));
document.querySelectorAll('[data-close-library]').forEach(b=>b.onclick=closeLibrary);
search.addEventListener('input',renderGrid);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(lesson.classList.contains('open'))closeLesson();else closeLibrary()}});

function openLesson(id){
 const item=knowledge.find(k=>k.id===id);if(!item)return;
 const d=domainById(item.domain);
 const x={...genericDetail(item),...(detail[id]||{})};
 lesson.innerHTML='<div class="lesson__top"><div><div class="lesson__eyebrow">'+d.name+' · '+item.level+'</div><h2>'+item.title+'</h2></div><button class="lesson__back" data-back>← Retour aux savoirs</button></div>'+
 '<p class="lesson__intro">'+x.intro+'</p>'+
 '<div class="lesson__diagram">'+x.diagram.map((s,i)=>'<div class="diagramStep"><b>0'+(i+1)+'</b><span>'+s+'</span></div>').join('')+'</div>'+
 '<div class="lesson__blocks">'+
 '<section class="lessonBlock"><h3>Matériel / repères</h3><ul>'+x.material.map(v=>'<li>'+v+'</li>').join('')+'</ul></section>'+
 '<section class="lessonBlock"><h3>Gestes essentiels</h3><ol>'+x.steps.map(v=>'<li>'+v+'</li>').join('')+'</ol></section>'+
 '<section class="lessonBlock"><h3>Erreurs à éviter</h3><ul>'+x.mistakes.map(v=>'<li>'+v+'</li>').join('')+'</ul></section>'+
 '<section class="lessonBlock"><h3>Ce qu’il faut retenir</h3><ul><li>Comprendre le principe avant de chercher la vitesse.</li><li>Mesurer ce qu’on fait plutôt que travailler “au feeling”.</li><li>Observer le résultat réel et corriger un seul paramètre à la fois.</li></ul></section>'+
 '</div><div class="lesson__safety"><b>Sécurité & contexte.</b> '+x.safety+'</div><div class="lesson__exercise"><b>Exemple / exercice concret.</b> '+x.exercise+'</div>';
 lesson.classList.add('open');lesson.setAttribute('aria-hidden','false');lesson.scrollTop=0;
 lesson.querySelector('[data-back]').onclick=closeLesson;
}
function closeLesson(){lesson.classList.remove('open');lesson.setAttribute('aria-hidden','true')}

/* Parallax constrained so image edges never appear */
let targetX=0,targetY=0,currentX=0,currentY=0;
function pointerMove(x,y){targetX=(x/innerWidth-.5)*2;targetY=(y/innerHeight-.5)*2}
if(!reduced){addEventListener('pointermove',e=>pointerMove(e.clientX,e.clientY),{passive:true});addEventListener('touchmove',e=>{const t=e.touches[0];if(t)pointerMove(t.clientX,t.clientY)},{passive:true})}
function animateParallax(){if(!reduced){currentX+=(targetX-currentX)*.032;currentY+=(targetY-currentY)*.032;const x=currentX*-13,y=currentY*-8;bg.style.transform='scale(1.07) translate3d('+x+'px,'+y+'px,0)'}requestAnimationFrame(animateParallax)}animateParallax();

/* Ambient fireflies + falling petals */
let W=0,H=0,dpr=1,fireflies=[],petals=[];
const rnd=(a,b)=>a+Math.random()*(b-a);
function makePetal(randomY=false){return{x:rnd(-40,W+40),y:randomY?rnd(-H*.2,H):rnd(-100,-15),s:rnd(2.2,6),vy:rnd(.18,.62),vx:rnd(-.16,.18),rot:rnd(0,6.28),vr:rnd(-.012,.012),phase:rnd(0,6.28),a:rnd(.2,.72)}}
function resetCanvas(){dpr=Math.min(devicePixelRatio||1,1.6);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const fc=Math.max(18,Math.min(48,Math.floor(W/34)));const pc=Math.max(24,Math.min(62,Math.floor(W/27)));fireflies=Array.from({length:fc},()=>({x:rnd(W*.38,W*.95),y:rnd(H*.13,H*.78),r:rnd(.7,1.8),vx:rnd(-.09,.09),vy:rnd(-.055,.055),p:rnd(0,6.28),a:rnd(.15,.72)}));petals=Array.from({length:pc},()=>makePetal(true))}
function drawAmbient(t){ctx.clearRect(0,0,W,H);fireflies.forEach(f=>{f.p+=.008;f.x+=f.vx+Math.sin(f.p)*.035;f.y+=f.vy+Math.cos(f.p*.8)*.025;if(f.x<0)f.x=W;if(f.x>W)f.x=0;if(f.y<0)f.y=H;if(f.y>H)f.y=0;const pulse=.52+.48*Math.sin(t*.0018+f.p*2);const g=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.r*8);g.addColorStop(0,'rgba(255,232,156,'+(f.a*pulse)+')');g.addColorStop(.18,'rgba(246,211,121,'+(f.a*.55*pulse)+')');g.addColorStop(1,'rgba(255,210,120,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(f.x,f.y,f.r*8,0,Math.PI*2);ctx.fill()});petals.forEach((p,i)=>{p.y+=p.vy;p.x+=p.vx+Math.sin(t*.00065+p.phase)*.24;p.rot+=p.vr;if(p.y>H+30||p.x<-60||p.x>W+60)petals[i]=makePetal(false);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=p.a;ctx.fillStyle='rgba(238,158,184,.9)';ctx.beginPath();ctx.ellipse(0,0,p.s,p.s*.48,.25,0,Math.PI*2);ctx.fill();ctx.restore()});requestAnimationFrame(drawAmbient)}
resetCanvas();addEventListener('resize',resetCanvas);requestAnimationFrame(drawAmbient);
renderAll();