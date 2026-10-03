# Лабораторная работа №3. Bubble

Студент: Коннов Андрей Анатольевич, группа СДП-241 ИИ.

## 1. Краткое описание выполненного

Приложение **FitPlan** — веб-сервис для планирования тренировок: личный кабинет со статистикой (количество тренировок, выполнено, % завершения, число планов), список ближайших занятий и действия над ними (отметить выполненным, пропустить, изменить, удалить).

## 2. Промпт для генерации каркаса (часть 1)

> Создай приложение на тему «план тренировок»
> Пусть этот сайт будет требующим регистрации
> Страницу обязательно создай по структуре header + body + footer
> Обязательно укажи в заготовке следующую строку: «ТВП: Konnov»
> Добавь несколько интерактивных элементов (реализующих CRUD)

Результат: AI сгенерировал приложение «FitPlan», заголовок страницы — «FitPlan — ТВП: Konnov» (требование с фамилией выполнено). Структура header (навигация: Обзор / Мои планы / Расписание / Выйти) + body (статистика и список тренировок) + footer — присутствует. Интерактивные CRUD-элементы: «Добавить занятие», «Выполнено», «Пропустить», «Изменить», «Удалить».

Скриншот: `../screenshots/01-prompt.png`

## 3. Ссылка на dev-версию приложения

TODO

## 4. Исследование идеи (часть 2, Build Guides)

Использован AI-генератор Build Guides (bubble.io/home/buildguides) с описанием идеи: *«Workout planner app where users create personal training plans, add exercises to each workout, schedule sessions by day, mark workouts as completed or skipped, and track overall progress and completion statistics.»*

По этому описанию сгенерировался набор из 6 гайдов под тему «Workout Planner»: User signup and login, Add exercises to workouts, **Mark workouts as completed or skipped**, Workout scheduling, Create and manage training plans, Progress tracking and statistics. Скриншот списка: `../screenshots/02-buildguide-list.png`.

Открыт гайд **«Mark workouts as completed or skipped»**. Полезное: рекомендуемая структура данных — Data type `Workout` с полями Title, Description, Scheduled Date, Status, **User**, и отдельный тип `Progress`; явная рекомендация гайда — поле User в обоих типах должно связывать записи с конкретным пользователем для персонализированного трекинга. Скриншот: `../screenshots/02-buildguide-detail.png`.

**Применённая идея:** проверка персонализации данных по пользователю. «До» — вкладка Data в редакторе: у приложения уже есть типы `План Тренировок`, `Тренировка`, `Упражнение` с пометкой «Privacy rules applied» (`../screenshots/02-buildguide-before.png`). «После» — запрос Bubble AI-агенту «Generate data types for User = Current User»: агент подтвердил, что каждый из этих типов уже содержит поле `Владелец` (owner → User) и privacy rule `owner = Current User`, то есть рекомендация гайда («User field ... linking records to the specific user») была реализована AI ещё на этапе генерации каркаса приложения в части 1 (`../screenshots/02-buildguide-after.png`).

Вывод: идея из Build Guide применена — данные в FitPlan изначально спроектированы с персонализацией по владельцу-пользователю, что подтверждено через AI-агента Bubble.

## 5. Ручная доработка UI (часть 3)

### 5.1. Заголовок на странице Design
Вручную (без ИИ) в Design-редакторе отредактирован текст заголовка в шапке приложения: было «FitPlan — ТВП: Konnov» (сгенерировано AI в части 1), стало «Anatolevich FitPlan» — добавлено имя студента. Скриншот: `../screenshots/03-header-title.png`.

### 5.2. Global variable (цвет)
Создана Global Variable типа Color с именем `primary-color`, применена к фону кнопки «Создать аккаунт» (стала красной). Скриншот: `../screenshots/03-global-variable.png`.

### 5.3. Стиль на основе Global variable
Создан новый Style с именем **Primary Style**, цвет в настройках стиля ссылается на Global Variable `primary-color` (а не задан напрямую), применён к элементу на странице. Скриншот: `../screenshots/04-style.png`.

### 5.4. Drag & drop компонент
Через drag & drop на страницу добавлена карточка формы логина (поля Email/Password, кнопка Log In, ссылка Create a new account) с фоновым изображением на спортивную тематику — компонента, которого раньше на странице не было. Оставлена в текущем виде (английский текст, фото-заглушка) как финальный вариант. Скриншот: `../screenshots/05-component.png`.

