import sqlite3
import numpy as np
import streamlit as st
from sklearn.linear_model import LinearRegression

# Дерекқорға дұрыс жол (екеуі де бір папкада тұр)
conn = sqlite3.connect("database.sqlite")
cursor = conn.cursor()

# database.sql файлынан кестелерді жүктеу
with open("database.sql", "r", encoding="utf-8") as f:
  sql_script = f.read()

cursor.executescript(sql_script)
conn.commit()

# Деректерді алу
cursor.execute("""
    SELECT s.gpa, a.total_points 
    FROM students s
    JOIN applications a ON s.user_id = a.student_id
""")
rows = cursor.fetchall()
conn.close()

if not rows:
  st.error("Қате: Дерекқордан мәлімет табылмады!")
  st.stop()

X = np.array([row[0] for row in rows]).reshape(-1, 1)
y = np.array([row[1] for row in rows])

# Модельді оқыту
model = LinearRegression()
model.fit(X, y)

# Веб-интерфейс
st.title("🏠 Dormitory Management System")
st.subheader("Студенттің жатақхана ұпайын болжау модулі")

st.write(
    "Бұл модуль студенттің академиялық үлгеріміне (**GPA**) сүйене отырып,"
    " оның өтініші бойынша берілетін болжамды ұпайын есептейді."
)

gpa_input = st.slider(
    "Студенттің GPA көрсеткішін таңдаңыз:", 2.5, 4.0, 3.5, 0.05
)

if st.button("Ұпайды болжау"):
  result = model.predict([[gpa_input]])[0]
  st.success(f"📊 Болжамды жалпы ұпай (Total Points): **{result:.2f}**")

  if result >= 85:
    st.info(
        "✅ Статус: Жатақханаға түсу мүмкіндігі өте жоғары (Approved статусқа"
        " лайық)"
    )
  elif result >= 70:
    st.warning(
        "⚠️ Статус: Орташа көрсеткіш, резерв тізіміне ілінуі мүмкін (Reserve)"
    )
  else:
    st.error(
        "❌ Статус: Көрсеткіш төмен, қабылданбау қаупі бар (Pending / Rejected)"
    )