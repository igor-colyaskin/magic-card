sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel'], (Controller, JSONModel) => {
  'use strict'

  return Controller.extend('com.epic.shell.Shell', {
    onInit: function () {
      // В Shell.controller.js перед созданием Хоста
      sap.ui.getCore().loadLibrary('sap.ui.integration')

      this._oHost = new sap.ui.integration.Host({
        id: 'epicHost',
        extension: 'com/epic/shell/HostExtension', // Путь к файлу
      })

      // Создаем хранилище подписчиков (наш Hub)
      this._oHost._mSubscribers = {}

      // Метод подписки
      this._oHost.subscribe = function (sTopic, fnHandler) {
        if (!this._mSubscribers[sTopic]) {
          this._mSubscribers[sTopic] = []
        }
        this._mSubscribers[sTopic].push(fnHandler)
        console.log(`[Hub] Новый подписчик на тему: ${sTopic}`)
      }

      // Метод публикации
      this._oHost.publish = function (sTopic, oData) {
        console.log(`[Hub] Публикация в тему ${sTopic}:`, oData)
        const aHandlers = this._mSubscribers[sTopic] || []
        aHandlers.forEach(fn => fn(oData))
      }

      // 2. Находим наши карточки по ID
      const oArchimage = this.getView().byId('archimageCard')
      const oTelepath = this.getView().byId('telepathCard')
      // const oOracle = this.getView().byId('oracleCard')

      // 3. Вручную передаем им объект Хоста
      if (oArchimage) {
        oArchimage.setHost(this._oHost)
      }
      if (oTelepath) {
        oTelepath.setHost(this._oHost)
      }
      
      const oHostModel = new JSONModel({
        selectedId: 'Сигнала нет...',
      })

      // Называем модель именно "host", чтобы манифесты карточек её видели
      this._oHost.setModel(oHostModel, 'host')
      // Здесь можно инициализировать общие данные хоста, если нужно
      console.log('Mr. Host (Shell) is ready to coordinate.')
    },

    onAfterRendering: function () {
      const oHost = this._oHost // Твой созданный Хост
      const oOracle = this.getView().byId('oracleCard')

      if (oOracle) {
        // Привязываем Хост
        oOracle.setHost(this._oHost)

        // ВРУЧНУЮ пробрасываем модель.
        // Если автоматика Host API не справляется, это наш железный аргумент.
        const oHostModel = this._oHost.getModel('host')
        oOracle.setModel(oHostModel, 'host')

        console.log("Оракул: Связь установлена, модель 'host' передана.")
      } else {
        console.error("Оракул не найден! Проверь ID='oracleCard' в Shell.view.xml")
      }
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
