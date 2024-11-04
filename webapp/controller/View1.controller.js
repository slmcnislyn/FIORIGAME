sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "com/smod/ux/customcontrol/custom/Card",
    "com/smod/ux/customcontrol/custom/TimerControl",

    
], function (Controller, MessageToast,Card, TimerControl) {
    "use strict";

    return Controller.extend("com.smod.ux.customcontrol.controller.View1", {
     
        onInit: function () {
            this.openCards = [];
            this.oTimer = new com.smod.ux.customcontrol.custom.TimerControl();
            this.oTimer.attachTimeout(this.onTimeOut, this);
            const oView = this.getView();
            oView.byId("timerContainer").addItem(this.oTimer);
            const username = localStorage.getItem("username");
            if (username) {
                oView.byId("usernameInput").setValue(username);
            }
            const oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("Card", "Click", this.onBusCardClick, this );
        },
        startTimer: function() {
            this.oTimer.start(120); // 60 saniye örnek başlangıç süresi 
        },
        
        onTimeOut: function() {
            // Zaman dolduğunda yapılacak işlemler
            MessageToast.show("Süre doldu! Oyun bitti.");
        },
    
        onPauseGame: function () {
       
            this.oTimer.stop(); // Zamanlayıcıyı durdur
            this.isPaused = true;
            // Kartların tıklanabilirliğini kapat
            const oCardContainer = this.getView().byId("cardContainer");
          
            oCardContainer.getCards().forEach(card => {
              
                card.setEnabled(false);
            });
         
            MessageToast.show("Oyun durduruldu.");
     
        },
        onResumeGame: function () {
            if (this.isPaused) {
            
                this.oTimer.resume(); // Zamanlayıcıyı devam ettir
                this.isPaused = false;

                // Kartların tıklanabilirliğini aç
                const oCardContainer = this.getView().byId("cardContainer");
                oCardContainer.getCards().forEach(card => {
                    if (!card.isMatched) { // Sadece eşleşmemiş kartlar tıklanabilir olsun
                        card.setEnabled(true);
                    }
                });

                MessageToast.show("Oyun devam ediyor.");
            }
        },
        onRestartGame: function () {
            this.onStartGame(); // Oyun başlangıç fonksiyonunu çağır
            MessageToast.show("Oyun yeniden başlatıldı.");
        },
       
        onStartGame: function () {
            const oView = this.getView();
            const username = oView.byId("usernameInput").getValue();
            const difficulty = oView.byId("difficultySelect").getSelectedKey();
            oView.byId("startbutton").setVisible(false); 
            // Kullanıcı adını local storage'a kaydet
            localStorage.setItem("username", username);
            let cardCount = 0;
            let defaultSpan = "XL2 L2 M4 S6"; // Varsayılan span
        
            switch (difficulty) {
                case "easy":
                    cardCount = 4; // Kolay seviyede 4 kart
                    defaultSpan = "XL2 L4 M4 S2"; // Geniş ekran için 4 sütun
                    break;
                case "medium":
                    cardCount = 6; // Orta seviyede 6 kart
                    defaultSpan = "XL2 L2 M4 S6"; // Geniş ekran için 4 sütun, orta için 3 sütun
                    break;
                case "hard":
                    cardCount = 8; // Zor seviyede 8 kart
                    defaultSpan = "XL1 L1 M4 S6"; // Geniş ekran için 4 sütun
                    break;
                default:
                    cardCount = 0; // Varsayılan olarak 0 kart
            }
            this.cardCount = cardCount;
            // Başlatma ile ilgili bilgi mesajı
            MessageToast.show(`Oyun Başladı! Hoş geldin, ${username}. Zorluk: ${difficulty}`);
        
            // Kartları göster
            this.matchedPairs = 0; // Y
            this.showCards(cardCount, defaultSpan);
            this.startTimer();
          
        },
        
        showCards: function (cardCount, defaultSpan) {
            const oView = this.getView();
            const oCardContainer = oView.byId("cardContainer");
            oCardContainer.setVisible(true);
            oCardContainer.removeAllCards(); // Mevcut kartları temizle
        
            // Kartları oluştur
            const kartlar = [];
            const totalPairs = cardCount / 2; // Eşleşen kart çiftleri sayısı
        
            for (let i = 0; i < totalPairs; i++) {
                const oCard = new com.smod.ux.customcontrol.custom.Card({
                    busy: false,
                    title: `Pokémon ${i + 1}`,
                 
                    enabled: true,
                  // Kartın resim kaynağı
                });
                kartlar.push(oCard, oCard.clone()); // Aynı kartın bir kopyasını ekle
            }
        
            // Kartları rastgele karıştırma
            const karilmisKartlar = this.karistir(kartlar);
        
            // Kartları ekle
            karilmisKartlar.forEach(oCard => {
                oCardContainer.addAggregation("cards", oCard); // Kartı Container'a ekle
            });
        
            // Span ayarlarını güncelle
            oCardContainer.setDefaultSpan(defaultSpan);
            oCardContainer.invalidate(); // Container'ı yeniden çiz
        },
        
        karistir: function(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }
,        
        karistir: function(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        },

    


            onBusCardClick: function(sChannel, sEvent, oData) {
         
                const clickedItem = oData?.clickedItem;
                if (this.firstCard && this.firstCard.isMatched) {
                    console.log("İki kart açıldı, başka bir karta tıklanamaz.");
                    return;
                }
                if (this.firstCard) {
                    console.log(this.firstCard);
                    console.log(clickedItem);
        
                    if (this.firstCard.getImageSrc() === clickedItem.getImageSrc() &&  this.firstCard.sId !== clickedItem.sId ) {
                        console.log("Kartlar eşleşti! Açık kalacaklar.");
                        this.firstCard.setBusy(false);
                        clickedItem.setBusy(false);
                        
            
                        this.firstCard.$().addClass("flipped");
                        clickedItem.$().addClass("flipped");
                        this.firstCard.setProperty("isFlipped", true);
                        setTimeout(() => {
                            clickedItem.setProperty("isFlipped", true);
                        }, 700); 
            
                        this.firstCard.isMatched = true;
                        clickedItem.isMatched = true;
            
                        // Eşleşen kart çiftlerini say
                        this.matchedPairs++;
            
                        // Tüm kartlar eşleştirildiyse süreyi durdur
                        if (this.matchedPairs === (this.cardCount / 2)) {
                            this.oTimer.stop();
                            setTimeout(() => {
                                MessageToast.show("Tebrikler! Tüm kartları eşleştirdiniz.");
                            }, 700); 
                
                          
                            const username = localStorage.getItem("username");
                            const score = 100; // Burada skoru hesaplayabilirsiniz
                            localStorage.setItem(`score_${username}`, score);
                            const ascore = localStorage.getItem(`score_${username}`);
                            console.log(ascore);
                        }
            
                        this.firstCard = null;
                    } else {
                        console.log("Kartlar eşleşmedi! Kapalı olacaklar.");
                        this.openCards.push(this.firstCard, clickedItem);
                        setTimeout(() => {
                            this.firstCard.$().removeClass("flipped");
                            clickedItem.$().removeClass("flipped");
            
                            this.firstCard.setBusy(false);
                            clickedItem.setBusy(false);
                            this.firstCard = null;
                        }, 1000);
                    }
                } else {
                    // İlk tıklanan kart olarak sakla
                    this.firstCard = clickedItem;
                    setTimeout(() => {
                        clickedItem.setBusy(false);
                    }, 5000);
                }
            }
            
    });
});
