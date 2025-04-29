$("#formInfo").submit(function (event) {

  // Function to get URL parameter by name
  var trafic_name = "";
  function hasFbclidParameter() {
      url = window.location.href;
      url.indexOf('fbclid') !== -1 ? trafic_name = 'Facebook' : '';
      url.indexOf('ttclid') !== -1 ? trafic_name = 'Tiktok' : '';
      url.indexOf('gclid') !== -1 ? trafic_name = 'Google Ads' : '';
  }
  hasFbclidParameter();

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

  const dateObject = new Date();

  const formattedDate = dateObject.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
}).replace(/,/g, '');

// Create the data object for SheetDB
  // var sheetDBData = {
  //   name: "Pantalon",
  //   date: new Date().toString(),
  //   customer_name: fullname,
  //   phone: phone,
  //   city: "-",
  //   address: adresse,
  //   quantity: variant,
  //   price: price ,
  //   product_notice: "",
  //   notice: product_color,
  //   status: "pending",
  //   fees_shipping: "",
	// size: product_size,
  // };

  var sheetDBData = {
    Produit : "Pack Bogosse",
    Client : fullname,
    Tel : phone,
    Adresse : adresse,
    Prix : "399",
    createdAt : formattedDate,
    Source traffic : trafic_name,
  };

  console.log("sheetDBData", sheetDBData);

  // Insert into SheetDB API
  fetch("https://sheetdb.io/api/v1/ho86xbk98vhih", {
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
            "Pantalon",
          content_type: "Home & Kitchen",
          product_id: "1127",
        });

         document.location.href = "/pantalon/order_success.html";
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

    // $.ajax({
    //   url: "https://novamart-officiel.com/api/ordervisite",
    //   type: "POST",
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //   },
    //   cors: true,
    //   data: {
    //     first_name: fullname,
    //     last_name: "",
    //     phone: phone,
    //     city: "",
    //     adresse: adresse,
    //     id_product: "1135",
    //     name_product: "Pantalon",
    //     unit_price: price,
    //     quantite: variant,
    //     variant: ""+product_color + product_size,
    //     from_landing_page: true,
    //   },
    //   success: function (response) {
    //     document.location.href = "/pantalon/order_success.html";
    //     console.log("response", response);
    //   },
    //   error: function (xhr, status, error) {
    //     document.location.href = "/pantalon/order_success.html";
    //   },
    // });
});
