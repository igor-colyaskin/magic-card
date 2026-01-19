sap.ui.define(['sap/ui/core/UIComponent', "sap/ui/integration/Host"], function (UIComponent, Host) {
  'use strict'
  return UIComponent.extend('com.epic.shell.Component', {
    metadata: { manifest: 'json' },

    init: function () {
      UIComponent.prototype.init.apply(this, arguments)
      const oRouter = this.getRouter()
      oRouter.initialize()

      // Создаем экземпляр Хоста
      this._oHost = new sap.ui.integration.Host("epicHost")

      // Инициализируем хранилище подписчиков
      this._oHost._mSubscribers = {}

      // Добавляем методы Резонантора прямо в объект oHost
      this._oHost.subscribe = function (sTopic, fnHandler, oContext) {
        if (!this._mSubscribers[sTopic]) {
          this._mSubscribers[sTopic] = []
        }
        const fnBound = oContext ? fnHandler.bind(oContext) : fnHandler
        this._mSubscribers[sTopic].push(fnBound)
      }

      this._oHost.publish = function (sTopic, oData) {
        console.log(`[Эфирный Резонантор] Вещание в тему ${sTopic}:`, oData)
        const aHandlers = this._mSubscribers[sTopic] || []
        aHandlers.forEach(fn => fn(oData))
      }

      // Подписываем Шелл на телепортацию Сталкера
      this._oHost.subscribe('com.epic.telepathy.taskSelected', function (oData) {
        oRouter.navTo("mirror", {
          id: oData.taskId
        })
      }, this)
    }
  })
})
