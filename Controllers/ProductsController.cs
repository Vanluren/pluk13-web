using p4_projekt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc;
namespace p4_projekt.Controllers
{
    [Route("api/products")]
    public class ProductsController : Controller
    {
        Product[] products = new Product[]
        {
            new Product { Id = 1, Name = "Tomato Soup", Category = "Groceries", Price = 1 },
            new Product { Id = 2, Name = "Yo-yo", Category = "Toys", Price = 3.75M },
            new Product { Id = 3, Name = "Hammer", Category = "Hardware", Price = 16.99M }
        };
        [HttpGet]
        public IEnumerable<Product> GetAllProducts()
        {
            return products;
        }


        [HttpGet("api/products/{id}")]
        public string GetProduct(int id)
        {
            Product product = products.FirstOrDefault((p) => p.Id == id);
            if(product == null) {
                return NotFound().ToString();
            }

            return Ok(product).ToString();
        }

    }
}