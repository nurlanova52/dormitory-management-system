```mermaid
flowchart TD
    subgraph L1["1-ДЕҢГЕЙ · ПРЕЗЕНТАЦИЯ ДЕҢГЕЙІ (Presentation Layer)"]
        direction TB
        CLIENT["<b>1. Пайдаланушы / Клиент</b><br/>Студент, Комендант<br/><i>Құрал: веб-браузер (Chrome, Edge)</i>"]
        UI["<b>2. Пайдаланушы интерфейсі</b><br/>Кіру формасы, өтінім формасы,<br/>өтінімдер тізімі, бөлмелер мен QR<br/><i>Тіл: HTML + CSS + JavaScript</i>"]
    end

    subgraph L2["2-ДЕҢГЕЙ · ҚОЛДАНБАЛЫ ЛОГИКА ДЕҢГЕЙІ (Application / Business Logic Layer)"]
        direction TB
        LOGIC["<b>3. Қолданбалы логика</b><br/>Авторизация, балл есептеу (GPA, әлеум. мәртебе),<br/>өтінім мәртебесі, бөлмеге орналастыру, QR генерациясы<br/><i>Тіл: Python (Flask)</i>"]
    end

    subgraph L3["3-ДЕҢГЕЙ · ДЕРЕКТЕР ДЕҢГЕЙІ (Data Layer)"]
        direction TB
        DAL["<b>4. Деректерге қол жеткізу компоненті</b><br/>UserRepository, StudentRepository, ApplicationRepository,<br/>RoomRepository, QrOrderRepository<br/><i>Тіл: Python + SQL (sqlite3)</i>"]
        DB[("<b>5. Деректер қоры</b><br/>users, students, commandants,<br/>rooms, applications, qr_orders<br/><i>Тіл: SQL (SQLite)</i>")]
    end

    CLIENT <-->|"6. HTTP сұраныс ↓ / HTTP жауап ↑"| UI
    UI <-->|"6. JSON сұраныс ↓ / JSON жауап ↑"| LOGIC
    LOGIC <-->|"6. Деректер сұрауы ↓ / Деректер жиынтығы ↑"| DAL
    DAL <-->|"6. SQL сұраныс ↓ / Нәтиже (rows) ↑"| DB

    classDef client fill:#f1f5f9,stroke:#475569,color:#0f172a;
    classDef ui fill:#dbeafe,stroke:#2563eb,color:#0f172a;
    classDef logic fill:#fef3c7,stroke:#d97706,color:#0f172a;
    classDef data fill:#d1fae5,stroke:#059669,color:#0f172a;
    class CLIENT client
    class UI ui
    class LOGIC logic
    class DAL,DB data
    style L1 fill:#eff6ff,stroke:#2563eb,stroke-width:2px
    style L2 fill:#fffbeb,stroke:#d97706,stroke-width:2px
    style L3 fill:#ecfdf5,stroke:#059669,stroke-width:2px
```

## Деңгейлер және тілдер

| Деңгей | Компонент | Тіл |
|---|---|---|
| 1. Презентация | Клиент | Веб-браузер |
| 1. Презентация | Пайдаланушы интерфейсі | HTML, CSS, JavaScript |
| 2. Қолданбалы логика | Бизнес-логика | Python (Flask) |
| 3. Деректер | Деректерге қол жеткізу | Python + SQL |
| 3. Деректер | Деректер қоры | SQL (SQLite) |
