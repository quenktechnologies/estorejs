
#Endpoints
*** This document needs to be reviewed and updated ***

Currently, EStore is a javascript heavy application.

These are the current http endpoints it supports. Use 
them when building a template.

`/_/products`

  Method   |      Result                                          
 ----------|  -------------                                 
  GET      | Returns a list of products.                          

`/_/products/{id}`

  Method   |      Result                                          
 ----------|  -------------                                        
  GET      | Returns a single product.  


`/_/cart/items`

  Method   |      Result                                          
 ----------|  -------------                                       
  GET      | Returns a list of the items in the cart.             
                    
`/_/cart/items/{id}`

  Method   |      Result                                          
 ----------|  -------------                                        
  PUT      | Puts an item in the cart, repeat to adjust quantity. 
  DELETE   | Removes an item from the cart.     
  HEAD     | Checks if an item is in the cart, 404s if it is not.

`/_/checkout/transactions`

  Method   |      Result                                          
 ----------|  -------------                                        
  PUT      | Create a new checkout transaction.


`/_/payment/options`

  Method   |      Result                                          
 ----------|  -------------                                        
  GET      | Returns a list of payment options.

