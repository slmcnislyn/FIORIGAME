sap.ui.define([
    "sap/ui/layout/Grid"
],
function (Grid) {
    "use strict";

    return Grid.extend("com.smod.ux.customcontrol.custom.CardContainer", {
        metadata: {
            properties: {
            },
            aggregations: {
               
                    cards: {
                        type: "com.smod.ux.customcontrol.custom.Card",
                        multiple: true,
                        
                    }
            },
            events:{
                click:{
                    parameters:{
                        clickedItem:{
                            type: "com.smod.ux.customcontrol.custom.Card"
                        }
                    }
                }
            }
        },
        init: function () {
        
        } ,
        renderer: {
            render: function(oRM, oControl) {
                // Kart Container divi
                oRM.openStart("div", oControl)
                    .class("smod-ux-card-container") // Özel CSS sınıfı
                    .openEnd();

                // Kartları render et
                const aCards = oControl.getCards(); // Kartları al
                for (let i = 0; i < aCards.length; i++) {
                    oRM.renderControl(aCards[i]); // Her bir kartı render et
                }

                oRM.close("div"); // Kart Container divini kapat
            }
        }

    });
});
