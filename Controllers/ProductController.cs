using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using pluk13_web.Models;

namespace pluk13_web.Controllers
{
    [Route("api/products")]
    public class ProductController : Controller
    {
        [HttpGet("{base}productList")]
        public List<Product> GetAllProducts()
        {
            List<Product> productsList = new List<Product>();


            productsList.Add(new Product(1, "Mors Varme Boller", "A-1-2"));


            return productsList;
        }

        [HttpGet("[action]")]
        public Product GetProduct(int id)
        {
            //open db connect
            //select statement: select * from Products where ProductId = id
            //nyt product med info fra db:
            Product product = new Product(2, "Fars Kolde Boller", "B-2-3");
            return product;
        }
    }
}
