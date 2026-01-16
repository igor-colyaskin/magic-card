sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/m/StandardListItem'], function (Controller, StandardListItem) {
  'use strict'

  return Controller.extend('magicCard.controller.Main', {
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
      const oList = oView.byId('todoList')

      oModel
        .loadData('https://jsonplaceholder.typicode.com/todos?_limit=5')
        .then(() => {
          const aData = oModel.getData()

          aData.forEach(function (oItem) {
            oItem.completedText = oItem.completed ? 'Done' : 'Pending'
            oItem.state = oItem.completed ? 'Success' : 'Warning'
          })

          oModel.setData(aData)
          // ПРОГРАММНЫЙ БИНДИНГ
          // 1. Создаем шаблон (как будет выглядеть каждая строка)
          const oItemTemplate = new StandardListItem({
            title: '{title}',
            info: '{completedText}',
            infoState: '{state}',
            icon: 'sap-icon://task',
            type: 'Active', // Делаем строку кликабельной (появится рука при наведении)
            press: this.onItemPress.bind(this),
          })

          // 2. Привязываем агрегацию "items" к корню модели "/"
          oList.bindItems({
            path: '/',
            template: oItemTemplate,
          })

          console.log('Биндинг списка завершен программно')
        })
        .catch(function (oError) {
          console.error('--- 6. Ошибка загрузки данных:', oError)
        })
    },

    onItemPress: function (oEvent) {
      const oItem = oEvent.getSource()
      const oContext = oItem.getBindingContext()
      const sId = oContext.getProperty('id')

      console.log(`Выбран ID: ${sId}`)

      // Используем встроенный механизм действий карточки
      // Это "чистый" способ сказать Хосту: "Произошло событие!"
      const oCard = this.getOwnerComponent().getCard()
      oCard.triggerAction({
        type: 'Custom',
        parameters: {
          selectedId: sId,
        },
      })
    },
  })
})
