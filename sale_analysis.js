/*
 * @author: Shubham Kabra
 * @description: Read two TAB delimited files and extract information from data
 * @return: Logs result of the queries
 * 
 * 
 * Problem Definition:
 * products.tab = A list of product names tab delimited with categories
 * sales.tab = A list of product names tab delimited with sales amount
 * 
 * From this data we'd like you to answer two questions:
 * What are the top 5 categories by sales
 * What is the top product by total sales in category 'Candy'
 * 
 * ** How to run this JavaScript file? **
 * ** Install Node.js **
 * Execute 'node sale_analysis.js [file1] [file2]' 
*/

// Require Node.js File System Library
var fs = require('fs');

// Start Timer
let start_time = new Date().getTime();

function elapsed(ms) {
    var secs = ms / 1000;
    ms = Math.floor(ms % 1000);
    secs = Math.floor(secs % 60);
    return secs + '.' + ms + ' secs';
}

try {
    // Read input files
    var sales_input = process.argv[2] || 'sales.tab';
    var products_input = process.argv[3] || 'products.tab';

    console.log(`\nAnalyzing ${sales_input} and ${products_input} files\n`);

    var sales_data = fs.readFileSync(sales_input).toString().trim().split('\n');
    var products_data = fs.readFileSync(products_input).toString().trim().split('\n');

    // Create products sales object
    var product_sales = {};

    // Read sales data and update product sales object
    try {
        sales_data.forEach((product_price, idx) => {
            let product_price_array = product_price.split('\t');
            let product = product_price_array[0].trim();
            let price = parseFloat(product_price_array[1].trim());
            if (product_sales[product] !== undefined) {
                product_sales[product].price += price;
            } else {
                product_sales[product] = {};
                product_sales[product].price = price;
            }
        })
    }
    catch (err) {
        if (err instanceof TypeError) {
            let error_msg = `Unable to parse ${products_input}`;
            throw new Error(error_msg);
        }
    }

    // Read category data and update product sales object
    try {
        products_data.forEach((product_category, idx) => {
            let product_category_array = product_category.split('\t');
            let product = product_category_array[0].trim();
            let category = product_category_array[1].trim();
            if (product_sales[product] !== undefined) {
                product_sales[product].category = category;
            }
        })
    }
    catch (err) {
        if (err instanceof TypeError) {
            let error_msg = `Unable to parse ${products_input}`;
            throw new Error(error_msg);
        }
    }

    /* Query Logic */

    function top_selling_categories(top = 5) {
        var categories = {}; // Create categories focussed object
        for (var key in product_sales) {
            let current_product_category = product_sales[key].category;
            let price = product_sales[key].price;
            if (categories[current_product_category] !== undefined) {
                categories[current_product_category].price += price;
            } else {
                categories[current_product_category] = {};
                categories[current_product_category].price = price;
            }
        }

        // Finding Top Selling Categories by Sorting
        var top_categories = Object.keys(categories).sort(function (a, b) {
            return categories[b].price - categories[a].price
        });

        return top_categories.slice(0, top).join('\n');
    }

    function top_selling_candy(top = 1) {
        var candies = {}; // Create 'Candy' focussed object
        for (var key in product_sales) {
            let current_product_category = product_sales[key].category;
            let price = product_sales[key].price;
            if (current_product_category === 'Candy') {
                if (candies[key] !== undefined) {
                    candies[key].price += price;
                } else {
                    candies[key] = {};
                    candies[key].price = price;
                }
            }
        }

        // Finding Top Selling Candy by Sorting
        var top_candy = Object.keys(candies).sort(function (a, b) {
            return candies[b].price - candies[a].price
        });

        return top_candy.slice(0, top).join('\n');
    }

    // Printing result in console
    console.log(`Top 5 categories by sales: \n${top_selling_categories()}\n`);
    console.log(`Top product by total sales in category 'Candy': \n${top_selling_candy()}\n`);
}

catch (err) {
    console.error(`ERROR: ${err.message}`);
}

finally {
    let elapsed_time = elapsed(new Date().getTime() - start_time);
    console.log(`(completed in ${elapsed_time})`);
}
