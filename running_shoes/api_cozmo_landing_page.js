$("#formInfo").submit(function (event) {
  // show loading icon and disable the button
  $("#save_guest_order").prop("disabled", true);
  $("#span_loading").show();

  // Prevent the default form submission
  event.preventDefault();

  // Get the updated data from the form
  var fullname = $('#formInfo input[name="fullname"]').val();
  var phone = $('#formInfo input[name="phone"]').val();
  var adresse = $('#formInfo input[name="adresse"]').val();


  var variant = $('#formInfo select[name="tier_variante"]').val();
  var product_color = $('#formInfo select[name="product_color"]').val();
  // var number_tier = $('#formInfo input[name="number_tier"]').val();
  var price = $('#formInfo input[name="price_tiers"]').val();
  var product_size = $('#formInfo select[name="product_size"]').val();

  // Create the data object for SheetDB
  var sheetDBData = {
    date: new Date().toString(),
    Marchandise: "Running Shoes",
    Client: fullname,
    Tlphone: phone,
    Ville: "-",
    Secteur: "-",
    address: adresse,
    Type: "Livraison CRBT",
    Mode_Paiement: "ESPECES",
    quantity: variant,
    price: price,
    product_notice: "",
    Couleur: product_color,
    status: "pending",
    size: product_size,
    fees_shipping: "",
  };

  console.log("sheetDBData", sheetDBData);

  // Insert into SheetDB API
  fetch("https://sheetdb.io/api/v1/oatrcv4usryhu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: sheetDBData }),
  })
    .then(function (response) {
      console.log("response", response);
      console.log("sent");
      if (response.ok) {
        // Handle successful response from SheetDB
        console.log("Order added to SheetDB successfully");

        // To track the purchase event using Facebook Pixel
        fbq("track", "Purchase", {
          value: 50,
          currency: "USD",
          content_name:
            "Running Shoes",
          content_type: "clothes",
          product_id: "1127",
        });

        document.location.href = "running_shoes/order_success.html";
        // To track the purchase event using Snap Pixel
        // snaptr("track", "PURCHASE", { value: 132, currency: "USD" });
      } else {
        // Handle error response from SheetDB
        console.log("Failed to add order to SheetDB");
        $("#save_guest_order").prop("disabled", false);
        $("#span_loading").hide();
        console.log("Error :", error);
        // // Display an error message if the update fails
        // alert("وقع حطأ اثناء الطب , يرجى المحاولة لاحقا ");
        // throw new Error("Failed to add order to SheetDB");
      }
    })
    .catch(function (error) {
      console.log("NOT sent");
      console.log("Error:", error);

      $("#save_guest_order").prop("disabled", false);
      $("#span_loading").hide();
      console.log("Error :", error);
      // Display an error message if the request fails
      // alert("Failed to add order to SheetDB. Please try again later.");
    });
});
