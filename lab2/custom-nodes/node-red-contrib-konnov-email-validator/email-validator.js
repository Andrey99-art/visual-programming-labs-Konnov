// Лаб. 2, ачивка 12. Коннов, СДП-241 ИИ.
// Проверяет, что указанное поле msg — валидный email (упрощённый формат, не полный RFC 5322).
module.exports = function (RED) {
    "use strict";

    // Упрощённая проверка: локальная часть @ домен . зона, без пробелов.
    // Полный RFC 5322 избыточен для учебной задачи и сильно усложнил бы чтение кода.
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function EmailValidatorNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.property = config.property || "payload";
        node.trim = config.trim !== false;

        node.on("input", function (msg, send, done) {
            // send/done могут отсутствовать в старых версиях Node-RED (до 1.0)
            send = send || function () { node.send.apply(node, arguments); };
            done = done || function (err) { if (err) { node.error(err, msg); } };

            let value = RED.util.getMessageProperty(msg, node.property);

            if (typeof value !== "string") {
                node.status({ fill: "red", shape: "ring", text: "не строка" });
                msg.valid = false;
                send(msg);
                done();
                return;
            }

            if (node.trim) {
                value = value.trim();
            }

            const valid = EMAIL_PATTERN.test(value);
            msg.valid = valid;
            node.status({
                fill: valid ? "green" : "red",
                shape: "dot",
                text: valid ? "valid: " + value : "invalid: " + value
            });
            send(msg);
            done();
        });
    }

    RED.nodes.registerType("konnov-email-validator", EmailValidatorNode);
};
