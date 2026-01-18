sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
  'use strict'

  return Controller.extend('com.epic.cards.oracleContextV2.controller.OracleContextV2', {
    onInit: function () {
      // const oCard = this.getOwnerComponent().getCard()
      // const oHost = sap.ui.getCore().byId(oCard.getHost())

      const oComponent = this.getOwnerComponent()
      const oCard = oComponent.getCard()
      const oModel = oComponent.getModel() // Наша внутренняя JSON модель

      // 1. Получаем доступ к Хосту
      const oHost = oCard.getHostInstance()

      if (oHost) {
        const oHostModel = oHost.getModel("host")

        if (oHostModel) {
          // 2. Создаем привязку (Binding) к свойству выбранного ID
          this._oIdBinding = oHostModel.bindProperty("/selectedId")

          // 3. Подписываемся на изменения
          this._oIdBinding.attachChange(function () {
            const sId = this._oIdBinding.getValue()
            if (sId) {
              console.log("Старший Оракул: Вижу новый ID в Хосте ->", sId)
              this.loadTaskDetails(sId)
            }
          }.bind(this))
        }
      }

      oModel.setData({ title: 'Оракул готов. Выберите заклинание в списке.' })
    },

    loadTaskDetails: function (sId) {
      const oModel = this.getView().getModel()
      const sUrl = `https://jsonplaceholder.typicode.com/todos/${sId}`

      // Показываем состояние загрузки
      oModel.setProperty("/title", "Запрашиваю видение для ID " + sId + "...")

      fetch(sUrl)
        .then(response => response.json())
        .then(oData => {
          oData.completedText = oData.completed ? 'Завершено' : 'В процессе'
          oData.state = oData.completed ? 'Success' : 'Warning'
          oData.title = "Видение: " + oData.title

          oModel.setData(oData)
          console.log("Старший Оракул: Данные обновлены успешно.")
        })
        .catch(err => console.error("Оракул ослеп:", err))
    }
  })
})
