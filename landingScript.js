const apiURL = 'https://debtcolapi.onrender.com';
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const username = localStorage.getItem('username');
const userLogID = localStorage.getItem('userID');
const vision = document.getElementById('vision');
const mission = document.getElementById('mission');
const banner = document.getElementById('banner');
const paint = document.getElementById('paint');
const collector = document.getElementById('collector');
const welcome = document.getElementById('pWelcome');

if (!token || !role) {
  console.error('No token or role found in localStorage. Redirecting to login page.');
  window.location.href = '/login.html';
};
let cartNo = 0;
cartMenu.src = "";
defaultDisplay();

// Menu About Section
vision.addEventListener('click', async () => {
  clearContent();

  // Display the left content elements
  const img = document.createElement('img');
  img.src = 'img/vm.png';
  img.alt = 'Vision and Mission Icon';
  img.className = 'w-[70%] h-[70%] object-cover';
  document.getElementById('leftContent').appendChild(img);

  // Display the right content elements
  rightH1.className = 'text-5xl font-bold p-6';
  rightH1.textContent = 'Vision';
  rightP.className = 'text-justify text-2xl';
  rightP.textContent = 'Our vision is to redefine and lead the Ah Long service industry across the ASEAN region with integrity, efficiency, and customer-centric solutions.';
});

mission.addEventListener('click', async () => {
  clearContent();

  // Display the left content elements
  const img = document.createElement('img');
  img.src = 'img/vm.png';
  img.alt = 'Vision and Mission Icon';
  img.className = 'w-[70%] h-[70%] object-cover';
  document.getElementById('leftContent').appendChild(img);

  // Display the right content elements
  rightH1.className = 'text-5xl font-bold p-6';
  rightH1.textContent = 'Mission';
  rightP.className = 'text-justify text-2xl';
  rightP.textContent = 'Our mission is to ensure justice for individuals and entities owed money, and to facilitate the recovery of those funds in a most efficient and effective manner. We are committed to providing our clients with the highest level of service, professionalism, and results.';
});

// Menu Services Section
banner.addEventListener('click', async () => {
  clearContent();

  // Display the left content elements
  leftH1.textContent = 'Banner';
  leftP.textContent = 'We can create and place a banner at your debtor\'s premises to remind them of their debt. Let us know your preferences and we will get it done for you.';
  leftContent.innerHTML = `
    <!-- Divider-->
    <div class="flex items-center mb-4">
      <hr class="flex-grow border-red-600"/>
    </div>

    <!-- Banner Size Options -->
    <div>
      <label for="options" class="text-xs">Size:</label>
      <select id="oBSize" name="oBannerSize" class="border border-gray-300 rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="nilOBSize" selected="selected">---</option>
        <option value="regular">Regular</option>
        <option value="big">Big</option>
        <option value="giant">Giant</option>
      </select>
    </div>

    <!-- Banner Language Options -->
    <div>
    <label for="options" class="text-xs">Language:</label>
    <select id="oBLang" name="oBannerLanguage" class="border border-gray-300 rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 disabled" disabled>
      <option value="nilOBLang" selected="selected">---</option>
      <option value="professional">Professional</option>
      <option value="strong">Strong</option>
      <option value="special">Ah Long Special</option>
    </select>
    </div>

    <!-- Divider-->
    <div class="flex items-center mb-4">
      <hr class="flex-grow border-red-600"/>
    </div>

    <button id="bAddToCart" class="w-full bg-red-900 text-white py-2 rounded-lg hover:bg-red-700 transition">Add to Cart</button>
    `;

  // Display the paint details dynamically
  const oBSize = document.getElementById('oBSize');
  const oBLang = document.getElementById('oBLang');
  const rightTopInner = document.getElementById('rightTopInner');
  const rightBottomInner = document.getElementById('rightBottomInner');

  // Get the banner size
  oBSize.addEventListener('change', () => {
    const bannerSize = oBSize.value;

    if (bannerSize !== 'nilOBSize') {
      // Enable the language selection dropdown
      oBLang.disabled = false;

      getDataWKey('banner/getId', bannerSize).then(async (bannerID) => {
        if (bannerID) {
          const bannerData = await getDataWKey('banner/getData', bannerID[0]._id)
          if (bannerData) {
            // Check if bannerDetails already exists; if so, update it
            let bannerDetails = document.getElementById('bannerDetails');
            const bannerClass = await getData(bannerData.banner.size);

            if (!bannerDetails) {
              // Create a img to display the banner details
              bannerDetails = document.createElement('img');
              bannerDetails.id = 'bannerDetails';
              bannerDetails.src = 'img/banner.png'; // Default image
              bannerDetails.alt = 'Banner';
              bannerDetails.className = bannerClass;
              rightTopInner.className = 'relative flex bg-gray-200 items-center justify-center';
              rightTopInner.appendChild(bannerDetails);
            }

            // Clear previous content and update class
            bannerDetails.src = 'img/banner.png'; // Default image
            bannerDetails.alt = 'Banner';
            bannerDetails.className = bannerClass;

            // Display the banner price
            rightBottomInner.innerHTML = `<p class="italic text-sm">(100% recyclable and environment-friendly material)<p class="text-sm">Price: $${bannerData.banner.price}</p></p>`;
          }

        };

        // Remove the old event listener to avoid stacking
        oBLang.removeEventListener('change', langChangeListener);

        // Add the new event listener for language selection
        oBLang.addEventListener('change', langChangeListener);
      });
    } else {
      // Disable the language selection dropdown and clear the right bottom inner content
      oBLang.disabled = true;
      rightBottomInner.innerHTML = '';
    }
  });

  //Add item to cart
  bAddToCart.addEventListener('click', async () => {
    const selectSize = document.getElementById("oBSize");
    const bannerSize = selectSize.value;
    const selectLang = document.getElementById("oBLang");
    const bannerLang = selectLang.value;
    if (role != 'guest') {
      let type = "banner";
      let config = {
        "size": bannerSize,
        "language": bannerLang
      };
      let quantity = 1;

      if ((bannerSize != 'nilOBSize' && bannerLang != 'nilOBLang')) {
        const cart = createCartJson(type, config, quantity);

        // Now add to cart
        if (cartNo != 0) {
          // Get CartID
          getDataWKey('cart/getId', userLogID).then(async (cartID) => {
            if (cartID) {
              updateCart(cart, cartID);
            }
          });
        }
        else {
          cartNo += 1;
          createCart(cart);
        }
      } else console.log('Either size or language not selected');
    } else alertCart('guest');
  });
});

