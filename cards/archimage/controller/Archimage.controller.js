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
        const oItem = oEvent.getSource().getBindingContext().getObject()
        const sSelectedId = oItem.id
        const sTitle = oItem.title

        console.log(`Выбран ID: ${sSelectedId}`)

        const oCard = this.getOwnerComponent().getCard()
        const oHost = sap.ui.getCore().byId(oCard.getHost())
        const oStorageModel = oHost ? oHost.getModel("chronicler") : null

        // 1. Магия для Telepath'а: публикация события через epicSubPub
        if (oHost && oHost.publish) {
          oHost.publish('com.epic.telepathy.taskSelected', { taskId: sSelectedId })
        }

        // 2. НОВАЯ МАГИЯ: Обновление контекста (для Оракула)
        // Мы создаем в контексте Хоста переменную 'selectedId'
        if (oHost) {
          const oHostModel = oHost.getModel('host')
          if (oHostModel) {
            oHostModel.setProperty('/selectedId', sSelectedId)
            console.log('Архимаг записал ID в модель Хоста:', sSelectedId)
            // 2. Явный вызов логики Оракула через его Extension

            // const oOracleCard = sap.ui.getCore().byId("oracleCard") // или через getView().byId
            const oOracleCard = sap.ui.core.Element.registry.filter(c =>
              c.getMetadata().getName() === "sap.ui.integration.widgets.Card" &&
              c.getId().endsWith("oracleCard")
            )[0]
            console.log("Найденная карта Оракула:", oOracleCard)
          }
        }

        if (oStorageModel) {
          // Мы просто добавляем запись в модель, а StorageModel сама 
          // сделает localStorage.setItem под капотом
          oStorageModel.addNewEntry({
            id: sSelectedId,
            title: sTitle,
            at: new Date().toLocaleTimeString()
          })
          oHost.publish("CHRONICLE_UPDATED")
        }

        // Триггерим экшен карточки для Алхимика
        oCard.triggerAction({
          type: 'Custom',
          parameters: {
            method: 'TRANSMUTE',
            id: oItem.id,
            title: oItem.title
          }
        })
      },
    })
  },
)
