import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";
import { toggleMealSelection } from "./mealsSlice";

const ConferenceEvent = () => {
  const dispatch = useDispatch();

  const [showItems, setShowItems] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const venueItems = useSelector((state) => state.venue);
  const avItems = useSelector((state) => state.av);
  const mealsItems = useSelector((state) => state.meals);

  const remainingAuditoriumQuantity = () => {
    const auditorium = venueItems.find(
      (item) => item.name === "Auditorium Hall"
    );

    if (!auditorium) {
      return 0;
    }

    return auditorium.quantity;
  };

  const handleIncrementQuantity = (index) => {
    dispatch(incrementQuantity(index));
  };

  const handleDecrementQuantity = (index) => {
    dispatch(decrementQuantity(index));
  };

  const handleIncrementAvQuantity = (index) => {
    dispatch(incrementAvQuantity(index));
  };

  const handleDecrementAvQuantity = (index) => {
    dispatch(decrementAvQuantity(index));
  };

  const handleMealSelection = (index) => {
    const item = mealsItems[index];

    if (item.selected && item.type === "mealForPeople") {
      const newNumberOfPeople = item.selected ? numberOfPeople : 0;
      dispatch(toggleMealSelection(index, newNumberOfPeople));
    } else {
      dispatch(toggleMealSelection(index));
    }
  };

  const handleNumberOfPeopleChange = (event) => {
    const value = Number(event.target.value);

    if (value >= 1) {
      setNumberOfPeople(value);
    }
  };

  const calculateTotalCost = (section) => {
    let totalCost = 0;

    if (section === "venue") {
      venueItems.forEach((item) => {
        totalCost += item.cost * item.quantity;
      });
    } else if (section === "av") {
      avItems.forEach((item) => {
        totalCost += item.cost * item.quantity;
      });
    } else if (section === "meals") {
      mealsItems.forEach((item) => {
        if (item.selected) {
          totalCost += item.cost * numberOfPeople;
        }
      });
    }

    return totalCost;
  };

  // These calculations must come AFTER calculateTotalCost is defined.
  const mealsTotalCost = calculateTotalCost("meals");
  const avTotalCost = calculateTotalCost("av");
  const venueTotalCost = calculateTotalCost("venue");

  const totalCosts = {
    venue: venueTotalCost,
    av: avTotalCost,
    meals: mealsTotalCost,
  };

  const getItemsFromTotalCost = () => {
    const items = [];

    venueItems.forEach((item) => {
      if (item.quantity > 0) {
        items.push({
          name: item.name,
          cost: item.cost,
          quantity: item.quantity,
          subtotal: item.cost * item.quantity,
        });
      }
    });

    avItems.forEach((item) => {
      if (item.quantity > 0) {
        items.push({
          name: item.name,
          cost: item.cost,
          quantity: item.quantity,
          subtotal: item.cost * item.quantity,
        });
      }
    });

    mealsItems.forEach((item) => {
      if (item.selected) {
        items.push({
          name: item.name,
          cost: item.cost,
          quantity: numberOfPeople,
          subtotal: item.cost * numberOfPeople,
        });
      }
    });

    return items;
  };

  const items = getItemsFromTotalCost();

  const ItemsDisplay = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Unit Cost</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>${item.cost}</td>
              <td>{item.quantity}</td>
              <td>${item.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleToggleItems = () => {
    setShowItems(!showItems);
  };

  return (
    <div className="conference_event">
      <div className="venue_selection">
        <h2>Venue</h2>

        {venueItems.map((item, index) => (
          <div className="venue_main" key={index}>
            <div className="img">
              <img src={item.img} alt={item.name} />
            </div>

            <div className="text">{item.name}</div>

            <div>${item.cost}</div>

            <div className="addons_btn">
              <button
                className="btn-warning"
                onClick={() => handleDecrementQuantity(index)}
              >
                &ndash;
              </button>

              <span className="quantity-value">{item.quantity}</span>

              <button
                className="btn-success"
                onClick={() => handleIncrementQuantity(index)}
              >
                &#43;
              </button>
            </div>
          </div>
        ))}

        <div className="total_cost">
          Total Cost: ${venueTotalCost}
        </div>
      </div>

      <div className="addons">
        <h2>Add-ons</h2>

        <div className="addons_selection">
          {avItems.map((item, index) => (
            <div className="av_data venue_main" key={index}>
              <div className="img">
                <img src={item.img} alt={item.name} />
              </div>

              <div className="text">{item.name}</div>

              <div>${item.cost}</div>

              <div className="addons_btn">
                <button
                  className="btn-warning"
                  onClick={() => handleDecrementAvQuantity(index)}
                >
                  &ndash;
                </button>

                <span className="quantity-value">{item.quantity}</span>

                <button
                  className="btn-success"
                  onClick={() => handleIncrementAvQuantity(index)}
                >
                  &#43;
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="total_cost">
          Total Cost: ${avTotalCost}
        </div>
      </div>

      <div className="meals">
        <h2>Meals</h2>

        <div className="number_of_people">
          <label htmlFor="numberOfPeople">Number of people:</label>

          <input
            id="numberOfPeople"
            type="number"
            min="1"
            value={numberOfPeople}
            onChange={handleNumberOfPeopleChange}
          />
        </div>

        <div className="meals_selection">
          {mealsItems.map((item, index) => (
            <div className="meal_data" key={index}>
              <div className="text">{item.name}</div>

              <div>${item.cost}</div>

              <div>
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => handleMealSelection(index)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="total_cost">
          Total Cost: ${mealsTotalCost}
        </div>
      </div>

      <div className="show_details">
        <button onClick={handleToggleItems}>
          {showItems ? "Hide Details" : "Show Details"}
        </button>

        {showItems && (
          <TotalCost
            totalCosts={totalCosts}
            handleClick={handleToggleItems}
            ItemsDisplay={() => <ItemsDisplay items={items} />}
          />
        )}
      </div>
    </div>
  );
};

export default ConferenceEvent;