paint.addEventListener('click', async () => {
  clearContent()

  // Display the left content elements
  leftH1.textContent = 'Paint';
  leftP.textContent = 'We don\'t just paint walls, we paint messages. Our team can help you create a powerful visual statement at your debtor\'s premises to remind them of their debt.';
  leftContent.innerHTML = `
    <!-- Divider-->
    <div class="flex items-center mb-4">
      <hr class="flex-grow border-red-600"/>
    </div>

    <!-- Paint Location Options -->
    <div>
      <label for="options" class="text-xs">Location:</label>
      <select id="oPLoc" name="oPaintLocation" class="border border-gray-300 rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="nilOPLoc" selected="selected">---</option>
        <option value="door">Door</option>
        <option value="wall">Wall</option>
        <option value="floor">Floor</option>
      </select>
    </div>

    <!-- Paint Colour Options -->
    <div>
    <label for="options" class="text-xs">Colour:</label>
    <select id="oPCol" name="oPaintColour" class="border border-gray-300 rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" disabled>
      <option value="nilOPCol" selected="selected">---</option>
      <option value="red">Red</option>
      <option value="blue">Blue</option>
    </select>
    </div>

    <!-- Divider-->
    <div class="flex items-center mb-4">
      <hr class="flex-grow border-red-600"/>
    </div>

    <button id="bAddToCart" class="w-full bg-red-900 text-white py-2 rounded-lg hover:bg-red-700 transition">Add to Cart</button>
    `;

  // Display the right content elements
  const img = document.createElement('img');
  img.src = 'img/HDB.avif';
  img.alt = 'Outside of HDB flat';
  img.className = 'w-full h-full object-cover';

  document.getElementById('rightTopInner').appendChild(img);

  // Display the paint details dynamically
  const oPLoc = document.getElementById('oPLoc');
  const oPCol = document.getElementById('oPCol');
  const rightTopInner = document.getElementById('rightTopInner');
  const rightBottomInner = document.getElementById('rightBottomInner');

  // This variable will hold the current dynamic <h2> reference
  let dinamicH2 = null;

  oPLoc.addEventListener('change', () => {
    const paintLocation = oPLoc.value;

    if (paintLocation !== 'nilOPLoc') {
      // Enable the colour selection dropdown
      oPCol.disabled = false;

      getDataWKey('paint/getId', paintLocation).then(async (paintID) => {
        if (paintID) {
          const paintLoc = await getDataWKey('paint/getData', paintID[0]._id);
          if (paintLoc) {
            // Check if paintDetails already exists; if so, update it
            let paintDetails = document.getElementById('paintDetails');
            const paintClass = await getData(paintLoc.paint.location);

            if (!paintDetails) {
              // Create a div to display the paint details
              paintDetails = document.createElement('div');
              paintDetails.id = 'paintDetails';
              paintDetails.className = paintClass;
              paintDetails.innerHTML = `
              <h2 id="dinamicH2" class="text-gray-900 text-4xl font-bold">O$P$</h2>
              `;
              rightTopInner.appendChild(paintDetails);
              dinamicH2 = document.getElementById('dinamicH2');  // Set the reference for dinamicH2
            }

            // Clear previous content and update class
            paintDetails.innerHTML = ''; // This clears the content inside the div
            paintDetails.className = paintClass;

            rightBottomInner.innerHTML = `<p class="italic text-sm">(100% pet-friendly painting material)<p class="text-sm">Price: $${paintLoc.paint.price}</p></p>`;

            // Recreate the <h2> inside the paintDetails div
            paintDetails.innerHTML = `
            <h2 id="dinamicH2" class="text-gray-900 text-3xl font-bold">O$P$</h2>
            `;
            dinamicH2 = document.getElementById('dinamicH2');  // Re-set the reference to the new h2
          }
        };
      });

      // Remove the old event listener to avoid stacking
      oPCol.removeEventListener('change', colourChangeListener);

      // Add the new event listener for colour selection
      oPCol.addEventListener('change', colourChangeListener);
    } else {
      // Disable the colour selection dropdown and clear the right bottom inner content
      oPCol.disabled = true;
      rightBottomInner.innerHTML = '';
    }
  });


  //Add item to cart
  bAddToCart.addEventListener('click', async () => {
    const selectLoc = document.getElementById("oPLoc");
    const paintLoc = selectLoc.value;
    const selectCol = document.getElementById("oPCol");
    const paintCol = selectCol.value;
    if (role != 'guest') {
      let type = "paint";
      let config = {
        "location": paintLoc,
        "colour": paintCol
      };
      let quantity = 1;

      if ((paintLoc != 'nilOPLoc' && paintCol != 'nilOPCol')) {
        const cart = createCartJson(type, config, quantity);

        // Now add to cart
        if (cartNo != 0) {
          // Get CartID
          getDataWKey('cart/getId', userLogID).then(async (cartID) => {
            if (cartID) {
              updateCart(cart, cartID);
            }
          });
        }
        else {
          cartNo += 1;
          createCart(cart);
        }
      } else console.log('Either location or colour not selected');
    } else alertCart('guest');
  });

});

