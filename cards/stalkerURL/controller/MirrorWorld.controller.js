sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
    'use strict'

    return Controller.extend('com.epic.cards.stalkerURL.controller.MirrorWorld', {
        onInit: function () {
            // Подключаемся к глобальному роутеру Хоста
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
            // Слушаем маршрут "mirror", который мы прописали в манифесте Хоста
            oRouter.getRoute("mirror").attachPatternMatched(this._onRouteMatched, this)
        },

        _onRouteMatched: function (oEvent) {
            // Вытаскиваем {id} из URL (например, из #/mirror/5)
            const sId = oEvent.getParameter("arguments").id
            this.getView().byId("mirrorIDText").setText("Вы исследуете объект: " + sId)
            console.log("Сталкер вошел в Зазеркалье объекта:", sId)
        },

        onBack: function () {
            // Возвращаемся на пустой путь (Платформа)
            sap.ui.core.UIComponent.getRouterFor(this).navTo("home")
        }
    })
})
