from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

documents = [
    "Жатақханаға орналасу үшін студент портал арқылы өтініш (application) тапсырады.",
    "Өтініштер GPA көрсеткіші мен әлеуметтік санаттар бойынша жиналған ұпаймен (total_points) қаралады.",
    "Жатақханаға кіру және шығу кезінде QR-рұқсатнама (qr_orders) тексеріледі.",
    "Бөлмедегі жөндеу немесе сантехника ақаулары бойынша өтінім комендантқа жіберіледі.",
    "Кезекшілік кестесі бөлме тұрғындары арасында апта сайын бөлінеді.",
]

embeddings = model.encode(documents)
print("Embedding өлшемі:", embeddings.shape)

query = "Жатақханаға қалай кіруге болады және қандай рұқсат керек?"
query_embedding = model.encode([query])

similarities = cosine_similarity(query_embedding, embeddings)[0]
for i, score in enumerate(similarities):
  print(f"{documents[i]} -> {score:.4f}")

best_index = similarities.argmax()
print("\nЕң сәйкес құжат:")
print(documents[best_index])