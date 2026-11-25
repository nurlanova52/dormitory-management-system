import os
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

documents = [
    "Жатақханаға өтініш беру мерзімі оқу жылы басталар алдында ашылады.",
    (
        "Үздік GPA және жоғары ұпай жинаған студенттерге бірінші кезекте орын"
        " беріледі."
    ),
    (
        "Жатақханаға түнде кешігіп кірген жағдайда дерек жүйеде тіркеліп,"
        " комендантқа хабарланады."
    ),
    "Бөлме ауыстыру өтініші бос орындар (rooms) болған жағдайда қаралады.",
    "Жатақхана ішкі тәртіп ережелерін сақтау барлық студентке міндетті.",
]

doc_embeddings = model.encode(documents)


def retrieve(query, top_k=2):
  query_embedding = model.encode([query])
  scores = cosine_similarity(query_embedding, doc_embeddings)[0]
  indices = np.argsort(scores)[::-1][:top_k]
  return [(documents[i], float(scores[i])) for i in indices]


def create_prompt(query, context_items):
  context_text = "\n".join(f"- {doc}" for doc, _ in context_items)
  return f"""Сен «Жатақхананы басқару жүйесінің» көмекшісісің.
Тек төмендегі контекстке сүйеніп жауап бер.
Егер жауап контексте болмаса, "Бұл ақпарат құжаттарда жоқ" деп жауап бер.

Контекст:
{context_text}

Сұрақ:
{query}

Жауап:"""


def generate_answer(query, context_items):
  api_key = os.getenv("OPENAI_API_KEY")
  if api_key:
    from openai import OpenAI

    client = OpenAI(api_key=api_key)
    prompt = create_prompt(query, context_items)
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )
    return response.output_text

  best_doc, best_score = context_items[0]
  if best_score < 0.25:
    return "Бұл ақпарат құжаттарда жоқ."
  return best_doc


query = "Жатақханаға түнде кешігіп кірсе не болады?"
context = retrieve(query)
answer = generate_answer(query, context)

print("Сұрақ:", query)
print("Жауап:", answer)