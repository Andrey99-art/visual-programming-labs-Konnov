# Лабораторная работа №2

**Node-RED**

Выполнил: Коннов Андрей Анатольевич, группа СДП-241 ИИ

---

## 1. Краткое описание выполненного

Освоен Node-RED как low-code инструмент: собраны и задеплоены 13 потоков
(12 обязательных из части 2 + один демонстрационный для ачивки), охватывающих
базовые ноды (`inject`, `debug`, `function`, `switch`, `change`), работу с
шаблонами (`template`, Mustache), внешние интеграции (`http request` к
публичному API, MQTT-брокер `broker.hivemq.com`, Telegram-бот), REST API
поверх Node-RED (`http in`/`http response`), dashboard с gauge и графиком,
чтение/запись файлов и работу с flow context. Дополнительно выполнена
ачивка 12 — собственная нода Node-RED, оформленная как отдельный npm-пакет.

Все потоки сохранены отдельными файлами `lab2/flows/flow-NN-<имя>.json`,
для каждого сделан минимум один скриншот в `lab2/screenshots/`. REST API
из п. 2.8 задокументирован в [api.md](api.md) с примерами запросов и
ответов, включая ошибки. Настройка `contextStorage` для п. 2.12
задокументирована в [context-storage.md](context-storage.md).

## 2. Способ установки, версии

Установка — через **Podman** (аналог Docker Desktop, использован из-за ОС
Fedora 43, где Docker Desktop недоступен), образ `nodered/node-red:latest`:

```zsh
podman run -d --name nodered-konnov \
  -p 1880:1880 \
  -v ~/.../lab2/nodered-data:/data:Z \
  --userns=keep-id \
  --restart=unless-stopped \
  docker.io/nodered/node-red:latest
```

- `:Z` — перемаркировка тома под SELinux (Fedora использует SELinux в
  режиме Enforcing).
- `--userns=keep-id` — сопоставляет UID хоста с UID 1000 пользователя
  `node-red` внутри контейнера, чтобы файлы в томе принадлежали
  пользователю хоста, а не root.

**Версии** (скриншот [00-versions.png](../screenshots/00-versions.png),
данные из `podman logs`):

- Node-RED: **v5.0.7**
- Node.js: **v24.20.0**
- ОС контейнера: Linux (образ на базе Alpine/Debian из `nodered/node-red`)

Дополнительно установленные npm-пакеты (в `/data`, через `npm install`
внутри контейнера): `node-red-dashboard@3.6.6`,
`node-red-contrib-telegrambot@19.0.3`,
`node-red-contrib-konnov-email-validator@1.0.0` (собственная нода,
см. п. 6).

## 3. Освоенные ноды

| Категория | Ноды |
|---|---|
| Базовые | `inject`, `debug`, `function`, `switch`, `change` |
| Шаблоны | `template` (Mustache → JSON) |
| Сеть | `http request`, `http in`, `http response`, `mqtt-broker`, `mqtt in`, `mqtt out` |
| Dashboard | `ui_tab`, `ui_group`, `ui_gauge`, `ui_chart` |
| Telegram | `telegram bot`, `telegram command`, `telegram receiver`, `telegram sender` |
| Файлы | `file` (запись, append), `file in` (чтение) |
| Контекст | `flow.get/set` внутри `function` + файловый `contextStorage` |
| Своя нода | `konnov-email-validator` (ачивка 12) |

## 4. Ключевые AI-промпты

Работа велась в паре с Claude Code: ассистент писал код нод и JSON потоков,
итоговый результат проверялся и защищается лично. Несколько показательных
примеров постановки задачи:

- *«Собери flow inject → function → debug: function должна использовать
  let/const, if/else, цикл for, массив и объект, и вернуть объект с полем
  payload. Придумай осмысленный сценарий на моих данных (фамилия, группа),
  не просто écho.»* — так появилась функция подсчёта статистики оценок
  (`flow-02-function.json`), переиспользованная в `flow-03-switch.json`.
- *«Настрой template-ноду с Mustache-шаблоном, который собирает JSON из
  2–3 полей входного объекта, Output = Parsed JSON»* — `flow-05-template.json`.
