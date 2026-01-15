sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel'], function (Controller, JSONModel) {
  'use strict'

  return Controller.extend('magic.card.controller.Main', {
    onInit: function () {
      var oComponent = this.getOwnerComponent()

      if (oComponent.getCard()) {
        this._loadData()
      } else {
        setTimeout(this._loadData.bind(this), 1000)
      }
    },
    // standard loading for cards, works only with destinations
    // _loadData: function () {
    //   console.log('--- 5. Controller: Вызов _loadData запущен')
    //   var oComponent = this.getOwnerComponent()
    //   var oCard = oComponent.getCard()

    //   if (!oCard) {
    //     console.error('--- 6. Controller: КРИТИЧЕСКАЯ ОШИБКА: Карточка так и не появилась!')
    //     return
    //   }
    //   console.log('--- 6. Controller: Запрос отправляется...')
    //   oCard
    //     .request({
    //       url: 'https://jsonplaceholder.typicode.com/todos/1',
    //     })
    //     .then(
    //       function (oData) {
    //         var oModel = new JSONModel(oData)
    //         this.getView().setModel(oModel)

    //         // Проверь, что ID совпадает с тем, что во View!
    //         var oTitle = this.byId('todoTitle')
    //         if (oTitle) {
    //           oTitle.setText(oData.title)
    //         }
    //       }.bind(this)
    //     )
    //     .catch(function (oError) {
    //       console.error('Data load failed', oError)
    //     })
    // },

    _loadData: function () {
      const oView = this.getView()
      const oModel = oView.getModel()
      // Вместо oCard.request используем стандартный механизм загрузки JSONModel
      oModel
        .loadData('https://jsonplaceholder.typicode.com/todos/1', null, true, 'GET', false)
        .then(function () {
          console.log('--- 6. Данные успешно загружены через loadData!')
          var oData = oModel.getData()

          // "Причесываем" данные
          oData.completedText = oData.completed ? 'Выполнено' : 'В ожидании'
          oData.state = oData.completed ? 'Success' : 'Warning'

          oModel.setData(oData) // Обновляем модель дополненными данными
        })
        .catch(function (oError) {
          console.error('--- 6. Ошибка загрузки данных:', oError)
        })
    },
  })
})
