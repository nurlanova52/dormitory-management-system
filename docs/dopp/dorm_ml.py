import sqlite3
import matplotlib.pyplot as plt
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

# Дерекқорға қосылу
conn = sqlite3.connect("docs/database.sqlite")
cursor = conn.cursor()

# database.sql файлынан кестелерді оқып, дерекқорға жүктеу (кестелер жасалу үшін)
with open("docs/database.sql", "r", encoding="utf-8") as f:
  sql_script = f.read()

cursor.executescript(sql_script)
conn.commit()

# students кестесінен GPA пен applications кестесінен total_points мәндерін алу
cursor.execute("""
    SELECT s.gpa, a.total_points 
    FROM students s
    JOIN applications a ON s.user_id = a.student_id
""")
rows = cursor.fetchall()
conn.close()

if not rows:
  print("Қате: Дерекқордан мәлімет табылмады!")
  exit()

X = np.array([row[0] for row in rows]).reshape(-1, 1)
y = np.array([row[1] for row in rows])

print(f"--- Дерекқордан сәтті жүктелді: {len(X)} студент мәліметі ---")

# Деректерді оқыту және тест жиынтығына бөлу
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

#  Сызықтық регрессия моделін құру және оқыту
model = LinearRegression()
model.fit(X_train, y_train)

# 
# Болжам жасау және сапасын бағалау
y_pred = model.predict(X_test)

print("\n--- Модель нәтижелері (Нақты дерекқор негізінде) ---")
print("Коэффициент (Weight):", model.coef_[0])
print("Бос мүше (Bias):", model.intercept_)
print("MAE (Орташа абсолют қателік):", mean_absolute_error(y_test, y_pred))
print("MSE (Орташа квадраттық қателік):", mean_squared_error(y_test, y_pred))
print("R² (Детерминация коэффициенті):", r2_score(y_test, y_pred))
# Мысалы, GPA = 3.7 болатын студенттің ұпайын болжау
new_student_gpa = np.array([[3.7]])
predicted_points = model.predict(new_student_gpa)
print(
    f"\n[Болжам] GPA 3.7 бар студенттің болжамды ұпайы:"
    f" {predicted_points[0]:.2f}"
)

# 6. Графикті тұрғызу
plt.scatter(X, y, color="blue", label="Дерекқордағы нақты студенттер")
plt.plot(
    X,
    model.predict(X),
    color="red",
    linewidth=2,
    label="Регрессия сызығы (Болжам)",
)
plt.xlabel("Студенттің GPA көрсеткіші")
plt.ylabel("Жатақхана ұпайы (Total Points)")
plt.title("Dormitory System: Нақты деректер негізінде регрессия")
plt.legend()
plt.show()