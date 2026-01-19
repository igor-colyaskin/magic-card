sap.ui.define(['sap/ui/core/UIComponent'], function (UIComponent) {
  'use strict'

  return UIComponent.extend('com.epic.cards.alchemistAction.Component', {
    init: function () {
      UIComponent.prototype.init.call(this)
    },

    // Метод, который вызовет Host, когда карточка будет готова
    onCardReady: function (oCard) {
      // Берем модель у карточки и регистрируем её внутри компонента под тем же именем
      this.oCard = oCard      
      this.setModel(oCard.getModel("parameters"), "parameters")

    },
    
    getCard: function () {
      return this.oCard
    },
  })
})