collector.addEventListener('click', async () => {
  clearContent();

  // Display the left content elements
  leftH1.textContent = 'Collector';
  leftP.textContent = 'We have a team of experienced collectors who can visit your debtor\'s premises in person and "convince" them of paying their debt. Choose your collector wisely!';
  leftContent.innerHTML = `
    <!-- Divider-->
    <div class="flex items-center mb-4">
      <hr class="flex-grow border-red-600"/>
    </div>

    <!-- Collector Options -->
    <div>
      <label for="options" class="text-xs">Collector:</label>
      <select id="oCName" name="oCollectorName" class="border border-gray-300 rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="nilOCName" selected="selected">---</option>
        <option value="Donquixote">Donquixote Doflamingo</option>
        <option value="Akainu">Akainu</option>
        <option value="Blackbeard">Blackbeard</option>
        <option value="Crocodile">Crocodile</option>
        <option value="Kaido">Kaido</option>
        <option value="Mom">Big Mom</option>
        <option value="Hody">Hody Jones</option>
        <option value="Enel">Enel</option>
        <option value="Rob">Rob Lucci</option>
        <option value="Magellan">Magellan</option>
      </select>
    </div>

    <!-- Divider-->
    <div class="flex items-center mb-4">
      <hr class="flex-grow border-red-600"/>
    </div>

    <button id="bAddToCart" class="w-full bg-red-900 text-white py-2 rounded-lg hover:bg-red-700 transition">Add to Cart</button>
    `;

  // Display the right content elements
  oCName.addEventListener('change', () => {
    const collectorName = oCName.value;

    if (collectorName !== 'nilOCName') {
      getDataWKey('collector/getId', collectorName).then(collectorID => {
        if (collectorID) {
          getDataWKey('collector/getData', collectorID[0]._id).then(collectorData => {
            if (collectorData) {
              // Display the collector's image
              rightTopInner.innerHTML = '';
              const img = document.createElement('img');
              img.src = collectorData.collector.image;
              img.alt = collectorData.collector.name;
              img.className = 'w-[30%] h-[30%] object-cover';
              rightTopInner.className = 'relative flex items-center justify-center p-4';
              rightTopInner.appendChild(img);

              // Display the collector's details
              rightBottomInner.innerHTML = '';
              const appearancePercentage = collectorData.collector.appearance * 10;
              const persuasivenessPercentage = collectorData.collector.persuasiveness * 10;
              const persistencePercentage = collectorData.collector.persistence * 10;

              const collectorDetails = `
                <div class="flex flex-col space-y-2 w-full text-center text-justify-center">
                  <!-- Appearance -->
                  <div>
                    <div class="w-full bg-gray-300 rounded h-6">
                      <div class="bg-amber-600 h-6 rounded" style="width: ${appearancePercentage}%"><span class="text-white text-xs">Apperance</span></div>
                    </div>
                  </div>

                  <!-- Persuasiveness -->
                  <div>
                    <div class="w-full bg-gray-300 rounded h-6">
                      <div class="bg-emerald-600 h-6 rounded" style="width: ${persuasivenessPercentage}%"><span class="text-white text-xs">Persuasiveness</span></div>
                    </div>
                  </div>

                  <!-- Persistence -->
                  <div>
                    <div class="w-full bg-gray-300 rounded h-6">
                      <div class="bg-sky-600 h-6 rounded text-white" style="width: ${persistencePercentage}%"><span class="text-white text-xs">Persistence</span></div>
                    </div>
                  </div>

                  <!-- Price -->
                  <div">
                    <p class="text-sm">Price: $${collectorData.collector.price}</p>
                  </div>
                </div>
              `;
              rightBottomInner.innerHTML = collectorDetails;
            } else {
              console.error('Collector data not found');
            }
          });
        } else {
          console.error('Collector ID not found');
        }
      });
    }
    else {
      rightBottomInner.innerHTML = '';
      rightTopInner.innerHTML = '';
    };
  });

  //Add item to cart
  bAddToCart.addEventListener('click', async () => {
    const selectCollector = document.getElementById("oCName");
    const collectorName = selectCollector.value;
    let collectorFullName = '';

    //Get full name
    getDataWKey('collector/getId', collectorName).then(collectorID => {
      if (collectorID) {
        getDataWKey('collector/getData', collectorID[0]._id).then(collectorData => {
          if (collectorData) {

            if (role != 'guest') {
              let type = "collector";
              let config = {
                "name": collectorData.collector.name,
                "price": collectorData.collector.price
              };
              let quantity = 1;

              if ((collectorFullName != 'nilOCName')) {
                const cart = createCartJson(type, config, quantity);

                // Now add to cart
                if (cartNo != 0) {
                  // Get CartID
                  getDataWKey('cart/getId', userLogID).then(async (cartID) => {
                    if (cartID) {
                      updateCart(cart, cartID);
                    }
                  });
                }
                else {
                  cartNo += 1;
                  createCart(cart);
                }
              } else console.log('Name not selected');
            } else alertCart('guest');
          };
        });
      }
    });
  });
});

