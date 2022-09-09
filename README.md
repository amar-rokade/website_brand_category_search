# website_brand_category_search

programmatically determine whether a website falls into the categories: { SHOPIFY, WOOCOMMERCE, BIGCOMMERCE, MAGENTO, OTHERS, NOT_WORKING } and mark the website accordingly with the above labels.

## How to start script

- go to working directory (main folder of project)  and install package 
> yarn or npm i

- create .env file in working directory and add your key and values
  - INTPUT_URL ( path/dir/inputfile.xlsx)
  - OUTPUT_URL ( path/dir/outputfile.xlsx)
  - BRAND_NAME (shopify,woocommerce,bigcommerce,magento)  separted by comma


- run 
> node index.js