- *«Для /api/items нужна валидация: id — только положительное целое, при
  нечисловом или отсутствующем id — 404/400, limit — целое 1..100, иначе
  400. Дай примеры curl на все случаи»* — легло в основу function-ноды и
  `docs/api.md`.
- *«Напиши минимальный npm-пакет custom node для Node-RED: валидация
  email упрощённым regex, свойство Property для выбора поля msg, чекбокс
  Trim, результат в msg.valid, статус ноды меняет цвет»* — ачивка 12,
  `lab2/custom-nodes/node-red-contrib-konnov-email-validator/`.

Перед каждым импортом код function-нод и JSON потоков прогонялся через
`node -e` вне контейнера на нескольких контрольных входах, чтобы отделить
ошибки логики от ошибок настройки самого Node-RED.

## 5. Скриншоты потоков

| № | Поток | Скриншоты |
|---|---|---|
| 00 | Версии (Podman/Node-RED/Node.js) | [00-versions.png](../screenshots/00-versions.png) |
| 01 | Inject → Debug | [01-inject-debug.png](../screenshots/01-inject-debug.png) |
| 02 | Function | [02-function.png](../screenshots/02-function.png) |
| 03 | Switch | [03-switch.png](../screenshots/03-switch.png) |
| 04 | Change | [04-change.png](../screenshots/04-change.png) |
| 05 | Template | [05-template.png](../screenshots/05-template.png) |
| 06 | HTTP Request | [06-http-request.png](../screenshots/06-http-request.png) |
| 07 | MQTT | [07-mqtt.png](../screenshots/07-mqtt.png) |
| 08 | GET-эндпоинты | [08-endpoints.png](../screenshots/08-endpoints.png), [08-api-text.png](../screenshots/08-api-text.png), [08-api-info.png](../screenshots/08-api-info.png), [08-api-items-ok.png](../screenshots/08-api-items-ok.png), [08-api-items-400.png](../screenshots/08-api-items-400.png), [08-api-items-404.png](../screenshots/08-api-items-404.png) |
| 09 | Dashboard (gauge + chart) | [09-dashboard-flow.png](../screenshots/09-dashboard-flow.png), [09-dashboard.png](../screenshots/09-dashboard.png) |
| 10 | Telegram-бот | [10-telegram-flow.png](../screenshots/10-telegram-flow.png), [10-telegram-chat.png](../screenshots/10-telegram-chat.png) |
| 11 | Файлы (чтение/запись) | [11-files.png](../screenshots/11-files.png) |
| 12 | Контекст (flow context) | [12-context.png](../screenshots/12-context.png) |
| Ачивка 12 | Custom node (email validator) | [12-custom-node-palette.png](../screenshots/12-custom-node-palette.png), [12-custom-node-flow.png](../screenshots/12-custom-node-flow.png) |

## 6. Ачивка: Custom Node-RED node (№12)

Реализован полноценный npm-пакет `node-red-contrib-konnov-email-validator`
(`package.json`, `email-validator.js`, `email-validator.html`) —
см. [lab2/custom-nodes/](../custom-nodes/node-red-contrib-konnov-email-validator/).
Нода проверяет указанное поле `msg` на соответствие упрощённому формату
email и кладёт результат в `msg.valid`. Установлена через `npm install` с
локального пути внутри тома Node-RED (переживает перезапуск контейнера),
регистрация подтверждена через Admin API (`GET /nodes/...`). Появляется в
палитре редактора в отдельной категории «Konnov SDP-241».

**Отличие от subflow:** subflow — это группировка уже существующих нод
внутри того же проекта, у него нет `package.json`, он не ставится через
`npm install` и не появляется в палитре как самостоятельный тип узла без
предварительного импорта. Custom node — независимый npm-модуль со своим
JS-рантаймом (`RED.nodes.registerType` на сервере) и HTML-формой
редактора (`RED.nodes.registerType` на клиенте), переносится между любыми
инсталляциями Node-RED и может иметь собственные npm-зависимости.

## 7. Выводы

TODO: пишет автор своими словами.
