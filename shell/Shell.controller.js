sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', "com/epic/helpers/StorageModel"], (Controller, JSONModel, StorageModel) => {
  'use strict'

  return Controller.extend('com.epic.shell.Shell', {
    onInit: function () {
      const oComponent = this.getOwnerComponent()
      const _oHost = oComponent._oHost // Вот он!

      // this.getOwnerComponent().getRouter().initialize()
      // // В Shell.controller.js перед созданием Хоста
      // sap.ui.getCore().loadLibrary('sap.ui.integration')

      // this._oHost = new sap.ui.integration.Host({
      //   id: 'epicHost',
      //   extension: 'com/epic/shell/HostExtension', // Путь к файлу
      // })

      // // Создаем хранилище подписчиков (наш Hub)
      // this._oHost._mSubscribers = {}

      // // Метод подписки
      // this._oHost.subscribe = function (sTopic, fnHandler) {
      //   if (!this._mSubscribers[sTopic]) {
      //     this._mSubscribers[sTopic] = []
      //   }
      //   this._mSubscribers[sTopic].push(fnHandler)
      //   console.log(`[Hub] Новый подписчик на тему: ${sTopic}`)
      // }

      // // Метод публикации
      // this._oHost.publish = function (sTopic, oData) {
      //   console.log(`[Hub] Публикация в тему ${sTopic}:`, oData)
      //   const aHandlers = this._mSubscribers[sTopic] || []
      //   aHandlers.forEach(fn => fn(oData))
      // }

      // this._oHost.subscribe('StalkerTeleport', function (oData) {
      //   console.log("Шелл поймал сигнал Резонантора! Координаты для Сталкера: ", oData.targetId)

      //   // А вот теперь мы дома, в Шелле, и роутер здесь — наш законный инструмент
      //   const oRouter = this.getRouter()

      //   oRouter.navTo("mirror", {
      //     id: oData.targetId
      //   })
      // }.bind(this)) // .bind(this) важен, чтобы внутри функции "this" оставался Шеллом

      // 2. Находим наши карточки по ID
      const oArchimage = this.getView().byId('archimageCard')
      const oTelepath = this.getView().byId('telepathCard')
      const oOracleV2 = this.getView().byId('oracleComponentCard')
      const oChronicler = this.getView().byId('chroniclerCard')
      const oAlchemist = this.getView().byId('alchemistCard')

      // 3. Вручную передаем им объект Хоста
      if (oArchimage) { oArchimage.setHost(this._oHost) }
      oArchimage.attachAction(function (oEvent) {
        const oParameters = oEvent.getParameter("parameters")

        if (oParameters.method === "TRANSMUTE") {
          const sNewRecipe = `Рецепт #${oParameters.id}: ${oParameters.title}`

          // 2. Прямая трансмутация параметров!
          oAlchemist.setParameters({ "recipe": sNewRecipe })
          console.log("[Host] Параметры Алхимика обновлены!")
        }
      })
      if (oTelepath) { oTelepath.setHost(_oHost) }
      if (oOracleV2) { oOracleV2.setHost(_oHost) }
      if (oChronicler) { oChronicler.setHost(_oHost) }
      if (oAlchemist) { oAlchemist.setHost(_oHost) }
      // эта прокси-модель для LocalStorage
      this._oStorageModel = new StorageModel()
      // this.getView().setModel(this._oStorageModel, "chronicler")
      _oHost.setModel(this._oStorageModel, "chronicler")

      // Называем модель именно "host", чтобы манифесты карточек её видели
      const oHostModel = new JSONModel({ selectedId: 'Сигнала нет...' })
      _oHost.setModel(oHostModel, 'host')

      // Здесь можно инициализировать общие данные хоста, если нужно
      console.log('Mr. Host (Shell) is ready to coordinate.')
    },

    onAfterRendering: function () {
      // const oHost = this._oHost // Твой созданный Хост
      const oComponent = this.getOwnerComponent()
      const oHost = oComponent._oHost 
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
  })
})
