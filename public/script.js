document.addEventListener("DOMContentLoaded", () => {
    fetchBakimKayitlari();
});

const express = require('express');
const app = express();
const path = require('path');

// Public klasörünü statik olarak kullan
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log("Server 3000 portunda çalışıyor...");
});


function fetchBakimKayitlari() {
    fetch("http://localhost:5000/api/admin/bakimlar", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("bakimTableBody");
            tableBody.innerHTML = "";

            data.forEach((bakim, index) => {
                const row = `<tr>
                <td>${index + 1}</td>
                <td>${bakim.musteri}</td>
                <td>${bakim.calisan}</td>
                <td>${new Date(bakim.tarih).toLocaleString()}</td>
                <td>${bakim.aciklama}</td>
            </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error("Veri çekme hatası:", error));
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