document.getElementById('bSignOutToggle').addEventListener('click', async function () {
  // Delete all cart
  try {
    const cartID = await getDataWKey('cart/getId', userLogID);
    if (cartID) {
      await deleteCart(cartID); // Await the deletion
    }
  } catch (err) {
    console.error("Error deleting cart during sign-out:", err);
  };
  // Clear local storage
  localStorage.clear();
  // Redirect to index.html
  window.location.href = 'index.html';
});

document.getElementById('cartMenu').addEventListener('click', async function () {
  clearContent();
  // Displaying cart
  // Loading cart data
  const cartID = await getDataWKey('cart/getId', userLogID);
  if (cartID) {
    data = await getDataWKey('cart', cartID[0]._id);
    // Displaying cart content in the right container
    rightH1.textContent = 'Cart Content';
    rightP.textContent = `You have in total ${data.cart.products.length} items in this cart`;
    rightTopInner.innerHTML = `
    <div>
      <div id="cartItems"></div>
    </div>
    `;
    rightBottomInner.innerHTML = `<p class="text-lg">Total Price: $${data.cart.totalPrice}</p>`;

    // 🛒 Now dynamically render products
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = ''; // Just in case

    data.cart.products.forEach((product, index) => {
      const item = document.createElement('div');
      item.className = 'p-2 shadow text-lg';
      item.innerHTML = translateCart(product);
      cartItemsDiv.appendChild(item);
    });
  };
});

