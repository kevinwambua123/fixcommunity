document.addEventListener("DOMContentLoaded", function () {
  const reportForm = document.getElementById("reportForm");
  const recentReportsList = document.getElementById("recentReportsList");
  const reportMessage = document.getElementById("reportMessage");

  const STORAGE_KEY = "communityFixReports";

  function getReports() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveReports(reports) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }

  function displayRecentReports() {
    if (!recentReportsList) return;

    const reports = getReports();

    recentReportsList.replaceChildren();

    if (reports.length === 0) {
      const message = document.createElement("p");
      message.textContent = "No reports submitted yet.";
      recentReportsList.appendChild(message);
      return;
    }

    reports.slice(0, 10).forEach(function (report) {
      const card = document.createElement("article");
      card.className = "report-card";

      const title = document.createElement("h3");
      title.textContent = report.category;

      const location = document.createElement("p");
      location.textContent =
        "Location: " + report.location + ", " + report.county;

      const description = document.createElement("p");
      description.textContent = report.description;

      const date = document.createElement("small");
      date.textContent = "Submitted: " + report.date;

      const status = document.createElement("p");
      status.textContent = "Status: " + report.status;

      card.append(title, location, description, date, status);

      if (report.photo) {
        const image = document.createElement("img");
        image.src = report.photo;
        image.alt = "Photo for " + report.category + " report";
        image.className = "report-photo";
        card.appendChild(image);
      }

      recentReportsList.appendChild(card);
    });
  }

  if (reportForm) {
    reportForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const category = document.getElementById("category").value.trim();
      const county = document.getElementById("county").value.trim();
      const location = document.getElementById("location").value.trim();
      const description = document.getElementById("description").value.trim();
      const photoInput = document.getElementById("reportPhoto");

      let photo = "";

      if (photoInput && photoInput.files.length > 0) {
        const file = photoInput.files[0];

        if (!file.type.startsWith("image/")) {
          reportMessage.textContent = "Please select an image file.";
          return;
        }

        if (file.size > 1024 * 1024) {
          reportMessage.textContent =
            "Please choose an image smaller than 1 MB.";
          return;
        }

        photo = await new Promise(function (resolve, reject) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        }).catch(function () {
          return "";
        });

        if (!photo) {
          reportMessage.textContent = "The photo could not be loaded.";
          return;
        }
      }

      const newReport = {
        id: "CF-" + Date.now(),
        category: category,
        county: county,
        location: location,
        description: description,
        photo: photo,
        date: new Date().toLocaleString(),
        status: "Pending",
      };

      const reports = getReports();
      reports.unshift(newReport);

      try {
        saveReports(reports);
      } catch (error) {
        reportMessage.textContent =
          "Storage is full. Try submitting a smaller photo.";
        return;
      }

      displayRecentReports();
      reportForm.reset();

      reportMessage.textContent = "Report submitted successfully!";
    });
  }

  displayRecentReports();
});
