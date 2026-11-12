import sqlite3

#'users' кестесін таңдап, іздеу бағдарламасын жасау
print(" Дерекқорға қосылу және іздеу ===")
conn = sqlite3.connect("docs/database.sqlite")
cursor = conn.cursor()

# database.sql файлынан кестелерді жүктеу
with open("docs/database.sql", "r", encoding="utf-8") as f:
  sql_script = f.read()

cursor.executescript(sql_script)
conn.commit()
print("Дерекқор сәтті жүктелді!\n")


#Осал сұраныс (SQL Injection тексеру)
print(" Осал код (SQL Injection) ")
search_name = input("Ізделетін аты-жөнді енгізіңіз: ")

# Қауіпті сұраныс (айнымалыны тікелей қосу)
vulnerable_query = f"SELECT * FROM users WHERE full_name = '{search_name}'"
print(f"Орындалатын SQL сұраныс: {vulnerable_query}")

cursor.execute(vulnerable_query)
results = cursor.fetchall()

if results:
  print("\n [ОСАЛДЫҚ РАСТАЛДЫ] Табылған деректер:")
  for row in results:
    print(row)
else:
  print("Мәлімет табылмады!")


# Қауіпсіз нұсқаға өзгерту (Параметрленген сұраныс) ---
print("\nҚауіпсіз код (Parameterized query) ---")
safe_name = input("Қауіпсіз режим үшін аты-жөнді қайта енгізіңіз: ")

# Қауіпсіз сұраныс (? белгісі арқылы)
safe_query = "SELECT * FROM users WHERE full_name = ?"
print(f"Орындалатын қауіпсіз SQL сұраныс: {safe_query}")

cursor.execute(safe_query, (safe_name,))
safe_results = cursor.fetchall()

if safe_results:
  print("\n Табылған деректер:")
  for row in safe_results:
    print(row)
else:
  print("[ҚОРҒАНЫС ЖҰМЫС ІСТЕ ДІ] Мәлімет табылмады немесе қате енгізілді!")

conn.close()