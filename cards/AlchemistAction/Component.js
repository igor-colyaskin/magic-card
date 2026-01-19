sap.ui.define(['sap/ui/core/UIComponent'], function (UIComponent) {
  'use strict'

  return UIComponent.extend('com.epic.cards.alchemistAction.Component', {
    init: function () {
      UIComponent.prototype.init.call(this)
    },

    // Метод, который вызовет Host, когда карточка будет готова
    onCardReady: function (oCard) {
      this.oCard = oCard
    },

    getCard: function () {
      return this.oCard
    },
  })
})