## 6. Data и Workflows (часть 4)

### 6.1. Data

Промпт для генерации сущности (дословно, в чат Bubble AI Agent):

> Create a new data type called "Achievement" for a workout tracking app. Fields: Title (text), Date Earned (date), Is Unlocked (yes/no), Related Workout (link to Тренировка), Description (text).

Название сущности: **Achievement**. Поля: `Title` (text), `Date Earned` (date), `Is Unlocked` (yes/no), `Related Workout` (link → Тренировка), `Description` (text), плюс служебное `Owner` (User, для приватности по аналогии с остальными типами данных приложения) и встроенные Creator/Modified Date/Created Date/Slug. Структура — скриншот `../screenshots/06-data-type.png`.

Вручную через **App Data** добавлено 2 записи типа Achievement:
- «First Workout Complete» — Is Unlocked: yes, Related Workout: Let The War…
- «Perform a 10-punch combination» — Is Unlocked: no, Related Workout: Manilla Ice…

Скриншот записей (вкладка App Data): `../screenshots/07-data-records.png`.

### 6.2. Workflows (CRUD)

Полный CRUD для Achievement реализован на странице `achievements` (создана AI на базе страницы-витрины из части 4.1), каждое действие — отдельный workflow на вкладке Workflow:

- **Create** — `Form open new achievement`: по клику на «New Achievement Button» сбрасывает и открывает форму (попап). Скриншот: `../screenshots/08-workflow-create.png`.
- **Create/Update** — `Form save`: по клику на Create Button — Step 1 создаёт новую запись Achievement, если форма пуста, либо Step 2 вносит изменения в существующую запись (если форма заполнена данными и текущий пользователь — владелец записи); дальше скрывает попап и сбрасывает поля. Скриншот: `../screenshots/09-workflow-create.png`.
- **Update** — `Form open edit` (загружает ачивку в форму для редактирования), `Unlock`/`Lock` (быстрое переключение поля Is Unlocked, Unlock дополнительно проставляет Date Earned).
- **Delete** — `Del ask delete` (по клику на Delete Button, только если текущий пользователь — владелец, показывает попап подтверждения с данными записи) → `Del confirm` (подтверждение — выполняет удаление записи). Скриншот (экран подтверждения): `../screenshots/10-workflow-delete.png`.
- **Read** — не отдельный workflow, а Data source репитинг-группы `Achievements List`: поиск записей Achievement с фильтром по Owner = Current User (приватность по пользователю реализована).
- Вспомогательные: `Form cancel`/`Del cancel` (закрытие попапов), `Page is loaded`, `Signed-out visitor goes to...` (редирект незалогиненных).

Проверено в Preview: создание, редактирование (Lock/Unlock) и удаление записи работают.

## 7. Ачивка

Выбрана ачивка: **1. API Connector (CRUD)**.

Подключён внешний API **JSONPlaceholder** (https://jsonplaceholder.typicode.com, из списка public-apis, раздел Test Data) через официальный плагин Bubble **API Connector**. Реализовано 4 эндпоинта на ресурсе `/posts`:
- **GET** `/posts/1` — получение поста;
- **POST** `/posts` — создание поста;
- **PATCH** `/posts/1` — обновление поста;
- **DELETE** `/posts/1` — удаление поста.

Каждый вызов настроен как отдельное Action в API Connector и вызывается через workflow по клику на соответствующую кнопку (Get Post / Create Post / Update Post / Delete Post) на странице `api-demo`. Все 4 операции проверены в Preview — ответы реального внешнего API (title/body/id, подтверждение удаления) отображаются на странице.

Полная документация эндпоинтов (параметры, примеры запросов/ответов) — в `api.md`.

Скриншоты: `../screenshots/11-api-setup.png`, `11-api-get.png`, `11-api-post.png`, `11-api-update-setup.png`, `11-api-update-result.png`, `11-api-delete-setup.png`, `11-api-delete-result.png`.

## 8. Освоенные элементы и концепции

TODO: Data, Workflows, Global variables, стили, плагин/API — своими словами

## 9. Выводы

TODO (заполняет студент самостоятельно)
