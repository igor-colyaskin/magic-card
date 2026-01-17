sap.ui.define(['sap/ui/core/mvc/Controller'], Controller => {
  'use strict'

  return Controller.extend('com.epic.shell.Shell', {
    onInit: function () {
      // Здесь можно инициализировать общие данные хоста, если нужно
      console.log('Mr. Host (Shell) is ready to coordinate.')
    },

    /**
     * Обработчик событий от карточек.
     * Настроен в Shell.view.xml через action="onCardAction"
     */
    onCardAction: function (oEvent) {
      const sActionType = oEvent.getParameter('type')
      const oParameters = oEvent.getParameter('parameters')

      // Мы реагируем только на наш кастомный тип действия
      if (sActionType === 'Custom' && oParameters.selectedId) {
        const sId = oParameters.selectedId
        console.log(`Shell: Поймал клик! Передаю ID ${sId} в Miracle Card`)

        this._updateDetailsCard(sId)
      }
    },

    /**
     * Внутренний метод для связи карточек
     */
    _updateDetailsCard: function (sId) {
      // 1. Находим объект детальной карточки по ID из View
      const oMiracleCard = this.getView().byId('miracleCard')

      if (oMiracleCard) {
        // 2. Пробираемся к внутреннему контроллеру карточки
        // Сначала получаем Component, потом RootControl (View), потом Controller
        const oCardContent = oMiracleCard.getCardContent()

        if (oCardContent && oCardContent.getComponentInstance) {
          const oComponent = oCardContent.getComponentInstance()
          const oController = oComponent.getRootControl().getController()

          // 3. Вызываем метод загрузки данных во второй карточке
          if (oController && typeof oController.loadTaskDetails === 'function') {
            oController.loadTaskDetails(sId)
          }
        } else {
          console.warn('Shell: Miracle Card еще не загрузила контент.')
        }
      }
    },
  })
})
