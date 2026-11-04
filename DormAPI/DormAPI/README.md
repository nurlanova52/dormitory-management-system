# 10-зертханалық жұмыс. HTTP REST API арқылы АЖ компоненттерінің өзара әрекеттесуі

**Мысал жүйе:** Жатақхана АЖ (бөлмелер ресурсы). Node.js + Express + MySQL, тестілеу — Postman.

## 1. Жұмыстың мақсаты
Node.js және Express арқылы MySQL базасымен байланысқан REST API жасау, CRUD операцияларын орындау және Postman-мен тестілеу.

## 2. Жоба құрылымы
```
DormAPI/
├── db.js          # MySQL қосылымы (mysql2 pool)
├── server.js      # Express REST API (5 endpoint)
├── schema.sql     # dorm_db базасы мен rooms кестесі
├── package.json
└── DormAPI.postman_collection.json   # Postman-ға импорттау үшін
```

## 3. Орындалу реті
1. MySQL-де `schema.sql` орындаңыз (MySQL Workbench → File → Open SQL Script → ⚡ Run).
2. `db.js` ішіндегі `YOUR_PASSWORD` орнына өз MySQL пароліңізді жазыңыз.
3. VS Code терминалында (қапшық `DormAPI`):
   ```
   npm install
   node server.js
   ```
   Терминалда `API сервері http://localhost:3000` шығуы керек. Терминалды жаппаңыз.
4. Postman → Import → `DormAPI.postman_collection.json`. Алты сұранысты ретімен Send басыңыз.

## 4. Endpoint-тер және күтілетін нәтиже
| № | Әдіс | Endpoint | Body | Күтілетін нәтиже |
|---|---|---|---|---|
| 1 | GET | /api/rooms | — | 200, барлық бөлмелер (JSON массив) |
| 2 | GET | /api/rooms/1 | — | 200, `{"id":1,"room_number":301,"capacity":4,"occupied_beds":2}` |
| 3 | POST | /api/rooms | `{"room_number":306,"capacity":4,"occupied_beds":0}` | 201, `{"id":6,"room_number":306,...}` |
| 4 | PUT | /api/rooms/1 | `{"room_number":301,"capacity":4,"occupied_beds":3}` | 200, `{"message":"Бөлме жаңартылды"}` |
| 5 | DELETE | /api/rooms/3 | — | 200, `{"message":"Бөлме сәтті жойылды"}` |
| 6 | GET | /api/rooms/999 | — | 404, `{"message":"Бөлме табылмады"}` |

Қосымша тексерулер: body-сіз/`room_number`-сіз POST → 400; қайталанған `room_number` → 409; `occupied_beds > capacity` → 400.

## 5. Қорытынды
Node.js және Express көмегімен жатақхана бөлмелерін басқаратын REST API әзірленді. API MySQL-мен `mysql2` арқылы байланысады, CRUD операциялары (GET, POST, PUT, DELETE) жұмыс істейді, нәтижелер Postman арқылы тексеріледі.

## 6. Бақылау сұрақтарының жауаптары
1. **API** (Application Programming Interface) — бағдарламалар бір-бірімен деректер алмасуы үшін ашылған интерфейс. Клиент (веб-бет, мобильді қосымша) серверге API арқылы сұраныс жіберіп, жауап алады.
2. **REST** ерекшеліктері: клиент пен сервер бөлек; сервер күйді сақтамайды (stateless); ресурстар URL арқылы анықталады (`/api/rooms/1`); стандартты HTTP әдістері қолданылады; деректер көбіне JSON форматында жүреді.
3. **HTTP** — API-дің тасымалдау протоколы: клиент әдіс (GET, POST…), URL және body жібереді, сервер статус-код (200, 201, 404, 500) мен JSON жауап қайтарады.
4. **CRUD:** Create (жасау — POST), Read (оқу — GET), Update (жаңарту — PUT), Delete (жою — DELETE).
5. **GET** — деректі оқиды, body болмайды, сервердегі деректі өзгертпейді; **POST** — body ішінде деректі жіберіп, жаңа ресурс жасайды.
6. **PUT** — бар ресурстың ақпаратын жаңартады; **DELETE** — ресурсты жояды.
7. **JSON** — жеңіл, адамға түсінікті, барлық тілде оқылатын деректер форматы; клиент пен сервер арасында деректі бірдей құрылымда жеткізеді.
8. **Node.js** — серверде JavaScript орындайтын орта; **Express** — Node.js үстіндегі веб-фреймворк, маршруттар мен сұраныстарды өңдеуді жеңілдетеді.
9. **Postman:** New → HTTP Request, әдіс пен URL таңдалады, POST/PUT үшін Body → raw → JSON енгізіледі, Send басылады және жауап пен статус-код тексеріледі.
