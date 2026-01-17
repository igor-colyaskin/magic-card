sap.ui.define(
  ['sap/ui/core/mvc/Controller', 'sap/m/StandardListItem', 'sap/ui/integration/Host'],
  function (Controller, StandardListItem, Host) {
    'use strict'

    return Controller.extend('com.epic.cards.archimage.controller.Archimage', {
      onInit: function () {
        var oComponent = this.getOwnerComponent()

        if (oComponent.getCard()) {
          this._loadData()
        } else {
          setTimeout(this._loadData.bind(this), 1000)
        }
      },

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
        const oContext = oEvent.getSource().getBindingContext()
        const sSelectedId = oContext.getProperty('id')

        console.log(`Выбран ID: ${sSelectedId}`)

        const oCard = this.getOwnerComponent().getCard()
        const oHost = sap.ui.getCore().byId(oCard.getHost())

        if (oHost && oHost.publish) {
          oHost.publish('com.epic.telepathy.taskSelected', { taskId: sSelectedId })
        }

        // 2. НОВАЯ МАГИЯ: Обновление контекста (для Оракула)
        // Мы создаем в контексте Хоста переменную 'selectedId'
        // if (oHost && oHost.getContext()) {
        //   oHost.getContext().update({
        //     selectedId: sId,
        //   })
        //   console.log('Archimage: Контекст Хоста обновлен!')
        // }
        if (oHost) {
          const oHostModel = oHost.getModel('host')
          if (oHostModel) {
            oHostModel.setProperty('/selectedId', sSelectedId)
            console.log('Архимаг записал ID в модель Хоста:', sSelectedId)
          }
        }
      },
    })
  },
)
