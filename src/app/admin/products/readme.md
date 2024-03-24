# Product Page

Main task is to display the list of products from the database.

## Additional Features:

1. Pagination
2. Sorting
3. Button to add new product.
4. A link to edit the product.
5. A check box to select multiple items (products)
  - To allow multiple deletions.
  - To allow multiple selection to make the product inactive.
6. An icon/link to quickly delete the product.
  - doesn't really delete the product, simply move to trash.
7. As much as possible, list most of the product fields including thumbnail for easy viewing.
8. Limit the number of products to 10 for faster loading.
   

## React Specific Plan

1. Create the Page component

This will be the server side component by default. This can allow us to query the product list from the server directly.

But the side effect is that, this component will not contain any state. We will have to create child components to allow us to have more interactivity.

But for data like the page display header which will be static, we can add it here, so long as they are static.

2. Create a child component for listing the actual products.

This component will be our basis and will have multiple child components as well.

================================================================
|
| [BULK ACTIONS dropdowns] <  > [Search][Pagination button]
|
================================================================
| [] LIST HEADER, (Name, Price, Category, Description) (Sortable)
================================================================
|
| ................
| INDIVIDUAL PRODUCT ITEMS
| ................
|
================================================================
|
| [] SIMILAR to the header, to allow easy access.
|
================================================================














https://coolors.co/palette/25ced1-ffffff-fceade-ff8a5b-ea526f
25CED1
FFFFFF
FCEADE
FF8A5B
EA526F
