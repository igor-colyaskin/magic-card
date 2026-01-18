sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
    "use strict"

    return JSONModel.extend("com.epic.helpers.StorageModel", {
        constructor: function () {
            JSONModel.apply(this, arguments)
            this.refreshFromStorage()

            // "Взрослый" способ следить за изменениями в текущем окне
            // Каждые 2 секунды синхронизируем данные (polling), 
            // либо можно вызывать это принудительно через Резонантор
            // setInterval(() => this.refreshFromStorage(), 2000)
        },

        // helpers/StorageModel.js

        refreshFromStorage: function () {
            const sKey = "archimage_history"
            const sRawData = localStorage.getItem(sKey)
            let aItems = []

            if (sRawData) {
                try {
                    aItems = JSON.parse(sRawData)
                } catch (e) {
                    console.error("Хранитель не смог расшифровать записи:", e)
                }
            }

            const oData = {
                items: aItems,
                count: aItems.length
            }

            // Обновляем модель, только если данные действительно изменились
            if (JSON.stringify(this.getData()) !== JSON.stringify(oData)) {
                this.setData(oData)
                console.log(`[Chronicler] История обновлена. Записей: ${oData.count}`)
            }
        },
        addNewEntry: function (oEntry) {
            const oData = this.getData()
            if (!oData.items) { oData.items = [] }

            // Добавляем в начало списка
            oData.items.unshift(oEntry)
            oData.count = oData.items.length

            this.setData(oData) // Обновляем UI всех, кто подписан

            // Сохраняем весь массив в один ключ для простоты Хроникера
            localStorage.setItem("archimage_history", JSON.stringify(oData.items))
            console.log("[StorageModel] История обновлена Архимагом")
        }
    })
})