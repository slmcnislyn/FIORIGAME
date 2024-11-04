sap.ui.define([
    "sap/ui/core/Control"
],
function (Control) {
    "use strict";
 
    return Control.extend("com.smod.ux.customcontrol.custom.Card", {
        metadata: {
            properties: {
                title: {
                    type: "string",
                    bindable: true,
                },
                description: {
                    type: "string",
                    bindable: true,
                },
                imageSrc: {
                    type: "string",
                    bindable: true,
                },
                enabled: {
                    type: "boolean",
                    bindable: true,
                    defaultValue: true
                },
                isFlipped: {
                    type: "boolean", 
                    defaultValue: false 
                }
            },
            events: {
                click: {}
            }
           
        },

        init: function () {
            const sLibraryPath = jQuery.sap.getModulePath("com.smod.ux.customcontrol");
            jQuery.sap.includeStyleSheet(sLibraryPath + "/custom/Card.css");
      
            // Rastgele Pokémon ismiyle görsel yükle
            this.loadRandomImage();
        },

        loadRandomImage: function () {
            // Pokémon isimlerini bir dizide tanımla
            this.aPokemonNames = [
                "Bulbasaur",
                "Ivysaur",
                "Venusaur",
                "Charmander",
                "Charmeleon",
                "Charizard",
                "Squirtle",
                "Wartortle",
                "Blastoise",
                "Primeape"
                // Diğer Pokémon isimlerini ekleyin
            ];

            // Rastgele bir Pokémon ismi seç ve URL oluştur
            const randomName = this.aPokemonNames[
                Math.floor(Math.random() * this.aPokemonNames.length)
            ];
            const randomImageUrl = `https://img.pokemondb.net/sprites/home/normal/2x/${randomName.toLowerCase()}.jpg`;

            // imageSrc özelliğine rastgele URL'yi ata
            this.setImageSrc(randomImageUrl);
        },

        showGameOverVisual: function() {
            const oGameOverDiv = document.createElement("div");
            oGameOverDiv.className = "game-over-visual";
            oGameOverDiv.innerHTML = "<h1>Oyun Bitti!</h1><p>Teşekkür ederiz, tekrar oynamak için tıklayın.</p>";

            // Opsiyonel olarak, oyunu yeniden başlatma butonu ekleyin
            const restartButton = document.createElement("button");
            restartButton.innerText = "Yeniden Başla";
            restartButton.onclick = () => {
                // Oyunu yeniden başlatma mantığı
                this.restartGame();
                oGameOverDiv.remove(); // Oyun bitiş görselini kaldır
            };
            oGameOverDiv.appendChild(restartButton);

            // Ana konteynı ekleyin
            document.getElementById("your-main-container-id").appendChild(oGameOverDiv);
        },

        renderer: {
            render: function(oRM, oControl) {
                // Ana div başlangıcı
                oRM.openStart("div", oControl)
                    .class("smod-ux-card")
                    .class(oControl.getIsFlipped() ? "flipped" : "")
                    .openEnd();
                
                // İç kart yapısı - ön ve arka yüz
                oRM.openStart("div")
                    .class("smod-ux-card-inner") // İç yapı
                    .openEnd();
                
                // Kartın arka yüzü (resim burada)
                oRM.openStart("div")
                    .class("smod-ux-card-back") // Arka yüz
                    .openEnd();
                  
                oRM.openStart("img")
                    .attr("src", oControl.getImageSrc())
                    .attr("alt", oControl.getTitle())
                    .openEnd()
                    .close("img");
                oRM.openStart("div")
                    .class("smod-ux-card-title")
                    .openEnd()
                    .text(oControl.getTitle())
                    .openStart("div")
                    .class("smod-ux-card-description")
                    .openEnd()
                    .text(oControl.getDescription())
                    .close("div")
                    .close("div");

                oRM.close("div"); // Kartın arka yüzünü kapat
                
                // Kartın ön yüzü (başlık ve açıklama)
                oRM.openStart("div")
                    .class("smod-ux-card-front") // Ön yüz
                    .openEnd();
                
                // Başlık
                // Açıklama
                oRM.openStart("div")
                    .class("smod-ux-card-description")
                    .openEnd()
                    .text(oControl.getDescription())
                    .close("div");
                
                oRM.close("div"); // Kartın ön yüzünü kapat
                
                oRM.close("div"); // İç kart yapısını kapat
                oRM.close("div"); // Ana divi kapat
            }
        },
     
        ontap: function(oEvent) {
            oEvent.preventDefault();
                 
            if (!this.getEnabled()) {
                return;
            }
            
            // Kartı çevirmek için "flipped" sınıfını ekle/kaldır
            if (!this.isMatched) { // Eğer kart eşleşmemişse
                this.$().toggleClass("flipped");
               
                const imageSrc = this.getImageSrc();
                const oEventBus = sap.ui.getCore().getEventBus();
                oEventBus.publish("Card", "Click", {
                    clickedItem: this,
                    imageSrc: imageSrc
                });
            }
        },
    });
});
