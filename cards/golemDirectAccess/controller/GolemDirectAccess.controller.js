sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
  'use strict'

  return Controller.extend('com.epic.cards.golemDirectAccess.controller.GolemDirectAccess', {
    onReset: function () {
      this.getView().byId("golemTaskDisplay").setText("Ожидаю приказа...")
    }
  })
})
