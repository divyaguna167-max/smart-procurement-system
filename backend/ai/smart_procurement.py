import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor

from .market_data import find_brand_data


def smart_procurement_prediction(
    product_name,
    sales_data,
    current_stock,
    min_stock
):
    """
    AI-powered demand prediction and smart procurement recommendation.
    """

    try:

        # ==========================================
        # 1. VALIDATE SALES DATA
        # ==========================================

        if not sales_data:
            return {
                "status": "error",
                "message": "No historical sales data available"
            }

        # ==========================================
        # 2. NORMALIZE SALES DATA
        # ==========================================

        cleaned_sales = []

        for item in sales_data:

            if isinstance(item, dict):

                if "sales" in item:
                    value = item["sales"]

                elif "quantity" in item:
                    value = item["quantity"]

                elif "units" in item:
                    value = item["units"]

                elif "unitsSold" in item:
                    value = item["unitsSold"]

                elif "qty" in item:
                    value = item["qty"]

                else:
                    continue

            else:
                value = item

            try:
                value = float(value)

                if value >= 0:
                    cleaned_sales.append(value)

            except (ValueError, TypeError):
                continue

        # ==========================================
        # 3. CHECK CLEANED DATA
        # ==========================================

        if len(cleaned_sales) == 0:
            return {
                "status": "error",
                "message": "No valid sales data available"
            }

        # ==========================================
        # 4. BASIC STATISTICS
        # ==========================================

        average_sales = float(
            np.mean(cleaned_sales)
        )

        recent_count = min(
            7,
            len(cleaned_sales)
        )

        recent_sales = cleaned_sales[
            -recent_count:
        ]

        recent_average = float(
            np.mean(recent_sales)
        )

        # ==========================================
        # 5. MACHINE LEARNING DEMAND PREDICTION
        # ==========================================

        predicted_demand = recent_average

        if len(cleaned_sales) >= 3:

            df = pd.DataFrame({
                "sales": cleaned_sales
            })

            df["day"] = np.arange(
                len(df)
            )

            X = df[["day"]]
            y = df["sales"]

            model = RandomForestRegressor(
                n_estimators=100,
                random_state=42
            )

            model.fit(
                X,
                y
            )

            next_day = np.array([
                [len(df)]
            ])

            ml_prediction = float(
                model.predict(next_day)[0]
            )

            # Hybrid prediction
            predicted_demand = (
                ml_prediction * 0.60
                + recent_average * 0.40
            )

        predicted_demand = max(
            0,
            round(predicted_demand)
        )

        # ==========================================
        # 6. DEMAND LEVEL
        # ==========================================

        if predicted_demand >= average_sales * 1.30:

            demand_level = "Very High"

        elif predicted_demand >= average_sales * 1.10:

            demand_level = "High"

        elif predicted_demand <= average_sales * 0.70:

            demand_level = "Low"

        else:

            demand_level = "Medium"

        # ==========================================
        # 7. MARKET DATA
        # ==========================================

        market_info = find_brand_data(
            product_name
        )

        market_brand = market_info.get(
            "brand",
            "Unknown"
        )

        market_share = float(
            market_info.get(
                "market_share",
                0
            )
        )

        market_trend = market_info.get(
            "market_trend",
            "Medium"
        )

        # ==========================================
        # 8. STOCK VALUES
        # ==========================================

        current_stock = float(
            current_stock
        )

        min_stock = float(
            min_stock
        )

        # ==========================================
        # 9. SAFETY STOCK
        # ==========================================

        safety_stock = max(
            int(
                round(
                    predicted_demand * 0.75
                )
            ),
            int(min_stock)
        )

        # ==========================================
        # 10. STOCK STATUS
        # ==========================================

        if current_stock <= 0:

            stock_status = "Out of Stock"

        elif current_stock <= min_stock:

            stock_status = "Low Stock"

        else:

            stock_status = "Healthy Stock"

        # ==========================================
        # 11. SMART PROCUREMENT
        # ==========================================

        target_stock = max(
            safety_stock,
            int(
                round(
                    predicted_demand * 1.25
                )
            )
        )

        recommended_purchase = max(
            0,
            int(
                round(
                    target_stock - current_stock
                )
            )
        )

        # ==========================================
        # 12. PRIORITY
        # ==========================================

        if current_stock <= 0:

            priority = "Critical"

        elif (
            current_stock <= min_stock
            and demand_level == "Very High"
        ):

            priority = "Critical"

        elif current_stock <= min_stock:

            priority = "High"

        elif demand_level == "Very High":

            priority = "High"

        else:

            priority = "Normal"

        # ==========================================
        # 13. FINAL RESULT
        # ==========================================

        return {
            "status": "success",

            "product_name": product_name,

            "predicted_demand": predicted_demand,

            "average_sales": round(
                average_sales,
                2
            ),

            "recent_average": round(
                recent_average,
                2
            ),

            "current_stock": int(
                current_stock
            ),

            "minimum_stock": int(
                min_stock
            ),

            "safety_stock": safety_stock,

            "market_brand": market_brand,

            "market_share": market_share,

            "market_trend": market_trend,

            "demand_level": demand_level,

            "stock_status": stock_status,

            "recommended_purchase": (
                recommended_purchase
            ),

            "priority": priority,

            "message": (
                "AI demand prediction and smart "
                "procurement recommendation "
                "generated successfully"
            )
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }


# ==========================================
# DIRECT TEST
# ==========================================

if __name__ == "__main__":

    sample_sales = [
        8,
        10,
        12,
        14,
        16,
        18,
        20,
        22,
        24,
        26
    ]

    result = smart_procurement_prediction(
        product_name="HP Laptop",
        sales_data=sample_sales,
        current_stock=5,
        min_stock=10
    )

    print("\n================================")
    print("SMART PROCUREMENT AI")
    print("================================")

    for key, value in result.items():

        print(
            f"{key}: {value}"
        )

    print("================================")