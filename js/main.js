async function loadConfig() {
      try {
        let response = await fetch("config.json");
        let config = await response.json();

        let startDate = new Date(config.startDate);
        let initialDays = config.initialDays;

        function updateDaysCount() {
          let now = new Date();
          let diffMs = now - startDate;
          let passedDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          let totalDays = initialDays + passedDays;

          document.getElementById("daysCount").textContent =
            totalDays + " дней";
        }

        function scheduleMidnightUpdate() {
          let now = new Date();
          let tomorrow = new Date(now);
          tomorrow.setHours(24, 0, 0, 0);

          function logCountdown() {
            let diff = tomorrow - new Date();

            if (diff <= 0) return; // чтобы не уходило в минус

            let hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
            let minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
            let seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

            console.log(`До обновления: ${hours}:${minutes}:${seconds}`);
          }

          // сразу показать отсчёт
          logCountdown();

          // каждую секунду обновлять таймер
          let countdownInterval = setInterval(logCountdown, 1000);

          let timeToMidnight = tomorrow - now;

          setTimeout(() => {
            clearInterval(countdownInterval); // останавливаем секундомер
            updateDaysCount();
            setInterval(updateDaysCount, 24 * 60 * 60 * 1000);
          }, timeToMidnight);
        }

        // Первое обновление сразу
        updateDaysCount();
        scheduleMidnightUpdate();

      } catch (err) {
        document.getElementById("daysCount").textContent =
          "Ошибка загрузки config.json";
        console.error(err);
      }
    }

    loadConfig();