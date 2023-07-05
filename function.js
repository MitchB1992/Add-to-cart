import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://playground-890ff-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const shoppingListRef = ref(database, "shopping-list");

const addBtn = document.getElementById("add-btn");
const inputField = document.getElementById("input-field");
const shoppingList = document.getElementById("shopping-list");
const updateCart = document.getElementById("update-cart");

addBtn.addEventListener("click", () => {
    if (inputField.value !== "") {
        const inputValue = inputField.value;
        updateCart.innerHTML = `<b>${inputValue}</b> has been added to your cart!`;
        push(shoppingListRef, inputValue);
        inputField.value = "";
    } else {
        updateCart.innerHTML = "Please enter a valid value";
    }
});

onValue(shoppingListRef, (snapshot) => {
    const data = snapshot.val();
    shoppingList.innerHTML = "";

    if (data) {
        for (let itemId in data) {
            const currentItemValue = data[itemId];

            let newElement = document.createElement("li");
            newElement.textContent = currentItemValue;

            newElement.addEventListener("click", () => {
                remove(ref(database, `shopping-list/${itemId}`))
                    .then(() => {
                        console.log("Item removed successfully.");
                    })
                    .catch((error) => {
                        console.error("Error removing item:", error);
                    });
            });

            shoppingList.appendChild(newElement);
        }
    } else {
        shoppingList.innerHTML = "No items found in the shopping list.";
    }
});
