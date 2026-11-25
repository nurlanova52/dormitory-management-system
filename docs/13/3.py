import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("intfloat/multilingual-e5-base")

documents = [
    "Түнгі уақытта кешігіп кіру деректері жүйеде тіркеліп, комендантқа хабарланады.",
    "Бөлме ауыстыру өтініші бос орындар (rooms) болған жағдайда қаралады.",
    "Жатақханаға өтініш беру мерзімі оқу жылы басталар алдында ашылады.",
    "Үздік GPA және жоғары ұпай жинаған студенттерге бірінші кезекте орын беріледі.",
    "Жатақхана ішкі тәртіп ережелерін сақтау барлық студентке міндетті.",
]

# 1) Семантикалық векторлар (e5 үшін "passage: " префиксі)
doc_embeddings = model.encode(
    [f"passage: {d}" for d in documents], normalize_embeddings=True
)

# 2) Лексикалық векторлар (таңба n-граммдары, қазақ жалғауларына төзімді)
tfidf = TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), lowercase=True)
doc_tfidf = tfidf.fit_transform(documents)


def minmax(x):
    rng = x.max() - x.min()
    return (x - x.min()) / rng if rng > 0 else np.zeros_like(x)


def retrieve(query, top_k=2, alpha=0.5, debug=False):
    # e5 үшін "query: " префиксі
    q_emb = model.encode([f"query: {query}"], normalize_embeddings=True)
    sem = cosine_similarity(q_emb, doc_embeddings)[0]
    lex = cosine_similarity(tfidf.transform([query]), doc_tfidf)[0]

    # гибрид: alpha — семантиканың үлесі
    scores = alpha * minmax(sem) + (1 - alpha) * minmax(lex)
    indices = np.argsort(scores)[::-1][:top_k]

    if debug:
        for i in indices:
            print(f"{scores[i]:.2f} (sem={sem[i]:.2f}, lex={lex[i]:.2f}) {documents[i]}")
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


query = "түнгі уақытта кешігіп кірген студенттің деректері қалай өңделеді?"
context = retrieve(query, debug=True)
print("Табылған контекст:", context)
print("\nҚұрастырылған Prompt:\n")
print(create_prompt(query, context))