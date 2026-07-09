import { CodingChallenge } from '../types';
import { PythonRunResult } from './pythonRunner';

export interface GeminiEvaluationResult {
  isCorrect: boolean;
  explanation: string;
  suggestedCode?: string;
}

export async function evaluateCodeWithGemini(
  challenge: CodingChallenge,
  userCode: string,
  localResult: PythonRunResult
): Promise<GeminiEvaluationResult | null> {
  const apiKey = (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined) || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("No GEMINI_API_KEY configured. Fallback to local rule-based validator.");
    return null;
  }

  const instructionsList = challenge.instructions.map((inst, idx) => `${idx + 1}. ${inst}`).join('\n');
  const localVariablesStr = JSON.stringify(localResult.variables);

  const prompt = `Vous êtes un tuteur Python expert, pédagogue et bienveillant. Évaluez le code Python ci-dessous soumis par un étudiant pour le défi de programmation.

### DÉTAILS DU DÉFI
- **Titre** : ${challenge.title}
- **Description** : ${challenge.description}
- **Consignes obligatoires** :
${instructionsList}
- **Mots-clés requis** : ${challenge.validationKeywords.join(', ')}
- **Mots-clés interdits** : ${challenge.forbiddenKeywords?.join(', ') || 'Aucun'}

### CODE DE L'ÉTUDIANT
\`\`\`python
${userCode}
\`\`\`

### RÉSULTAT DE L'EXÉCUTION DU CODE
- **Succès d'exécution** : ${localResult.success}
- **Sortie affichée (stdout)** : ${localResult.stdout || '(Vide)'}
- **Variables calculées en mémoire** : ${localVariablesStr}
- **Erreur obtenue (si échec)** : ${localResult.error || 'Aucune'}

### DIRECTIVES D'ÉVALUATION
1. **Flexibilité** : Ne rejetez pas le code pour des écarts mineurs de casse, de format de texte dans print(), ou de légères variations de noms de variables (ex: 'total_secondes' écrit 'tot_secondes' ou 'totalSec'), SOUF si la consigne l'exigeait strictement. Si la logique est correcte et produit le résultat attendu, marquez "isCorrect" à true.
2. **Mots-clés et structures** : Vérifiez si l'étudiant a utilisé les concepts clés requis (ex. boucles "for", opérateurs spéciaux "//", "%" ou "**", fonctions "print") si stipulés dans les consignes ou dans les mots-clés requis.
3. **Explication claire en Français** :
   - Si le code est correct : Félicitez l'étudiant, expliquez pourquoi son code est bon et donnez éventuellement un conseil d'amélioration (PEP 8, f-strings, etc.).
   - Si le code contient des erreurs : Expliquez-lui précisément et gentiment ce qui ne va pas (ex: erreur de logique, formule mathématique incorrecte, variable manquante, erreur de syntaxe). Expliquez le concept théorique derrière son erreur pour l'aider à comprendre.
4. **Code suggéré** : Si incorrect, proposez une version correcte, propre et commentée du code répondant à la consigne.
5. **Mise en forme et Espacement** : Rédigez l'explication en utilisant des paragraphes aérés et des listes à puces Markdown (ex: \`1.\`, \`2.\` ou \`-\`). Mettez obligatoirement un double retour à la ligne entre vos paragraphes. Veillez à TOUJOURS insérer un espace après chaque point de ponctuation (par exemple : après '.', '!', ':', ou ','). N'accolez jamais de mots sans espace après une ponctuation (ex: écrivez 'essentielle ! Cependant' au lieu de 'essentielle!Cependant'). Utilisez des backticks (\`code\`) autour des noms de variables, fonctions et expressions (ex: \`largeur\`).`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              isCorrect: { type: 'BOOLEAN' },
              explanation: { type: 'STRING' },
              suggestedCode: { type: 'STRING' }
            },
            required: ['isCorrect', 'explanation']
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`HTTP error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error("Empty response from Gemini API");
    }

    const result: GeminiEvaluationResult = JSON.parse(textResponse);
    return result;
  } catch (error) {
    console.error("Error evaluating code with Gemini:", error);
    return null;
  }
}

export async function analyzeCodeWithGemini(systemPrompt: string, userMessage: string): Promise<{ feedback: string }> {
  const apiKey = (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined) || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return { feedback: "Clé d'API Gemini non configurée." };
  }
  
  const prompt = `${systemPrompt}\n\nQuestion de l'étudiant:\n${userMessage}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`HTTP error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return { feedback: textResponse || "Désolé, je n'ai pas de réponse." };
  } catch (error) {
    console.error("Error analyzing with Gemini:", error);
    throw error;
  }
}
