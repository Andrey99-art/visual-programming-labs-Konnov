# Настройка contextStorage (лаб. 2, п. 2.12)

Автор: Коннов Андрей, группа СДП-241 ИИ.

По умолчанию Node-RED хранит `flow`/`global` context в памяти процесса, поэтому
значения теряются при каждом перезапуске контейнера. Чтобы демонстрировать
счётчик в потоке [flow-12-context.json](../flows/flow-12-context.json), который
переживает `podman restart`, в `settings.js` (файл лежит в
`lab2/nodered-data/`, он в `.gitignore` вместе с токенами и credentials)
включён файловый context store.

Фрагмент `settings.js`, который был раскомментирован:

```js
contextStorage: {
    default: {
        module: "localfilesystem"
    },
},
```

Файл-хранилище флашится на диск раз в 30 секунд (поведение модуля
`localfilesystem` по умолчанию) и физически лежит в
`lab2/nodered-data/context/`.

Применено командой:

```zsh
podman restart nodered-konnov
```

В логе контейнера после рестарта появилась строка:

```
Context store  : 'default' [module=localfilesystem]
```

(до изменения было `[module=memory]`).