// Common functions
function clearContent() {
  const leftH1 = document.getElementById('leftH1');
  const leftP = document.getElementById('leftP');
  const rightH1 = document.getElementById('rightH1');
  const rightP = document.getElementById('rightP');
  const leftContent = document.getElementById('leftContent');
  const rightTopInner = document.getElementById('rightTopInner');
  const rightBottomInner = document.getElementById('rightBottomInner');

  leftH1.textContent = '';
  leftP.textContent = '';
  rightH1.textContent = '';
  rightP.textContent = '';
  leftContent.innerHTML = '';
  rightTopInner.innerHTML = '';
  rightBottomInner.innerHTML = '';
};

// Async function to get various data from inner json
async function getData(key) {
  try {
    const response = await fetch(`data/data.json`);
    const data = await response.json();
    return data[key];
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    return null;
  }
};

// Async function to return data
async function getDataWKey(path, key) {
  try {
    const response = await fetch(`${apiURL}/${path}/${key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const dataByID = await response.json();
    return dataByID;
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return null;
  }
};

// Event listener for colour selection
function colourChangeListener() {
  const pColVal = oPCol.value;

  if (pColVal != 'nilOPCol') {

    getDataWKey('colour', '').then(paintColour => {
      if (paintColour) {
        if (!dinamicH2) {
          // If dynamic <h2> doesn't exist, create it
          const paintDetails = document.getElementById('paintDetails');
          paintDetails.innerHTML = `
            <h2 id="dinamicH2" class="text-${paintColour.colours[0][pColVal]} text-3xl font-bold">O$P$</h2>
            `;
          dinamicH2 = document.getElementById('dinamicH2');
        } else {
          // Update the class of the existing <h2>
          dinamicH2.className = `text-${paintColour.colours[0][pColVal]} text-3xl font-bold`;
        }
      } else {
        console.error('Paint colour not found');
      }
    });
  };
};

// Event listener for language selection
function langChangeListener() {
  const bLangVal = oBLang.value;

  if (bLangVal !== 'nilOBLang') {
    getDataWKey('language', '').then(langType => {
      if (langType) {
        // Check if bTempDiv already exists; if so, update it
        let bTempDiv = document.getElementById('bTempDiv');

        if (!bTempDiv) {
          // If dynamic <div> doesn't exist, create it
          bTempDiv = document.createElement("div");
          bTempDiv.id = 'bTempDiv';

          bTempDiv.className = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40";
          bTempDiv.innerHTML = `<p class="text-gray-900 text-base">${langType.languages[0][bLangVal]}</p>`;
          rightTopInner.appendChild(bTempDiv);
        } else {
          // Update the class of the existing <div>

          bTempDiv.className = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40";
          bTempDiv.innerHTML = `<p class="text-gray-900 text-base">${langType.languages[0][bLangVal]}</p>`;
          rightTopInner.appendChild(bTempDiv);
        }
      }
      else {
        console.error('Language not found');
      }
    });
  } else bTempDiv.innerHTML = "";
};

// Clock
function displayClock() {
  const zeroFill = n => {
    return ('0' + n).slice(-2);
  }

  // Creates interval
  const interval = setInterval(() => {
    // Get current time
    const now = new Date();
    const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Format date as in mm/dd/aaaa hh:ii:ss
    const dateTime = zeroFill(now.getDate()) + '/' +
      monthAbbr[now.getMonth()] + '/' +
      now.getFullYear() + ' ' +
      zeroFill(now.getHours()) + ':' +
      zeroFill(now.getMinutes()) + ':' +
      zeroFill(now.getSeconds());

    // Display the date and time on the screen using div#date-time
    document.getElementById('dTime').innerHTML = dateTime;
  }, 1000);
};

// Default display
function defaultDisplay() {
  clearContent();

  // Display the left content elements
  const img = document.createElement('img');
  img.src = 'img/SG.png';
  img.alt = 'SG map';
  img.className = 'w-[75%] h-[75%] object-cover';
  rightTopInner.className = 'relative flex items-center justify-center p-4';
  document.getElementById('rightTopInner').appendChild(img);

  // Display the right content elements
  rightP.className = 'text-center justify-center text-2xl';
  rightP.textContent = 'We are here, we are there, we are everywhere!';

  // Display welcome message and current time
  welcome.textContent = `Welcome, ${username}!`;
  displayClock();
};

function createCartJson(type, config, quantity) {
  let unitPrice;

  if (type === "banner") {
    const sizePrices = { regular: 100, big: 200, giant: 300 };
    unitPrice = sizePrices[config.size];
  } else if (type === "paint") {
    const locationPrices = { wall: 1000, door: 1500, floor: 2000 };
    unitPrice = locationPrices[config.location];
  } else if (type === "collector") {
    //const collectorPrices = { "Donquixote Doflamingo": 500, "Akainu": 470, "Blackbeard": 300, "Crocodile": 200, "Kaido": 450, "Big Mom" : 280, "Hody Jones": 150, "Enel" : 300, "Rob Lucci": 100, "Magellan": 430 };
    unitPrice = config.price;
  }

  return {
    type,
    quantity,
    config,
    unitPrice
  };
};

async function createCart(cart) {
  let action = "create";
  try {
    const response = await fetch(`${apiURL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userID: userLogID,
        products: [cart]
      })
    });

    const data = await response.json();
    if (response.ok) {
      alertCart(action);
      document.getElementById("cartMenu").src = "img/cart.png";
    } else {
      alert(data.message || 'Cart creation unsuccessful');
    }
  } catch (error) {
    console.error('Error during cart creation:', error);
    alert('An error occurred while trying to create a cart. Please try again later.');
  }
};

