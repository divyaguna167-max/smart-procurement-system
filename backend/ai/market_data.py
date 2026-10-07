# ============================================
# REAL-WORLD INDIA LAPTOP MARKET DATA
# ============================================

MARKET_DATA = [
    {
        "brand": "HP",
        "market_share": 26.6,
        "market_trend": "High"
    },
    {
        "brand": "Acer",
        "market_share": 21.3,
        "market_trend": "High"
    },
    {
        "brand": "Lenovo",
        "market_share": 18.3,
        "market_trend": "High"
    },
    {
        "brand": "Dell",
        "market_share": 15.9,
        "market_trend": "Medium"
    },
    {
        "brand": "ASUS",
        "market_share": 6.9,
        "market_trend": "Medium"
    }
]


# ============================================
# GET ALL MARKET DATA
# ============================================

def get_market_data():
    return MARKET_DATA


# ============================================
# GET TOP BRANDS
# ============================================

def get_top_brands(limit=5):

    data = sorted(
        MARKET_DATA,
        key=lambda x: x["market_share"],
        reverse=True
    )

    return data[:limit]


# ============================================
# FIND BRAND DATA FROM PRODUCT NAME
# ============================================

def find_brand_data(product_name):

    product_text = str(product_name).lower().strip()

    # ----------------------------------------
    # Check whether product name contains
    # any known laptop brand
    # ----------------------------------------

    for item in MARKET_DATA:

        brand = str(
            item.get("brand", "")
        ).strip()

        if not brand:
            continue

        if brand.lower() in product_text:

            return {
                "brand": brand,
                "market_share": float(
                    item.get("market_share", 0)
                ),
                "market_trend": item.get(
                    "market_trend",
                    "Medium"
                )
            }

    # ----------------------------------------
    # If product is a laptop but brand is not
    # mentioned, use highest market-share brand
    # ----------------------------------------

    if "laptop" in product_text:

        top_brand = max(
            MARKET_DATA,
            key=lambda x: x.get(
                "market_share",
                0
            )
        )

        return {
            "brand": top_brand.get(
                "brand",
                "Unknown"
            ),
            "market_share": float(
                top_brand.get(
                    "market_share",
                    0
                )
            ),
            "market_trend": top_brand.get(
                "market_trend",
                "Medium"
            )
        }

    # ----------------------------------------
    # Default
    # ----------------------------------------

    return {
        "brand": "Unknown",
        "market_share": 0,
        "market_trend": "Medium"
    }


# ============================================
# TEST MARKET DATA
# ============================================

if __name__ == "__main__":

    print("\nREAL-WORLD INDIA LAPTOP MARKET")
    print("--------------------------------")

    for brand in get_top_brands():

        print(
            f"{brand['brand']} : "
            f"{brand['market_share']}% "
            f"({brand['market_trend']} demand)"
        )

    print("\nBRAND SEARCH TEST")
    print("-----------------")

    test_products = [
        "HP Laptop",
        "Acer Laptop",
        "Lenovo Laptop",
        "Dell Laptop",
        "ASUS Laptop",
        "Laptop"
    ]

    for product in test_products:

        result = find_brand_data(product)

        print(
            f"{product} -> "
            f"{result['brand']} | "
            f"{result['market_share']}% | "
            f"{result['market_trend']}"
        )