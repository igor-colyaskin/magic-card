sap.ui.define(["sap/ui/integration/Extension", "sap/ui/model/json/JSONModel"], function (Extension, JSONModel) {
    "use strict"

    return Extension.extend("com.epic.cards.oracleContext.Extension", {
        init: function () {
            Extension.prototype.init.apply(this, arguments)
            this.setModel(new JSONModel({ analysis: "Жду импульса..." }), "localLogic")
            var oCard = sap.ui.core.Element.registry.filter(c => c.getId().endsWith("oracleCard"))[0];
            var oContent = oCard.getAggregation("_content")
            console.log("Оракул: Расширение инициализировано!", oCard, oContent)
        },

        // ЭТОТ МЕТОД — КЛЮЧ К КОНЦЕПЦИИ CONTEXT
        onParametersChanged: function (mParameters) {
            // mParameters содержит обновленные значения из манифеста
            if (mParameters.selectedId) {
                const sId = mParameters.selectedId.value
                this.getModel("localLogic").setProperty("/analysis", "Параметр изменился: " + sId)
                console.log("Оракул: Контекст обновил параметры автоматически!")
            }
        }
    })
})