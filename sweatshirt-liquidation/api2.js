document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('formInfo');
    const packHeaders = document.querySelectorAll('.pack-header');
    const packDetails = document.querySelectorAll('.pack-details');
    let selectedPack = 0; // Par défaut, aucun pack n'est sélectionné

    // Afficher le Pack 2 par défaut
    packDetails[0].style.display = 'block';
    packHeaders[0].parentElement.style.border = '2px solid #333'; // Ajouter une bordure foncée

    packHeaders.forEach((header, index) => {
        header.addEventListener('click', function () {
            const packDetail = packDetails[index];
            const packContainer = header.parentElement;
            
            // Fermer tous les autres packs et supprimer leurs bordures
            packDetails.forEach((detail, i) => {
                if (i !== index) {
                    detail.style.display = 'none';
                    packHeaders[i].parentElement.style.border = 'none';
                    removeRequiredFromPack(i + 2);
                }
            });

            // Basculer la visibilité du pack cliqué et ajouter/supprimer la bordure
            if (packDetail.style.display === 'block') {
                packDetail.style.display = 'none';
                packContainer.style.border = 'none';
                removeRequiredFromPack(index + 2);
                selectedPack = 0;
            } else {
                packDetail.style.display = 'block';
                packContainer.style.border = '2px solid #333'; // Ajouter une bordure foncée
                addRequiredToPack(index + 2);
                selectedPack = index + 2;
            }

            // Mettre à jour la valeur du champ caché 'qte'
            document.getElementById('qte').value = selectedPack;
        });
    });

    function addRequiredToPack(packNumber) {
        const colorSelects = document.querySelectorAll(`[id^="product_color_${packNumber}"]`);
        const sizeSelects = document.querySelectorAll(`[id^="product_size_${packNumber}"]`);
        
        colorSelects.forEach(select => select.required = true);
        sizeSelects.forEach(select => select.required = true);
    }

    function removeRequiredFromPack(packNumber) {
        const colorSelects = document.querySelectorAll(`[id^="product_color_${packNumber}"]`);
        const sizeSelects = document.querySelectorAll(`[id^="product_size_${packNumber}"]`);
        
        colorSelects.forEach(select => select.required = false);
        sizeSelects.forEach(select => select.required = false);
    }

    // Ajouter l'attribut required au Pack 2 par défaut
    addRequiredToPack(2);

    // Gérer la soumission du formulaire
    form.addEventListener('submit', function(e) {
        if (selectedPack === 0) {
            e.preventDefault();
        }
    });

    $("#formInfo").submit(function (event) {
        event.preventDefault();

        var trafic_name = "";
        function hasFbclidParameter() {
            url = window.location.href;
            url.indexOf('fbclid') !== -1 ? trafic_name = 'Facebook' : '';
            url.indexOf('ttclid') !== -1 ? trafic_name = 'Tiktok' : '';
            url.indexOf('gclid') !== -1 ? trafic_name = 'Google Ads' : '';
        }
        hasFbclidParameter();

        $("#save_guest_order").prop("disabled", true);
        $("#span_loading").show();

        const formData = new FormData(this);
        let colors = [];
        let sizes = [];
        let total = 0;
        let quantity = 0;

        formData.forEach((value, key) => {
            if (key.startsWith('product_color') && value !== "") {
                colors.push(value);
            } else if (key.startsWith('product_size') && value !== "") {
                sizes.push(value);
            }
        });

        if (document.querySelector('.pack-details[style*="display: block"]')) {
            const packDetailsVisible = document.querySelector('.pack-details[style*="display: block"]');
            const packHeader = packDetailsVisible.previousElementSibling.querySelector('.title').textContent;

            switch (packHeader) {
                case 'واحدة ب 70 درهم':
                    total = 70;
                    quantity = 1;
                    break;
					case 'إثنان ب 140 درهم':
                    total = 140;
                    quantity = 2;
                    break;
                case 'إثنان + الثالث مجانا ب 338': 
                    total = 338;
                    quantity = 3;
                    break;
                default:
                    total = 0;
            }
        }

        const fullname = $('#formInfo input[name="fullname"]').val();
        const phone = $('#formInfo input[name="phone"]').val();
        const adresse = $('#formInfo input[name="adresse"]').val();

        const dateObject = new Date();
        const formattedDate = dateObject.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second:  '2-digit'
        }).replace(',', ' à');

        const colorsString = colors.join(', ');
        const sizesString = sizes.join(', ');

        var sheetDBData = {
            marchandise: "Sweatshirt",
            client: fullname,
            tlphone: phone,
            ville: "-",
            secteur: "Centre Ville",
            adresse: adresse,
            type: "Livraison CRBT",
            mode_paiement: "ESPECES",
            montant: total.toString(),
            caution: "0",
            n_cmd: "",
            poids: "Entre 1.2 Kg et 5 Kg",
            fragile: "0",
            declare_value_dh: "",
            valeur_du_poids_kg: "",
            profondeur_en_cm: "",
            longueur_en_cm: "",
            largeur_en_cm: "",
            commentaire: "",
            autoriser_ouverture: "1",
            nbre_de_colis: "1",
            numero_tel_a_notifier: "",
            tag: "",
            quantity: quantity.toString(),
            color: colorsString,
            size: sizesString,
            createdAt: formattedDate,
            status: "en cours",
            trafic: trafic_name,
        };

        console.log("sheetDBData", sheetDBData);

        fetch("https://sheetdb.io/api/v1/9ck3owwv3wurm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: sheetDBData }),
        })
        .then(function (response) {
            console.log("response", response);
            if (response.ok) {
                console.log("Order added to SheetDB successfully");
                fbq("track", "Purchase", {
                    value: total,
                    currency: "MAD",
                    content_name: "Pantalon",
                    content_type: "Home & Kitchen",
                    product_id: "1127",
                });
                
                // Clear all form fields
                $('#formInfo').trigger("reset");
                
                // Reset pack selection
                packDetails.forEach((detail, i) => {
                    detail.style.display = 'none';
                    packHeaders[i].parentElement.style.border = 'none';
                    removeRequiredFromPack(i + 2);
                });
                
                // Reset default pack (Pack 2)
                packDetails[0].style.display = 'block';
                packHeaders[0].parentElement.style.border = '2px solid #333';
                addRequiredToPack(2);
                
                // Reset selectedPack and hidden 'qte' field
                selectedPack = 2;
                document.getElementById('qte').value = selectedPack;
                
                colors = [];
                sizes = [];
                document.location.href = "order_success.html";
            } else {
                console.log("Failed to add order to SheetDB");
                $("#save_guest_order").prop("disabled", false);
                $("#span_loading").hide();
            }
        })
        .catch(function (error) {
            console.log("Error:", error);
            $("#save_guest_order").prop("disabled", false);
            $("#span_loading").hide();
        });
    });
});