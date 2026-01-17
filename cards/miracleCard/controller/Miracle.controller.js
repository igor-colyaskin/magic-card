sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
  'use strict'

  return Controller.extend('com.epic.cards.miracleCard.controller.Miracle', {
    onInit: function () {
      // Модель уже создана манифестом, просто берем её
      const oModel = this.getOwnerComponent().getModel()

      // Можно положить туда начальные данные
      oModel.setData({ title: 'Select a task from the list' })
    },

    // ЭТОТ МЕТОД МЫ ВЫЗОВЕМ ИЗ INDEX.HTML
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
