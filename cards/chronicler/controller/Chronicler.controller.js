sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
  'use strict'

  return Controller.extend('com.epic.cards.chronicler.controller.Chronicler', {
    onInit: function () {
      // const oModel = this.getView().getModel("chronicler")
      const oCard = this.getOwnerComponent().getCard()
      const oHost = sap.ui.getCore().byId(oCard.getHost())
      const oModel = oHost.getModel("chronicler")
      this.getView().setModel(oModel)
      const oList = this.byId("chroniclerList");

      // Создаем шаблон программно
      const oItemTemplate = new sap.m.StandardListItem({
        title: "{title}",
        description: "{at}",
        info: "{id}"
      })

      // Принудительно биндим агрегацию items
      oList.bindItems({
        path: "/items",
        template: oItemTemplate,
        templateShareable: false
      })

      if (oHost && oHost.subscribe) {
        oHost.subscribe("CHRONICLE_UPDATED", () => {
          console.log('refresh local storage model')
          oModel.refreshFromStorage()
        })
      }
    },

    loadTaskDetails: function (sId) {
      const oModel = this.getView().getModel()
      const sUrl = `https://jsonplaceholder.typicode.com/todos/${sId}`

      oModel.loadData(sUrl).then(() => {
        const oData = oModel.getData()
        oData.completedText = oData.completed ? 'Done' : 'In Progress'
        oData.state = oData.completed ? 'Success' : 'Warning'
        oModel.setData(oData)
      })
    },
  })
})
