sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("miracleCard.controller.Miracle", {
        onInit: function () {
            // Модель уже создана манифестом, просто берем её
            const oModel = this.getOwnerComponent().getModel();
            
            // Можно положить туда начальные данные
            oModel.setData({ title: "Выберите задачу в списке слева" });
        },

        // ЭТОТ МЕТОД МЫ ВЫЗОВЕМ ИЗ INDEX.HTML
        loadTaskDetails: function (sId) {
            const oModel = this.getView().getModel();
            const sUrl = `https://jsonplaceholder.typicode.com/todos/${sId}`;

            oModel.loadData(sUrl).then(() => {
                const oData = oModel.getData();
                oData.completedText = oData.completed ? "Выполнено" : "В работе";
                oData.state = oData.completed ? "Success" : "Warning";
                oModel.setData(oData);
            });
        }
    });
});