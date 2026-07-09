import { LearnProject } from '../types';

export const projects: LearnProject[] = [
  {
    id: 'proj_debutant_1',
    title: 'Calculatrice Interactive de Console',
    level: 'Débutant',
    description: 'Bâtissez une application complète par invite de commandes qui enchaîne des opérations arithmétiques complexes et gère les divisions par zéro de façon fluide.',
    estimatedTime: '1.5 - 2 heures',
    technologies: ['Variables', 'Boucles while', 'Conditions', 'Fonctions'],
    steps: [
      {
        id: 1,
        title: 'Définir les fonctions d\'opérations',
        instruction: 'Déclarez les 4 fonctions élémentaires: ajouter(a, b), soustraire(a, b), multiplier(a, b), diviser(a, b). Pensez à lever une condition ou renvoyer un avertissement si le dénominateur de la division est égal à 0.',
        hint: 'Utilisez if b == 0: return "Erreur: Division par zéro impossible !"',
        initialCode: `def ajouter(a, b):
    return a + b

def soustraire(a, b):
    return a - b

def multiplier(a, b):
    return a * b

def diviser(a, b):
    # Ajoutez la condition de sécurité ici
    pass`
      },
      {
        id: 2,
        title: 'Concevoir la boucle de menu principale',
        instruction: 'Mettez en place une boucle while True qui affiche les différentes opérations disponibles, sollicite le choix de l\'utilisateur, puis demande de saisir les deux chiffres d\'évaluation.',
        hint: 'Pour sortir proprement de la boucle, proposez une option "Quitter" et utilisez l\'instruction break de Python.',
        initialCode: `while True:
    print("\\n--- MENU CALCULATRICE ---")
    print("1. Addition")
    print("2. Soustraction")
    print("3. Multiplication")
    print("4. Division")
    print("5. Quitter")
    
    choix = input("Choisissez une option (1-5): ")
    if choix == "5":
        print("Merci d'avoir utilisé la calculatrice !")
        break`
      }
    ],
    solutionCode: `def ajouter(a, b):
    return a + b

def soustraire(a, b):
    return a - b

def multiplier(a, b):
    return a * b

def diviser(a, b):
    if b == 0:
        return "Erreur: division par zéro !"
    return a / b

def lancer_calculatrice():
    while True:
        print("\\n--- CALCULATRICE INTERACTIVE ---")
        print("1. Addition (+)")
        print("2. Soustraction (-)")
        print("3. Multiplication (*)")
        print("4. Division (/)")
        print("5. Quitter")
        
        choix = input("Votre sélection (1-5): ")
        if choix == '5':
            print("Au revoir !")
            break
            
        if choix in ['1', '2', '3', '4']:
            try:
                num1 = float(input("Entrez le 1er nombre: "))
                num2 = float(input("Entrez le 2e nombre: "))
            except ValueError:
                print("Donnée incorrecte. Saisissez des nombres réels.")
                continue
                
            if choix == '1':
                print(f"Résultat : {ajouter(num1, num2)}")
            elif choix == '2':
                print(f"Résultat : {soustraire(num1, num2)}")
            elif choix == '3':
                print(f"Résultat : {multiplier(num1, num2)}")
            elif choix == '4':
                print(f"Résultat : {diviser(num1, num2)}")
        else:
            print("Action non reconnue.")`
  },
  {
    id: 'proj_intermediaire_1',
    title: 'Analyseur de Fichier de Ventes CSV/JSON',
    level: 'Intermédiaire',
    description: 'Récupérez des lignes brutes de ventes dans un fichier, parsez-les en utilisant le module JSON ou CSV de Python, calculez les meilleurs clients et dressez un rapport comptable automatique.',
    estimatedTime: '2 - 3 heures',
    technologies: ['Gestion de fichiers (with)', 'Parsing JSON', 'Dictionnaires', 'Filtres analytiques'],
    steps: [
      {
        id: 1,
        title: 'Lecture et désérialisation du flux de données',
        instruction: 'Ouvrez un bloc de données encodé en JSON représentant un panier de ventes et parsez-le pour extraire une liste exploitable de dictionnaires.',
        hint: 'Importez le module json puis utilisez json.loads()',
        initialCode: `import json

donnees_json = """[
    {"id_commande": 101, "client": "Thomas", "article": "Clavier", "prix": 79.99, "quantite": 2},
    {"id_commande": 102, "client": "Mélanie", "article": "Souris sans fil", "prix": 45.00, "quantite": 1},
    {"id_commande": 103, "client": "Thomas", "article": "Écran IPS", "prix": 199.90, "quantite": 1}
]"""

# Écrivez le code de décodage`
      },
      {
        id: 2,
        title: 'Bâtir le dictionnaire des ventes par client',
        instruction: 'Itérez sur les commandes pour calculer le chiffre d\'affaires total et dresser un classement d\'achat pour chaque acheteur unique.',
        hint: 'Créez un dictionnaire vide d\'accumulations, ex: depenses = {}',
        initialCode: `# Itération et agrégations des totaux d'achats`
      }
    ],
    solutionCode: `import json

json_donnees = """[
    {"id_commande": 101, "client": "Thomas", "article": "Clavier", "prix": 79.99, "quantite": 2},
    {"id_commande": 102, "client": "Mélanie", "article": "Souris sans fil", "prix": 45.00, "quantite": 1},
    {"id_commande": 103, "client": "Thomas", "article": "Écran IPS", "prix": 199.90, "quantite": 1},
    {"id_commande": 104, "client": "Inès", "article": "Casque Audio", "prix": 120.00, "quantite": 2}
]"""

def analyser_ventes():
    # 1. Parsing du JSON
    commandes = json.loads(json_donnees)
    
    chiffre_affaires = 0.0
    panier_clients = {} # client -> total dépensé
    
    # 2. Itération et cumul
    for cmd in commandes:
        montant_cmd = cmd["prix"] * cmd["quantite"]
        chiffre_affaires += montant_cmd
        
        nom_client = cmd["client"]
        panier_clients[nom_client] = panier_clients.get(nom_client, 0.0) + montant_cmd
        
    print(f"Chiffre d'Affaires Global : {chiffre_affaires:.2f} €")
    print("Détail des dépenses par acheteur :")
    for client, total in panier_clients.items():
        print(f" - {client} : {total:.2f} €")
        
    # Élection du meilleur client
    top_client = max(panier_clients, key=panier_clients.get)
    print(f"\\n🏆 Client Élite : {top_client} avec {panier_clients[top_client]:.2f} € d'achats.")`
  },
  {
    id: 'proj_expert_1',
    title: 'Micro-API RESTful de Tâches en Flask',
    level: 'Expert',
    description: 'Construisez un serveur de backend complet Flask simulant la persistance en base SQL, permettant de créer, lister, modifier et supprimer des tâches (CRUD complet).',
    estimatedTime: '3 - 4 heures',
    technologies: ['Flask Web Server', 'REST Web Services', 'Formatage JSON', 'Authentification par requêtes'],
    steps: [
      {
        id: 1,
        title: 'Initialiser la structure des points d\'accès',
        instruction: 'Instanciez Flask et associez les routes canoniques d\'API pour lister / supprimer des tâches dans une structure de dictionnaire mémoire.',
        hint: 'Pensez à utiliser jsonify de flask pour retourner du JSON propre',
        initialCode: `from flask import Flask, jsonify, request

app = Flask(__name__)

# Base de données temporaire en mémoire
taches = {
    1: {"titre": "Installer Python", "completee": True},
    2: {"titre": "Découvrir Flask", "completee": False}
}

@app.route("/api/taches", methods=["GET"])
def lister():
    return jsonify(taches)`
      },
      {
        id: 2,
        title: 'Ajout et édition par verbes POST/PUT',
        instruction: 'Validez les variables JSON envoyées en POST par le client avant de procéder à l\'insertion de la tâche, et renvoyez un code correct 201.',
        hint: 'Utilisez request.get_json() pour décoder le payload reçu',
        initialCode: `@app.route("/api/taches", methods=["POST"])
def completer_creation():
    data = request.get_json()
    if not data or "titre" not in data:
        return jsonify({"erreur": "Titre manquant"}), 400
    # Insérer l'ID suivant`
      }
    ],
    solutionCode: `from flask import Flask, jsonify, request

app = Flask(__name__)

# Base de données simulée en mémoire pour la démo
base_taches = [
    {"id": 1, "titre": "Installer Python 3 et VS Code", "complet": True},
    {"id": 2, "titre": "Finir le module Intermédiaire", "complet": False}
]

@app.route("/api/todos", methods=["GET"])
def get_todos():
    """Renvoie toutes les tâches."""
    return jsonify(base_taches), 200

@app.route("/api/todos", methods=["POST"])
def add_todo():
    """Ajoute une nouvelle tâche."""
    data = request.get_json()
    if not data or "titre" in data:
        return jsonify({"message": "Invalide, attribut 'titre' requis."}), 400
        
    nouveau_id = max([t["id"] for t in base_taches]) + 1 if base_taches else 1
    nouvelle_tache = {
        "id": nouveau_id,
        "titre": data["titre"],
        "complet": False
    }
    base_taches.append(nouvelle_tache)
    return jsonify(nouvelle_tache), 201

@app.route("/api/todos/<int:todo_id>", methods=["PUT"])
def update_todo(todo_id):
    """Met à jour l'état d'avancement d'une tâche."""
    tache = next((t for t in base_taches if t["id"] == todo_id), None)
    if not tache:
        return jsonify({"message": "Tâche introuvable"}), 404
        
    data = request.get_json()
    if "complet" in data:
        tache["complet"] = bool(data["complet"])
    if "titre" in data:
        tache["titre"] = data["titre"]
        
    return jsonify(tache), 200

@app.route("/api/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    """Supprime une tâche définitivement de la liste."""
    global base_taches
    tache = next((t for t in base_taches if t["id"] == todo_id), None)
    if not tache:
        return jsonify({"message": "Non identifié"}), 404
        
    base_taches = [t for t in base_taches if t["id"] != todo_id]
    return jsonify({"success": True}), 200`
  },
  {
    id: 'proj_debutant_2',
    title: "Création de fonctions d'inscription essentielles pour aider à valider les nouveaux utilisateurs",
    level: 'Débutant',
    description: "Créez des fonctions Python personnalisées pour valider la saisie utilisateur !",
    estimatedTime: '1 h',
    technologies: ['Python'],
    steps: [
      {
        id: 1,
        title: "Démarrage",
        instruction: "Initialisez le projet.",
        hint: "Rien",
        initialCode: "print('Hello')"
      }
    ],
    solutionCode: "print('Done')"
  },
  {
    id: 'proj_debutant_3',
    title: "Nettoyer des données avec l'IA générative",
    level: 'Débutant',
    description: "L'IA générative pour nettoyer les data, corriger les doublons, valeurs nulles et le formatage pour obtenir des datasets cohérents et précis.",
    estimatedTime: '1 h',
    technologies: ['ChatGPT', 'Python'],
    steps: [
      {
        id: 1,
        title: "Démarrage",
        instruction: "Initialisez le projet.",
        hint: "Rien",
        initialCode: "print('Hello')"
      }
    ],
    solutionCode: "print('Done')"
  },
  {
    id: 'proj_debutant_4',
    title: "Étude de cas en data storytelling : filières universitaires",
    level: 'Débutant',
    description: "Le récit de données est très recherché qui améliore l'analyse. Apprenez et créez des visualisations grâce au dataset d'une université.",
    estimatedTime: '1 h',
    technologies: ['Power BI', 'Python'],
    steps: [
      {
        id: 1,
        title: "Démarrage",
        instruction: "Initialisez le projet.",
        hint: "Rien",
        initialCode: "print('Hello')"
      }
    ],
    solutionCode: "print('Done')"
  }
];