async function updateCart(cart, cartID) {
  let action = "update";
  try {
    const response = await fetch(`${apiURL}/cart/${cartID[0]._id}/add`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(cart)
    });
    const data = await response.json();
    if (response.ok) {
      alertCart(action);
    } else {
      alert(data.message || 'Update cart unsuccessful');
    }
  } catch (error) {
    console.error('Error during cart update:', error);
    alert('An error occurred while trying to add item to cart. Please try again later.');
  }
};

async function deleteCart(cartID) {
  try {
    const response = await fetch(`${apiURL}/cart/${cartID[0]._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      console.log('Cannot delete');
    } else console.log('Successfully deleted');
  } catch (error) {
    console.error('Error during cart update:', error);
    alert('An error occurred while trying to add item to cart. Please try again later.');
  }
};

// Create an alert function for guest login
function alertCart(action) {
  const alert = document.createElement('div');
  alert.className = 'fixed items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-50 w-[20%]';
  let msg = '';
  if (action === 'create') {
    msg = "Cart successfully created!";
  } else if (action === 'update') {
    msg = "Cart successfully updated!";
  } else if (action === 'guest') {
    msg = "You are not authorised to place order."
  }

  const message = document.createElement('span');
  message.textContent = msg;
  message.className = 'block mb-2';

  const button = document.createElement('button');
  button.textContent = 'Ok';
  button.className = 'p-2 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 transition';
  button.onclick = () => {
    alert.remove();
  };

  alert.appendChild(message);
  alert.appendChild(button);
  document.body.appendChild(alert);
};

function translateCart(product) {
  let htmlCode = '';
  if (product.type === 'banner') {
    htmlCode = `
      <div id="${product._id}" class="justify-left cursor-pointer hover:bg-white">
        <p class="w-full">Banner of ${product.config.size} size with ${product.config.language} message: $${product.unitPrice}</p>
      </div>
      `;
    return htmlCode;
  } else if (product.type === 'paint') {
    htmlCode = `
      <div id="${product._id}" class="justify-left cursor-pointer hover:bg-white">
        <p class="w-full">Paint at ${product.config.location} in ${product.config.colour} colour: $${product.unitPrice}</p>
      </div>
      `;
    return htmlCode;
  } else if (product.type === 'collector') {
    htmlCode = `
      <div id="${product._id}" class="justify-left cursor-pointer hover:bg-white">
        <p class="w-full">Collector name ${product.config.name}: $${product.unitPrice}</p>
      </div>
      `;
    return htmlCode;
  };
};