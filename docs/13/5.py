import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

documents = [
    (
        "Жатақханаға өтініш беру мерзімі оқу жылы басталар алдында ашылады"
        " және өтініш қабылдау уақыты алдын ала жарияланады."
    ),
    (
        "Үздік GPA және жоғары ұпай жинаған студенттерге бірінші кезекте орын"
        " беріледі."
    ),
    (
        "Жатақханаға түнде кешігіп кірген жағдайда дерек жүйеде тіркеліп,"
        " комендантқа хабарланады."
    ),
    "Бөлме ауыстыру өтініші бос орындар (rooms) болған жағдайда қаралады.",
    (
        "Өтініштер GPA көрсеткіші, қосымша ұпайлар және әлеуметтік санаттар"
        " бойынша есептелген жалпы ұпаймен (total_points) қаралады."
    ),
    (
        "Өтініш статустары төрт түрге бөлінеді: Pending (тексеру күтуде),"
        " Approved (орын бөлінді), Reserve (күту тізімінде) және Rejected"
        " (қабылданбады)."
    ),
    (
        "Жатақханаға кіру және шығу кезінде QR-рұқсатнама (qr_orders)"
        " тексеріледі."
    ),
    (
        "Бөлмедегі жөндеу немесе сантехника ақаулары бойынша өтінім"
        " комендантқа жіберіледі."
    ),
    "Кезекшілік кестесі бөлме тұрғындары арасында апта сайын бөлінеді.",
    "Жатақхана ішкі тәртіп ережелерін сақтау барлық студентке міндетті.",
]


def kazakh_analyzer(text):
  cleaned = (
      text.lower()
      .replace("?", "")
      .replace(".", "")
      .replace(",", "")
      .replace("(", "")
      .replace(")", "")
      .replace(":", "")
  )
  tokens = []
  for word in cleaned.split():
    # Қысқа жалғаулар мен көмекші сөздерді сүзу
    if len(word) <= 2:
      continue
    tokens.append(word[:5] if len(word) > 5 else word)
  return tokens


vectorizer = TfidfVectorizer(analyzer=kazakh_analyzer)
doc_vectors = vectorizer.fit_transform(documents)


def retrieve(query, top_k=2):
  query_vec = vectorizer.transform([query])
  scores = cosine_similarity(query_vec, doc_vectors)[0]
  indices = np.argsort(scores)[::-1][:top_k]
  return [(documents[i], float(scores[i])) for i in indices]


def generate_answer(query, context_items, threshold=0.30):
  best_doc, best_score = context_items[0]
  if best_score < threshold:
    return "Бұл ақпарат құжаттарда жоқ."
  return best_doc


test_queries = [
    "Жатақханаға өтініш қашан беріледі?",
    "Кімдерге бірінші кезекте орын беріледі?",
    "Жатақханаға түнде кешігіп кірсе не болады?",
    "Бөлмені қалай ауыстыруға болады?",
    "Жатақхана директорының телефон нөмірі қандай?",
]

for i, q in enumerate(test_queries, start=1):
  ctx = retrieve(q)
  ans = generate_answer(q, ctx)
  top_score = ctx[0][1]
  print(f"{i}. Сұрақ: {q}")
  print(f"   Ұқсастық балы: {top_score:.4f}")
  print(f"   Жауап: {ans}\n")