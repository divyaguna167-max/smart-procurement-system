# ============================================
# REAL-WORLD DEMAND PREDICTION MODULE
# ============================================

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor


def predict_demand(sales_data):
    """
    Predict future product demand using historical sales data.
    """

    if not sales_data:
        return {
            "status": "error",
            "message": "No sales data available"
        }

    df = pd.DataFrame(sales_data)

    required_columns = ["product", "sales"]

    for column in required_columns:
        if column not in df.columns:
            return {
                "status": "error",
                "message": f"Missing column: {column}"
            }

    # Convert sales values to numbers
    df["sales"] = pd.to_numeric(df["sales"], errors="coerce")
    df = df.dropna()

    if len(df) < 2:
        return {
            "status": "error",
            "message": "At least 2 sales records are required"
        }

    # Create time/order feature
    df["day"] = np.arange(len(df))

    X = df[["day"]]
    y = df["sales"]

    # Machine Learning model
    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42
    )

    model.fit(X, y)

    # Predict next period demand
    next_day = np.array([[len(df)]])
    predicted_demand = model.predict(next_day)[0]

    predicted_demand = max(0, round(predicted_demand))

    # Average historical sales
    average_sales = round(df["sales"].mean())

    # Demand classification
    if predicted_demand >= average_sales * 1.5:
        demand_level = "Very High"
    elif predicted_demand >= average_sales * 1.2:
        demand_level = "High"
    elif predicted_demand >= average_sales * 0.8:
        demand_level = "Medium"
    else:
        demand_level = "Low"

    return {
        "status": "success",
        "predicted_demand": predicted_demand,
        "average_sales": average_sales,
        "demand_level": demand_level
    }


# Test data
if __name__ == "__main__":

    sample_sales = [
        {"product": "Laptop", "sales": 8},
        {"product": "Laptop", "sales": 10},
        {"product": "Laptop", "sales": 12},
        {"product": "Laptop", "sales": 15},
        {"product": "Laptop", "sales": 18}
    ]

    result = predict_demand(sample_sales)

    print("\nAI DEMAND PREDICTION")
    print("----------------------------")
    print("Predicted Demand :", result["predicted_demand"])
    print("Average Sales    :", result["average_sales"])
    print("Demand Level     :", result["demand_level"])