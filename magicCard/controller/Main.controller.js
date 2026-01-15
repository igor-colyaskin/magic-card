sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel'], function (Controller, JSONModel) {
  'use strict'

  return Controller.extend('magic.card.controller.Main', {
    onInit: function () {
      console.log('--- 3. Controller: onInit начат')
      var oComponent = this.getOwnerComponent()

      // Если компонент уже готов
      if (oComponent.getCard()) {
        console.log('--- 4. Controller: Карточка УЖЕ была в наличии. Загружаем данные сразу.')
        this._loadData()
      } else {
        console.warn('--- 4. Controller: Карточки еще НЕТ. Уходим в режим ожидания (setTimeout).')
        setTimeout(this._loadData.bind(this), 1000)
      }
    },

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
      var oView = this.getView()
      console.log('--- 5. Controller: Вызов _loadData запущен')

      // Вместо oCard.request используем стандартный механизм загрузки JSONModel
      var oModel = new JSONModel()

      oModel
        .loadData('https://jsonplaceholder.typicode.com/todos/1')
        .then(function () {
          console.log('--- 6. Данные успешно загружены через loadData!')
          var oData = oModel.getData()

          // "Причесываем" данные
          oData.completedText = oData.completed ? 'Выполнено' : 'В ожидании'
          oData.state = oData.completed ? 'Success' : 'Warning'

          oModel.setData(oData) // Обновляем модель дополненными данными
          oView.setModel(oModel)

          // На всякий случай обновляем текст заголовка напрямую, если биндинг не сработал
          oView.byId('todoTitle').setText(oData.title)
        })
        .catch(function (oError) {
          console.error('--- 6. Ошибка загрузки данных:', oError)
        })
    },
  })
})
