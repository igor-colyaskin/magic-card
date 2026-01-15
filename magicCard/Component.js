sap.ui.define(['sap/ui/core/UIComponent'], function (UIComponent) {
  'use strict'

  return UIComponent.extend('magic.card.Component', {
    init: function () {
        console.log("--- 1. Component: init вызван");
      UIComponent.prototype.init.call(this)
    },

    // Метод, который вызовет Host, когда карточка будет готова
    onCardReady: function (oCard) {
        console.log("--- 2. Component: onCardReady ВЫПОЛНЕН. Объект Card получен.");
      this.oCard = oCard
    },

    getCard: function () {
      return this.oCard
    },
  })
})
