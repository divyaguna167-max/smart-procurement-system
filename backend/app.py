from flask import Flask, jsonify, request
from flask_cors import CORS

from ai.smart_procurement import smart_procurement_prediction


app = Flask(__name__)

CORS(app)


# =========================================================
# HOME
# =========================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "status": "success",
        "message": "SmartProcure AI Backend is running",
        "api": "/api/ai/predict"
    })


# =========================================================
# AI PREDICTION API
# =========================================================

@app.route("/api/ai/predict", methods=["POST"])
def ai_predict():

    print("\n========================================")
    print("        AI PREDICTION API REQUEST")
    print("========================================")

    try:

        data = request.get_json(silent=True)

        print("Received Data:")
        print(data)

        if not data:

            return jsonify({
                "status": "error",
                "message": "No JSON data received"
            }), 400


        product_name = data.get(
            "product_name",
            "Unknown Product"
        )


        sales_data = data.get(
            "sales_data",
            []
        )


        current_stock = data.get(
            "current_stock",
            0
        )


        min_stock = data.get(
            "min_stock",
            5
        )


        print("Product:", product_name)
        print("Sales Data:", sales_data)
        print("Current Stock:", current_stock)
        print("Minimum Stock:", min_stock)


        # -------------------------------------------------
        # IMPORTANT
        # Convert numbers into the format expected
        # by the AI function.
        # -------------------------------------------------

        formatted_sales = []

        for value in sales_data:

            try:

                if isinstance(value, dict):

                    if "sales" in value:

                        formatted_sales.append({
                            "sales": float(value["sales"])
                        })

                    elif "quantity" in value:

                        formatted_sales.append({
                            "sales": float(value["quantity"])
                        })

                else:

                    formatted_sales.append({
                        "sales": float(value)
                    })

            except (ValueError, TypeError):

                continue


        print("Formatted Sales:")
        print(formatted_sales)


        if not formatted_sales:

            return jsonify({
                "status": "error",
                "message": "No valid sales data received"
            }), 400


        # -------------------------------------------------
        # CALL AI ENGINE
        # -------------------------------------------------

        result = smart_procurement_prediction(

            product_name=product_name,

            sales_data=formatted_sales,

            current_stock=float(current_stock),

            min_stock=float(min_stock)

        )


        print("\nAI RESULT:")
        print(result)

        print("========================================\n")


        return jsonify(result)


    except Exception as e:

        print("\nAI Prediction Error:")
        print(str(e))

        return jsonify({

            "status": "error",

            "message": str(e)

        }), 500


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    print("\n========================================")
    print("       SMARTPROCURE AI BACKEND")
    print("========================================")
    print("Backend started successfully")
    print("AI Prediction API:")
    print("http://127.0.0.1:5000/api/ai/predict")
    print("========================================\n")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False,
        use_reloader=False
    )