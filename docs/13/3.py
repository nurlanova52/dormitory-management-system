import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

documents = [
    "Жатақханаға өтініш беру мерзімі оқу жылы басталар алдында ашылады.",
    "Үздік GPA және жоғары ұпай жинаған студенттерге бірінші кезекте орын беріледі.",
    "Түнгі уақытта кешігіп кіру деректері жүйеде тіркеліп, комендантқа хабарланады.",
    "Бөлме ауыстыру өтініші бос орындар (rooms) болған жағдайда қаралады.",
    "Жатақхана ішкі тәртіп ережелерін сақтау барлық студентке міндетті.",
]

doc_embeddings = model.encode(documents)


def retrieve(query, top_k=2):
  query_embedding = model.encode([query])
  scores = cosine_similarity(query_embedding, doc_embeddings)[0]
  indices = np.argsort(scores)[::-1][:top_k]
  return [documents[i] for i in indices]


def create_prompt(query, context):
  context_text = "\n".join(f"- {item}" for item in context)
  return f"""Сен «Жатақхананы басқару жүйесінің» көмекшісісің.
Тек төмендегі контекстке сүйеніп жауап бер.
Егер жауап контексте болмаса, "Бұл ақпарат құжаттарда жоқ" деп жауап бер.

Контекст:
{context_text}

Сұрақ:
{query}

Жауап:"""


query = "Түнде кешігіп кірсе не болады?"
context = retrieve(query)
print("Табылған контекст:", context)
print("\nҚұрастырылған Prompt:\n")
print(create_prompt(query, context))