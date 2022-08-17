import "./App.css";
import { useEffect } from "react";
import { ContextHolder } from "@frontegg/rest-api";
import { useAuth, useLoginWithRedirect } from "@frontegg/react";
function App() {
  const { user, isAuthenticated } = useAuth();
  const loginWithRedirect = useLoginWithRedirect();
  //Uncomment this to redirect to login automatically
  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);
  const logout = () => {
    const baseUrl = ContextHolder.getContext().baseUrl;
    window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location}`;
  };
  const checkAndAddCustomerToDB = () => {
    var requestOptions = {
      method: "GET",
    };

    fetch(
      "http://localhost:3000/customer/checkandadd?cemail=" +
        user?.email +
        "&cname=" +
        user?.name,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log("Error for checking and adding: ", error));
  };
  const getOrdersFromServer = () => {
    checkAndAddCustomerToDB();

    var requestOptions = {
      method: "GET",
    };

    fetch(
      "http://localhost:3000/order/customer?cemail=" + user?.email,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        var text = `<h4>Welcome ${user?.name}! Here are the items you have ordered:</h4>`;
        if (data.length === 0) {
          text += `<h5>No items found in order list</h5>`;
        } else {
          text += `<ul class="orderlist">`
          data.forEach(function (item) {
            text += `<li class="orderlist">
            <strong>Item Name:</strong> ${item.name} <br>
            <strong>Quantity:</strong> ${item.quantity} <br>
            <strong>Shipping Date:</strong> ${item.shipping_date}
            </li> <hr>`;
          });
          text += "</ul>";
        }
        document.getElementById("mypanel").innerHTML = text;
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <div className="card">
          <div>
            <img src={user?.profilePictureUrl} alt={user?.name} />
          </div>
          <div className="detail">
            <span className="heading">Name: {user?.name}</span>
            <span className="heading">Name: {user?.email}</span>{" "}
          </div>
          <div>
            <button onClick={() => logout()} className="button">
              Click to logout
            </button>
            
          </div>
          <div className="card" id="mypanel">
            {getOrdersFromServer()}
          </div>
        </div>
      ) : (
        <div>
          <button onClick={() => loginWithRedirect()} className="button">
            Click me to login
          </button>
        </div>
      )}{" "}
    </div>
  );
}
export default App;
