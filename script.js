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
 ['Lire le cycle de l’eau','Comprendre où l’eau tombe, circule, s’infiltre et repart.','Débutant'],
 ['Collecter l’eau de pluie','Dimensionner une collecte simple et limiter les pertes.','Pratique'],
 ['Économiser l’eau','Repérer les gros usages et réduire sans perdre en confort.','Pratique'],
 ['Rendre une eau plus sûre','Comprendre les risques, la filtration et la désinfection.','Essentiel']
],
sol:[
 ['Lire un sol','Texture, structure, humidité, matière organique et vie visible.','Débutant'],
 ['Nourrir le sol','Compost, couverture, résidus végétaux et rotations.','Pratique'],
 ['Limiter l’érosion','Ralentir l’eau, protéger la surface, garder des racines.','Pratique'],
 ['Tester sans laboratoire','Petits tests d’observation pour comparer deux parcelles.','Atelier']
],
agriculture:[
 ['Préparer une planche de culture','Créer une zone cultivable sans épuiser le sol.','Pratique'],
 ['Semer avec régularité','Profondeur, espacement, humidité et levée.','Pratique'],
 ['Arroser intelligemment','Observer avant d’arroser et viser les racines.','Essentiel'],
 ['Récolter et produire ses graines','Récolter au bon stade et conserver des semences.','Avancé']
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
 ['Reconnaître les métaux courants','Fer, acier, cuivre, aluminium : indices et usages.','Débutant'],
 ['Comprendre la forge','Chaleur, plasticité, déformation et refroidissement.','Pratique'],
 ['Comprendre les alliages','Pourquoi mélanger les métaux change leurs propriétés.','Essentiel'],
 ['Organiser un atelier métal sûr','Chaleur, fumées, étincelles, EPI et zones de travail.','Sécurité']
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
 'agriculture-0':{
  intro:"Une bonne planche de culture commence par le sol existant. Le but n’est pas de tout retourner, mais de créer une zone facile à travailler, fertile et protégée.",
  diagram:['Observer','Délimiter','Ameublir','Nourrir','Couvrir'],
  material:['Fourche-bêche ou grelinette','Râteau','Compost mûr','Paillage végétal','Cordeau ou repères'],
  steps:['Choisir une zone recevant assez de lumière et observer où l’eau s’accumule.','Délimiter une largeur accessible depuis les côtés pour éviter de piétiner la zone cultivée.','Ameublir sans pulvériser la structure du sol.','Ajouter une couche raisonnable de compost mûr en surface.','Couvrir le sol pour limiter évaporation, battance et adventices.'],
  mistakes:['Piétiner la planche après préparation','Enfouir de grandes quantités de matière fraîche','Laisser le sol nu longtemps','Arroser automatiquement sans observer l’humidité'],
  safety:"Commencer petit permet d’apprendre le comportement réel du sol avant d’étendre la surface.",
  exercise:"Exercice : prépare 1 m², photographie l’état initial, note l’humidité et observe l’évolution pendant 14 jours."
 },
 'agriculture-1':{
  intro:"Le semis devient fiable quand quatre paramètres sont maîtrisés : profondeur, contact avec le sol, humidité et espacement.",
  diagram:['Choisir','Tracer','Semer','Recouvrir','Maintenir humide'],
  material:['Graines identifiées','Règle ou repère de profondeur','Terreau ou sol fin','Arrosoir à pomme fine','Étiquettes'],
  steps:['Lire la profondeur et la période adaptées à l’espèce.','Tracer une ligne ou préparer des godets réguliers.','Déposer les graines sans les concentrer au même endroit.','Recouvrir légèrement puis tasser doucement pour assurer le contact.','Maintenir humide mais non détrempé jusqu’à la levée.'],
  mistakes:['Semer trop profond','Noyer le substrat','Oublier d’étiqueter','Semer trop dense puis laisser les plants se concurrencer'],
  safety:"La régularité compte davantage que la quantité de graines semées.",
  exercise:"Exercice : sème la même espèce à trois profondeurs différentes et compare vitesse et taux de levée."
 },
 'agriculture-2':{
  intro:"Arroser correctement consiste surtout à savoir quand ne pas arroser. On vise la zone racinaire et on privilégie des apports adaptés au sol.",
  diagram:['Observer','Tester','Arroser','Laisser infiltrer','Contrôler'],
  material:['Arrosoir ou tuyau à débit doux','Paillage','Petit repère de profondeur','Carnet d’observation'],
  steps:['Observer la plante et la surface du sol.','Vérifier l’humidité sous la surface avec un doigt ou un petit outil.','Arroser lentement au pied pour limiter ruissellement et évaporation.','Laisser l’eau s’infiltrer avant de rajouter.','Noter combien de temps le sol reste humide selon la météo.'],
  mistakes:['Arroser tous les jours par habitude','Mouiller surtout les feuilles','Arroser trop vite sur sol sec','Confondre surface sèche et sol sec en profondeur'],
  safety:"Adapter la fréquence au climat, au sol et à la plante : il n’existe pas de calendrier universel.",
  exercise:"Exercice : pendant une semaine, n’arrose qu’après un contrôle réel de l’humidité et note la différence."
 },
 'agriculture-3':{
  intro:"Produire ses graines demande de laisser certains plants accomplir tout leur cycle et de récolter seulement à maturité.",
  diagram:['Sélectionner','Laisser mûrir','Récolter','Sécher','Étiqueter'],
  material:['Sachets papier','Étiquettes','Ciseaux propres','Plateau de séchage','Boîte sèche'],
  steps:['Choisir des plants sains et représentatifs.','Laisser fleurs, fruits ou graines parvenir à maturité.','Récolter par temps sec si possible.','Sécher complètement avant stockage.','Étiqueter espèce, variété, date et lieu.'],
  mistakes:['Récolter trop tôt','Stocker humide','Mélanger des lots non identifiés','Supposer que toutes les variétés se reproduisent fidèlement'],
  safety:"Certaines espèces se croisent facilement ; apprendre leur mode de reproduction améliore la fidélité des semences.",
  exercise:"Exercice : conserve un petit lot bien identifié et teste son taux de germination quelques mois plus tard."
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
  intro:"Reconnaître un métal ne repose jamais sur un seul indice. On combine aspect, densité, magnétisme, corrosion et contexte d’usage.",
  diagram:['Observer','Soupeser','Tester aimant','Lire corrosion','Comparer'],
  material:['Aimant','Balance simple','Échantillons connus','Lunettes de protection','Fiche de comparaison'],
  steps:['Observer couleur, finition et traces de corrosion.','Comparer le poids de pièces de volume proche.','Tester le magnétisme sans en faire une preuve absolue.','Observer la forme de la corrosion et l’usage de la pièce.','Comparer avec un échantillon dont la nature est connue.'],
  mistakes:['Identifier uniquement à la couleur','Supposer que tout métal magnétique est identique','Limer ou chauffer un métal inconnu','Ignorer les revêtements de surface'],
  safety:"Ne jamais chauffer, meuler ou souder un métal inconnu : certains revêtements ou alliages peuvent produire des fumées dangereuses.",
  exercise:"Exercice : rassemble 5 objets métalliques courants et crée une fiche d’indices sans les endommager."
 },
 'metallurgie-1':{
  intro:"La forge exploite le fait qu’un métal devient plus facile à déformer dans certaines plages de température. Le geste transforme progressivement la forme.",
  diagram:['Chauffer','Positionner','Frapper','Contrôler','Laisser refroidir'],
  material:['Enclume ou masse adaptée','Marteau de forge','Pinces','Protection des yeux','Vêtements adaptés et zone ventilée'],
  steps:['Comprendre d’abord la fonction de chaque outil et la zone de travail.','Chauffer uniquement un matériau connu dans un équipement prévu pour cela.','Maintenir la pièce avec un outil adapté, jamais à la main.','Déformer progressivement en contrôlant régulièrement la forme.','Déposer les pièces chaudes dans une zone clairement dédiée.'],
  mistakes:['Travailler un métal inconnu','Porter des vêtements synthétiques exposés aux étincelles','Laisser des pièces chaudes parmi des pièces froides','Travailler dans un espace mal ventilé'],
  safety:"La forge implique chaleur extrême, projections et risques d’incendie. Elle nécessite équipement adapté, ventilation, zone dégagée et apprentissage encadré.",
  exercise:"Exercice sans chauffe : entraîne-toi d’abord au contrôle du marteau sur pâte à modeler ou argile pour comprendre comment les coups déplacent la matière."
 },
 'metallurgie-2':{
  intro:"Un alliage associe plusieurs éléments pour obtenir un compromis de propriétés : dureté, résistance, corrosion, facilité de fabrication ou masse.",
  diagram:['Métal de base','Ajout','Mélange','Structure','Propriété'],
  material:['Tableau de métaux courants','Échantillons finis','Loupe','Fiches techniques simples'],
  steps:['Comparer métal pur et alliage dans des usages réels.','Identifier la propriété recherchée : dureté, corrosion, masse, conductivité.','Relier quelques familles connues à leur usage.','Comprendre qu’une petite variation de composition peut changer le comportement.','Utiliser les désignations normalisées lorsque disponibles.'],
  mistakes:['Croire qu’un alliage est toujours plus solide','Confondre dureté et ténacité','Déduire la composition d’un simple aspect','Fondre des métaux sans connaître leur nature'],
  safety:"L’étude des alliages peut se faire sans fusion. La fusion exige des installations et des protections spécifiques.",
  exercise:"Exercice : compare les usages de l’acier, de l’inox, du laiton et de l’aluminium et note la propriété principale recherchée."
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
 '<section class="lessonBlock"><h3>Ce qu’il faut retenir</h3><ul><li>Comprendre le principe avant de chercher la vitesse.</li><li>Tester à petite échelle.</li><li>Observer le résultat réel et transmettre ce qui fonctionne.</li></ul></section>'+
 '</div><div class="lesson__safety"><b>Sécurité & contexte.</b> '+x.safety+'</div><div class="lesson__exercise"><b>À faire maintenant.</b> '+x.exercise+'</div>';
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