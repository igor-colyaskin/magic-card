sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
  'use strict'

  return Controller.extend('com.epic.cards.oracleContext.controller.OracleContext', {
    onInit: function () {
      setTimeout(() => {
        const oCard = this.getOwnerComponent().getCard()
        const oHost = sap.ui.getCore().byId(oCard.getHost())

        if (oHost && oHost.subscribe) {
          oHost.subscribe('com.epic.telepathy.taskSelected', oData => {
            console.log('Telepath: Мысль получена через Резонантор!', oData.taskId)
            this.loadTaskDetails(oData.taskId)
          })
        }
      }, 100)
      // Модель уже создана манифестом, просто берем её
      const oModel = this.getOwnerComponent().getModel()

      // Можно положить туда начальные данные
      oModel.setData({ title: 'Select a task from the list' })
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
