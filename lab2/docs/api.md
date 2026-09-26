# API (Node-RED, lab2, flow-08-endpoints)

Автор: Коннов Андрей, группа СДП-241 ИИ.

Базовый адрес: `http://localhost:1880`. Поток: [flow-08-endpoints.json](../flows/flow-08-endpoints.json).
Все эндпоинты только `GET`, авторизации нет. Ошибки возвращаются как JSON `{ "error": "...", "message": "..." }`.
Примеры ниже проверены через `curl`; сервер отдаёт JSON в одну строку, здесь он отформатирован для читаемости.

| Метод | Путь | Что возвращает | Коды |
|-------|------|----------------|------|
| GET | `/api/text` | простой текст | 200 |
| GET | `/api/info` | JSON с двумя полями | 200 |
| GET | `/api/items` | список элементов (query: `limit`, `category`) | 200, 400 |
| GET | `/api/items/:id` | один элемент (path: `id`) | 200, 400, 404 |

## 1. GET /api/text

Возвращает текст. `Content-Type: text/plain; charset=utf-8`. Параметров нет.

```bash
curl -i http://localhost:1880/api/text
```

Ответ `200 OK`:

```
Привет от Node-RED! Коннов Андрей, СДП-241 ИИ, лаб. 2.
```

## 2. GET /api/info

Возвращает JSON с двумя полями. `Content-Type: application/json; charset=utf-8`. Параметров нет.

```bash
curl -i http://localhost:1880/api/info
```

Ответ `200 OK`:

```json
{ "student": "Konnov", "group": "SDP-241" }
```

## 3. GET /api/items и GET /api/items/:id

Данные лежат прямо в function-ноде (5 элементов): `id` (число), `name`, `category` (`sensor`, `actuator`, `gateway`).

| id | name | category |
|----|------|----------|
| 1 | Датчик температуры | sensor |
| 2 | Датчик влажности | sensor |
| 3 | Реле | actuator |
| 4 | Сервопривод | actuator |
| 5 | Шлюз MQTT | gateway |

### Параметры

| Параметр | Где | Обязателен | Правила |
|----------|-----|------------|---------|
| `id` | path, `/api/items/:id` | да | положительное целое (`1`, `2`, ...); не число или `0` -> 400; нет такого -> 404 |
| `limit` | query, `/api/items` | нет | целое от 1 до 100; иначе 400. По умолчанию все элементы |
| `category` | query, `/api/items` | нет | фильтр по точному совпадению; неизвестная категория даёт пустой список (200) |

### 3.1 Список: успех (200)

```bash
curl -i "http://localhost:1880/api/items"
curl -i "http://localhost:1880/api/items?limit=2"
curl -i "http://localhost:1880/api/items?category=sensor"
```

Ответ на `?limit=2`:

```json
{
  "count": 2,
  "items": [
    { "id": 1, "name": "Датчик температуры", "category": "sensor" },
    { "id": 2, "name": "Датчик влажности", "category": "sensor" }
  ]
}
```

### 3.2 Список: ошибка 400 (неверный limit)

```bash
curl -i "http://localhost:1880/api/items?limit=abc"
curl -i "http://localhost:1880/api/items?limit=0"
curl -i "http://localhost:1880/api/items?limit=101"
```

Ответ `400 Bad Request`:

```json
{ "error": "Bad Request", "message": "limit должен быть целым числом от 1 до 100" }
```

### 3.3 Один элемент: успех (200)

```bash
curl -i http://localhost:1880/api/items/3
```

Ответ `200 OK`:

```json
{ "id": 3, "name": "Реле", "category": "actuator" }
```

### 3.4 Один элемент: ошибка 400 (id не положительное целое)

```bash
curl -i http://localhost:1880/api/items/abc
curl -i http://localhost:1880/api/items/0
```

Ответ `400 Bad Request` для `/api/items/abc`:

```json
{ "error": "Bad Request", "message": "id должен быть положительным целым числом, получено: abc" }
```

### 3.5 Один элемент: ошибка 404 (нет такого id)

```bash
curl -i http://localhost:1880/api/items/99
```

Ответ `404 Not Found`:

```json
{ "error": "Not Found", "message": "элемент с id=99 не найден" }
```

## Как устроен поток

- Для `/api/text` и `/api/info` свой `http in` -> `change` (задаёт `payload`) -> `http response`.
- Для `/api/items` два `http in` (`/api/items` и `/api/items/:id`) сходятся в одну function-ноду, которая проверяет параметры и выставляет `msg.statusCode`. Затем один `http response` берёт код из `msg.statusCode` (поле «Status code» в ноде пустое).
- Path-параметр читается из `msg.req.params.id`, query-параметры из `msg.req.query`.
