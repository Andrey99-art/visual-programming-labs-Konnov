# Ачивка: API Connector (CRUD)

## Выбранный API

**JSONPlaceholder** — https://jsonplaceholder.typicode.com — фейковый REST API из списка [public-apis/public-apis](https://github.com/public-apis/public-apis) (раздел Test Data), специально предназначенный для тренировки CRUD-запросов. Ключ не требуется.

Ресурс: `/posts`.

## Используемый плагин в Bubble

**API Connector** (официальный плагин Bubble). API внутри плагина назван `JSONPlaceholder`, в нём настроено 4 вызова (calls), каждый — `Use as: Action`, `Data type: JSON`.

## Эндпоинты

### 1. GET — получить пост

- **Call name:** Get Post
- **Method:** GET
- **URL:** `https://jsonplaceholder.typicode.com/posts/1`
- **Параметры:** нет (id поста захардкожен в URL для демонстрации)
- **Пример ответа:**
```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecat excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
```
Скриншоты: `../screenshots/11-api-setup.png` (найденные поля ответа), `../screenshots/11-api-get.png` (результат в Preview).

### 2. POST — создать пост

- **Call name:** Create Post
- **Method:** POST
- **URL:** `https://jsonplaceholder.typicode.com/posts`
- **Body (JSON):**
```json
{"title": "FitPlan post", "body": "...", "userId": 1}
```
- **Пример ответа** (JSONPlaceholder эмулирует создание, реально не сохраняет данные и всегда возвращает `id: 101`):
```json
{
  "title": "FitPlan post",
  "id": 101
}
```
Скриншот результата в Preview: `../screenshots/11-api-post.png` («Post 101: FitPlan post»).

### 3. PATCH — обновить пост

- **Call name:** Update Post
- **Method:** PATCH
- **URL:** `https://jsonplaceholder.typicode.com/posts/1`
- **Body (JSON):**
```json
{"title": "Обновлённая тренировка"}
```
- **Пример ответа** (title обновлён, остальные поля исходного поста #1 сохранены):
```json
{
  "userId": 1,
  "id": 1,
  "title": "Обновлённая тренировка",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
```
Скриншоты: `../screenshots/11-api-update-setup.png` (найденные поля ответа), `../screenshots/11-api-update-result.png` (результат в Preview — «Post 1: Обновлённая тренировка»).

### 4. DELETE — удалить пост

- **Call name:** Delete Post
- **Method:** DELETE
- **URL:** `https://jsonplaceholder.typicode.com/posts/1`
- **Параметры:** нет
- **Пример ответа:** `{}` (пустой объект — JSONPlaceholder подтверждает удаление без тела ответа)

Скриншоты: `../screenshots/11-api-delete-setup.png` (инициализация вызова), `../screenshots/11-api-delete-result.png` (результат в Preview — «Post 1 deleted»).

## Демонстрация через UI

На странице `api-demo` приложения FitPlan размещены 4 кнопки — «Get Post», «Create Post», «Update Post», «Delete Post» — каждая привязана через workflow к соответствующему вызову API Connector (`Plugins → API Connector → JSONPlaceholder - <Call>`). Результат каждого запроса выводится в общий текстовый элемент на странице. Проверено в Preview для всех 4 операций.

## Примечание по ключу API

JSONPlaceholder не требует API-ключа. Если бы ключ был нужен, в реальном проекте он передавался бы как shared header/parameter в API Connector и не публиковался бы в этом файле — вместо значения использовался бы плейсхолдер `YOUR_API_KEY`.
