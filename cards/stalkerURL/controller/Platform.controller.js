sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict"

    return Controller.extend("com.epic.cards.stalkerURL.controller.Platform", {
        onInit: function () {
            console.log("Сталкер прибыл на Платформу.")
        }
    })
})